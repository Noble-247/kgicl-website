import { describe, expect, it } from "vitest";

import {
  formatTime,
  isOpenNow,
  openingHoursLine,
  todayHours,
} from "./hours";

/** Lagos is UTC+1 all year, so 06:00Z is 07:00 in Lagos. */
const lagos = (isoUtc: string) => new Date(isoUtc);

describe("isOpenNow", () => {
  it.each([
    "2026-10-26",
    "2026-10-27",
    "2026-10-28",
    "2026-10-29",
    "2026-10-30",
  ])("is open at 07:00 and 21:59 on %s", (day) => {
    expect(isOpenNow(lagos(`${day}T06:00:00Z`))).toBe(true);
    expect(isOpenNow(lagos(`${day}T20:59:00Z`))).toBe(true);
  });

  it("closes at 22:00 on a weekday", () => {
    expect(isOpenNow(lagos("2026-10-26T20:59:59Z"))).toBe(true);
    expect(isOpenNow(lagos("2026-10-26T21:00:00Z"))).toBe(false);
  });

  it("closes at 20:00 on Saturday", () => {
    expect(isOpenNow(lagos("2026-10-31T18:59:00Z"))).toBe(true);
    expect(isOpenNow(lagos("2026-10-31T19:00:00Z"))).toBe(false);
  });

  it("is closed all day Sunday", () => {
    expect(isOpenNow(lagos("2026-11-01T06:00:00Z"))).toBe(false);
    expect(isOpenNow(lagos("2026-11-01T12:00:00Z"))).toBe(false);
    expect(isOpenNow(lagos("2026-11-01T20:00:00Z"))).toBe(false);
  });

  it("uses Lagos time when the server runs in UTC", () => {
    // 06:00Z is 07:00 in Lagos and open; 05:00Z is 06:00 and still closed.
    expect(isOpenNow(lagos("2026-10-26T06:00:00Z"))).toBe(true);
    expect(isOpenNow(lagos("2026-10-26T05:00:00Z"))).toBe(false);
    // 23:00Z on Monday is 00:00 Tuesday in Lagos, before opening.
    expect(isOpenNow(lagos("2026-10-26T23:00:00Z"))).toBe(false);
  });
});

describe("todayHours", () => {
  it("returns the Lagos weekday and its hours", () => {
    expect(todayHours(lagos("2026-10-26T12:00:00Z"))).toEqual({
      day: "monday",
      hours: { opens: "07:00", closes: "22:00" },
    });
  });

  it("rolls over at midnight in Lagos, not UTC", () => {
    expect(todayHours(lagos("2026-10-31T22:59:00Z")).day).toBe("saturday");
    expect(todayHours(lagos("2026-10-31T23:00:00Z")).day).toBe("sunday");
  });

  it("does not crash at midnight or on a leap day", () => {
    expect(todayHours(lagos("2024-02-29T23:00:00Z"))).toEqual({
      day: "friday",
      hours: { opens: "07:00", closes: "22:00" },
    });
    expect(todayHours(lagos("2024-02-29T12:00:00Z")).day).toBe("thursday");
  });

  it("rejects an invalid date with a plain message", () => {
    expect(() => todayHours(new Date("not a date"))).toThrow(
      "The date for the opening-hours check is not valid.",
    );
  });
});

describe("formatting", () => {
  it("formats opening times", () => {
    expect(formatTime("07:00")).toBe("7am");
    expect(formatTime("22:00")).toBe("10pm");
    expect(formatTime("07:30")).toBe("7:30am");
  });

  it("builds the enquiry-panel line from data/site.ts", () => {
    expect(openingHoursLine()).toBe(
      "Open Mon to Fri 7am to 10pm, Sat 7am to 8pm.",
    );
  });
});
