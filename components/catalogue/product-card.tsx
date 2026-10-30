import Link from "next/link";

import { CloudImage } from "@/components/CloudImage";
import { Button } from "@/components/button";
import { groupLabel } from "@/lib/areas";
import type { Product } from "@/lib/schemas/product";
import { messages, waLink } from "@/lib/whatsapp";

export type ProductCardVariant = "standard" | "family" | "compact";

type ProductCardProps = {
  product: Product;
  /** Absolute product page URL, used in the WhatsApp message. */
  productUrl: string;
  variant?: ProductCardVariant;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

function specValue(product: Product, label: string): string {
  return product.specs.find((spec) => spec.label === label)?.value ?? "";
}

function cutAtWord(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;

  const slice = value.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;

  return `${cut.trimEnd()}…`;
}

/**
 * One key line for a card (design.md 6.3). Solar lights lead with the
 * design, wattage and backup; everything else shows the start of the details.
 */
export function productKeyLine(product: Product): string {
  if (product.area === "solar-lighting") {
    const type = specValue(product, "Type");
    const backup = specValue(product, "Backup");
    const wattage = product.wattage ? `${product.wattage}W` : "";
    return [type, wattage, backup ? `${backup} backup` : ""]
      .filter(Boolean)
      .join(" · ");
  }

  const details =
    specValue(product, "Details") || product.specs[0]?.value || product.summary;

  return cutAtWord(details, 80);
}

function EnquiryButton({
  product,
  productUrl,
  dark = false,
  className = "",
}: {
  product: Product;
  productUrl: string;
  dark?: boolean;
  className?: string;
}) {
  return (
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
      variant={dark ? "secondary-dark" : "secondary-light"}
      size={dark ? "compact" : "default"}
      className={`w-full ${className}`}
    >
      Enquire
    </Button>
  );
}

/** Standard or family card for light catalogue pages. */
function LightCard({
  product,
  productUrl,
  family,
  priority,
  sizes,
  className = "",
}: ProductCardProps & { family: boolean }) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-md border border-stone-300 bg-white shadow-1 transition-[translate,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-2 ${className}`}
    >
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-0 z-10 rounded-md"
      />

      <div className="pointer-events-none">
        <div className="aspect-[4/3] bg-stone-100 p-3">
          <CloudImage
            publicId={product.image.publicId}
            alt={product.image.alt}
            sizes={sizes}
            priority={priority}
            width={800}
            height={600}
            className="transition-transform duration-150 group-hover:scale-[1.03]"
          />
        </div>

        <div className="px-4 pt-4">
          <p className="type-label text-red-deep">
            {groupLabel(product.area, product.group)}
          </p>
          <h3 className="type-h3 mt-2 line-clamp-2">{product.name}</h3>
          <p className="type-small mt-2 line-clamp-2 text-text-muted">
            {productKeyLine(product)}
          </p>
        </div>
      </div>

      <div className="relative z-20 mt-auto px-4 pb-4 pt-4">
        {family ? (
          <Button
            href={`/products/${product.slug}`}
            variant="secondary-light"
            className="w-full"
          >
            See sizes
          </Button>
        ) : (
          <EnquiryButton product={product} productUrl={productUrl} />
        )}
      </div>
    </article>
  );
}

/** Compact dark card used on the Industrial Supply page. */
function CompactCard({
  product,
  productUrl,
  priority,
  sizes,
  className = "",
}: ProductCardProps) {
  return (
    <article
      className={`on-dark group relative flex flex-col overflow-hidden rounded-md border border-white/12 bg-ink-3 p-3 transition-[translate,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-3 ${className}`}
    >
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="absolute inset-0 z-10 rounded-md"
      />

      <div className="pointer-events-none">
        <div className="aspect-square bg-stone-100 p-2">
          <CloudImage
            publicId={product.image.publicId}
            alt={product.image.alt}
            sizes={sizes}
            priority={priority}
            width={600}
            height={600}
            className="transition-transform duration-150 group-hover:scale-[1.03]"
          />
        </div>

        <div className="mt-3">
          <h3 className="type-h3 line-clamp-2 text-white">{product.name}</h3>
          <p className="type-small mt-1 text-text-muted-on-dark">
            {groupLabel(product.area, product.group)}
          </p>
        </div>
      </div>

      <div className="relative z-20 mt-auto pt-3">
        <EnquiryButton
          product={product}
          productUrl={productUrl}
          dark
          className="w-full"
        />
      </div>
    </article>
  );
}

/**
 * Catalogue card (design.md 6.3). The whole card links to the product page;
 * the Enquire button is a separate WhatsApp control. Never shows commercial terms.
 */
export function ProductCard({
  variant,
  product,
  ...props
}: ProductCardProps) {
  const resolved =
    variant ?? (product.familyLikely ? "family" : "standard");

  if (resolved === "compact") {
    return <CompactCard product={product} {...props} />;
  }

  return (
    <LightCard
      product={product}
      family={resolved === "family"}
      {...props}
    />
  );
}
