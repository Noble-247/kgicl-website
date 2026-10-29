import Image from "next/image";
import Link from "next/link";

import { COMPANY_NAV, PRODUCT_AREAS } from "@/data/nav";
import { SITE, type DayHours, type Weekday } from "@/data/site";
import { telLink } from "@/lib/whatsapp";

import { SocialLinks } from "./social-links";

function clock(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "pm" : "am";
  const hour = hours % 12 || 12;

  return minutes === 0
    ? `${hour}${suffix}`
    : `${hour}:${String(minutes).padStart(2, "0")}${suffix}`;
}

function dayLine(label: string, day: DayHours): string {
  return day
    ? `${label} ${clock(day.opens)} to ${clock(day.closes)}`
    : `${label} closed`;
}

const days: Record<Weekday, DayHours> = SITE.hours.days;
const hours = [
  dayLine("Mon to Fri", days.monday),
  dayLine("Sat", days.saturday),
  dayLine("Sun", days.sunday),
];

const linkClass =
  "text-text-muted-on-dark transition-colors hover:text-white";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-black text-white">
      <div className="container-site py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <Image
              src="/assets/img/logo-mark-white.svg"
              alt="KGICL Goodnews Solar"
              width={128}
              height={128}
              className="h-16 w-16"
            />
            <p className="type-small mt-4 max-w-[32ch] text-text-muted-on-dark">
              Solar lighting, electrical supplies and industrial supply.
              Port Harcourt, Nigeria.
            </p>
            <p className="type-small mt-3 font-semibold text-white">
              {SITE.coverage}
            </p>
            <SocialLinks />
          </div>

          <nav aria-labelledby="footer-products">
            <h2 id="footer-products" className="type-label text-white">
              Products
            </h2>
            <ul className="mt-4 space-y-3">
              {PRODUCT_AREAS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} prefetch={false} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-company">
            <h2 id="footer-company" className="type-label text-white">
              Company
            </h2>
            <ul className="mt-4 space-y-3">
              {COMPANY_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} prefetch={false} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="type-label text-white">Visit us</h2>
            <address className="type-small mt-4 not-italic text-text-muted-on-dark">
              {SITE.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <ul className="type-small mt-4 space-y-1 text-text-muted-on-dark">
              {hours.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <ul className="type-small mt-4 space-y-1">
              {SITE.phones.map((phone) => (
                <li key={phone.e164}>
                  <a href={telLink(phone.display)} className={linkClass}>
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
            {SITE.emailVerified ? (
              <ul className="type-small mt-4 space-y-1">
                {SITE.emails.map((email) => (
                  <li key={email}>
                    <a href={`mailto:${email}`} className={linkClass}>
                      {email}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-12 border-t border-white/12 pt-6">
          <p className="type-small text-text-muted-on-dark">
            © {year} Kris Goodnews Int&apos;l Co. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
