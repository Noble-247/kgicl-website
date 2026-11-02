import { describe, expect, it } from "vitest";

import {
  getSocialLinks,
  invalidSocialVariables,
  isValidSocialLink,
} from "./social";

const VALID = {
  FACEBOOK_URL: "https://facebook.com/kgiclsolar",
  INSTAGRAM_URL: "https://www.instagram.com/kgiclsolar/",
  LINKEDIN_URL: "https://linkedin.com/company/kgiclsolar",
};

describe("getSocialLinks", () => {
  it("returns each valid link in network order", () => {
    const links = getSocialLinks(VALID);

    expect(links.map((link) => link.network)).toEqual([
      "facebook",
      "instagram",
      "linkedin",
    ]);
    expect(links[0]).toEqual({
      network: "facebook",
      name: "Facebook",
      href: "https://facebook.com/kgiclsolar",
    });
    expect(links[1].href).toBe("https://www.instagram.com/kgiclsolar/");
  });

  it("returns nothing when the variables are blank or missing", () => {
    expect(getSocialLinks({})).toEqual([]);
    expect(
      getSocialLinks({ FACEBOOK_URL: "   ", INSTAGRAM_URL: "", LINKEDIN_URL: "" }),
    ).toEqual([]);
  });

  it("rejects a link on the wrong host", () => {
    expect(
      getSocialLinks({ FACEBOOK_URL: "https://instagram.com/kgiclsolar" }),
    ).toEqual([]);
  });

  it("rejects a lookalike host", () => {
    expect(
      getSocialLinks({ FACEBOOK_URL: "https://facebook.com.evil.example/kgicl" }),
    ).toEqual([]);
    expect(
      getSocialLinks({ FACEBOOK_URL: "https://notfacebook.com/kgicl" }),
    ).toEqual([]);
  });

  it("accepts only https", () => {
    expect(
      getSocialLinks({ FACEBOOK_URL: "http://facebook.com/kgiclsolar" }),
    ).toEqual([]);
  });

  it("rejects placeholder, example and your", () => {
    expect(
      getSocialLinks({ FACEBOOK_URL: "https://facebook.com/placeholder" }),
    ).toEqual([]);
    expect(
      getSocialLinks({ FACEBOOK_URL: "https://facebook.com/example" }),
    ).toEqual([]);
    expect(
      getSocialLinks({ FACEBOOK_URL: "https://facebook.com/your-page" }),
    ).toEqual([]);
  });

  it("returns only the valid links from a mixed set", () => {
    const links = getSocialLinks({
      FACEBOOK_URL: "https://facebook.com/example",
      INSTAGRAM_URL: "https://instagram.com/kgiclsolar",
      LINKEDIN_URL: "not a url",
    });

    expect(links.map((link) => link.network)).toEqual(["instagram"]);
  });
});

describe("isValidSocialLink", () => {
  it("accepts a matching host and a subdomain", () => {
    expect(
      isValidSocialLink("linkedin", "https://linkedin.com/company/kgicl"),
    ).toBe(true);
    expect(
      isValidSocialLink("linkedin", "https://www.linkedin.com/company/kgicl"),
    ).toBe(true);
  });

  it("rejects blank values and other protocols", () => {
    expect(isValidSocialLink("facebook", "")).toBe(false);
    expect(
      isValidSocialLink("facebook", "ftp://facebook.com/kgiclsolar"),
    ).toBe(false);
  });
});

describe("invalidSocialVariables", () => {
  it("lists only variables that are set but invalid", () => {
    expect(
      invalidSocialVariables({
        FACEBOOK_URL: "https://facebook.com/example",
        INSTAGRAM_URL: "",
        LINKEDIN_URL: "https://linkedin.com/company/kgiclsolar",
      }),
    ).toEqual([
      {
        env: "FACEBOOK_URL",
        network: "facebook",
        expectedHost: "facebook.com",
      },
    ]);
  });

  it("returns nothing when every variable is blank or valid", () => {
    expect(invalidSocialVariables(VALID)).toEqual([]);
    expect(invalidSocialVariables({})).toEqual([]);
  });
});
