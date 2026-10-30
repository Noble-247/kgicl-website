import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  /** Adds the optional 24 px amber rule before the eyebrow. */
  withRule?: boolean;
  id?: string;
  className?: string;
};

/** Eyebrow + H2 + intro, for section headings (design.md 6.2). */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
  withRule = false,
  id,
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  const eyebrowColour = tone === "dark" ? "text-red-soft" : "text-red-deep";
  const titleColour = tone === "dark" ? "text-white" : "text-text";
  const introColour = tone === "dark" ? "text-text-muted-on-dark" : "text-text-muted";

  return (
    <div className={`${centered ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow ? (
        <p
          className={`type-label flex items-center gap-3 ${eyebrowColour} ${
            centered ? "justify-center" : ""
          }`}
        >
          {withRule ? (
            <span aria-hidden="true" className="h-px w-6 shrink-0 bg-amber" />
          ) : null}
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className={`type-h2 mt-3 ${titleColour}`}>
        {title}
      </h2>
      {intro ? (
        <p
          className={`type-body-lg mt-4 max-w-[65ch] ${introColour} ${
            centered ? "mx-auto" : ""
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
