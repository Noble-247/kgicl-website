export type SiteMode = "review" | "live";

const DEFAULT_SITE_URL = "https://kriss-goodnews-solar.vercel.app";

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

/**
 * Server-side only. Anything other than `live` is treated as the safe
 * review default, including a missing or malformed value.
 */
export function getSiteMode(): SiteMode {
  return readEnv("SITE_MODE") === "live" ? "live" : "review";
}

export function isReview(): boolean {
  return getSiteMode() === "review";
}

export function isLive(): boolean {
  return getSiteMode() === "live";
}

/** Canonical base URL without a trailing slash. */
export function siteUrl(): string {
  const raw = readEnv("SITE_URL");
  const withoutTrailingSlashes = raw.replace(/\/+$/, "");
  return withoutTrailingSlashes || DEFAULT_SITE_URL;
}

/**
 * Defaults to false in review and true in live. `HIDE_UNVERIFIED_SPECS`
 * overrides the default in either mode.
 */
export function hideUnverifiedSpecs(): boolean {
  const raw = readEnv("HIDE_UNVERIFIED_SPECS").toLowerCase();
  if (raw === "true") return true;
  if (raw === "false") return false;
  return isLive();
}
