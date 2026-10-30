import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { SITE } from "@/data/site";
import { openingHoursLine } from "@/lib/hours";
import type { Product } from "@/lib/schemas/product";
import { messages, telLink, waLink } from "@/lib/whatsapp";

type EnquiryPanelProps = {
  product: Product;
  /** Absolute product page URL, used in the WhatsApp message. */
  productUrl: string;
  className?: string;
};

/** Sticky enquiry card on the product page (design.md 6.3). */
export function EnquiryPanel({
  product,
  productUrl,
  className = "",
}: EnquiryPanelProps) {
  const phone = SITE.phones[0];

  return (
    <div
      className={`rounded-md border border-stone-300 bg-white p-6 shadow-1 ${className}`}
    >
      <h2 className="type-h3">Interested in {product.name}?</h2>

      <div className="mt-5 flex flex-col gap-3">
        <Button
          href={waLink(
            messages.product({
              name: product.name,
              modelCode: product.modelCode,
              url: productUrl,
            }),
          )}
          target="_blank"
          rel="noreferrer"
          icon={<FaWhatsapp />}
          className="w-full"
        >
          Enquire on WhatsApp
        </Button>

        <Button
          href={telLink(phone.e164)}
          variant="secondary-light"
          icon={<Phone aria-hidden="true" size={18} />}
          aria-label={`Call us on ${phone.display}`}
          className="w-full"
        >
          Call us
        </Button>

        <Button
          href={`/contact?product=${product.slug}`}
          variant="link"
          className="mt-1"
        >
          Or send a message
        </Button>
      </div>

      <p className="type-small mt-5 border-t border-stone-300 pt-4 text-text-muted">
        Reply within working hours. {openingHoursLine()}
      </p>
    </div>
  );
}
