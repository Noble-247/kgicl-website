import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
  /** Text colour on a light or dark surface. */
  tone?: "light" | "dark";
  className?: string;
};

/** Small breadcrumb trail; the last item is the current page (design.md 6.2). */
export function Breadcrumbs({
  items,
  tone = "light",
  className = "",
}: BreadcrumbsProps) {
  const dark = tone === "dark";

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={`type-small flex flex-wrap items-center gap-x-2 gap-y-1 ${
          dark ? "text-text-muted-on-dark" : "text-text-muted"
        }`}
      >
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className={dark ? "text-white/30" : "text-stone-300"}
                >
                  /
                </span>
              ) : null}
              {current || !item.href ? (
                <span aria-current={current ? "page" : undefined}>{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  prefetch={false}
                  className={`transition-colors ${
                    dark ? "hover:text-white" : "hover:text-text"
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
