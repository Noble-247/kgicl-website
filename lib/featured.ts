import { FEATURED_COUNT, HOME_FEATURED } from "@/data/featured";
import type { Product } from "@/lib/schemas/product";

/**
 * Plain-language checks for the featured list (PRD 7.2).
 * Returns every problem so one build shows the full list, not just the first.
 */
export function validateFeatured(
  products: readonly Product[],
  list: readonly string[] = HOME_FEATURED,
  expectedCount: number = FEATURED_COUNT,
): string[] {
  const errors: string[] = [];

  if (list.length !== expectedCount) {
    errors.push(
      `Featured list has ${list.length} products; it must have ${expectedCount}. Edit data/featured.ts.`,
    );
  }

  const seen = new Set<string>();

  for (const slug of list) {
    if (seen.has(slug)) {
      errors.push(`"${slug}" is featured twice.`);
      continue;
    }
    seen.add(slug);

    const product = products.find((entry) => entry.slug === slug);

    if (!product) {
      errors.push(
        `Featured product "${slug}" was not found. Check the spelling against data/products.`,
      );
      continue;
    }

    if (!product.published) {
      errors.push(`Featured product "${slug}" is unpublished.`);
    }

    if (product.image.status === "missing") {
      errors.push(`Featured product "${slug}" has no photo yet.`);
    }
  }

  return errors;
}

/** Throws one error with every featured problem, for the build and the audit. */
export function assertFeaturedValid(
  products: readonly Product[],
  list: readonly string[] = HOME_FEATURED,
  expectedCount: number = FEATURED_COUNT,
): void {
  const errors = validateFeatured(products, list, expectedCount);
  if (errors.length > 0) {
    throw new Error(
      ["The featured products are not valid.", ...errors].join("\n"),
    );
  }
}
