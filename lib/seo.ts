import type { Product } from "@/lib/schemas/product";

export const SITE_NAME = "KGICL Goodnews Solar";
export const SITE_LOCATION = "Port Harcourt";

/** Longest description search engines show without cutting the tail. */
export const DESCRIPTION_MAX_LENGTH = 160;

/** `{Page name} | KGICL Goodnews Solar, Port Harcourt` (task 2.6). */
export function buildTitle(name: string): string {
  return `${name.trim()} | ${SITE_NAME}, ${SITE_LOCATION}`;
}

/**
 * Plain description: whitespace collapsed, at most `maxLength` characters,
 * and never cut in the middle of a word. A trimmed sentence that is too long
 * ends at the last whole word with an ellipsis.
 */
export function buildDescription(
  text: string,
  maxLength = DESCRIPTION_MAX_LENGTH,
): string {
  const clean = text.replace(/\s+/g, " ").trim();

  if (clean.length <= maxLength) return clean;
  if (maxLength <= 0) return "";

  // Reserve one character for the ellipsis so the result stays within the limit.
  const limit = Math.max(1, maxLength - 1);
  const clipped = clean.slice(0, limit);
  const lastSpace = clipped.lastIndexOf(" ");
  const cut = lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped;

  return `${cut.replace(/[\s,;:.–—-]+$/u, "")}…`;
}

export type ProductJsonLdOptions = {
  /** Absolute canonical URL of the product page. */
  url: string;
  /** Absolute Cloudinary URL, when the product has a photo. */
  imageUrl?: string;
};

/**
 * Product structured data without `offers`: the catalogue has no prices or
 * stock status (PRD FR-27).
 */
export function productJsonLd(
  product: Product,
  { url, imageUrl }: ProductJsonLdOptions,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(product.modelCode ? { sku: product.modelCode } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    url,
  };
}
