export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

/** Opening and closing times in 24-hour `HH:MM`, or `null` when closed. */
export type DayHours = { opens: string; closes: string } | null;

export type SitePhone = {
  /** Display form, for example "0803 613 6883". */
  display: string;
  /** International form without spaces, for `tel:` and `wa.me` links. */
  e164: string;
};

export type SiteAddress = {
  street: string;
  extended: string;
  city: string;
  region: string;
  country: string;
  /** Display lines for the footer and contact page. */
  lines: readonly string[];
};

export type Site = {
  name: string;
  tradeName: string;
  rc: string;
  foundedOn: string;
  address: SiteAddress;
  phones: readonly SitePhone[];
  whatsapp: {
    siteButton: SitePhone;
    secondary: SitePhone;
  };
  hours: {
    timeZone: "Africa/Lagos";
    days: Record<Weekday, DayHours>;
  };
  coverage: string;
  emails: readonly string[];
  /** Emails stay hidden on the site until the mailboxes are confirmed. */
  emailVerified: boolean;
};

/**
 * Company facts from the shared context (section 6) and PRD Appendix B.
 * This is the only place the site publishes phone, WhatsApp and address details.
 */
export const SITE = {
  name: "KRIS GOODNEWS INT'L CO. LTD",
  tradeName: "KGICL Goodnews Solar",
  rc: "1552853",
  foundedOn: "2005-08-26",
  address: {
    street: "No. 7 Ada George Road",
    extended: "opposite Cosy Plaza, by Wide Choice Supermarket",
    city: "Port Harcourt",
    region: "Rivers State",
    country: "Nigeria",
    lines: [
      "No. 7 Ada George Road",
      "opposite Cosy Plaza, by Wide Choice Supermarket",
      "Port Harcourt, Rivers State, Nigeria",
    ],
  },
  phones: [
    { display: "0803 613 6883", e164: "+2348036136883" },
    { display: "0805 420 7519", e164: "+2348054207519" },
  ],
  whatsapp: {
    siteButton: { display: "0813 902 7180", e164: "+2348139027180" },
    secondary: { display: "0803 613 6883", e164: "+2348036136883" },
  },
  hours: {
    timeZone: "Africa/Lagos",
    days: {
      monday: { opens: "07:00", closes: "22:00" },
      tuesday: { opens: "07:00", closes: "22:00" },
      wednesday: { opens: "07:00", closes: "22:00" },
      thursday: { opens: "07:00", closes: "22:00" },
      friday: { opens: "07:00", closes: "22:00" },
      saturday: { opens: "07:00", closes: "20:00" },
      sunday: null,
    },
  },
  coverage: "Nationwide delivery",
  emails: ["info@kgiclsolar.com", "sales@kgiclsolar.com"],
  emailVerified: false,
} as const satisfies Site;
