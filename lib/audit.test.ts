import { describe, expect, it } from "vitest";

import type { Product } from "@/lib/schemas/product";
import {
  allowedSiteNumbers,
  findMissingAlt,
  findPhotoNotReal,
  findPlaceholderText,
  findPrivateNumbers,
  findProvisionalSlugs,
  findUnverifiedClaims,
  formatReport,
  runAudit,
  type DataFile,
} from "./audit";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "P-001",
    slug: "fixture-product",
    name: "Fixture Product",
    area: "solar-lighting",
    group: "street-lights",
    summary: "A fixture product for the audit tests.",
    specs: [{ label: "Type", value: "Fixture" }],
    claimsVerified: true,
    familyLikely: false,
    image: {
      publicId: "fixture",
      alt: "Fixture Product",
      status: "real",
    },
    published: true,
    review: {
      nameStatus: "Good",
      detailsStatus: "Good",
      claimsStatus: "n/a",
      photoStatus: "Real",
      notes: "",
    },
    ...overrides,
  };
}

function run(
  products: readonly Product[],
  mode: "review" | "live" = "review",
  dataFiles: readonly DataFile[] = [],
) {
  return runAudit({
    mode,
    products,
    dataFiles,
    featuredList: products.filter((product) => product.published).map((product) => product.slug),
    featuredCount: products.filter((product) => product.published).length,
  });
}

describe("findPhotoNotReal", () => {
  it("reports published products whose photo is not real", () => {
    const products = [
      makeProduct({ id: "P-001" }),
      makeProduct({
        id: "P-002",
        image: { publicId: "x", alt: "x", status: "unverified" },
      }),
      makeProduct({
        id: "P-003",
        image: { publicId: "x", alt: "x", status: "stock" },
      }),
      makeProduct({
        id: "P-004",
        image: { publicId: null, alt: "", status: "missing" },
      }),
    ];

    expect(findPhotoNotReal(products).map((finding) => finding.location)).toEqual([
      "P-002",
      "P-003",
      "P-004",
    ]);
  });

  it("ignores unpublished products", () => {
    const products = [
      makeProduct({
        published: false,
        image: { publicId: "x", alt: "x", status: "unverified" },
      }),
    ];

    expect(findPhotoNotReal(products)).toEqual([]);
  });
});

describe("findProvisionalSlugs", () => {
  it("reports names still marked as cut off", () => {
    const products = [
      makeProduct({ id: "P-001" }),
      makeProduct({
        id: "P-002",
        review: {
          nameStatus: "Cut off — needs the full name",
          detailsStatus: "Good",
          claimsStatus: "n/a",
          photoStatus: "Real",
          notes: "",
        },
      }),
    ];

    expect(findProvisionalSlugs(products).map((finding) => finding.location)).toEqual([
      "P-002",
    ]);
  });
});

describe("findPlaceholderText", () => {
  it("catches each placeholder in names, summaries and specs", () => {
    const products = [
      makeProduct({ id: "P-001", name: "EXAM Camera" }),
      makeProduct({ id: "P-002", summary: "Lorem ipsum camera." }),
      makeProduct({
        id: "P-003",
        specs: [{ label: "Warranty", value: "Customer Name" }],
      }),
      makeProduct({ id: "P-004", summary: "Placeholder text for later." }),
    ];

    const findings = findPlaceholderText(products);

    expect(findings).toHaveLength(4);
    expect(findings.map((finding) => finding.location)).toEqual([
      "P-001 name",
      "P-002 summary",
      "P-003 spec \"Warranty\"",
      "P-004 summary",
    ]);
  });

  it("does not flag the real word example", () => {
    const products = [
      makeProduct({ summary: "For example, a camera for a shop." }),
    ];

    expect(findPlaceholderText(products)).toEqual([]);
  });
});

describe("findMissingAlt", () => {
  it("reports published photos without alt text", () => {
    const products = [
      makeProduct({ id: "P-001" }),
      makeProduct({
        id: "P-002",
        image: { publicId: "x", alt: "   ", status: "real" },
      }),
      makeProduct({
        id: "P-003",
        image: { publicId: null, alt: "", status: "missing" },
      }),
      makeProduct({
        id: "P-004",
        published: false,
        image: { publicId: "x", alt: "", status: "real" },
      }),
    ];

    expect(findMissingAlt(products).map((finding) => finding.location)).toEqual([
      "P-002",
    ]);
  });
});

