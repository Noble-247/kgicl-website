import { z } from "zod";

import type { SiteMode } from "@/lib/mode";

export type EnvSeverity = "warn" | "error";

export type EnvIssue = {
  /** Variable name only. Values are never included. */
  name: string;
  message: string;
  severity: EnvSeverity;
};

export type EnvReport = {
  ok: boolean;
  mode: SiteMode;
  issues: EnvIssue[];
};

/** Required for a live deployment. Missing values are warnings in review. */
export const REQUIRED_IN_LIVE = [
  "SITE_URL",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "RESEND_API_KEY",
  "CONTACT_FROM_EMAIL",
  "CONTACT_TO_EMAIL",
] as const;

const httpUrl = z
  .url()
  .refine((value) => /^https?:\/\//i.test(value), "must be an http or https URL");

const email = z.email();

const sender = z
  .string()
  .refine(
    (value) =>
      email.safeParse(value).success ||
      /^[^<>]+<[^<>@\s]+@[^<>@\s]+>$/.test(value),
    "must be an email address or a 'Name <email@example.com>' sender",
  );

export type EnvSource = Readonly<Record<string, string | undefined>>;

const socialUrl = httpUrl;

function read(source: EnvSource, name: string): string {
  const value = source[name];
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates the environment without logging anything. Issue messages mention
 * variable names and formats only, never the values.
 */
export function validateEnv(source: EnvSource = process.env): EnvReport {
  const mode: SiteMode = read(source, "SITE_MODE") === "live" ? "live" : "review";
  const severity: EnvSeverity = mode === "live" ? "error" : "warn";
  const issues: EnvIssue[] = [];

  const add = (name: string, message: string) => {
    issues.push({ name, message, severity });
  };

  const checkFormat = (
    name: string,
    schema: z.ZodType<string>,
    message: string,
  ) => {
    const value = read(source, name);
    if (value && !schema.safeParse(value).success) add(name, message);
  };

  for (const name of REQUIRED_IN_LIVE) {
    if (!read(source, name)) add(name, `${name} is not set.`);
  }

  checkFormat("SITE_MODE", z.enum(["review", "live"]), 'SITE_MODE must be "review" or "live".');
  checkFormat("SITE_URL", httpUrl, "SITE_URL must be a valid http or https URL.");
  checkFormat(
    "CONTACT_FROM_EMAIL",
    sender,
    "CONTACT_FROM_EMAIL must be an email address or a 'Name <email@example.com>' sender.",
  );
  checkFormat(
    "CONTACT_TO_EMAIL",
    email,
    "CONTACT_TO_EMAIL must be a valid email address.",
  );

  for (const name of ["FACEBOOK_URL", "INSTAGRAM_URL", "LINKEDIN_URL"]) {
    checkFormat(name, socialUrl, `${name} must be a valid http or https URL.`);
  }

  checkFormat(
    "HIDE_UNVERIFIED_SPECS",
    z.enum(["true", "false"]),
    'HIDE_UNVERIFIED_SPECS must be "true" or "false".',
  );

  return {
    ok: !issues.some((issue) => issue.severity === "error"),
    mode,
    issues,
  };
}
