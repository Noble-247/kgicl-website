export type Severity = "off" | "warn" | "error";

export const GATES: Record<
  string,
  { review: Severity; live: Severity; note: string }
> = {
  featuredInvalid: { review: "error", live: "error", note: "Always on" },
  privateNumbers: {
    review: "error",
    live: "error",
    note: "Never publish third-party phone numbers. Always on",
  },
  testimonialPlaceholders: {
    review: "off",
    live: "error",
    note: "Placeholders must not go live",
  },
  socialInvalid: {
    review: "warn",
    live: "error",
    note: "Set but not a valid URL",
  },
  photoNotReal: {
    review: "warn",
    live: "error",
    note: "stock, unverified or missing photo on a published product",
  },
  provisionalSlug: {
    review: "warn",
    live: "error",
    note: "Product name still cut off in the source",
  },
  placeholderText: {
    review: "warn",
    live: "error",
    note: "e.g. Customer Name, lorem, EXAM",
  },
  missingAlt: {
    review: "warn",
    live: "error",
    note: "Content image without alt text",
  },
  missingEnv: {
    review: "warn",
    live: "error",
    note: "Required environment variable missing",
  },
  unverifiedClaims: {
    review: "off",
    live: "warn",
    note: "Earthing and PPE specs not yet verified",
  },
  modeMismatch: {
    review: "error",
    live: "error",
    note: "Always on: SITE_MODE unset on a Vercel production build, or SITE_MODE and SITE_URL disagree (live mode on a vercel.app address, or review mode on kgiclsolar.com)",
  },
};
