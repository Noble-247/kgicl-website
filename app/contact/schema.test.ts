import { describe, expect, it } from "vitest";

import { NEED_OPTIONS } from "./options";
import { contactSchema } from "./schema";

const valid = {
  name: "Ada Okafor",
  phone: "0803 613 6883",
  email: "",
  location: "Port Harcourt",
  need: "Solar lighting",
  message: "We need 12 solar street lights for an estate.",
  product: "100W Solar Street Light",
  consent: "on",
};

function issuesFor(input: Record<string, string>) {
  const result = contactSchema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.map((issue) => String(issue.path[0]));
}

describe("contactSchema", () => {
  it("accepts a complete enquiry with no email", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts every approved need option", () => {
    for (const need of NEED_OPTIONS) {
      expect(contactSchema.safeParse({ ...valid, need }).success).toBe(true);
    }
  });

  it("accepts a valid email when one is given", () => {
    expect(
      contactSchema.safeParse({ ...valid, email: "ada@example.com" }).success,
    ).toBe(true);
  });

  it("reports a missing or too-short name", () => {
    expect(issuesFor({ ...valid, name: "" })).toContain("name");
    expect(issuesFor({ ...valid, name: "A" })).toContain("name");
  });

  it("rejects a phone number with letters", () => {
    expect(issuesFor({ ...valid, phone: "call me" })).toContain("phone");
  });

  it("rejects an invalid email but allows a blank one", () => {
    expect(issuesFor({ ...valid, email: "not-an-email" })).toContain("email");
    expect(issuesFor({ ...valid, email: "" })).not.toContain("email");
  });

  it("rejects a location that is too short", () => {
    expect(issuesFor({ ...valid, location: "" })).toContain("location");
  });

  it("rejects a need outside the approved options", () => {
    expect(issuesFor({ ...valid, need: "Free money" })).toContain("need");
    expect(issuesFor({ ...valid, need: "" })).toContain("need");
  });

  it("rejects a message under 10 or over 1000 characters", () => {
    expect(issuesFor({ ...valid, message: "Too short" })).toContain("message");
    expect(issuesFor({ ...valid, message: "x".repeat(1001) })).toContain(
      "message",
    );
  });

  it("requires the consent box to be ticked", () => {
    expect(issuesFor({ ...valid, consent: "" })).toContain("consent");
    expect(issuesFor({ ...valid, consent: "true" })).toContain("consent");
  });

  it("keeps the product field optional and capped", () => {
    expect(contactSchema.safeParse({ ...valid, product: "" }).success).toBe(
      true,
    );
    expect(issuesFor({ ...valid, product: "x".repeat(121) })).toContain(
      "product",
    );
  });
});
