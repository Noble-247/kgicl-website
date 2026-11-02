import type { Metadata } from "next";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SocialLinks } from "@/components/social-links";
import { SITE, WEEKDAYS, type Weekday } from "@/data/site";
import { getBySlug } from "@/lib/catalogue";
import { formatTime, isOpenNow, todayHours } from "@/lib/hours";
import { siteUrl } from "@/lib/mode";
import { buildDescription, buildTitle, localBusinessJsonLd } from "@/lib/seo";
import { getSocialLinks } from "@/lib/social";
import { messages, telLink, waLink } from "@/lib/whatsapp";

import { ContactForm } from "./ContactForm";

/**
 * A Resend call takes well under two seconds. Fail fast instead of leaving the
 * visitor waiting on a stuck request.
 */
export const maxDuration = 15;

const PAGE_DESCRIPTION =
  "Call, WhatsApp or send a message to KGICL Goodnews Solar in Port Harcourt. Address, opening hours and directions.";

export const metadata: Metadata = {
  title: { absolute: buildTitle("Contact") },
  description: buildDescription(PAGE_DESCRIPTION),
  alternates: { canonical: `${siteUrl()}/contact` },
};

const DAY_LABELS: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  [
    SITE.address.street,
    SITE.address.extended,
    SITE.address.city,
    SITE.address.region,
    SITE.address.country,
  ].join(", "),
)}`;

type ContactPageProps = {
  searchParams: Promise<{ product?: string | string[] }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  /*
   * `?product={slug}` comes from the product enquiry panel. Resolving the slug
   * here means the form posts the product name, not a URL. Reading searchParams
   * makes this one route dynamic; every other page stays static.
   */
  const params = await searchParams;
  const slug =
    typeof params.product === "string" ? params.product.trim() : "";
  const product = slug ? getBySlug(slug) : undefined;
  const productName = product?.published ? product.name : "";

  const now = new Date();
  const today = todayHours(now);
  const open = isOpenNow(now);
  const socialLinks = getSocialLinks();

  return (
    <>
      <JsonLd data={localBusinessJsonLd(`${siteUrl()}/`)} />

      <PageHero
        title="Contact us"
        intro="Call, message or visit us in Port Harcourt. We reply within working hours."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="section-y bg-paper">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
            {/* Details first in the DOM, so they come first on mobile. */}
            <div className="space-y-6">
              <div className="rounded-md border border-stone-300 bg-white p-6 shadow-1">
                <h2 className="type-h3">Visit or call us</h2>

                <div className="mt-4 flex gap-3">
                  <MapPin
                    aria-hidden="true"
                    size={20}
                    className="mt-0.5 shrink-0 text-red-deep"
                  />
                  <address className="type-body not-italic">
                    {SITE.address.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>

                <ul className="mt-5 space-y-2 border-t border-stone-300 pt-5">
                  {SITE.phones.map((phone) => (
                    <li key={phone.e164}>
                      <a
                        href={telLink(phone.e164)}
                        className="type-body inline-flex items-center gap-2 font-semibold text-text underline-offset-4 hover:text-red-deep hover:underline"
                      >
                        <Phone
                          aria-hidden="true"
                          size={17}
                          className="shrink-0 text-red-deep"
                        />
                        {phone.display}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-col gap-3">
                  <Button
                    href={waLink(messages.general)}
                    target="_blank"
                    rel="noreferrer"
                    icon={<FaWhatsapp />}
                    className="w-full"
                  >
                    Chat on WhatsApp
                  </Button>

                  <Button
                    href={DIRECTIONS_URL}
                    target="_blank"
                    rel="noreferrer"
                    variant="secondary-light"
                    icon={<Navigation aria-hidden="true" size={18} />}
                    className="w-full"
                  >
                    Get directions
                  </Button>
                </div>
              </div>

              <div className="rounded-md border border-stone-300 bg-white p-6 shadow-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="type-h3 flex items-center gap-2">
                    <Clock
                      aria-hidden="true"
                      size={18}
                      className="text-red-deep"
                    />
                    Opening hours
                  </h2>

                  <span
                    className={`type-small inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${
                      open
                        ? "bg-success/10 text-success"
                        : "bg-stone-100 text-text-muted"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${
                        open ? "bg-success" : "bg-text-muted"
                      }`}
                    />
                    {open ? "Open now" : "Closed now"}
                  </span>
                </div>

                <table className="mt-4 w-full border-collapse text-left">
                  <caption className="sr-only">Opening hours</caption>
                  <tbody>
                    {WEEKDAYS.map((day) => {
                      const hours = SITE.hours.days[day];
                      const isToday = day === today.day;

                      return (
                        <tr
                          key={day}
                          aria-current={isToday ? "date" : undefined}
                          className={isToday ? "bg-stone-100" : undefined}
                        >
                          <th
                            scope="row"
                            className={`type-small py-2 pl-2 font-normal text-text-muted ${
                              isToday ? "font-semibold text-text" : ""
                            }`}
                          >
                            {DAY_LABELS[day]}
                          </th>
                          <td
                            className={`type-small py-2 pr-2 text-right ${
                              isToday
                                ? "font-semibold text-text"
                                : "text-text-muted"
                            }`}
                          >
                            {hours
                              ? `${formatTime(hours.opens)} to ${formatTime(hours.closes)}`
                              : "Closed"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <p className="type-small mt-3 text-text-muted">
                  Opening hours are in Nigerian time (WAT).
                </p>
              </div>

              {socialLinks.length > 0 ? (
                <div className="rounded-md border border-stone-300 bg-white p-6 shadow-1">
                  <h2 className="type-h3">Follow us</h2>
                  <SocialLinks
                    links={socialLinks}
                    tone="light"
                    className="mt-4"
                  />
                </div>
              ) : null}
            </div>

            <div>
              <SectionHeading
                eyebrow="Send a message"
                title="Tell us what you need"
                intro="Share your power needs, the application and the quantity. We will reply with the next step."
              />

              {productName ? (
                <p className="type-small mt-4 text-text-muted">
                  Enquiry about{" "}
                  <span className="font-semibold text-text">
                    {productName}
                  </span>
                  .
                </p>
              ) : null}

              <ContactForm product={productName} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
