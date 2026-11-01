import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CloudImage } from "@/components/CloudImage";
import { DottedRing } from "@/components/dotted-ring";
import { SITE_IMAGES } from "@/data/images";

export type PillarKey = "solar" | "cctv" | "electrical" | "industrial";

type PillarTileProps = {
  /** Key into `SITE_IMAGES.tiles`; the photo state switches on its own. */
  area: PillarKey;
  title: string;
  /** One plain sentence, kept short enough for the tile. */
  description: string;
  href: string;
  className?: string;
};

/**
 * Home area tile (design.md 6.3). The default is the approved dark gradient
 * with the dotted ring. Adding a Cloudinary public ID to
 * `SITE_IMAGES.tiles.<area>` switches this tile to its photo state.
 */
export function PillarTile({
  area,
  title,
  description,
  href,
  className = "",
}: PillarTileProps) {
  const photo = SITE_IMAGES.tiles[area];

  return (
    <Link
      href={href}
      className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-md bg-black p-4 text-white transition-[translate,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-3 sm:aspect-[4/3] ${className}`}
    >
      {photo ? (
        <>
          <CloudImage
            publicId={photo}
            alt={title}
            fit="cover"
            sizes="(min-width: 1024px) 25vw, 50vw"
            width={640}
            height={480}
            className="absolute inset-0 transition-transform duration-150 group-hover:scale-[1.03]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15"
          />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-ink-3 via-ink-2 to-black"
          />
          <DottedRing
            size={220}
            opacity={0.14}
            rotate={false}
            className="pointer-events-none absolute -right-16 -top-16"
          />
        </>
      )}

      <ArrowUpRight
        aria-hidden="true"
        size={20}
        className="absolute right-4 top-4 text-white transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />

      <div className="relative">
        <h3 className="type-h3">{title}</h3>
        <p className="type-small mt-1 text-text-muted-on-dark">{description}</p>
      </div>
    </Link>
  );
}
