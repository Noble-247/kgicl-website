import type { Metadata } from "next";
import { Building2, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  HISTORY,
  MISSION,
  TAGLINE,
  VALUES,
  VISION,
  WHY_CHOOSE_US,
} from "@/data/about";
import { siteUrl } from "@/lib/mode";
import { buildDescription, buildTitle } from "@/lib/seo";
import { messages, waLink } from "@/lib/whatsapp";
import { companyYears } from "@/lib/years";

export const revalidate = 86400;

const PAGE_DESCRIPTION =
  "KRIS GOODNEWS INT'L CO. LTD: registered with the CAC in 2005, a limited liability company since 2019, serving Port Harcourt and Nigeria.";

export const metadata: Metadata = {
  title: { absolute: buildTitle("About") },
  description: buildDescription(PAGE_DESCRIPTION),
  alternates: { canonical: `${siteUrl()}/about` },
};

const REASON_ICONS: readonly LucideIcon[] = [ShieldCheck, Truck, Building2];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About us"
        intro={TAGLINE}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="section-y bg-paper">
        <Container>
          <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-16">
            <div>
              <SectionHeading eyebrow="Our history" title="Since 2005" />

              {HISTORY.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="type-body mt-5">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="rounded-md border border-stone-300 bg-white p-8 text-center shadow-1">
              <p className="font-display text-[4rem] leading-none text-text">
                {companyYears()}
              </p>
              <p className="type-label mt-3 text-red-deep">
                Years of proven experience
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-2">
            <div className="rounded-md border border-stone-300 bg-white p-6 shadow-1">
              <h2 className="type-h3">Mission</h2>
              <p className="type-body mt-3 text-text-muted">{MISSION}</p>
            </div>

            <div className="rounded-md border border-stone-300 bg-white p-6 shadow-1">
              <h2 className="type-h3">Vision</h2>
              <p className="type-body mt-3 text-text-muted">{VISION}</p>
            </div>
          </Reveal>

          <div className="mt-14 md:mt-20">
            <SectionHeading eyebrow="Values" title="What we stand for" />

            <Reveal>
              <ul className="mt-6 flex flex-wrap gap-2">
                {VALUES.map((value) => (
                  <li
                    key={value}
                    className="type-small inline-flex h-10 items-center rounded-full border border-stone-300 bg-white px-4 font-semibold text-text"
                  >
                    {value}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="on-dark section-y bg-black">
        <Container>
          <SectionHeading
            eyebrow="Why choose us"
            title="Why customers choose KGICL"
            tone="dark"
            withRule
          />

          <Reveal>
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {WHY_CHOOSE_US.map((reason, index) => {
                const Icon = REASON_ICONS[index];

                return (
                  <li key={reason.title}>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] text-red-soft">
                      <Icon aria-hidden="true" size={22} />
                    </span>
                    <h3 className="type-h3 mt-4 text-white">
                      {reason.title}
                    </h3>
                    <p className="type-small mt-2 text-text-muted-on-dark">
                      {reason.text}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </Container>
      </section>

      <CtaBand
        title="Talk to us"
        text="Ask about a product, a project or a service."
        href={waLink(messages.general)}
        label="Chat on WhatsApp"
        className="border-t border-white/12"
      />
    </>
  );
}
