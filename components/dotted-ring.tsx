import Image from "next/image";

type DottedRingProps = {
  /** Square size in pixels. The hero uses 520 to 720. */
  size: number;
  /** 0 to 1; the hero uses 0.06 to 0.1. */
  opacity?: number;
  /** Slow 120 s rotation; off for static decoration. */
  rotate?: boolean;
  priority?: boolean;
  className?: string;
};

/** Decorative dotted ring from the brand pack. Always `aria-hidden`. */
export function DottedRing({
  size,
  opacity = 0.08,
  rotate = true,
  priority = false,
  className = "",
}: DottedRingProps) {
  return (
    <Image
      src="/assets/img/logo-ring-white.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      priority={priority}
      className={`${rotate ? "dotted-ring" : ""} ${className}`}
      style={{ width: size, height: size, opacity }}
    />
  );
}
