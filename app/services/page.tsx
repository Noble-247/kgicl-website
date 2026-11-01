import type { Metadata } from "next";
import {
  BatteryCharging,
  Check,
  HardHat,
  Sun,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { OTHER_SERVICES, SERVICES } from "@/data/services";
import { TERMS } from "@/data/terms";
import { siteUrl } from "@/lib/mode";
import { buildDescription, buildTitle } from "@/lib/seo";
import { messages, waLink } from "@/lib/whatsapp";

const PAGE_DESCRIPTION =
  "Solar consultation and installation, electrical installation and wiring, UPS supply, procurement and logistics, and civil works in Port Harcourt.";

export const metadata: Metadata = {
  title: { absolute: buildTitle("Services") },
  description: buildDescription(PAGE_DESCRIPTION),
  alternates: { canonical: `${siteUrl()}/services` },
};

const SERVICE_ICONS: readonly LucideIcon[] = [
  Sun,
  Zap,
  BatteryCharging,
  Truck,
  HardHat,
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Services"
        intro="Installation, supply and procurement for homes, businesses and industrial sites."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <section className="section-y bg-paper">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="Our services"
            intro="Five services, from advice and installation to sourcing and delivery."
          />

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                icon={SERVICE_ICONS[index]}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="section-y border-t border-stone-300 bg-white">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Terms"
              title="Warranty and payment terms"
            />

            <ul className="mt-6 space-y-4">
              {TERMS.map((term) => (
                <li key={term} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red/10 text-red-deep">
                    <Check aria-hidden="true" size={14} strokeWidth={3} />
                  </span>
                  <span className="type-body">{term}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading eyebrow="Also available" title="Other services" />

            <ul className="mt-6 space-y-3">
              {OTHER_SERVICES.map((service) => (
                <li
                  key={service}
                  className="type-body flex gap-3 border-b border-stone-300 pb-3 last:border-0"
                >
                  <span aria-hidden="true" className="text-red-deep">
                    &bull;
                  </span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CtaBand
        title="Need a service or a quote?"
        text="Send us the details and we will reply with the next step."
        href={waLink(messages.general)}
        label="Chat on WhatsApp"
      />
    </>
  );
}
