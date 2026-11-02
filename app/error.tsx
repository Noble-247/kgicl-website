"use client";

import { RotateCcw } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { messages, waLink } from "@/lib/whatsapp";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <section className="section-y bg-paper">
      <Container className="max-w-2xl text-center">
        <p className="type-label text-red-deep">Something went wrong</p>
        <h1 className="type-h2 mt-3">We could not load this page</h1>
        <p className="type-body mt-4 text-text-muted">
          Please try again. If it keeps happening, message us on WhatsApp and we
          will help you find what you need.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            onClick={reset}
            icon={<RotateCcw aria-hidden="true" size={18} />}
          >
            Try again
          </Button>
          <Button
            href={waLink(messages.general)}
            target="_blank"
            rel="noreferrer"
            variant="secondary-light"
            icon={<FaWhatsapp />}
          >
            Chat on WhatsApp
          </Button>
        </div>
      </Container>
    </section>
  );
}
