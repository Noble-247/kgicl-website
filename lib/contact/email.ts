import type { ContactInput } from "@/app/contact/schema";
import { isReview } from "@/lib/mode";

/** Escapes every value the visitor typed before it goes into the HTML email. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

/** "0803 613 6883" or "+234 803 613 6883" becomes "2348036136883". */
export function toWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits;
}

export type EnquiryEmail = {
  subject: string;
  text: string;
  html: string;
};

/** Builds the subject, plain-text body and HTML body for one enquiry. */
export function buildEnquiryEmail(data: ContactInput): EnquiryEmail {
  const subjectLine = oneLine(
    `New website enquiry: ${data.need} (${data.name})`,
  );
  const subject = isReview() ? `[REVIEW] ${subjectLine}` : subjectLine;
  const whatsapp = `https://wa.me/${toWhatsAppDigits(data.phone)}`;

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email || "Not given"],
    ["Location", data.location],
    ["Interested in", data.need],
    ["Product page", data.product || "None (general enquiry)"],
  ];

  const text =
    rows.map(([key, value]) => `${key}: ${value}`).join("\n") +
    `\n\nMessage:\n${data.message}\n\nReply on WhatsApp: ${whatsapp}\n` +
    `\nSent from the KGICL website contact form.`;

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111;max-width:560px">
  <h2 style="margin:0 0 12px">New website enquiry</h2>
  <table cellpadding="6" style="border-collapse:collapse;width:100%">
    ${rows
      .map(
        ([key, value]) =>
          `<tr><td style="border-bottom:1px solid #eee;color:#555;width:140px">${escapeHtml(key)}</td>` +
          `<td style="border-bottom:1px solid #eee"><strong>${escapeHtml(value)}</strong></td></tr>`,
      )
      .join("")}
  </table>
  <p style="margin:16px 0 4px;color:#555">Message</p>
  <p style="margin:0;white-space:pre-wrap">${escapeHtml(data.message)}</p>
  <p style="margin:20px 0 0"><a href="${whatsapp}">Reply on WhatsApp</a></p>
  <p style="margin:20px 0 0;color:#888;font-size:12px">Sent from the KGICL website contact form.</p>
</div>`;

  return { subject, text, html };
}
