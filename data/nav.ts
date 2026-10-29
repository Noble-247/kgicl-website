export type NavItem = {
  label: string;
  href: string;
};

// Routes arrive in Tasks 02–03. Until then the shell sets prefetch={false}
// on these links so the review deployment has no 404 prefetch noise.
// Remove those props once every route exists.

/** The four catalogue areas. Shared by the header and the footer. */
export const PRODUCT_AREAS = [
  { label: "Solar Lighting", href: "/solar-lighting" },
  { label: "CCTV & Security", href: "/cctv-security" },
  { label: "Electrical Supplies", href: "/electrical-supplies" },
  { label: "Industrial Supply", href: "/industrial-supply" },
] as const satisfies readonly NavItem[];

/** Eight primary links, in the order set by design.md 6.1. */
export const PRIMARY_NAV = [
  ...PRODUCT_AREAS,
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const satisfies readonly NavItem[];

export const COMPANY_NAV = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy notice", href: "/privacy" },
] as const satisfies readonly NavItem[];

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
