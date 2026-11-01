import { afterEach, describe, expect, it, vi } from "vitest";

import type { ContactInput } from "@/app/contact/schema";

import {
  buildEnquiryEmail,
  escapeHtml,
  toWhatsAppDigits,
} from "./email";

const enquiry: ContactInput = {
  name: "Ada Okafor",
  phone: "0803 613 6883",
  email: "ada@example.com",
  location: "Port Harcourt",
  need: "Solar lighting",
  message: "We need 12 solar street lights for an estate.",
  product: "100W Solar Street Light",
  consent: "on",
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("escapeHtml", () => {
  it("escapes every HTML-sensitive character", () => {
    expect(escapeHtml(`<script>"x" & 'y'</script>`)).toBe(
      "&lt;script&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/script&gt;",
    );
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("12 solar lights, Port Harcourt")).toBe(
      "12 solar lights, Port Harcourt",
    );
  });
});

describe("toWhatsAppDigits", () => {
  it.each([
    ["0803 613 6883", "2348036136883"],
    ["+234 803 613 6883", "2348036136883"],
    ["2348036136883", "2348036136883"],
    ["(0803) 613-6883", "2348036136883"],
    ["8036136883", "8036136883"],
  ])("turns %s into %s", (phone, expected) => {
    expect(toWhatsAppDigits(phone)).toBe(expected);
  });
});

describe("buildEnquiryEmail", () => {
  it("prefixes the subject in review mode", () => {
    vi.stubEnv("SITE_MODE", "review");

    const email = buildEnquiryEmail(enquiry);

    expect(email.subject).toBe(
      "[REVIEW] New website enquiry: Solar lighting (Ada Okafor)",
    );
  });

  it("leaves the subject unprefixed in live mode", () => {
    vi.stubEnv("SITE_MODE", "live");

    const email = buildEnquiryEmail(enquiry);

    expect(email.subject).toBe(
      "New website enquiry: Solar lighting (Ada Okafor)",
    );
  });

  it("keeps the subject on one line", () => {
    vi.stubEnv("SITE_MODE", "review");

    const email = buildEnquiryEmail({
      ...enquiry,
      name: "Ada\nOkafor",
      need: "Solar\r\nlighting",
    });

    expect(email.subject).not.toMatch(/[\r\n]/);
  });

  it("includes the submitted fields and a WhatsApp reply link", () => {
    vi.stubEnv("SITE_MODE", "review");

    const email = buildEnquiryEmail(enquiry);

    expect(email.text).toContain("Name: Ada Okafor");
    expect(email.text).toContain("Phone: 0803 613 6883");
    expect(email.text).toContain("Email: ada@example.com");
    expect(email.text).toContain("Location: Port Harcourt");
    expect(email.text).toContain("Interested in: Solar lighting");
    expect(email.text).toContain("Product page: 100W Solar Street Light");
    expect(email.text).toContain(
      "Reply on WhatsApp: https://wa.me/2348036136883",
    );
    expect(email.text).toContain(enquiry.message);
  });

  it("marks an optional email and product as not given", () => {
    vi.stubEnv("SITE_MODE", "review");

    const email = buildEnquiryEmail({ ...enquiry, email: "", product: "" });

    expect(email.text).toContain("Email: Not given");
    expect(email.text).toContain("Product page: None (general enquiry)");
  });

  it("escapes user input in the HTML body", () => {
    vi.stubEnv("SITE_MODE", "review");

    const email = buildEnquiryEmail({
      ...enquiry,
      message: "<script>alert(1)</script>",
      name: "Ada & Co <b>",
    });

    expect(email.html).not.toContain("<script>alert(1)</script>");
    expect(email.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(email.html).toContain("Ada &amp; Co &lt;b&gt;");
  });

  it("does not let HTML in the subject reach the HTML body unescaped", () => {
    vi.stubEnv("SITE_MODE", "review");

    const email = buildEnquiryEmail({ ...enquiry, need: "<img src=x>" });

    expect(email.html).toContain("&lt;img src=x&gt;");
  });
});
