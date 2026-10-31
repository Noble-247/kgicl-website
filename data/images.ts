/**
 * Site-level image slots. Values are Cloudinary public IDs (never full URLs);
 * `lib/cloudinary.ts` builds the delivery URL.
 *
 * `null` means "use the default visual". To replace an image, upload it to
 * Cloudinary and paste the public ID here. See 00-shared-context.md section 4.
 */
export const SITE_IMAGES = {
  hero: null as string | null,
  tiles: {
    solar: null,
    cctv: null,
    electrical: null,
    industrial: null,
  } as Record<string, string | null>,
  about: null as string | null,
} as const;
