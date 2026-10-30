import Image from "next/image";

export type CloudImageProps = {
  /** Cloudinary public ID, or null when the product has no photo. */
  publicId: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  fit?: "contain" | "cover";
  className?: string;
  width?: number;
  height?: number;
};

type PlaceholderProps = {
  width: number;
  height: number;
  className?: string;
};

/**
 * Development and preview placeholder: a stone block with the KG monogram.
 * It never says "Photo coming soon" and never shifts the layout.
 */
export function ImagePlaceholder({
  width,
  height,
  className = "",
}: PlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      style={{ aspectRatio: `${width} / ${height}` }}
      className={`flex w-full items-center justify-center bg-stone-100 ${className}`}
    >
      <span className="type-h3 select-none text-stone-300">KG</span>
    </div>
  );
}

/**
 * Product image through the Cloudinary loader (design.md 8).
 * Width and height are always set; the first image on a page passes priority.
 */
export function CloudImage({
  publicId,
  alt,
  sizes = "100vw",
  priority = false,
  fit = "contain",
  className = "",
  width = 800,
  height = 600,
}: CloudImageProps) {
  if (!publicId) {
    return (
      <ImagePlaceholder width={width} height={height} className={className} />
    );
  }

  return (
    <Image
      src={publicId}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={`h-full w-full ${
        fit === "cover" ? "object-cover" : "object-contain"
      } ${className}`}
    />
  );
}
