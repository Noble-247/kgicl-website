import { FEATURED_COUNT, HOME_FEATURED } from "@/data/featured";
import { getPrivacySections, type PrivacySection } from "@/data/privacy";
import { SITE } from "@/data/site";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";
import { REQUIRED_IN_LIVE, type EnvSource } from "@/lib/env";
import type { SiteMode } from "@/lib/mode";
import type { Product } from "@/lib/schemas/product";
import { invalidSocialVariables } from "@/lib/social";
import { GATES, type Severity } from "@/config/launch-gates";
import { validateFeatured } from "@/lib/featured";

/** A file under `data/`, with forward-slash paths for stable report locations. */
export type DataFile = {
  path: string;
  content: string;
};

export type AuditFinding = {
  /** Product ID, or `path:line` for source files. */
  location: string;
  message: string;
};

export type AuditRuleResult = {
  rule: string;
  severity: Severity;
  implemented: boolean;
  findings: AuditFinding[];
  count: number;
};

export type AuditReport = {
  mode: SiteMode;
  results: AuditRuleResult[];
  totalFindings: number;
  /** Findings in rules whose severity is `error` for this mode. */
  blockingFindings: number;
  failed: boolean;
};

/** Local Nigerian mobile numbers, with optional spaces or hyphens. */
const LOCAL_PHONE = /(?<!\d)0[789](?:[\s-]?\d){9}(?!\d)/g;

/** Country-code form, with or without a leading plus. */
const INTERNATIONAL_PHONE = /(?<!\d)\+?234(?:[\s-]?\d){10}(?!\d)/g;

const PLACEHOLDER_PATTERNS: readonly { label: string; pattern: RegExp }[] = [
  // Uppercase only: "example" is a real word and must not match.
  { label: "EXAM", pattern: /\bEXAM\b/ },
  { label: "lorem", pattern: /lorem/i },
  { label: "Customer Name", pattern: /customer\s+name/i },
  { label: "Placeholder", pattern: /placeholder/i },
  { label: "[To be confirmed", pattern: /\[To be confirmed/i },
  { label: "Replace with a real", pattern: /Replace with a real/i },
];

/** Normalise a local or international Nigerian number to `0XXXXXXXXXX`. */
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  if (digits.startsWith("234")) return `0${digits.slice(3)}`;
  return digits;
}

/** The only phone numbers the site may publish (data/site.ts). */
export function allowedSiteNumbers(): string[] {
  const numbers = [
    ...SITE.phones.flatMap((phone) => [phone.display, phone.e164]),
    SITE.whatsapp.siteButton.display,
    SITE.whatsapp.siteButton.e164,
    SITE.whatsapp.secondary.display,
    SITE.whatsapp.secondary.e164,
  ];

  return [...new Set(numbers.map(normalisePhone))];
}

export function findFeaturedInvalid(
  products: readonly Product[],
  list: readonly string[] = HOME_FEATURED,
  expectedCount: number = FEATURED_COUNT,
): AuditFinding[] {
  return validateFeatured(products, list, expectedCount).map((message) => ({
    location: "data/featured.ts",
    message,
  }));
}

export function findPhotoNotReal(
  products: readonly Product[],
): AuditFinding[] {
  return products
    .filter((product) => product.published && product.image.status !== "real")
    .map((product) => ({
      location: product.id,
      message: `${product.name} (${product.slug}): photo status is "${product.image.status}", not "real".`,
    }));
}

export function findProvisionalSlugs(
  products: readonly Product[],
): AuditFinding[] {
  return products
    .filter(
      (product) =>
        product.published && product.review.nameStatus.startsWith("Cut off"),
    )
    .map((product) => ({
      location: product.id,
      message: `${product.name} (${product.slug}): the workbook name is still cut off.`,
    }));
}

export function findPlaceholderText(
  products: readonly Product[],
): AuditFinding[] {
  const findings: AuditFinding[] = [];

  for (const product of products) {
    if (!product.published) continue;

    const fields: { label: string; value: string }[] = [
      { label: "name", value: product.name },
      { label: "summary", value: product.summary },
      ...product.specs.map((spec) => ({
        label: `spec "${spec.label}"`,
        value: spec.value,
      })),
    ];

    for (const field of fields) {
      for (const placeholder of PLACEHOLDER_PATTERNS) {
        if (placeholder.pattern.test(field.value)) {
          findings.push({
            location: `${product.id} ${field.label}`,
            message: `${product.name} (${product.slug}): ${field.label} contains "${placeholder.label}".`,
          });
        }
      }
    }
  }

  return findings;
}

