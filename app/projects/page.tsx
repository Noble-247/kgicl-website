import type { Metadata } from "next";

import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { PROJECTS } from "@/data/projects";
import { siteUrl } from "@/lib/mode";
import { buildDescription, buildTitle } from "@/lib/seo";
import { messages, waLink } from "@/lib/whatsapp";

const PAGE_DESCRIPTION =
  "Completed transformer, solar lighting, electrical installation and industrial supply projects by KGICL Goodnews Solar.";

export const metadata: Metadata = {
  title: { absolute: buildTitle("Projects") },
  description: buildDescription(PAGE_DESCRIPTION),
  alternates: { canonical: `${siteUrl()}/projects` },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        title="Projects"
        intro="A selection of completed installations and supply projects."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />

      <section className="section-y bg-paper">
        <Container>
          <SectionHeading
            eyebrow="Our work"
            title="Recent projects"
            intro="Transformer installation, solar lighting, electrical work and industrial supply."
          />

          <Reveal className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBand
        title="Need something similar?"
        text="Talk to us on WhatsApp about your site and what it needs."
        href={waLink(messages.general)}
        label="Talk to us on WhatsApp"
      />
    </>
  );
}
