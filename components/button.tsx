import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export type ButtonVariant =
  | "primary"
  | "secondary-dark"
  | "secondary-light"
  | "link";

export type ButtonSize = "default" | "compact";
export type ButtonTone = "light" | "dark";

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Text-link colour on light or dark surfaces. Ignored by the other variants. */
  tone?: ButtonTone;
  /** Let a long label wrap instead of overflowing at narrow widths. */
  wrap?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type ButtonElementProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type LinkElementProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
    disabled?: boolean;
  };

export type ButtonProps = ButtonElementProps | LinkElementProps;

const BASE =
  "type-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-[translate,background-color,border-color,color,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-50";

const BASE_WRAP =
  "type-button inline-flex items-center justify-center gap-2 whitespace-normal text-center rounded-md transition-[translate,background-color,border-color,color,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-red text-white hover:-translate-y-px hover:bg-red-deep hover:shadow-[0_6px_20px_rgba(227,6,19,0.35)] active:translate-y-0",
  "secondary-dark":
    "border border-white/35 text-white hover:-translate-y-px hover:border-white hover:bg-white/[0.06] active:translate-y-0",
  "secondary-light":
    "border border-text text-text hover:-translate-y-px hover:bg-text hover:text-white active:translate-y-0",
  link: "rounded-sm underline-offset-4 hover:underline",
};

const SIZES: Record<ButtonSize, string> = {
  default: "h-[52px] px-6",
  compact: "h-11 px-4",
};

const WRAP_SIZES: Record<ButtonSize, string> = {
  default: "min-h-[52px] px-6 py-3",
  compact: "min-h-11 px-4 py-2",
};

function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  tone: ButtonTone,
  wrap: boolean,
  className: string,
): string {
  const surface =
    variant === "link"
      ? `px-0 text-left ${tone === "dark" ? "text-red-soft" : "text-red-deep"}`
      : wrap
        ? WRAP_SIZES[size]
        : SIZES[size];

  return [wrap ? BASE_WRAP : BASE, VARIANTS[variant], surface, className]
    .filter(Boolean)
    .join(" ");
}

function ButtonContent({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <>
      {icon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      ) : null}
      {children}
    </>
  );
}

/**
 * Primary, secondary and text-link buttons (design.md 6.2).
 * Pass `href` for a link or omit it for a `<button>`.
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "default",
    tone = "light",
    wrap = false,
    icon,
    className = "",
    children,
    ...rest
  } = props;
  const classes = buttonClasses(variant, size, tone, wrap, className);
  const content = <ButtonContent icon={icon}>{children}</ButtonContent>;

  if (rest.href !== undefined) {
    const { href, disabled, ...anchorRest } = rest;
    const linkProps = disabled
      ? {
          ...anchorRest,
          "aria-disabled": true,
          tabIndex: -1,
          className: `${classes} pointer-events-none opacity-50`,
        }
      : { ...anchorRest, className: classes };

    if (href.startsWith("/") || href.startsWith("#")) {
      return (
        <Link href={href} {...linkProps}>
          {content}
        </Link>
      );
    }

    return (
      <a href={href} {...linkProps}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