/** Visible `[To be confirmed by KGICL]` markers still in the privacy notice. */
export function findPrivacyMarkers(
  sections: readonly PrivacySection[] = getPrivacySections(),
): AuditFinding[] {
  return sections.flatMap((section) => {
    const text = [
      ...section.paragraphs,
      ...(section.items ?? []),
      ...(section.after ?? []),
    ].join("\n");

    return PLACEHOLDER_PATTERNS.filter((placeholder) =>
      placeholder.pattern.test(text),
    ).map((placeholder) => ({
      location: `data/privacy.ts#${section.id}`,
      message: `Privacy notice ("${section.heading}") contains "${placeholder.label}".`,
    }));
  });
}

export function findMissingAlt(products: readonly Product[]): AuditFinding[] {
  return products
    .filter(
      (product) =>
        product.published &&
        product.image.publicId !== null &&
        product.image.alt.trim() === "",
    )
    .map((product) => ({
      location: product.id,
      message: `${product.name} (${product.slug}): the product image has no alt text.`,
    }));
}

export function findPrivateNumbers(
  files: readonly DataFile[],
  allowed: readonly string[] = allowedSiteNumbers(),
): AuditFinding[] {
  const allowedSet = new Set(allowed.map(normalisePhone));
  const findings: AuditFinding[] = [];

  for (const file of files) {
    const lines = file.content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const candidates = new Set<string>();

      for (const pattern of [LOCAL_PHONE, INTERNATIONAL_PHONE]) {
        pattern.lastIndex = 0;
        for (const match of line.matchAll(pattern)) {
          candidates.add(match[0]);
        }
      }

      for (const candidate of candidates) {
        if (allowedSet.has(normalisePhone(candidate))) continue;

        findings.push({
          location: `${file.path}:${index + 1}`,
          message: `Third-party phone number "${candidate.trim()}" is not one of the numbers in data/site.ts.`,
        });
      }
    });
  }

  return findings;
}

export function findUnverifiedClaims(
  products: readonly Product[],
): AuditFinding[] {
  return products
    .filter((product) => product.published && !product.claimsVerified)
    .map((product) => ({
      location: product.id,
      message: `${product.name} (${product.slug}): claims are not verified.`,
    }));
}

const LIVE_SITE_URL = "https://kgiclsolar.com";

function hostnameOf(value: string): string | null {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Always on, in both modes. Catches the two launch mistakes that matter most:
 * a production build with no `SITE_MODE`, and a mode that disagrees with the
 * address it is deployed on.
 */
export function findModeMismatch(
  env: EnvSource = process.env,
): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const rawMode = env.SITE_MODE?.trim() ?? "";
  const siteUrl = env.SITE_URL?.trim() ?? "";

  if (env.VERCEL_ENV?.trim() === "production" && rawMode === "") {
    findings.push({
      location: "SITE_MODE",
      message: "SITE_MODE is not set on a Vercel production build.",
    });
  }

  if (rawMode !== "" && rawMode !== "live" && rawMode !== "review") {
    findings.push({
      location: "SITE_MODE",
      message: 'SITE_MODE must be "review" or "live".',
    });
  }

  const mode: SiteMode = rawMode === "live" ? "live" : "review";

  if (mode === "live") {
    const normalised = siteUrl.replace(/\/+$/, "").toLowerCase();

    if (normalised !== LIVE_SITE_URL) {
      findings.push({
        location: "SITE_URL",
        message: `SITE_MODE is "live" but SITE_URL is not ${LIVE_SITE_URL}.`,
      });
    }

    return findings;
  }

  const host = hostnameOf(siteUrl);

  if (host === "kgiclsolar.com" || host?.endsWith(".kgiclsolar.com")) {
    findings.push({
      location: "SITE_URL",
      message:
        'SITE_MODE is "review" but SITE_URL uses the live domain kgiclsolar.com.',
    });
  }

  return findings;
}

export function findTestimonialPlaceholders(
  testimonials: readonly Testimonial[] = TESTIMONIALS,
): AuditFinding[] {
  return testimonials.flatMap((testimonial, index) =>
    testimonial.isPlaceholder
      ? [
          {
            location: "data/testimonials.ts",
            message: `Testimonial ${index + 1} is still marked as a placeholder.`,
          },
        ]
      : [],
  );
}

