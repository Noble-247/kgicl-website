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
