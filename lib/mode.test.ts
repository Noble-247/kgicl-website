import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getSiteMode,
  hideUnverifiedSpecs,
  isLive,
  isReview,
  siteUrl,
} from "./mode";

const MODE_ENV = ["SITE_MODE", "SITE_URL", "HIDE_UNVERIFIED_SPECS"] as const;

describe("site mode", () => {
  beforeEach(() => {
    for (const name of MODE_ENV) vi.stubEnv(name, "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults to review and the review URL", () => {
    expect(getSiteMode()).toBe("review");
    expect(isReview()).toBe(true);
    expect(isLive()).toBe(false);
    expect(siteUrl()).toBe("https://kriss-goodnews-solar.vercel.app");
    expect(hideUnverifiedSpecs()).toBe(false);
  });

  it("reads review mode explicitly", () => {
    vi.stubEnv("SITE_MODE", "review");

    expect(getSiteMode()).toBe("review");
    expect(isReview()).toBe(true);
    expect(isLive()).toBe(false);
    expect(hideUnverifiedSpecs()).toBe(false);
  });

  it("reads live mode and hides unverified specs by default", () => {
    vi.stubEnv("SITE_MODE", "live");

    expect(getSiteMode()).toBe("live");
    expect(isReview()).toBe(false);
    expect(isLive()).toBe(true);
    expect(hideUnverifiedSpecs()).toBe(true);
  });

  it("treats an unknown mode as review", () => {
    vi.stubEnv("SITE_MODE", "preview");

    expect(getSiteMode()).toBe("review");
    expect(isReview()).toBe(true);
  });

  it("trims surrounding whitespace from the mode", () => {
    vi.stubEnv("SITE_MODE", "  live  ");

    expect(getSiteMode()).toBe("live");
  });

  it("removes trailing slashes from SITE_URL", () => {
    vi.stubEnv("SITE_URL", "https://kgiclsolar.com///");

    expect(siteUrl()).toBe("https://kgiclsolar.com");
  });

  it("trims whitespace around SITE_URL", () => {
    vi.stubEnv("SITE_URL", "  https://example.com/  ");

    expect(siteUrl()).toBe("https://example.com");
  });

  it("honours an explicit HIDE_UNVERIFIED_SPECS value in either mode", () => {
    vi.stubEnv("SITE_MODE", "review");
    vi.stubEnv("HIDE_UNVERIFIED_SPECS", "true");
    expect(hideUnverifiedSpecs()).toBe(true);

    vi.stubEnv("SITE_MODE", "live");
    vi.stubEnv("HIDE_UNVERIFIED_SPECS", "false");
    expect(hideUnverifiedSpecs()).toBe(false);
  });
});
