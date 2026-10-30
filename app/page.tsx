import type { Metadata } from "next";

import { siteUrl } from "@/lib/mode";

export const metadata: Metadata = {
  alternates: { canonical: `${siteUrl()}/` },
};

export default function HomePage() {
  return (
    <section className="section-y on-dark bg-black">
      <div className="container-site">
        <p className="type-label text-red-soft">Port Harcourt, Nigeria</p>
        <h1 className="type-display mt-4 max-w-3xl text-white">
          Solar and electrical supplies you can rely on.
        </h1>
        <p className="type-body-lg mt-6 max-w-2xl text-text-muted-on-dark">
          Solar street lights, CCTV, electrical materials and industrial
          supply, with nationwide delivery.
        </p>
      </div>
    </section>
  );
}
