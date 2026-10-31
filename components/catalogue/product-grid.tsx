import { ProductCard } from "@/components/catalogue/product-card";
import type { Product } from "@/lib/schemas/product";

export type ProductGridVariant = "standard" | "compact";

type ProductGridProps = {
  products: readonly Product[];
  /** Canonical site base URL, used for the WhatsApp page link. */
  baseUrl: string;
  variant?: ProductGridVariant;
  /**
   * The first image on the page is eager; the rest are lazy. Pass `null` when
   * another image on the page (for example the product hero) is already eager.
   */
  prioritySlug?: string | null;
  className?: string;
};

const GRID_CLASSES: Record<ProductGridVariant, string> = {
  standard:
    "grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  compact: "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4",
};

const SIZES: Record<ProductGridVariant, string> = {
  standard:
    "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw",
  compact: "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
};

function productUrl(baseUrl: string, slug: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/products/${slug}`;
}

/** Product cards in the responsive grid from design.md 5. */
export function ProductGrid({
  products,
  baseUrl,
  variant = "standard",
  prioritySlug,
  className = "",
}: ProductGridProps) {
  return (
    <div className={`${GRID_CLASSES[variant]} ${className}`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          productUrl={productUrl(baseUrl, product.slug)}
          variant={variant === "compact" ? "compact" : undefined}
          priority={
            prioritySlug === null
              ? false
              : prioritySlug === undefined
                ? index === 0
                : product.slug === prioritySlug
          }
          sizes={SIZES[variant]}
        />
      ))}
    </div>
  );
}
