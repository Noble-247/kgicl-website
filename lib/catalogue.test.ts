import { describe, expect, it } from "vitest";

import { HOME_FEATURED } from "@/data/featured";
import {
  getAllProducts,
  getByArea,
  getByGroup,
  getBySlug,
  getFeatured,
  getPublishedProducts,
  getRelated,
} from "@/lib/catalogue";

describe("catalogue access", () => {
  it("reads all 63 workbook products", () => {
    expect(getAllProducts()).toHaveLength(63);
    expect(getByArea("solar-lighting")).toHaveLength(17);
    expect(getByArea("cctv-security")).toHaveLength(7);
    expect(getByArea("electrical-supplies")).toHaveLength(15);
    expect(getByArea("industrial-supply")).toHaveLength(24);
    expect(getPublishedProducts()).toHaveLength(63);
  });

  it("filters a group inside its area", () => {
    expect(getByGroup("electrical-supplies", "lighting-fans")).toHaveLength(2);
    expect(getByGroup("industrial-supply", "pipes-marine")).toHaveLength(0);
  });

  it("finds a product by slug", () => {
    expect(getBySlug("led-bulb")?.name).toBe("LED Bulb");
    expect(getBySlug("not-a-product")).toBeUndefined();
  });

  it("returns the six featured products in file order", () => {
    expect(getFeatured().map((product) => product.slug)).toEqual([
      ...HOME_FEATURED,
    ]);
  });

  it("puts same-group related products first and excludes itself", () => {
    const product = getBySlug("120w-solar-street-light-12-eye");
    expect(product).toBeDefined();

    const related = getRelated(product!);
    expect(related).toHaveLength(4);
    expect(related.some((entry) => entry.slug === product!.slug)).toBe(false);
    expect(related.every((entry) => entry.area === "solar-lighting")).toBe(true);
  });

  it("falls back to the rest of the area when a group is small", () => {
    const product = getBySlug("led-bulb");
    expect(product).toBeDefined();

    const related = getRelated(product!, 4);
    expect(related).toHaveLength(4);
    expect(related[0].area).toBe("electrical-supplies");
  });
});
