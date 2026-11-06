import { RING_PATH, RING_VIEW_BOX } from "@/components/dotted-ring-path";

type DottedRingProps = {
  /** Square size in pixels. The hero uses 520 to 720. */
  size: number;
  /** 0 to 1; the hero uses 0.06 to 0.1. */
  opacity?: number;
  /** Slow 120 s rotation; off for static decoration. */
  rotate?: boolean;
  className?: string;
};

const SPRITE_ID = "kg-dotted-ring";

/**
 * One hidden copy of the ring path per page. Inline SVG is not an image, so
 * the motif can never become a Largest Contentful Paint candidate, and every
 * ring references this sprite instead of repeating the 29 kB path.
 */
export function DottedRingSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <symbol id={SPRITE_ID} viewBox={RING_VIEW_BOX}>
          <path d={RING_PATH} fill="#FFFFFF" fillRule="evenodd" />
        </symbol>
      </defs>
    </svg>
  );
}

/** Decorative dotted ring from the brand pack. Always `aria-hidden`. */
export function DottedRing({
  size,
  opacity = 0.08,
  rotate = true,
  className = "",
}: DottedRingProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={RING_VIEW_BOX}
      className={`${rotate ? "dotted-ring" : ""} ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      <use href={`#${SPRITE_ID}`} width="800" height="800" />
    </svg>
  );
}
