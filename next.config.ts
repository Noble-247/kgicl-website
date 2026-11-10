import type { NextConfig } from "next";

const isLive = process.env.SITE_MODE === "live";
const isDev = process.env.NODE_ENV === "development";

/**
 * Static Next.js pages hydrate with inline scripts, so a nonce is not possible.
 * Scripts and styles allow `'unsafe-inline'`; everything else is same-origin
 * only, with Cloudinary allowed for product images (task 4.4).
 *
 * Development is relaxed just enough for webpack's source maps and hot reload:
 * `'unsafe-eval'` and the dev WebSocket. Production builds use the strict
 * policy from the task with no extra sources.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "img-src 'self' data: https://res.cloudinary.com",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const immutableCache = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  async redirects() {
    // The client-approved renames changed six product slugs. Keep the review
    // links working while sending visitors and search engines to the new URL.
    return [
      {
        source: "/products/pvc-surface-wiring-cable",
        destination: "/products/flat-twin-3core-surface-wiring-cables",
        permanent: true,
      },
      {
        source: "/products/flexible-cable",
        destination: "/products/flexible-cables-3core-4core-all-sizes",
        permanent: true,
      },
      {
        source: "/products/pure-copper-earth-rod-solid",
        destination: "/products/copper-thunder-arrestor",
        permanent: true,
      },
      {
        source: "/products/copper-bonded-earth-rod",
        destination: "/products/copper-mat-copper-earthing-tape",
        permanent: true,
      },
      {
        source: "/products/bare-copper-earth-wire",
        destination: "/products/4ft-and-6ft-copper-earthing-rods",
        permanent: true,
      },
      {
        source: "/products/insulated-copper-earth-cable",
        destination: "/products/insulated-copper-rods",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          // The review site stays out of search results (task 1.4).
          ...(isLive
            ? []
            : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
      {
        source: "/assets/:path*",
        headers: immutableCache,
      },
      {
        source: "/_next/static/:path*",
        headers: immutableCache,
      },
    ];
  },
};

export default nextConfig;
