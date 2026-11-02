import type { Metadata } from "next";

import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import {
  getPrivacySections,
  PRIVACY_INTRO,
  PRIVACY_LAST_UPDATED,
} from "@/data/privacy";
import { siteUrl } from "@/lib/mode";
import { buildDescription, buildTitle } from "@/lib/seo";

export const revalidate = 86400;

const PAGE_DESCRIPTION =
  "How KGICL Goodnews Solar collects, uses and protects the personal data you send through this website, under the Nigeria Data Protection Act 2023.";

export const metadata: Metadata = {
  title: { absolute: buildTitle("Privacy notice") },
  description: buildDescription(PAGE_DESCRIPTION),
  alternates: { canonical: `${siteUrl()}/privacy` },
};

export default function PrivacyPage() {
  const sections = getPrivacySections();

  return (
    <>
      <PageHero
        title="Privacy notice"
        intro={PRIVACY_INTRO}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy notice" }]}
      />

      <section className="section-y bg-paper">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,70ch)] lg:items-start lg:gap-16">
            <nav aria-labelledby="privacy-contents" className="lg:sticky lg:top-28">
              <h2 id="privacy-contents" className="type-label text-text-muted">
                On this page
              </h2>
              <ul className="mt-4 space-y-2 border-l border-stone-300 pl-4">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="type-small block text-text-muted transition-colors hover:text-red-deep"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <article>
              <p className="type-small text-text-muted">
                Last updated: {PRIVACY_LAST_UPDATED}
              </p>

              <div className="mt-8 space-y-10">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24"
                  >
                    <h2 className="type-h3">{section.heading}</h2>

                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="type-body mt-3">
                        {paragraph}
                      </p>
                    ))}

                    {section.items ? (
                      <ul className="type-body mt-3 list-disc space-y-2 pl-5">
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}

                    {section.after?.map((paragraph) => (
                      <p key={paragraph} className="type-body mt-3">
                        {paragraph}
                      </p>
                    ))}
                  </section>
                ))}
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