describe("findPrivateNumbers", () => {
  it("allows the numbers in data/site.ts in every form", () => {
    const files: DataFile[] = [
      {
        path: "data/sample.ts",
        content: [
          'const a = "0803 613 6883";',
          'const b = "+2348036136883";',
          'const c = "0805 420 7519";',
          'const d = "+2348139027180";',
        ].join("\n"),
      },
    ];

    expect(findPrivateNumbers(files, allowedSiteNumbers())).toEqual([]);
  });

  it("catches a local number that is not in data/site.ts", () => {
    const files: DataFile[] = [
      { path: "data/sample.ts", content: 'const phone = "0812 345 6789";' },
    ];

    const findings = findPrivateNumbers(files, allowedSiteNumbers());

    expect(findings).toHaveLength(1);
    expect(findings[0].location).toBe("data/sample.ts:1");
    expect(findings[0].message).toContain("0812 345 6789");
  });

  it("catches an international number with a plus and spaces", () => {
    const files: DataFile[] = [
      { path: "data/sample.ts", content: 'const phone = "+234 812 345 6789";' },
    ];

    expect(findPrivateNumbers(files, allowedSiteNumbers())).toHaveLength(1);
  });

  it("catches a country-code number written without a plus", () => {
    const files: DataFile[] = [
      { path: "data/sample.ts", content: "const phone = 2348123456789;" },
    ];

    expect(findPrivateNumbers(files, allowedSiteNumbers())).toHaveLength(1);
  });
});

describe("findUnverifiedClaims", () => {
  it("counts published products whose claims are not verified", () => {
    const products = [
      makeProduct({ id: "P-001", claimsVerified: true }),
      makeProduct({ id: "P-002", claimsVerified: false }),
      makeProduct({ id: "P-003", claimsVerified: false }),
      makeProduct({ id: "P-004", claimsVerified: false, published: false }),
    ];

    expect(findUnverifiedClaims(products)).toHaveLength(2);
  });
});

describe("runAudit exit logic", () => {
  it("does not fail review mode for warnings and off rules", () => {
    const products = [
      makeProduct({
        claimsVerified: false,
        image: { publicId: "x", alt: "x", status: "unverified" },
      }),
    ];

    const report = run(products, "review");

    expect(report.results.find((result) => result.rule === "photoNotReal")?.severity).toBe(
      "warn",
    );
    expect(
      report.results.find((result) => result.rule === "unverifiedClaims")?.severity,
    ).toBe("off");
    expect(report.blockingFindings).toBe(0);
    expect(report.failed).toBe(false);
  });

  it("fails live mode when a published photo is not real", () => {
    const products = [
      makeProduct({ image: { publicId: "x", alt: "x", status: "unverified" } }),
    ];

    const report = run(products, "live");

    expect(report.failed).toBe(true);
    expect(report.blockingFindings).toBe(1);
  });

  it("fails both modes for a third-party phone number", () => {
    const products = [makeProduct()];
    const dataFiles: DataFile[] = [
      { path: "data/sample.ts", content: 'const phone = "0812 345 6789";' },
    ];

    expect(run(products, "review", dataFiles).failed).toBe(true);
    expect(run(products, "live", dataFiles).failed).toBe(true);
  });

  it("fails both modes when the featured list is invalid", () => {
    const products = [makeProduct()];

    const review = runAudit({
      mode: "review",
      products,
      dataFiles: [],
      featuredList: ["missing-product"],
      featuredCount: 1,
    });
    const live = runAudit({
      mode: "live",
      products,
      dataFiles: [],
      featuredList: ["missing-product"],
      featuredCount: 1,
    });

    expect(review.failed).toBe(true);
    expect(live.failed).toBe(true);
  });

  it("leaves the four Task 03 rules as stubs", () => {
    const report = run([makeProduct()]);
    const stubs = report.results.filter((result) => !result.implemented);

    expect(stubs.map((result) => result.rule).sort()).toEqual([
      "missingEnv",
      "modeMismatch",
      "socialInvalid",
      "testimonialPlaceholders",
    ]);
  });

  it("prints every rule and always ends with the total", () => {
    const text = formatReport(run([makeProduct()]));
    const lines = text.split("\n");

    expect(text).toContain("- photoNotReal [warn] 0 findings");
    expect(text).toContain("- unverifiedClaims [off] 0 findings");
    expect(text).toContain("missingEnv [warn] not implemented yet (Task 03)");
    expect(lines[lines.length - 1]).toBe(
      "Total: 0 findings; 0 blocking in review mode.",
    );
  });
});
