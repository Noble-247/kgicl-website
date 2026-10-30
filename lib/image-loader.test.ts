import { afterEach, beforeEach, describe, expect, it } from "vitest";

import cloudinaryLoader from "./image-loader";

const ORIGINAL_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

beforeEach(() => {
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "x5utb1ld";
});

afterEach(() => {
  if (ORIGINAL_CLOUD === undefined) {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  } else {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = ORIGINAL_CLOUD;
  }
});

describe("cloudinaryLoader", () => {
  it("resolves a stored public ID through Cloudinary", () => {
    expect(cloudinaryLoader({ src: "5-120W_12-eye", width: 640 })).toBe(
      "https://res.cloudinary.com/x5utb1ld/image/upload/f_auto,q_auto,w_640/5-120W_12-eye",
    );
  });

  it("leaves local public assets untouched", () => {
    expect(
      cloudinaryLoader({ src: "/assets/img/logo-mark-white.svg", width: 96 }),
    ).toBe("/assets/img/logo-mark-white.svg");
  });

  it("leaves absolute and protocol-relative URLs untouched", () => {
    expect(
      cloudinaryLoader({ src: "https://example.com/photo.jpg", width: 640 }),
    ).toBe("https://example.com/photo.jpg");
    expect(
      cloudinaryLoader({ src: "//example.com/photo.jpg", width: 640 }),
    ).toBe("//example.com/photo.jpg");
  });
});