/** A social variable that is set but fails the https/host/placeholder rules. */
export function findSocialInvalid(
  env: EnvSource = process.env,
): AuditFinding[] {
  return invalidSocialVariables(env).map((variable) => ({
    location: variable.env,
    message: `${variable.env} is set but is not a valid https://${variable.expectedHost}/ link.`,
  }));
}

/** Live mode needs every production variable. Review mode may leave them blank. */
export function findMissingEnv(
  mode: SiteMode,
  env: EnvSource = process.env,
): AuditFinding[] {
  if (mode !== "live") return [];

  return REQUIRED_IN_LIVE.filter((name) => !(env[name]?.trim() ?? "")).map(
    (name) => ({
      location: name,
      message: `${name} is not set for live mode.`,
    }),
  );
}

export type AuditInput = {
  mode: SiteMode;
  products: readonly Product[];
  dataFiles: readonly DataFile[];
  allowedNumbers?: readonly string[];
  /** Test seam; the build uses data/featured.ts. */
  featuredList?: readonly string[];
  featuredCount?: number;
  /** Test seam; the build reads process.env. */
  env?: EnvSource;
  /** Test seam; the build reads data/testimonials.ts. */
  testimonials?: readonly Testimonial[];
  /** Test seam; the build reads data/privacy.ts. */
  privacySections?: readonly PrivacySection[];
};

/**
 * Run every rule that is implemented today and attach the gate severity for
 * the current mode. Findings in `off` rules are still counted and printed.
 */
export function runAudit({
  mode,
  products,
  dataFiles,
  allowedNumbers = allowedSiteNumbers(),
  featuredList = HOME_FEATURED,
  featuredCount = FEATURED_COUNT,
  env = process.env,
  testimonials = TESTIMONIALS,
  privacySections = [],
}: AuditInput): AuditReport {
  const findingsByRule: Record<string, AuditFinding[]> = {
    featuredInvalid: findFeaturedInvalid(products, featuredList, featuredCount),
    privateNumbers: findPrivateNumbers(dataFiles, allowedNumbers),
    photoNotReal: findPhotoNotReal(products),
    provisionalSlug: findProvisionalSlugs(products),
    placeholderText: [
      ...findPlaceholderText(products),
      ...findPrivacyMarkers(privacySections),
    ],
    missingAlt: findMissingAlt(products),
    unverifiedClaims: findUnverifiedClaims(products),
    modeMismatch: findModeMismatch(env),
    testimonialPlaceholders: findTestimonialPlaceholders(testimonials),
    socialInvalid: findSocialInvalid(env),
    missingEnv: findMissingEnv(mode, env),
  };

  const results: AuditRuleResult[] = Object.entries(GATES).map(
    ([rule, gate]) => {
      const findings = findingsByRule[rule] ?? [];

      return {
        rule,
        severity: gate[mode],
        implemented: rule in findingsByRule,
        findings,
        count: findings.length,
      };
    },
  );

  const totalFindings = results.reduce((total, result) => total + result.count, 0);
  const blockingFindings = results
    .filter((result) => result.severity === "error")
    .reduce((total, result) => total + result.count, 0);

  return {
    mode,
    results,
    totalFindings,
    blockingFindings,
    failed: blockingFindings > 0,
  };
}

/** Grouped, plain-text report. The last line is always the total. */
export function formatReport(report: AuditReport): string {
  const lines = [`Pre-launch audit (${report.mode} mode)`];

  for (const result of report.results) {
    if (!result.implemented) {
      lines.push(
        `- ${result.rule} [${result.severity}] not implemented yet (Task 03)`,
      );
      continue;
    }

    const label = result.count === 1 ? "finding" : "findings";
    lines.push(`- ${result.rule} [${result.severity}] ${result.count} ${label}`);

    for (const finding of result.findings.slice(0, 10)) {
      lines.push(`    ${finding.location} — ${finding.message}`);
    }

    if (result.count > 10) {
      lines.push(`    … and ${result.count - 10} more.`);
    }
  }

  lines.push(
    `Total: ${report.totalFindings} findings; ${report.blockingFindings} blocking in ${report.mode} mode.`,
  );

  return lines.join("\n");
}
