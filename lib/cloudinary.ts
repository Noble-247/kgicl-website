import { isLive } from "@/lib/mode";

export type CloudinaryOptions = {
  /** Requested width in CSS pixels. Cloudinary performs the resize. */
  width: number;
  /** Cloudinary quality token, for example "auto". */
  quality?: string;
  /** Cloudinary format token, for example "auto" or "webp". */
  format?: string;
};

/** Shown in review mode when the cloud name is missing, instead of a broken image. */
export const CLOUDINARY_FALLBACK = "/image-placeholder.svg";

/** RFC 3986 encoding: `encodeURIComponent` leaves `!'()*` unescaped. */
function encodeSegment(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (character) =>
      `%${character.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`,
  );
}

function cloudName(): string {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ?? "";
}

/**
 * Build a Cloudinary delivery URL from a stored public ID (PRD 6.7).
 * Only the public ID is stored in the data files; this is the single place
 * that knows the cloud name and transformation string.
 */
export function cloudinaryUrl(
  publicId: string,
  { width, quality = "auto", format = "auto" }: CloudinaryOptions,
): string {
  if (!Number.isFinite(width) || width <= 0) {
    throw new Error("Cloudinary image width must be a positive number.");
  }

  const cloud = cloudName();
  if (!cloud) {
    if (isLive()) {
      throw new Error(
        "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set. Add it to the environment before building.",
      );
    }
    return CLOUDINARY_FALLBACK;
  }

  const path = publicId
    .split("/")
    .filter((segment) => segment.length > 0)
    .map(encodeSegment)
    .join("/");

  return `https://res.cloudinary.com/${encodeSegment(cloud)}/image/upload/f_${format},q_${quality},w_${width}/${path}`;
}
