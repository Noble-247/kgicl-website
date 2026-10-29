import { SITE } from "@/data/site";

/**
 * Temporary shell links. Sub-task 1.5 replaces this file with
 * `lib/whatsapp.ts`, which owns every WhatsApp and phone link.
 */
export const GENERAL_WHATSAPP_HREF = `https://wa.me/${SITE.whatsapp.siteButton.e164.replace(
  /^\+/,
  "",
)}?text=${encodeURIComponent("Hello KGICL, I'd like to make an enquiry.")}`;

export const PRIMARY_PHONE_HREF = `tel:${SITE.phones[0].e164}`;

export function telHref(e164: string): string {
  return `tel:${e164}`;
}
