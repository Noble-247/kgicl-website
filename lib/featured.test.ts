import { describe, expect, it } from "vitest";

import { FEATURED_COUNT, HOME_FEATURED } from "@/data/featured";
import { getAllProducts } from "@/lib/catalogue";
import { validateFeatured } from "@/lib/featured";
import type { Product } from "@/lib/schemas/product";

const products = getAllProducts();

function withChange(slug: string, change: Partial<Product>): Product[] {
  return products.map((product) =>
    product.slug === slug ? { ...product, ...change } : product,
  );
}

describe("validateFeatured", () => {
  it("accepts the six slugs in data/featured.ts", () => {
    expect(validateFeatured(products)).toEqual([]);
    expect(HOME_FEATURED).toHaveLength(FEATURED_COUNT);
  });

  it("uses the exact count error", () => {
    expect(validateFeatured(products, HOME_FEATURED.slice(0, 5))).toEqual([
      "Featured list has 5 products; it must have 6. Edit data/featured.ts.",
    ]);
  });

  it("uses the exact duplicate error", () => {
    const list = [...HOME_FEATURED];
    list[0] = "led-bulb";

    expect(validateFeatured(products, list)).toContain(
      '"led-bulb" is featured twice.',
    );
  });

  it("uses the exact unknown-slug error", () => {
    const list = ["xyz", ...HOME_FEATURED.slice(1)];

    expect(validateFeatured(products, list)).toEqual([
      'Featured product "xyz" was not found. Check the spelling against data/products.',
    ]);
  });

  it("uses the exact unpublished error", () => {
    expect(
      validateFeatured(withChange("led-bulb", { published: false })),
    ).toEqual(['Featured product "led-bulb" is unpublished.']);
  });

  it("uses the exact missing-photo error", () => {
    const withMissingPhoto = products.map((product) =>
      product.slug === "led-bulb"
        ? { ...product, image: { ...product.image, status: "missing" as const } }
        : product,
    );

    expect(validateFeatured(withMissingPhoto)).toEqual([
      'Featured product "led-bulb" has no photo yet.',
    ]);
  });
});
