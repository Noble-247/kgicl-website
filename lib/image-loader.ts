import type { ImageLoaderProps } from "next/image";

import { cloudinaryUrl } from "@/lib/cloudinary";

/**
 * Custom next/image loader: width, format and quality become a Cloudinary
 * transformation, so Vercel's /_next/image endpoint is never used (PRD 6.7).
 */
export default function cloudinaryLoader({
  src,
  width,
}: ImageLoaderProps): string {
  // Local public assets and absolute URLs are not Cloudinary public IDs.
  if (src.startsWith("/") || /^https?:\/\//i.test(src)) return src;

  return cloudinaryUrl(src, { width });
}
