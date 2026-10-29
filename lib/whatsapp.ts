import { SITE } from "@/data/site";

/** Site WhatsApp number in international digits, from the single company record. */
const WHATSAPP_NUMBER = SITE.whatsapp.siteButton.e164.replace(/\D/g, "");

/** RFC 3986 encoding: `encodeURIComponent` leaves `!'()*` unescaped. */
function encodeMessage(message: string): string {
  return encodeURIComponent(message).replace(
    /[!'()*]/g,
    (character) =>
      `%${character.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`,
  );
}

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeMessage(message)}`;
}

/** Approved templates from design.md section 11. */
export const messages = {
  general: "Hello KGICL, I'd like to make an enquiry.",
  product: ({
    name,
    modelCode,
    url,
  }: {
    name: string;
    modelCode?: string;
    url: string;
  }) => {
    const model = modelCode?.trim() ? ` (${modelCode.trim()})` : "";
    return `Hello KGICL, I'm interested in the ${name}${model}. ${url}`;
  },
  industrial: ({ name, url }: { name: string; url: string }) =>
    `Hello KGICL, I'd like a quote for: ${name}. ${url}`,
} as const;

/**
 * `tel:` link from a Nigerian number in local or international form:
 * "0803 613 6883", "+2348036136883" and "2348036136883" all work.
 */
export function telLink(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (trimmed.startsWith("+") || digits.startsWith("234")) {
    return `tel:+${digits.replace(/^\+/, "")}`;
  }

  const local = digits.startsWith("0") ? digits.slice(1) : digits;
  return `tel:+234${local}`;
}
