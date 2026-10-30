import { HOME_FEATURED } from "@/data/featured";
import { products as cctv } from "@/data/products/cctv";
import { products as electrical } from "@/data/products/electrical";
import { products as industrial } from "@/data/products/industrial";
import { products as solar } from "@/data/products/solar";
import type { AreaSlug } from "@/lib/areas";
import { assertFeaturedValid } from "@/lib/featured";
import type { Product } from "@/lib/schemas/product";

/**
 * Module-level data is read once per build. Every function is pure, so the
 * catalogue can be imported by server components without extra caching layers.
 */
const ALL_PRODUCTS: readonly Product[] = [
  ...solar,
  ...cctv,
  ...electrical,
  ...industrial,
];

export function getAllProducts(): readonly Product[] {
  return ALL_PRODUCTS;
}

export function getPublishedProducts(): readonly Product[] {
  return ALL_PRODUCTS.filter((product) => product.published);
}

export function getByArea(area: AreaSlug): readonly Product[] {
  return ALL_PRODUCTS.filter((product) => product.area === area);
}

export function getByGroup(
  area: AreaSlug,
  group: string,
): readonly Product[] {
  return ALL_PRODUCTS.filter(
    (product) => product.area === area && product.group === group,
  );
}

export function getBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((product) => product.slug === slug);
}

/**
 * Related products: same group first, then the rest of the same area.
 * The product itself is always excluded.
 */
export function getRelated(
  product: Product,
  limit = 4,
): readonly Product[] {
  const sameGroup = ALL_PRODUCTS.filter(
    (entry) =>
      entry.slug !== product.slug &&
      entry.area === product.area &&
      entry.group === product.group,
  );
  const sameArea = ALL_PRODUCTS.filter(
    (entry) =>
      entry.slug !== product.slug &&
      entry.area === product.area &&
      entry.group !== product.group,
  );

  return [...sameGroup, ...sameArea].slice(0, Math.max(0, limit));
}

/** The six products from data/featured.ts, in the file's order. */
export function getFeatured(): readonly Product[] {
  assertFeaturedValid(ALL_PRODUCTS);

  return HOME_FEATURED.map((slug) => {
    const product = ALL_PRODUCTS.find((entry) => entry.slug === slug);
    if (!product) {
      throw new Error(
        `Featured product "${slug}" was not found. Check the spelling against data/products.`,
      );
    }
    return product;
  });
}
