import type { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { AREA_BY_SLUG } from "@/lib/areas";
import { siteUrl } from "@/lib/mode";
import { buildDescription, buildTitle } from "@/lib/seo";
import { messages, waLink } from "@/lib/whatsapp";

const area = AREA_BY_SLUG["industrial-supply"];

export const metadata: Metadata = {
  title: { absolute: buildTitle(area.title) },
  description: buildDescription(area.intro),
  alternates: { canonical: `${siteUrl()}/${area.slug}` },
};

/**
 * Temporary Industrial Supply page for the review build. Task 03 replaces it
 * with the full dark catalogue, so the main navigation has no broken link now.
 */
export default function IndustrialSupplyPage() {
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
          href={waLink(messages.general)}
          target="_blank"
          rel="noreferrer"
          icon={<FaWhatsapp />}
        >
          Ask for a quote
        </Button>
      </PageHero>

      <section className="on-dark bg-black py-16">
        <Container className="max-w-3xl">
          <h2 className="type-h2 text-white">
            Safety and earthing supplies, available on request
          </h2>
          <p className="type-body-lg mt-4 text-text-muted-on-dark">
            We supply PPE and safety equipment, earthing and lightning
            protection, and pipes and marine supplies. Send us the items,
            quantities and delivery location, and we will reply with a quote.
          </p>
          <Button
            href={waLink(messages.general)}
            target="_blank"
            rel="noreferrer"
            icon={<FaWhatsapp />}
            className="mt-8"
          >
            Send your list on WhatsApp
          </Button>
        </Container>
      </section>
    </>
  );
}
