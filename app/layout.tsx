import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { ReviewBadge } from "@/components/review-badge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isReview, siteUrl } from "@/lib/mode";

import "./globals.css";

const cormorant = localFont({
  src: "./fonts/cormorant-garamond-latin-600-normal.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

const manrope = localFont({
  src: [
    {
      path: "./fonts/manrope-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/manrope-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/manrope-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
});

const DEFAULT_TITLE =
  "KGICL Goodnews Solar | Solar and electrical supplies, Port Harcourt";
const DEFAULT_DESCRIPTION =
  "Solar street lights, CCTV, electrical materials and industrial supply, with nationwide delivery.";

export function generateMetadata(): Metadata {
  const review = isReview();

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: DEFAULT_TITLE,
      template: "%s | KGICL Goodnews Solar",
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: "KGICL Goodnews Solar",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      type: "website",
      locale: "en_NG",
      siteName: "KGICL Goodnews Solar",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      url: siteUrl(),
    },
    robots: review
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <SiteHeader />

        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>

        <SiteFooter />
        <FloatingWhatsApp />
        <ReviewBadge />
      </body>
    </html>
  );
}
