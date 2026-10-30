import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CLOUDINARY_FALLBACK, cloudinaryUrl } from "./cloudinary";

const ORIGINAL_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const ORIGINAL_MODE = process.env.SITE_MODE;

function restore(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

beforeEach(() => {
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "x5utb1ld";
  delete process.env.SITE_MODE;
});

afterEach(() => {
  restore("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", ORIGINAL_CLOUD);
  restore("SITE_MODE", ORIGINAL_MODE);
});

describe("cloudinaryUrl", () => {
  it("builds the default auto transformation", () => {
    expect(cloudinaryUrl("5-120W_12-eye", { width: 480 })).toBe(
      "https://res.cloudinary.com/x5utb1ld/image/upload/f_auto,q_auto,w_480/5-120W_12-eye",
    );
  });

  it("uses each requested width", () => {
    expect(cloudinaryUrl("5-120W_12-eye", { width: 800 })).toContain(",w_800/");
    expect(cloudinaryUrl("5-120W_12-eye", { width: 1200 })).toContain(
      ",w_1200/",
    );
  });

  it("encodes spaces and parentheses in each path segment", () => {
    expect(cloudinaryUrl("products/my photo (1)", { width: 480 })).toBe(
      "https://res.cloudinary.com/x5utb1ld/image/upload/f_auto,q_auto,w_480/products/my%20photo%20%281%29",
    );
  });

  it("accepts explicit quality and format", () => {
    expect(
      cloudinaryUrl("5-120W_12-eye", {
        width: 640,
        quality: "80",
        format: "webp",
      }),
    ).toContain("/image/upload/f_webp,q_80,w_640/");
  });

  it("rejects a width that is not a positive number", () => {
    expect(() => cloudinaryUrl("5-120W_12-eye", { width: 0 })).toThrowError(
      /width must be a positive number/,
    );
  });

  it("returns the safe fallback in review when the cloud name is missing", () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    expect(cloudinaryUrl("5-120W_12-eye", { width: 480 })).toBe(
      CLOUDINARY_FALLBACK,
    );
  });

  it("throws a clear error in live mode when the cloud name is missing", () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    process.env.SITE_MODE = "live";
    expect(() => cloudinaryUrl("5-120W_12-eye", { width: 480 })).toThrowError(
      /NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set/,
    );
  });
});
