import type { MetadataRoute } from "next";

import { isLive, siteUrl } from "@/lib/mode";

export default function robots(): MetadataRoute.Robots {
  if (!isLive()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
