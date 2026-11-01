"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import { buildEnquiryEmail } from "@/lib/contact/email";
import { allow } from "@/lib/rate-limit";

import { contactSchema, type ContactInput, type ContactState } from "./schema";

const MIN_FILL_MS = 3_000; // humans take longer than 3 seconds
const MAX_AGE_MS = 24 * 60 * 60_000; // form older than a day: ask to reload

const FIELDS = [
  "name",
  "phone",
  "email",
  "location",
  "need",
  "message",
  "product",
  "consent",
] as const;

const read = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

const SEND_FAILED =
  "Sorry, we couldn't send your message. Please message us on WhatsApp or call us instead.";

export async function sendEnquiry(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // 1. Honeypot: a hidden field that real people never fill in.
  if (read(formData, "website") !== "") return { status: "success" };

  // 2. Timing: bots submit instantly.
  const startedAt = Number(read(formData, "startedAt"));
  const elapsed = Date.now() - startedAt;
  if (!startedAt || elapsed < MIN_FILL_MS || elapsed > MAX_AGE_MS) {
    return { status: "error", message: "Please reload the page and try again." };
  }

  // 3. Best-effort rate limit per IP.
  const headerList = await headers();
  const ip = (
    headerList.get("x-real-ip") ??
    headerList.get("x-forwarded-for")?.split(",")[0] ??
    "unknown"
  ).trim();
  if (!allow(ip)) {
    return {
      status: "error",
      message:
        "Too many messages from your connection. Please try again in a few minutes or use WhatsApp.",
    };
  }

  // 4. Validate.
  const raw = Object.fromEntries(
    FIELDS.map((field) => [field, read(formData, field)]),
  ) as Record<keyof ContactInput, string>;

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]) as keyof ContactInput;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      values: raw,
    };
  }

  // 5. Check configuration (never reveal details to the visitor).
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    console.error("[contact] Email is not configured (missing env variables)");
    return { status: "error", message: SEND_FAILED, values: raw };
  }

  // 6. Send. The SDK returns { data, error }; it does not throw for API errors.
  try {
    const resend = new Resend(apiKey); // created here, not at import time
    const { subject, text, html } = buildEnquiryEmail(parsed.data);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: parsed.data.email || undefined,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[contact] Resend error:", error.name, error.message);
      return { status: "error", message: SEND_FAILED, values: raw };
    }

    return { status: "success" };
  } catch (error) {
    // Unexpected failures only (network, runtime). Log it, never show details.
    console.error("[contact] Unexpected send failure:", error);
    return { status: "error", message: SEND_FAILED, values: raw };
  }
}
