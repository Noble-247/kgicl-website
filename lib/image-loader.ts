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
  return cloudinaryUrl(src, { width });
}
