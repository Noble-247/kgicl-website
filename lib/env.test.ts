import { describe, expect, it } from "vitest";

import { REQUIRED_IN_LIVE, validateEnv } from "./env";

const liveEnv = {
  SITE_MODE: "live",
  SITE_URL: "https://kgiclsolar.com",
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "test-cloud",
  RESEND_API_KEY: "test-key",
  CONTACT_FROM_EMAIL: "KGICL Website <website@notify.kgiclsolar.com>",
  CONTACT_TO_EMAIL: "info@kgiclsolar.com",
};

describe("environment validation", () => {
  it("warns about missing live variables in review mode", () => {
    const report = validateEnv({});

    expect(report.mode).toBe("review");
    expect(report.ok).toBe(true);
    expect(report.issues.map((issue) => issue.name)).toEqual(
      expect.arrayContaining([...REQUIRED_IN_LIVE]),
    );
    expect(report.issues.every((issue) => issue.severity === "warn")).toBe(true);
  });

  it("fails when live variables are missing in live mode", () => {
    const report = validateEnv({ SITE_MODE: "live" });

    expect(report.mode).toBe("live");
    expect(report.ok).toBe(false);
    expect(
      report.issues.filter((issue) => issue.severity === "error"),
    ).toHaveLength(REQUIRED_IN_LIVE.length);
  });

  it("passes with a complete live environment", () => {
    const report = validateEnv(liveEnv);

    expect(report.ok).toBe(true);
    expect(report.issues).toEqual([]);
  });

  it("warns on an invalid social URL in review and fails in live", () => {
    const review = validateEnv({ ...liveEnv, SITE_MODE: "review", FACEBOOK_URL: "not-a-url" });
    expect(review.ok).toBe(true);
    expect(review.issues.filter((issue) => issue.name === "FACEBOOK_URL")).toEqual([
      expect.objectContaining({
        name: "FACEBOOK_URL",
        severity: "warn",
      }),
    ]);

    const live = validateEnv({ ...liveEnv, FACEBOOK_URL: "not-a-url" });
    expect(live.ok).toBe(false);
    expect(live.issues).toEqual([
      expect.objectContaining({
        name: "FACEBOOK_URL",
        severity: "error",
      }),
    ]);
  });

  it("accepts blank social variables", () => {
    const report = validateEnv({ ...liveEnv, FACEBOOK_URL: "" });

    expect(report.ok).toBe(true);
    expect(report.issues).toEqual([]);
  });

  it("does not include an invalid value in the issue message", () => {
    const value = "private-person";
    const report = validateEnv({ ...liveEnv, CONTACT_TO_EMAIL: value });

    expect(report.ok).toBe(false);
    expect(JSON.stringify(report)).not.toContain(value);
  });

  it("validates SITE_MODE and HIDE_UNVERIFIED_SPECS values", () => {
    const report = validateEnv({
      SITE_MODE: "staging",
      HIDE_UNVERIFIED_SPECS: "yes",
    });

    expect(report.mode).toBe("review");
    expect(report.issues.map((issue) => issue.name)).toEqual(
      expect.arrayContaining(["SITE_MODE", "HIDE_UNVERIFIED_SPECS"]),
    );
  });
});
