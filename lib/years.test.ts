import { describe, expect, it } from "vitest";

import { companyYears, yearsSince } from "./years";

const founded = new Date("2005-08-26T00:00:00.000Z");

describe("yearsSince", () => {
  it("counts completed years on the registration date", () => {
    expect(yearsSince(founded, new Date("2026-08-25T00:00:00.000Z"))).toBe(20);
    expect(yearsSince(founded, new Date("2026-08-26T00:00:00.000Z"))).toBe(21);
    expect(yearsSince(founded, new Date("2027-08-26T00:00:00.000Z"))).toBe(22);
  });

  it("does not count a year before the anniversary month", () => {
    expect(yearsSince(founded, new Date("2027-08-25T00:00:00.000Z"))).toBe(21);
    expect(yearsSince(founded, new Date("2027-07-31T00:00:00.000Z"))).toBe(21);
  });

  it("handles a leap-day start date", () => {
    const leapDay = new Date("2024-02-29T00:00:00.000Z");

    expect(yearsSince(leapDay, new Date("2025-02-28T00:00:00.000Z"))).toBe(0);
    expect(yearsSince(leapDay, new Date("2025-03-01T00:00:00.000Z"))).toBe(1);
  });

  it("rejects an invalid date with a plain message", () => {
    expect(() => yearsSince(new Date("not a date"))).toThrow(
      "The start date is not a valid date.",
    );
  });
});

describe("companyYears", () => {
  it("uses foundedOn from data/site.ts", () => {
    expect(companyYears(new Date("2026-10-31T00:00:00.000Z"))).toBe(21);
  });
});
