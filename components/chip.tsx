import { Check } from "lucide-react";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children"
> & {
  selected?: boolean;
  className?: string;
  children: ReactNode;
};

/** Filter chip, 40 px pill (design.md 6.2). Selection is never colour-only. */
export function Chip({
  selected = false,
  className = "",
  children,
  type = "button",
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 ${
        selected
          ? "border-text bg-text text-white"
          : "border-stone-300 bg-white text-text hover:border-text"
      } ${className}`}
      {...rest}
    >
      {selected ? <Check aria-hidden="true" size={16} /> : null}
      {children}
    </button>
  );
}

type ChipLinkProps = {
  href: string;
  /** Dark pills sit on the home hero. */
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
};

/** The chip pill used as a navigation link (home hero, design.md 6.2). */
export function ChipLink({
  href,
  tone = "light",
  className = "",
  children,
}: ChipLinkProps) {
  const palette =
    tone === "dark"
      ? "border-white/25 text-white hover:border-white hover:bg-white/[0.06]"
      : "border-stone-300 bg-white text-text hover:border-text";

  return (
    <Link
      href={href}
      className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold transition-colors ${palette} ${className}`}
    >
      {children}
    </Link>
  );
}
