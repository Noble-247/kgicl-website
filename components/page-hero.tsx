import type { ReactNode } from "react";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { DottedRing } from "@/components/dotted-ring";

type PageHeroProps = {
  title: string;
  intro?: string;
  breadcrumbs: readonly BreadcrumbItem[];
  /** Optional actions, for example a WhatsApp button. */
  children?: ReactNode;
};

/** Dark inner-page hero: breadcrumb, H1, one line of intro and a faint ring. */
export function PageHero({
  title,
  intro,
  breadcrumbs,
  children,
}: PageHeroProps) {
  return (
    <section className="on-dark relative overflow-hidden bg-black py-14 md:py-20">
      <DottedRing
        size={560}
        opacity={0.06}
        className="pointer-events-none absolute -right-44 top-1/2 -translate-y-1/2 md:-right-24"
      />
      <Container className="relative">
        <Breadcrumbs items={breadcrumbs} tone="dark" />
        <h1 className="type-product-title mt-4 max-w-3xl text-white">{title}</h1>
        {intro ? (
          <p className="type-body-lg mt-4 max-w-2xl text-text-muted-on-dark">
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </Container>
    </section>
  );
}
