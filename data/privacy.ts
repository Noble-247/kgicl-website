import { SITE } from "@/data/site";

export type PrivacySection = {
  /** Anchor used by the contents list. */
  id: string;
  heading: string;
  paragraphs: readonly string[];
  /** Optional bullet list, rendered after the paragraphs. */
  items?: readonly string[];
  /** Optional paragraphs rendered after the bullet list. */
  after?: readonly string[];
};

/** The date the client last approved this notice. */
export const PRIVACY_LAST_UPDATED = "2 November 2026";

export const PRIVACY_INTRO =
  "How KGICL Goodnews Solar collects and uses the personal data you send through this website.";

/**
 * The privacy notice required by PRD section 9.4.
 *
 * Two items are still with the client: the privacy contact and the retention
 * period. They stay as visible `[To be confirmed by KGICL]` markers, and the
 * pre-launch audit blocks live mode while any marker remains.
 */
export function getPrivacySections(): readonly PrivacySection[] {
  const address = [
    SITE.address.street,
    SITE.address.extended,
    `${SITE.address.city}, ${SITE.address.region}, ${SITE.address.country}`,
  ].join(", ");

  return [
    {
      id: "who-we-are",
      heading: "Who we are",
      paragraphs: [
        `KGICL Goodnews Solar is the trading name of ${SITE.name} (RC ${SITE.rc}), ${address}.`,
        "We decide why and how the personal data described in this notice is used. We handle it in line with the Nigeria Data Protection Act 2023 and the Nigeria Data Protection Commission's 2025 directive.",
      ],
    },
    {
      id: "what-we-collect",
      heading: "What we collect and why",
      paragraphs: [
        "When you send an enquiry through the contact form, we collect:",
      ],
      items: [
        "your name;",
        "your phone number;",
        "your email address, if you choose to give one;",
        "your location;",
        "the product or service you are interested in, and your message.",
      ],
      after: [
        "We use these details to reply to your enquiry and to follow up on the product or service you asked about.",
      ],
    },
    {
      id: "lawful-basis",
      heading: "Lawful basis",
      paragraphs: [
        "We rely on your consent. You give consent by ticking the unticked checkbox on the contact form before you send it.",
        "You can withdraw consent at any time by contacting us. Withdrawing consent does not affect anything we did with your data before you withdrew it.",
      ],
    },
    {
      id: "who-handles-the-data",
      heading: "Who handles the data",
      paragraphs: [
        "Resend delivers the enquiry email to us, and Vercel hosts this website. They process the data on our instructions as service providers.",
        "Their servers are outside Nigeria, so your data may be transferred outside Nigeria.",
      ],
    },
    {
      id: "how-long-we-keep-enquiries",
      heading: "How long we keep enquiries",
      paragraphs: ["Retention period: [To be confirmed by KGICL]."],
    },
    {
      id: "your-rights",
      heading: "Your rights",
      paragraphs: [
        "Under the Nigeria Data Protection Act 2023, you can ask us to:",
      ],
      items: [
        "give you a copy of the personal data we hold about you;",
        "correct personal data that is inaccurate or incomplete;",
        "delete your personal data;",
        "withdraw the consent you gave us;",
        "complain to the data protection regulator.",
      ],
      after: [
        "To exercise any of these rights, contact us using the details below. You can also complain to the Nigeria Data Protection Commission (NDPC).",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies",
      paragraphs: [
        "This website does not use cookies for tracking. The analytics we use is cookieless, so it does not set cookies or identify you personally.",
      ],
    },
    {
      id: "privacy-contact",
      heading: "Contact for privacy requests",
      paragraphs: [
        SITE.emailVerified
          ? `Email ${SITE.emails[0]} with your request.`
          : "Privacy contact: [To be confirmed by KGICL].",
      ],
    },
  ];
}
