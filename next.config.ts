import type { NextConfig } from "next";

const isLive = process.env.SITE_MODE === "live";

const nextConfig: NextConfig = {
  async headers() {
    if (isLive) return [];

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
