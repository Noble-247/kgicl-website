import type { EnvSource } from "@/lib/env";

/**
 * The only social networks the site supports. Each variable must hold an
 * `https://` URL on the matching host, and must not contain placeholder text.
 */
export const SOCIAL_NETWORKS = [
  {
    network: "facebook",
    name: "Facebook",
    env: "FACEBOOK_URL",
    host: "facebook.com",
  },
  {
    network: "instagram",
    name: "Instagram",
    env: "INSTAGRAM_URL",
    host: "instagram.com",
  },
  {
    network: "linkedin",
    name: "LinkedIn",
    env: "LINKEDIN_URL",
    host: "linkedin.com",
  },
] as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number]["network"];
export type SocialEnvName = (typeof SOCIAL_NETWORKS)[number]["env"];

export type SocialLink = {
  network: SocialNetwork;
  name: string;
  href: string;
};

export type InvalidSocialVariable = {
  env: SocialEnvName;
  network: SocialNetwork;
  expectedHost: string;
};

/** Words that mean the value is still a template, not a real profile. */
const PLACEHOLDER_WORDS = ["placeholder", "example", "your"] as const;

function configFor(network: SocialNetwork) {
  const config = SOCIAL_NETWORKS.find((item) => item.network === network);

  if (!config) throw new Error(`Unknown social network: ${network}`);

  return config;
}

function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

/**
 * A link is valid only when it is `https://`, sits on the matching network's
 * host (including a subdomain such as `www.`), and contains none of the
 * placeholder words.
 */
export function isValidSocialLink(
  network: SocialNetwork,
  value: string,
): boolean {
  const trimmed = value.trim();

  if (!trimmed) return false;

  const lower = trimmed.toLowerCase();
  if (PLACEHOLDER_WORDS.some((word) => lower.includes(word))) return false;

  const url = parseUrl(trimmed);
  if (!url || url.protocol !== "https:") return false;

  const host = url.hostname.toLowerCase();
  const expected = configFor(network).host;

  return host === expected || host.endsWith(`.${expected}`);
}

/** Links ready to render. Invalid or blank variables are left out. */
export function getSocialLinks(
  source: EnvSource = process.env,
): SocialLink[] {
  return SOCIAL_NETWORKS.flatMap((config) => {
    const value = source[config.env]?.trim() ?? "";

    if (!isValidSocialLink(config.network, value)) return [];

    return [
      {
        network: config.network,
        name: config.name,
        href: new URL(value).href,
      },
    ];
  });
}

/**
 * Variables that are set but do not pass the rules, for the pre-launch audit.
 * Blank variables are ignored: they simply hide that icon.
 */
export function invalidSocialVariables(
  source: EnvSource = process.env,
): InvalidSocialVariable[] {
  return SOCIAL_NETWORKS.flatMap((config) => {
    const value = source[config.env]?.trim() ?? "";

    if (!value || isValidSocialLink(config.network, value)) return [];

    return [
      {
        env: config.env,
        network: config.network,
        expectedHost: config.host,
      },
    ];
  });
}
