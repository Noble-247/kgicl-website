type DividerProps = {
  tone?: "light" | "dark";
  className?: string;
};

/** Thin dotted divider, 6 px dot spacing (design.md 4.3 and 6.2). */
export function Divider({ tone = "light", className = "" }: DividerProps) {
  return (
    <hr
      className={`dotted-divider ${
        tone === "dark" ? "text-ink-3" : "text-stone-300"
      } ${className}`}
    />
  );
}
