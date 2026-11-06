import { HelpBand } from "@/components/catalogue/help-band";
import { ProductGrid } from "@/components/catalogue/product-grid";
import { WattageFilter } from "@/components/catalogue/wattage-filter";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { getByArea } from "@/lib/catalogue";
import type { Area, AreaSlug } from "@/lib/areas";
import { siteUrl } from "@/lib/mode";

const HELP_TEXT: Record<AreaSlug, string> = {
  "solar-lighting":
    "Not sure which light fits? Tell us the location and we will advise.",
  "cctv-security":
    "Not sure which camera fits? Tell us the site and what you need to see, and we will advise.",
  "electrical-supplies":
    "Not sure what you need? Send us your list and we will advise.",
  "industrial-supply":
    "Supplied on request. Tell us what you need and we will quote.",
};

type AreaPageProps = {
  area: Area;
};

/**
 * Shared catalogue page for an area: dark hero, ordered group sections,
 * the solar wattage filter, and the help band (design.md 7.2).
 */
export function AreaPage({ area }: AreaPageProps) {
  const products = getByArea(area.slug).filter((product) => product.published);
  const groups = area.groups
    .map((group) => ({
      ...group,
      products: products.filter((product) => product.group === group.key),
    }))
    .filter((group) => group.products.length > 0);

  const firstSlug = groups[0]?.products[0]?.slug;
  const baseUrl = siteUrl();

  return (
    <>
      <PageHero
        title={area.title}
        intro={area.intro}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: area.title },
        ]}
      />

      <section className="section-y bg-paper">
        <Container className="space-y-14 md:space-y-20">
          {groups.map((group) => (
            <section
              key={group.key}
              aria-labelledby={`group-${group.key}`}
              className="scroll-mt-24"
            >
              <SectionHeading
                id={`group-${group.key}`}
                title={group.label}
                intro={`${group.products.length} ${
                  group.products.length === 1 ? "product" : "products"
                }`}
              />

              {area.slug === "solar-lighting" ? (
                /*
                 * The grid is server-rendered and passed into the client
                 * filter as children, so the cards never hydrate as part of
                 * the filter. `WattageFilter` only hides cards that do not
                 * match the URL, keeping `?watt=120` shareable.
                 */
                <WattageFilter
                  options={Array.from(
                    new Set(
                      group.products
                        .map((product) => product.wattage)
                        .filter(
                          (wattage): wattage is number =>
                            typeof wattage === "number",
                        ),
                    ),
                  )
                    .sort((left, right) => left - right)
                    .map((wattage) => ({
                      wattage,
                      count: group.products.filter(
                        (product) => product.wattage === wattage,
                      ).length,
                    }))}
                  total={group.products.length}
                  className="mt-6"
                >
                  <ProductGrid
                    products={group.products}
                    baseUrl={baseUrl}
                    prioritySlug={firstSlug}
                    className="mt-6"
                  />
                </WattageFilter>
              ) : (
                <ProductGrid
                  products={group.products}
                  baseUrl={baseUrl}
                  prioritySlug={firstSlug}
                  className="mt-6"
                />
              )}
            </section>
          ))}
        </Container>
      </section>

      <HelpBand text={HELP_TEXT[area.slug]} />
    </>
  );
}
