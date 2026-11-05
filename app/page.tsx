import type { Metadata } from "next";
import {
  ArrowRight,
  BatteryCharging,
  Building2,
  HardHat,
  Phone,
  ShieldCheck,
  Sun,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { ChipLink } from "@/components/chip";
import { CloudImage } from "@/components/CloudImage";
import { Container } from "@/components/container";
import { DottedRing } from "@/components/dotted-ring";
import { PillarTile, type PillarKey } from "@/components/home/PillarTile";
import { Testimonials } from "@/components/home/Testimonials";
import { JsonLd } from "@/components/json-ld";
import { ProjectCard } from "@/components/projects/project-card";
import { ProductGrid } from "@/components/catalogue/product-grid";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { WHY_CHOOSE_US } from "@/data/about";
import { SITE_IMAGES } from "@/data/images";
import { PROJECTS } from "@/data/projects";
import { SERVICES } from "@/data/services";
import { SITE } from "@/data/site";
import { getFeatured } from "@/lib/catalogue";
import { openingHoursLine } from "@/lib/hours";
import { siteUrl } from "@/lib/mode";
import { buildDescription, localBusinessJsonLd } from "@/lib/seo";
import { messages, telLink, waLink } from "@/lib/whatsapp";
import { companyYears } from "@/lib/years";

export const revalidate = 86400;

const TITLE =
  "KGICL Goodnews Solar | Solar and electrical supplies, Port Harcourt";
const DESCRIPTION =
  "Solar street lights, CCTV, electrical materials and industrial supply, with nationwide delivery.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: buildDescription(DESCRIPTION),
  alternates: { canonical: `${siteUrl()}/` },
};

type Pillar = {
  key: PillarKey;
  title: string;
  description: string;
  href: string;
};

const PILLARS: readonly Pillar[] = [
  {
    key: "solar",
    title: "Solar Lighting",
    description: "Street lights for estates, streets, schools and highways.",
    href: "/solar-lighting",
  },
  {
    key: "cctv",
    title: "CCTV & Security",
    description: "Cameras and recorders for homes, shops and estates.",
    href: "/cctv-security",
  },
  {
    key: "electrical",
    title: "Electrical Supplies",
    description: "Cables, switches, protection and power backup.",
    href: "/electrical-supplies",
  },
  {
    key: "industrial",
    title: "Industrial Supply",
    description: "Safety and earthing supplies, supplied on request.",
    href: "/industrial-supply",
  },
];

const REASON_ICONS: readonly LucideIcon[] = [ShieldCheck, Truck, Building2];

const SERVICE_ICONS: readonly LucideIcon[] = [
  Sun,
  Zap,
  BatteryCharging,
  Truck,
  HardHat,
];

export default function HomePage() {
  const baseUrl = siteUrl();
  const featured = getFeatured();

  return (
    <>
      <JsonLd data={localBusinessJsonLd(`${baseUrl}/`)} />

      {/* Hero: ring motif and glow, with an unused photo slot (design.md 7.1). */}
      <section className="on-dark relative overflow-hidden bg-black">
        {SITE_IMAGES.hero ? (
          <div aria-hidden="true" className="absolute inset-0">
            <CloudImage
              publicId={SITE_IMAGES.hero}
              alt=""
              fit="cover"
              sizes="100vw"
              width={1280}
              height={720}
              className="opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
          </div>
        ) : null}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60% 60% at 0% 0%, rgba(227, 6, 19, 0.30), transparent 70%), radial-gradient(45% 45% at 100% 100%, rgba(255, 176, 32, 0.10), transparent 70%)",
          }}
        />

        <DottedRing
          size={320}
          opacity={0.08}
          priority
          className="pointer-events-none absolute -right-24 -top-24 md:hidden"
        />
        <DottedRing
          size={720}
          opacity={0.08}
          className="pointer-events-none absolute -right-40 -top-40 hidden md:block"
        />

        <Container className="relative py-8 md:py-24">
          <p className="type-label text-red-soft">Port Harcourt, Nigeria</p>

          <h1 className="type-display mt-3 max-w-4xl text-white">
            Solar and electrical supplies you can rely on.
          </h1>

          <p className="type-body-lg mt-4 max-w-2xl text-text-muted-on-dark">
            Solar street lights, CCTV, electrical materials and industrial
            supply, with nationwide delivery.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              href={waLink(messages.general)}
              target="_blank"
              rel="noreferrer"
              icon={<FaWhatsapp />}
            >
              Chat on WhatsApp
            </Button>
            <Button href="/solar-lighting" variant="secondary-dark">
              Browse products
            </Button>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Product areas">
            {PILLARS.map((pillar) => (
              <li key={pillar.key}>
                <ChipLink href={pillar.href} tone="dark">
                  {pillar.title}
                </ChipLink>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section-y bg-paper">
        <Container>
          <SectionHeading eyebrow="Products" title="What we supply" />

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {PILLARS.map((pillar) => (
              <PillarTile
                key={pillar.key}
                area={pillar.key}
                title={pillar.title}
                description={pillar.description}
                href={pillar.href}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="section-y border-y border-stone-300 bg-white">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Featured" title="Popular products" />
              <Button href="/solar-lighting" variant="link">
                See all products
                <ArrowRight aria-hidden="true" size={18} />
              </Button>
            </div>
          </Reveal>

          <ProductGrid
            products={featured}
            baseUrl={baseUrl}
            prioritySlug={null}
            reveal
            className="mt-8"
          />
        </Container>
      </section>

      <section className="on-dark section-y bg-black">
        <Container>
          <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Why choose us"
                title="Why customers choose KGICL"
                tone="dark"
                withRule
              />

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
            </div>

            <div className="rounded-md border border-white/12 bg-ink-2 p-8 text-center">
              <p className="font-display text-[4rem] leading-none text-white">
                {companyYears()}
              </p>
              <p className="type-label mt-3 text-red-soft">
                Years of proven experience
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-y bg-paper">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Projects" title="Recent projects" />
            <Button href="/projects" variant="link">
              See all projects
              <ArrowRight aria-hidden="true" size={18} />
            </Button>
          </div>

          <Reveal className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PROJECTS.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Reveal>
        </Container>
      </section>

      <Testimonials />

      <section className="section-y bg-paper">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Services"
            intro="Installation, supply and procurement for homes, businesses and industrial sites."
          />

          <Reveal className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {SERVICES.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                icon={SERVICE_ICONS[index]}
              />
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="on-dark section-y bg-black">
        <Container>
          <Reveal className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <SectionHeading eyebrow="Contact" title="Talk to us" tone="dark" />

              <address className="type-body mt-4 not-italic text-text-muted-on-dark">
                {SITE.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>

              <p className="type-small mt-3 text-text-muted-on-dark">
                {openingHoursLine()}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Button
                href={waLink(messages.general)}
                target="_blank"
                rel="noreferrer"
                icon={<FaWhatsapp />}
              >
                WhatsApp
              </Button>
              <Button
                href={telLink(SITE.phones[0].e164)}
                variant="secondary-dark"
                icon={<Phone aria-hidden="true" size={18} />}
                aria-label={`Call us on ${SITE.phones[0].display}`}
              >
                Call us
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
