import { describe, expect, it } from "vitest";

import type { Product } from "@/lib/schemas/product";
import {
  DESCRIPTION_MAX_LENGTH,
  buildDescription,
  buildTitle,
  productJsonLd,
} from "./seo";

const product: Product = {
  id: "P-001",
  slug: "120w-solar-street-light-12-eye",
  name: "120W Solar Street Light, 12-Eye",
  modelCode: "KG-SL-120W",
  area: "solar-lighting",
  group: "street-lights",
  summary: "120W solar street light, 12-eye. 2 rainy-day backup.",
  specs: [{ label: "Type", value: "12-eye" }],
  wattage: 120,
  warranty: "1 year",
  claimsVerified: false,
  familyLikely: false,
  image: {
    publicId: "5-120W_12-eye",
    alt: "120W Solar Street Light, 12-Eye, KG-SL-120W",
    status: "unverified",
  },
  published: true,
  review: {
    nameStatus: "Good",
    detailsStatus: "Good",
    claimsStatus: "Unverified",
    photoStatus: "Link present",
    notes: "",
  },
};

describe("buildTitle", () => {
  it("uses the product title pattern with the town", () => {
    expect(buildTitle("120W Solar Street Light, 12-Eye")).toBe(
      "120W Solar Street Light, 12-Eye | KGICL Goodnews Solar, Port Harcourt",
    );
  });

  it("trims surrounding whitespace", () => {
    expect(buildTitle("  Solar Lighting  ")).toBe(
      "Solar Lighting | KGICL Goodnews Solar, Port Harcourt",
    );
  });
});

describe("buildDescription", () => {
  it("leaves a short description unchanged", () => {
    expect(buildDescription("  Solar street lights for estates. ")).toBe(
      "Solar street lights for estates.",
    );
  });

  it("collapses line breaks and repeated spaces", () => {
    expect(buildDescription("Cameras,\n  camera-and-light   units.")).toBe(
      "Cameras, camera-and-light units.",
    );
  });

  it("cuts at a word boundary and stays within 160 characters", () => {
    const text = `${"word ".repeat(40)}end`;
    const description = buildDescription(text);

    expect(description.length).toBeLessThanOrEqual(DESCRIPTION_MAX_LENGTH);
    expect(description.endsWith("…")).toBe(true);
    expect(description.slice(0, -1).endsWith("word")).toBe(true);
    expect(description).not.toContain("wor…");
  });

  it("drops a word that would be cut in half", () => {
    const text = `${"a".repeat(150)} ${"b".repeat(40)}`;
    const description = buildDescription(text, 160);

    expect(description.length).toBeLessThanOrEqual(160);
    expect(description).toBe(`${"a".repeat(150)}…`);
  });

  it("honours a custom limit", () => {
    expect(buildDescription("one two three four", 10)).toBe("one two…");
  });

  it("hard-cuts a single long word that cannot be broken at a space", () => {
    const description = buildDescription("x".repeat(200), 20);

    expect(description).toBe(`${"x".repeat(19)}…`);
  });
});

describe("productJsonLd", () => {
  it("describes the product without price or availability", () => {
    const jsonLd = productJsonLd(product, {
      url: "https://kgiclsolar.com/products/120w-solar-street-light-12-eye",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/w_1200/5-120W_12-eye",
    });

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.summary,
      sku: "KG-SL-120W",
      url: "https://kgiclsolar.com/products/120w-solar-street-light-12-eye",
      brand: { "@type": "Brand", name: "KGICL Goodnews Solar" },
    });
    expect(jsonLd.image).toEqual([
      "https://res.cloudinary.com/demo/image/upload/w_1200/5-120W_12-eye",
    ]);
    expect("offers" in jsonLd).toBe(false);
    expect("availability" in jsonLd).toBe(false);
  });

  it("omits the image and sku when they do not exist", () => {
    const jsonLd = productJsonLd(
      {
        ...product,
        modelCode: undefined,
        image: { publicId: null, alt: "", status: "missing" },
      },
      { url: "https://kgiclsolar.com/products/example" },
    );

    expect("image" in jsonLd).toBe(false);
    expect("sku" in jsonLd).toBe(false);
  });
});
