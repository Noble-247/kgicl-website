import type { MetadataRoute } from "next";

import { getPublishedProducts } from "@/lib/catalogue";
import { siteUrl } from "@/lib/mode";

/**
 * Routes that exist today. Services, projects, about, contact, privacy and
 * the Industrial page are added with Task 03. `/design-check` is a build aid
 * and never appears here.
 */
const AREA_ROUTES = [
  "/solar-lighting",
  "/cctv-security",
  "/electrical-supplies",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...AREA_ROUTES.map((route) => ({
      url: `${base}${route}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getPublishedProducts().map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
