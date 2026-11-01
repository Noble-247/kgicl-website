import type { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ProductGrid } from "@/components/catalogue/product-grid";
import { SectionHeading } from "@/components/section-heading";
import { AREA_BY_SLUG } from "@/lib/areas";
import { getByGroup } from "@/lib/catalogue";
import { siteUrl } from "@/lib/mode";
import { buildDescription, buildTitle } from "@/lib/seo";
import { messages, waLink } from "@/lib/whatsapp";

const area = AREA_BY_SLUG["industrial-supply"];

const PAGE_DESCRIPTION =
  "PPE and safety equipment, earthing and lightning protection, and pipes and marine supplies, supplied on request from Port Harcourt.";

export const metadata: Metadata = {
  title: { absolute: buildTitle(area.title) },
  description: buildDescription(PAGE_DESCRIPTION),
  alternates: { canonical: `${siteUrl()}/${area.slug}` },
};

const STEPS = [
  {
    title: "Tell us what you need",
    text: "Send the items, quantities and delivery location on WhatsApp.",
  },
  {
    title: "We quote",
    text: "We confirm availability and send you a written quote.",
  },
  {
    title: "We deliver",
    text: "We supply the items and arrange delivery to your site.",
  },
] as const;

export default function IndustrialSupplyPage() {
  const baseUrl = siteUrl();
  const pageUrl = `${baseUrl}/${area.slug}`;

  const groups = area.groups
    .map((group) => ({
      ...group,
      products: getByGroup(area.slug, group.key).filter(
        (product) => product.published,
      ),
    }))
    .filter((group) => group.products.length > 0);

  const firstSlug = groups[0]?.products[0]?.slug;

  const quoteLink = waLink(
    messages.industrial({ name: "industrial supplies", url: pageUrl }),
  );
  const pipesLink = waLink(
    messages.industrial({
      name: "safety pipes and anchor chains",
      url: pageUrl,
    }),
  );

  return (
    <>
      <PageHero
        title={area.title}
        intro="Supplied on request. Tell us what you need and we will quote."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: area.title },
        ]}
      >
        <Button
          href={quoteLink}
          target="_blank"
          rel="noreferrer"
          icon={<FaWhatsapp />}
        >
          Ask for a quote
        </Button>
      </PageHero>

      <section className="on-dark bg-black pb-16 md:pb-24">
        <Container className="space-y-14 md:space-y-20">
          {groups.map((group) => (
            <section
              key={group.key}
              aria-labelledby={`group-${group.key}`}
              className="scroll-mt-24"
            >
              <SectionHeading
                id={`group-${group.key}`}
                title={group.label}
                intro={`${group.products.length} ${
                  group.products.length === 1 ? "product" : "products"
                }`}
                tone="dark"
              />

              <ProductGrid
                products={group.products}
                baseUrl={baseUrl}
                variant="compact"
                enquiry="industrial"
                prioritySlug={firstSlug}
                className="mt-6"
              />
            </section>
          ))}

          <section
            aria-labelledby="group-pipes-marine"
            className="scroll-mt-24"
          >
            <SectionHeading
              id="group-pipes-marine"
              title="Pipes & Marine"
              tone="dark"
            />

            <div className="mt-6 rounded-md border border-white/12 bg-ink-3 p-6 md:max-w-2xl">
              <p className="type-body text-text-muted-on-dark">
                Safety pipes and anchor chains, supplied on request. Ask us on
                WhatsApp.
              </p>
              <Button
                href={pipesLink}
                target="_blank"
                rel="noreferrer"
                variant="secondary-dark"
                icon={<FaWhatsapp />}
                className="mt-5"
              >
                Ask about pipes and marine
              </Button>
            </div>
          </section>

          <section
            aria-labelledby="how-it-works"
            className="rounded-md border border-white/12 bg-ink-2 p-6 md:p-10"
          >
            <SectionHeading
              id="how-it-works"
              eyebrow="How it works"
              title="From list to delivery"
              tone="dark"
            />

            <ol className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-sm font-bold text-red-soft"
                  >
                    {index + 1}
                  </span>
                  <h3 className="type-h3 mt-4 text-white">{step.title}</h3>
                  <p className="type-small mt-2 text-text-muted-on-dark">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>

            <Button
              href={quoteLink}
              target="_blank"
              rel="noreferrer"
              icon={<FaWhatsapp />}
              className="mt-8"
            >
              Send your list on WhatsApp
            </Button>
          </section>
        </Container>
      </section>
    </>
  );
}
