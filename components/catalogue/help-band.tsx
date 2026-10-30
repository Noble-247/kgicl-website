import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { messages, waLink } from "@/lib/whatsapp";

type HelpBandProps = {
  /** Heading shown on the band. */
  title?: string;
  /** One or two sentences of guidance. */
  text: string;
  /** WhatsApp message; defaults to the approved general enquiry. */
  message?: string;
};

/** Light "not sure which one fits?" band with a WhatsApp button. */
export function HelpBand({
  title = "Not sure which one fits?",
  text,
  message = messages.general,
}: HelpBandProps) {
  return (
    <section className="border-t border-stone-300 bg-white py-12">
      <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="type-h3">{title}</h2>
          <p className="type-body mt-2 max-w-2xl text-text-muted">{text}</p>
        </div>
        <Button
          href={waLink(message)}
          target="_blank"
          rel="noreferrer"
          icon={<FaWhatsapp />}
          className="shrink-0"
        >
          Ask on WhatsApp
        </Button>
      </Container>
    </section>
  );
}
