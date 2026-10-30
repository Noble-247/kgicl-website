import type { Metadata } from "next";

import { AreaPage } from "@/components/catalogue/area-page";
import { AREA_BY_SLUG } from "@/lib/areas";
import { buildDescription, buildTitle } from "@/lib/seo";

const area = AREA_BY_SLUG["solar-lighting"];

export const metadata: Metadata = {
  title: { absolute: buildTitle(area.title) },
  description: buildDescription(area.intro),
  alternates: { canonical: `/${area.slug}` },
};

export default function SolarLightingPage() {
  return <AreaPage area={area} />;
}
