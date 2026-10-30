import type { Metadata } from "next";

import { AreaPage } from "@/components/catalogue/area-page";
import { AREA_BY_SLUG } from "@/lib/areas";

const area = AREA_BY_SLUG["cctv-security"];

export const metadata: Metadata = {
  title: area.title,
  description: area.intro,
  alternates: { canonical: `/${area.slug}` },
};

export default function CctvSecurityPage() {
  return <AreaPage area={area} />;
}
