import { describe, expect, it } from "vitest";

import { allow } from "./rate-limit";

describe("allow", () => {
  it("allows up to the limit inside the window", () => {
    const key = `limit-${Date.now()}-a`;
    const now = 1_000_000;

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      expect(allow(key, 5, 60_000, now + attempt)).toBe(true);
    }

    expect(allow(key, 5, 60_000, now + 6)).toBe(false);
  });

  it("allows again once the window has passed", () => {
    const key = `window-${Date.now()}-b`;
    const now = 2_000_000;

    expect(allow(key, 1, 10_000, now)).toBe(true);
    expect(allow(key, 1, 10_000, now + 9_999)).toBe(false);
    expect(allow(key, 1, 10_000, now + 10_000)).toBe(true);
  });

  it("counts each key separately", () => {
    const prefix = `separate-${Date.now()}`;
    const now = 3_000_000;

    expect(allow(`${prefix}-one`, 1, 60_000, now)).toBe(true);
    expect(allow(`${prefix}-one`, 1, 60_000, now + 1)).toBe(false);
    expect(allow(`${prefix}-two`, 1, 60_000, now + 1)).toBe(true);
  });

  it("uses a five-per-ten-minutes default", () => {
    const key = `default-${Date.now()}-c`;
    const now = 4_000_000;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(allow(key, undefined, undefined, now + attempt)).toBe(true);
    }

    expect(allow(key, undefined, undefined, now + 5)).toBe(false);
    expect(allow(key, undefined, undefined, now + 10 * 60 * 1000)).toBe(true);
  });
});
