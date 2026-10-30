export const AREA_SLUGS = [
  "solar-lighting",
  "cctv-security",
  "electrical-supplies",
  "industrial-supply",
] as const;

export type AreaSlug = (typeof AREA_SLUGS)[number];

export type AreaGroup = {
  /** Stable kebab-case key stored on every product. */
  key: string;
  /** Published heading. */
  label: string;
};

export type Area = {
  slug: AreaSlug;
  title: string;
  /** One plain sentence, shown under the area page H1. */
  intro: string;
  /** Ordered groups. Empty groups render nothing. */
  groups: readonly AreaGroup[];
  /** Generated data file, used by build-time error messages. */
  dataFile: string;
};

/**
 * The four catalogue areas and their ordered groups (task 2.1).
 * A product's `group` must be one of the keys listed under its `area`.
 */
export const AREAS: readonly Area[] = [
  {
    slug: "solar-lighting",
    title: "Solar Lighting",
    intro:
      "Solar street lights for estates, streets, schools and highways, from 80 W to 300 W.",
    groups: [{ key: "street-lights", label: "Street Lights" }],
    dataFile: "data/products/solar.ts",
  },
  {
    slug: "cctv-security",
    title: "CCTV & Security",
    intro:
      "Cameras, camera-and-light units and recorders for homes, shops and estates.",
    groups: [
      { key: "cameras", label: "Cameras" },
      { key: "camera-lighting", label: "Camera + Lighting" },
      { key: "recorders-accessories", label: "Recorders & Accessories" },
    ],
    dataFile: "data/products/cctv.ts",
  },
  {
    slug: "electrical-supplies",
    title: "Electrical Supplies",
    intro:
      "Cables, switches, protection and power backup for homes, shops and installations.",
    groups: [
      { key: "cables-wiring", label: "Cables & Wiring" },
      {
        key: "switches-sockets-conduit",
        label: "Switches, Sockets & Conduit",
      },
      { key: "distribution-protection", label: "Distribution & Protection" },
      { key: "power-backup-protection", label: "Power Backup & Protection" },
      { key: "lighting-fans", label: "Lighting & Fans" },
    ],
    dataFile: "data/products/electrical.ts",
  },
  {
    slug: "industrial-supply",
    title: "Industrial Supply",
    intro:
      "Safety and earthing supplies for electrical work, available on request.",
    groups: [
      { key: "ppe-safety", label: "PPE & Safety" },
      {
        key: "earthing-lightning-protection",
        label: "Earthing & Lightning Protection",
      },
      { key: "pipes-marine", label: "Pipes & Marine" },
    ],
    dataFile: "data/products/industrial.ts",
  },
];

export const AREA_BY_SLUG: Record<AreaSlug, Area> = Object.fromEntries(
  AREAS.map((area) => [area.slug, area]),
) as Record<AreaSlug, Area>;

export function isAreaSlug(value: string): value is AreaSlug {
  return (AREA_SLUGS as readonly string[]).includes(value);
}

export function getArea(slug: string): Area | undefined {
  return isAreaSlug(slug) ? AREA_BY_SLUG[slug] : undefined;
}

export function getAreaGroup(
  area: AreaSlug,
  groupKey: string,
): AreaGroup | undefined {
  return AREA_BY_SLUG[area].groups.find((group) => group.key === groupKey);
}

export function groupLabel(area: AreaSlug, groupKey: string): string {
  return getAreaGroup(area, groupKey)?.label ?? groupKey;
}

export function dataFileForArea(area: AreaSlug): string {
  return AREA_BY_SLUG[area].dataFile;
}
