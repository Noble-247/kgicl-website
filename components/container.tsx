import type { ReactNode } from "react";

type ContainerElement = "div" | "section" | "article" | "header" | "footer" | "nav";

type ContainerProps = {
  as?: ContainerElement;
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Page gutter: max 1200 px, 20 / 32 / 40 px side padding (design.md 4.3). */
export function Container({
  as: Tag = "div",
  id,
  className = "",
  children,
}: ContainerProps) {
  return (
    <Tag id={id} className={`container-site ${className}`}>
      {children}
    </Tag>
  );
}
