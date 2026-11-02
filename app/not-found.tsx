import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { DottedRing } from "@/components/dotted-ring";
import { PRODUCT_AREAS } from "@/data/nav";
import { messages, waLink } from "@/lib/whatsapp";

export default function NotFound() {
  return (
    <section className="on-dark relative flex min-h-[70vh] items-center overflow-hidden bg-black py-20">
      <DottedRing
        size={720}
        opacity={0.1}
        className="pointer-events-none absolute -right-52 top-1/2 -translate-y-1/2 md:-right-24"
      />

      <Container className="relative">
        <p className="type-label text-red-soft">404</p>
        <h1 className="type-display mt-3 text-white">Page not found</h1>
        <p className="type-body-lg mt-4 max-w-xl text-text-muted-on-dark">
          The page you are looking for does not exist or has moved. Try one of
          these instead.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/" icon={<Home aria-hidden="true" size={18} />}>
            Back to home
          </Button>
          <Button
            href={waLink(messages.general)}
            target="_blank"
            rel="noreferrer"
            variant="secondary-dark"
            icon={<FaWhatsapp />}
          >
            Chat on WhatsApp
          </Button>
        </div>

        <nav aria-labelledby="not-found-products" className="mt-12">
          <h2
            id="not-found-products"
            className="type-label text-text-muted-on-dark"
          >
            Browse products
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PRODUCT_AREAS.map((area) => (
              <li key={area.href}>
                <Link
                  href={area.href}
                  className="type-body flex items-center justify-between gap-4 rounded-md border border-white/12 bg-white/[0.04] px-5 py-4 text-white transition-colors hover:border-white/35 hover:bg-white/[0.08]"
                >
                  {area.label}
                  <ArrowRight
                    aria-hidden="true"
                    size={18}
                    className="shrink-0 text-red-soft"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
