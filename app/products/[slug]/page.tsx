import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/button";
import { CloudImage } from "@/components/CloudImage";
import { Container } from "@/components/container";
import { EnquiryPanel } from "@/components/catalogue/enquiry-panel";
import { ProductGrid } from "@/components/catalogue/product-grid";
import { SpecTable } from "@/components/catalogue/spec-table";
import { SectionHeading } from "@/components/section-heading";
import { AREA_BY_SLUG } from "@/lib/areas";
import { getBySlug, getPublishedProducts, getRelated } from "@/lib/catalogue";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { hideUnverifiedSpecs, siteUrl } from "@/lib/mode";
import { buildDescription, buildTitle, productJsonLd } from "@/lib/seo";
import { messages, waLink } from "@/lib/whatsapp";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getBySlug(slug);

  if (!product || !product.published) {
    return { title: "Product not found" };
  }

  const url = `${siteUrl()}/products/${product.slug}`;
  const image = product.image.publicId
    ? cloudinaryUrl(product.image.publicId, { width: 1200 })
    : undefined;
  const title = buildTitle(product.name);
  const description = buildDescription(product.summary);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 900,
              alt: product.image.alt,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getBySlug(slug);

  if (!product || !product.published) notFound();

  const area = AREA_BY_SLUG[product.area];
  const baseUrl = siteUrl();
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const related = getRelated(product, 4);
  const hideSpecs = hideUnverifiedSpecs() && !product.claimsVerified;

  const image = product.image.publicId
    ? cloudinaryUrl(product.image.publicId, { width: 1200 })
    : undefined;

  const jsonLd = productJsonLd(product, { url: productUrl, imageUrl: image });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="bg-paper pb-14 pt-8">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: area.title, href: `/${area.slug}` },
              { label: product.name },
            ]}
          />

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-start lg:gap-x-12">
            <div className="lg:col-start-1 lg:row-start-1">
              <div className="rounded-md border border-stone-300 bg-stone-100 p-3">
                <CloudImage
                  publicId={product.image.publicId}
                  alt={product.image.alt}
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  width={1200}
                  height={900}
                />
              </div>
            </div>

            <div className="lg:col-start-2 lg:row-start-1">
              <p className="type-label text-red-deep">
                <Link
                  href={`/${area.slug}`}
                  prefetch={false}
                  className="transition-colors hover:text-red"
                >
                  {area.title}
                </Link>
                <span aria-hidden="true" className="px-2 text-stone-300">
                  /
                </span>
                {area.groups.find((group) => group.key === product.group)?.label ??
                  product.group}
              </p>

              <h1 className="type-product-title mt-3">{product.name}</h1>

              <div className="type-small mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-text-muted">
                {product.modelCode ? (
                  <p>
                    <span className="text-text-muted">Model:</span>{" "}
                    <span className="font-semibold text-text">
                      {product.modelCode}
                    </span>
                  </p>
                ) : null}
                {product.warranty ? (
                  <p>
                    <span className="text-text-muted">Warranty:</span>{" "}
                    <span className="font-semibold text-text">
                      {product.warranty}
                    </span>
                  </p>
                ) : null}
              </div>

              <p className="type-body-lg mt-5 text-text-muted">
                {product.summary}
              </p>
            </div>

            <div className="lg:col-start-1 lg:row-start-2">
              {hideSpecs ? (
                <div className="rounded-md border border-stone-300 bg-white p-6 shadow-1">
                  <h2 className="type-h2">Specifications</h2>
                  <p className="type-body mt-3 text-text-muted">
                    Full specifications on request. Ask us on WhatsApp.
                  </p>
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
                    className="mt-5"
                  >
                    Ask on WhatsApp
                  </Button>
                </div>
              ) : (
                <SpecTable specs={product.specs} />
              )}
            </div>

            <div className="lg:col-start-2 lg:row-start-2">
              <EnquiryPanel
                product={product}
                productUrl={productUrl}
                className="lg:sticky lg:top-24"
              />
            </div>
          </div>
        </Container>
      </div>

      {related.length > 0 ? (
        <section className="section-y border-t border-stone-300 bg-paper">
          <Container>
            <SectionHeading title="Related products" />
            <ProductGrid
              products={related}
              baseUrl={baseUrl}
              className="mt-8"
            />
          </Container>
        </section>
      ) : null}
    </>
  );
}
