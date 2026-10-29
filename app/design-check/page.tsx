import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design check",
  robots: { index: false, follow: false },
};

type Swatch = {
  token: string;
  hex: string;
  className: string;
  overlay: string;
  use: string;
};

const swatches: Swatch[] = [
  {
    token: "--color-red",
    hex: "#E30613",
    className: "bg-red",
    overlay: "text-white",
    use: "Primary buttons, key accents, large red text",
  },
  {
    token: "--color-red-deep",
    hex: "#B1040E",
    className: "bg-red-deep",
    overlay: "text-white",
    use: "Red text on light, hover and pressed",
  },
  {
    token: "--color-red-soft",
    hex: "#FF4D57",
    className: "bg-red-soft",
    overlay: "text-black",
    use: "Small red text on dark",
  },
  {
    token: "--color-black",
    hex: "#0A0A0B",
    className: "bg-black",
    overlay: "text-white",
    use: "Header, hero, footer, Industrial page",
  },
  {
    token: "--color-ink-2",
    hex: "#121214",
    className: "bg-ink-2",
    overlay: "text-white",
    use: "Raised surfaces on dark",
  },
  {
    token: "--color-ink-3",
    hex: "#1B1B1F",
    className: "bg-ink-3",
    overlay: "text-white",
    use: "Cards on dark, borders",
  },
  {
    token: "--color-paper",
    hex: "#F7F6F4",
    className: "bg-paper border border-stone-300",
    overlay: "text-text",
    use: "Main light page background",
  },
  {
    token: "--color-white",
    hex: "#FFFFFF",
    className: "bg-white border border-stone-300",
    overlay: "text-text",
    use: "Cards on light, text on dark",
  },
  {
    token: "--color-stone-100",
    hex: "#EFEDEA",
    className: "bg-stone-100 border border-stone-300",
    overlay: "text-text",
    use: "Image backgrounds, table stripes, chips",
  },
  {
    token: "--color-stone-300",
    hex: "#D8D5D0",
    className: "bg-stone-300",
    overlay: "text-text",
    use: "Borders on light",
  },
  {
    token: "--color-text",
    hex: "#111114",
    className: "bg-text",
    overlay: "text-white",
    use: "Body text on light",
  },
  {
    token: "--color-text-muted",
    hex: "#55555C",
    className: "bg-text-muted",
    overlay: "text-white",
    use: "Secondary text on light",
  },
  {
    token: "--color-text-on-dark",
    hex: "#FFFFFF",
    className: "bg-text-on-dark border border-stone-300",
    overlay: "text-text",
    use: "Text on dark",
  },
  {
    token: "--color-text-muted-on-dark",
    hex: "#B8B8BD",
    className: "bg-text-muted-on-dark",
    overlay: "text-black",
    use: "Secondary text on dark",
  },
  {
    token: "--color-amber",
    hex: "#FFB020",
    className: "bg-amber",
    overlay: "text-black",
    use: "Accent on dark only",
  },
  {
    token: "--color-success",
    hex: "#1F7A45",
    className: "bg-success",
    overlay: "text-white",
    use: "Success panel icon and border",
  },
  {
    token: "--color-danger",
    hex: "#B3261E",
    className: "bg-danger",
    overlay: "text-white",
    use: "Form error text on light",
  },
];

const typeRamp = [
  {
    className: "type-display",
    role: "Display (hero H1)",
    spec: "Cormorant 600 · clamp(2.5rem, 6.2vw, 4.75rem) · lh 1.05",
    sample: "Solar and electrical supplies",
  },
  {
    className: "type-h2",
    role: "H2 (section title)",
    spec: "Cormorant 600 · clamp(1.875rem, 3.4vw, 2.75rem) · lh 1.15",
    sample: "What we supply",
  },
  {
    className: "type-product-title",
    role: "Product name (H1)",
    spec: "Cormorant 600 · clamp(2rem, 4vw, 3rem) · lh 1.1",
    sample: "120W Solar Street Light, 12-Eye",
  },
  {
    className: "type-h3",
    role: "H3 / card title",
    spec: "Manrope 700 · 1.125rem → 1.25rem · lh 1.3",
    sample: "Solar lighting",
  },
  {
    className: "type-body-lg",
    role: "Body large",
    spec: "Manrope 400 · 1.125rem · lh 1.6",
    sample:
      "Solar lighting, electrical supplies and industrial supply. Nationwide delivery.",
  },
  {
    className: "type-body",
    role: "Body",
    spec: "Manrope 400 · 1rem · lh 1.6",
    sample:
      "Solar lighting, electrical supplies and industrial supply. Nationwide delivery.",
  },
  {
    className: "type-small",
    role: "Small",
    spec: "Manrope 400 · 0.875rem · lh 1.5",
    sample: "Reply within working hours. Mon to Fri 7am to 10pm.",
  },
  {
    className: "type-label",
    role: "Label / eyebrow",
    spec: "Manrope 600 · 0.75rem · uppercase · ls 0.18em",
    sample: "Port Harcourt, Nigeria",
  },
  {
    className: "type-button",
    role: "Button",
    spec: "Manrope 700 · 1rem",
    sample: "Chat on WhatsApp",
  },
  {
    className: "type-spec",
    role: "Spec value / model code",
    spec: "Manrope 600 · 0.9375rem · tabular numbers",
    sample: "KG-SL-120W · 0803 613 6883",
  },
];

