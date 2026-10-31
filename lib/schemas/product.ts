import { z } from "zod";

import {
  AREA_SLUGS,
  dataFileForArea,
  getAreaGroup,
  isAreaSlug,
} from "@/lib/areas";

export const PHOTO_STATUSES = ["real", "stock", "unverified", "missing"] as const;

export type PhotoStatus = (typeof PHOTO_STATUSES)[number];

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productSchema = z.object({
  /** Workbook reference, stable across renames. */
  id: z
    .string()
    .regex(/^P-\d{3}$/, 'Product ID must look like "P-001".'),
  slug: z.string().min(1, "Slug is required."),
  name: z.string(),
  modelCode: z.string().min(1, "Model code must be omitted, not empty.").optional(),
  area: z.enum(AREA_SLUGS),
  group: z.string().min(1, "Group is required."),
  summary: z.string().min(1, "Summary is required."),
  specs: z.array(
    z.object({
      label: z.string().min(1, "Spec label is required."),
      value: z.string().min(1, "Spec value is required."),
    }),
  ),
  wattage: z
    .number()
    .int("Wattage must be a whole number.")
    .positive("Wattage must be greater than zero.")
    .optional(),
  warranty: z.string().min(1, "Warranty must be omitted, not empty.").optional(),
  claimsVerified: z.boolean(),
  familyLikely: z.boolean(),
  image: z.object({
    publicId: z.string().min(1, "Use null for a missing image.").nullable(),
    alt: z.string(),
    status: z.enum(PHOTO_STATUSES),
  }),
  published: z.boolean(),
  related: z.array(z.string().min(1)).optional(),
  review: z.object({
    nameStatus: z.string(),
    detailsStatus: z.string(),
    claimsStatus: z.string(),
    photoStatus: z.string(),
    notes: z.string(),
  }),
});

export type Product = z.infer<typeof productSchema>;

function fileFor(product: Pick<Product, "area">): string {
  return isAreaSlug(product.area)
    ? dataFileForArea(product.area)
    : "the matching file in data/products/";
}

/**
 * Build-time product checks with plain-language errors. Each message names the
 * product ID and the data file to edit (task 2.1 and PRD 6.3).
 */
export function validateProducts(products: readonly Product[]): void {
  const seenSlugs = new Map<string, string>();

  for (const product of products) {
    const file = fileFor(product);

    if (!isAreaSlug(product.area)) {
      throw new Error(
        `Product ${product.id} uses the area "${product.area}", which is not a catalogue area. ` +
          `Use "solar-lighting", "cctv-security", "electrical-supplies" or "industrial-supply". ` +
          `Fix the area in ${file}.`,
      );
    }

    if (!KEBAB_CASE.test(product.slug)) {
      throw new Error(
        `Product ${product.id} has the slug "${product.slug}", which is not kebab-case. ` +
          `Use lowercase letters and numbers separated by single hyphens. Fix ${file}.`,
      );
    }

    if (product.published && product.name.trim() === "") {
      throw new Error(
        `Published product ${product.id} has an empty name. ` +
          `Add a name in ${file} or set published: false.`,
      );
    }

    if (!getAreaGroup(product.area, product.group)) {
      throw new Error(
        `Product ${product.id} uses the group "${product.group}", which does not exist for ` +
          `the area "${product.area}". Add it to lib/areas.ts or correct the group in ${file}.`,
      );
    }

    const existing = seenSlugs.get(product.slug);
    if (existing) {
      throw new Error(
        `Products ${existing} and ${product.id} share the slug "${product.slug}". ` +
          `Each product needs a unique slug. Fix ${file}.`,
      );
    }
    seenSlugs.set(product.slug, product.id);

    const parsed = productSchema.safeParse(product);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const field = issue.path.length > 0 ? issue.path.join(".") : "the record";
      throw new Error(
        `Product ${product.id} has an invalid ${field} in ${file}: ${issue.message}`,
      );
    }
  }
}
