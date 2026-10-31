import { SITE } from "@/data/site";

function assertValidDate(value: Date, label: string): void {
  if (Number.isNaN(value.getTime())) {
    throw new Error(`${label} is not a valid date.`);
  }
}

/**
 * Completed years between two dates, counted on the calendar in UTC so the
 * result does not change with the server's time zone. A birthday on 26 August
 * turns over at 00:00 UTC on 26 August.
 */
export function yearsSince(date: Date, now = new Date()): number {
  assertValidDate(date, "The start date");
  assertValidDate(now, "The current date");

  let years = now.getUTCFullYear() - date.getUTCFullYear();
  const monthDifference = now.getUTCMonth() - date.getUTCMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && now.getUTCDate() < date.getUTCDate())
  ) {
    years -= 1;
  }

  return years;
}

/**
 * Completed years since the company was registered, using `foundedOn` in
 * data/site.ts. 21 in October 2026, 22 on 26 August 2027.
 */
export function companyYears(now = new Date()): number {
  const founded = new Date(`${SITE.foundedOn}T00:00:00.000Z`);
  return yearsSince(founded, now);
}
