import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { Container } from "@/components/container";

type CtaBandProps = {
  title: string;
  /** One short supporting line. */
  text?: string;
  /** WhatsApp link, usually from `waLink(messages.general)`. */
  href: string;
  label: string;
  className?: string;
};

/** Dark WhatsApp band at the foot of a page (design.md 6.4). */
export function CtaBand({
  title,
  text,
  href,
  label,
  className = "",
}: CtaBandProps) {
  return (
    <section className={`on-dark bg-black ${className}`}>
      <Container className="flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
        <div>
          <h2 className="type-h2 text-white">{title}</h2>
          {text ? (
            <p className="type-body mt-2 max-w-2xl text-text-muted-on-dark">
              {text}
            </p>
          ) : null}
        </div>

        <Button
          href={href}
          target="_blank"
          rel="noreferrer"
          icon={<FaWhatsapp />}
          className="shrink-0"
        >
          {label}
        </Button>
      </Container>
    </section>
  );
}
