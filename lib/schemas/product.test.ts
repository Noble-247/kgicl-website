import { describe, expect, it } from "vitest";

import { productSchema, validateProducts, type Product } from "./product";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "P-001",
    slug: "120w-solar-street-light-12-eye",
    name: "120W Solar Street Light, 12-Eye",
    modelCode: "KG-SL-120W",
    area: "solar-lighting",
    group: "street-lights",
    summary: "120W solar street light, 12-Eye. >12-20Hrs backup.",
    specs: [
      { label: "Type", value: "12-Eye" },
      { label: "Backup", value: ">12-20Hrs" },
    ],
    wattage: 120,
    warranty: "1 year",
    claimsVerified: true,
    familyLikely: false,
    image: {
      publicId: "5-120W_12-eye",
      alt: "120W Solar Street Light, 12-Eye, KG-SL-120W",
      status: "real",
    },
    published: true,
    review: {
      nameStatus: "Complete",
      detailsStatus: "Complete",
      claimsStatus: "n/a",
      photoStatus: "Real (confirmed by client)",
      notes: "",
    },
    ...overrides,
  };
}

describe("productSchema", () => {
  it("accepts a valid product", () => {
    expect(productSchema.safeParse(makeProduct()).success).toBe(true);
  });

  it("rejects an unknown area and a missing summary", () => {
    expect(
      productSchema.safeParse(makeProduct({ area: "toys" as Product["area"] }))
        .success,
    ).toBe(false);
    expect(productSchema.safeParse(makeProduct({ summary: "" })).success).toBe(
      false,
    );
  });

  it("requires null, not an empty string, for a missing image", () => {
    const product = makeProduct();
    product.image = { ...product.image, publicId: "" };
    expect(productSchema.safeParse(product).success).toBe(false);
  });
});

describe("validateProducts", () => {
  it("accepts a valid list", () => {
    expect(() => validateProducts([makeProduct()])).not.toThrow();
  });

  it("names both products and the data file for a duplicate slug", () => {
    const first = makeProduct();
    const second = makeProduct({ id: "P-002" });

    expect(() => validateProducts([first, second])).toThrowError(
      /Products P-001 and P-002 share the slug "120w-solar-street-light-12-eye".*data[\\/]products[\\/]solar\.ts/,
    );
  });

  it("names the product ID and file for an unknown group", () => {
    const product = makeProduct({ group: "roofing" });

    expect(() => validateProducts([product])).toThrowError(
      /Product P-001 uses the group "roofing".*lib[\\/]areas\.ts.*data[\\/]products[\\/]solar\.ts/,
    );
  });

  it("names the product ID and file for a slug that is not kebab-case", () => {
    const product = makeProduct({ slug: "120W_Solar_Light" });

    expect(() => validateProducts([product])).toThrowError(
      /Product P-001 has the slug "120W_Solar_Light".*data[\\/]products[\\/]solar\.ts/,
    );
  });

  it("names the product ID and file for a published product with an empty name", () => {
    const product = makeProduct({ name: "   " });

    expect(() => validateProducts([product])).toThrowError(
      /Published product P-001 has an empty name.*data[\\/]products[\\/]solar\.ts/,
    );
  });

  it("uses the area data file in the message", () => {
    const product = makeProduct({
      id: "P-040",
      area: "industrial-supply",
      group: "nope",
    });

    expect(() => validateProducts([product])).toThrowError(
      /data[\\/]products[\\/]industrial\.ts/,
    );
  });
});