export default function DesignCheckPage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <main id="main" tabIndex={-1} className="pb-24">
        <div className="container-site pt-16 pb-10">
          <p className="type-label text-red-deep">Design check</p>
          <h1 className="type-display mt-3">KGICL Goodnews Solar</h1>
          <p className="type-body-lg mt-4 max-w-[65ch] text-text-muted">
            Temporary token and type reference. Not linked anywhere. It is
            removed in Task 04. Buttons shown here are static references; the
            real primitives arrive in sub-task 1.6.
          </p>
        </div>

        <section className="container-site pb-16" aria-labelledby="colours">
          <h2 id="colours" className="type-h2">
            Colour tokens
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {swatches.map((swatch) => (
              <li
                key={swatch.token}
                className="overflow-hidden rounded-md border border-stone-300 bg-white shadow-1"
              >
                <div
                  className={`flex h-20 items-end p-3 ${swatch.className}`}
                >
                  <span
                    className={`type-spec ${swatch.overlay}`}
                    aria-hidden="true"
                  >
                    Aa
                  </span>
                </div>
                <div className="p-4">
                  <p className="type-spec break-all">{swatch.token}</p>
                  <p className="type-small mt-1 uppercase text-text-muted">
                    {swatch.hex}
                  </p>
                  <p className="type-small mt-2 text-text-muted">{swatch.use}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="border-y border-stone-300 bg-stone-100 py-16"
          aria-labelledby="contrast"
        >
          <div className="container-site">
            <h2 id="contrast" className="type-h2">
              Contrast pairs
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-md border border-stone-300 bg-paper p-6">
                <p className="type-body">
                  --text on --paper. All body text. 17.5:1.
                </p>
              </div>
              <div className="rounded-md border border-stone-300 bg-paper p-6">
                <p className="type-body text-text-muted">
                  --text-muted on --paper. Secondary text. 6.9:1.
                </p>
              </div>
              <div className="rounded-md bg-red p-6">
                <p className="type-button text-white">
                  White on --red. Button labels. 4.88:1.
                </p>
              </div>
              <div className="rounded-md bg-red-deep p-6">
                <p className="type-button text-white">
                  White on --red-deep. Hover state. 7.26:1.
                </p>
              </div>
              <div className="rounded-md border border-stone-300 bg-paper p-6">
                <p className="text-[1.5rem] font-bold leading-snug text-red">
                  --red on --paper. Large text only. 4.52:1.
                </p>
                <p className="type-small mt-2 text-red-deep">
                  Small red text uses --red-deep. 6.7:1.
                </p>
              </div>
              <div className="rounded-md bg-black p-6">
                <p className="text-[1.5rem] font-bold leading-snug text-red">
                  --red on --black. Graphics and large text. 4.05:1.
                </p>
                <p className="type-small mt-2 text-red-soft">
                  Small red text uses --red-soft. 6.1:1.
                </p>
              </div>
              <div className="rounded-md bg-black p-6">
                <p className="type-body text-text-muted-on-dark">
                  --text-muted-on-dark on --black. 10:1.
                </p>
              </div>
              <div className="rounded-md bg-black p-6">
                <p className="type-body text-amber">
                  --amber on --black. 10.8:1. Never on light.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container-site py-16" aria-labelledby="type">
          <h2 id="type" className="type-h2">
            Type ramp
          </h2>
          <ul className="mt-8 divide-y divide-stone-300 border-y border-stone-300">
            {typeRamp.map((item) => (
              <li key={item.role} className="py-6">
                <p className="type-small text-text-muted">{item.spec}</p>
                <p className={`${item.className} mt-2`}>{item.sample}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-black py-16" aria-labelledby="buttons">
          <div className="container-site on-dark">
            <h2 id="buttons" className="type-h2 text-white">
              Buttons and focus rings
            </h2>
            <p className="type-body mt-2 max-w-[65ch] text-text-muted-on-dark">
              Reference styles from design.md 6.2. The Button component replaces
              these in sub-task 1.6.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="type-button inline-flex h-[52px] items-center rounded-md bg-red px-6 text-white shadow-2">
                Primary
              </span>
              <span className="type-button inline-flex h-11 items-center rounded-md bg-red px-4 text-white">
                Primary compact
              </span>
              <span className="type-button inline-flex h-[52px] items-center rounded-md border border-white/35 px-6 text-white">
                Secondary on dark
              </span>
              <button
                type="button"
                disabled
                className="type-button inline-flex h-[52px] cursor-not-allowed items-center rounded-md bg-red px-6 text-white opacity-50"
              >
                Disabled
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-md bg-ink-2 p-6">
                <p className="type-small text-text-muted-on-dark">
                  Dark surface focus ring
                </p>
                <button
                  type="button"
                  className="type-button mt-3 inline-flex h-[52px] items-center rounded-md bg-red px-6 text-white"
                >
                  Focus me
                </button>
              </div>
              <div className="rounded-md bg-paper p-6">
                <p className="type-small text-text-muted">
                  Light surface focus ring
                </p>
                <button
                  type="button"
                  className="type-button mt-3 inline-flex h-[52px] items-center rounded-md border border-text px-6 text-text"
                >
                  Focus me
                </button>
                <p className="type-small mt-3 text-red-deep">
                  Text link on light
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-md bg-ink-2 p-6">
              <p className="type-small text-text-muted-on-dark">
                Reduced motion check: this square turns once per 120 s. With
                reduced motion enabled it stops.
              </p>
              <div className="mt-4 flex h-16 w-16 items-center justify-center rounded-md border border-white/12">
                <span
                  aria-hidden="true"
                  className="block h-8 w-8 animate-spin rounded-sm bg-red-soft"
                  style={{ animationDuration: "120s" }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
