# Performance

Targets from PRD 9.1, measured on mobile with Lighthouse's simulated Fast 4G
and 4x CPU slowdown:

| Metric | Target |
|---|---|
| Largest Contentful Paint (LCP) | 2.5 s or less |
| Cumulative Layout Shift (CLS) | 0.1 or less |
| Interaction to Next Paint (INP) | 200 ms or less |
| Lighthouse mobile performance | 90 or more |
| First-load JavaScript | about 150 kB gzipped or less per page |

## How these numbers were taken

- Production build (`npm run build`) served with `npm run start`, not the dev
  server.
- `SITE_MODE=review`, `SITE_URL=https://kriss-goodnews-solar.vercel.app`.
- Lighthouse mobile preset, default simulated Fast 4G and 4x CPU slowdown,
  Chrome 156 on Windows.
- Five sequential runs per page. The Windows host is shared and occasionally
  stalls during a run (one Solar run reported a 3.76 s FCP and scored 77); the
  table records the **median** of the five runs so a single stall does not
  decide the result. The run scores are shown in brackets.

## Results

| Page | Performance | FCP | LCP | CLS | TBT | First-load JS |
|---|---|---|---|---|---|---|
| Home `/` | **97** (95, 99, 98, 97, 97) | 1.33 s | 1.33 s | 0.035 | 180 ms | 114 kB |
| Solar Lighting `/solar-lighting` | **98** (77, 98, 98, 98, 94) | 1.27 s | 1.27 s | 0.0002 | 163 ms | 118 kB |
| Product `/products/indoor-dome-cctv-camera` | **93** (95, 84, 93, 79, 95) | 1.10 s | 2.94 s | 0.0006 | 167 ms | 114 kB |
| Industrial Supply `/industrial-supply` | **98** (98, 95, 98, 97, 98) | 1.26 s | 1.26 s | 0 | 171 ms | 112 kB |
| Contact `/contact` | **95** (91, 95, 95, 99, 95) | 1.14 s | 1.14 s | 0 | 272 ms | 114 kB |

Every page is above the 90 performance target, every CLS is well under 0.1,
and every first-load bundle is under the 150 kB budget (shared bundle: 103 kB).
LCP is a text block on four of the five pages; only the product page's hero
photo is large enough to be the LCP element.

### The product page LCP miss

The product hero image is the only measured LCP miss: median **2.94 s** against
a 2.5 s target, with runs between 2.57 s and 3.26 s. Discovery is not the
problem:

- the image is in the initial HTML with `fetchpriority=high`;
- Lighthouse confirms `fetchpriority=high applied`, `Request is discoverable in
  initial document`, and `LCP resources shouldn't use loading=lazy`;
- `https://res.cloudinary.com` is preconnected in the root layout;
- the phone requests the 750 px Cloudinary variant (38 kB transfer for the
  tested camera), so the image is not oversized;
- Lighthouse's LCP breakdown attributes the time to resource load and element
  render, not to a late request.

The page still scores 93 and the rest of the page is fast. Further reducing the
image would mean shipping a visibly softer product photo, so this narrow,
explained miss is accepted for the review build. It was rechecked in 4.8 on the
real review deployment (see below): the font preloads appear on the Linux build
and the product LCP fell to 1.8 s.

### Contact TBT

Contact is the highest TBT median at **272 ms** (runs 122, 264, 272, 274, 377
ms) and still scores 95. TBT is a lab proxy for INP, not INP itself: it includes
all long tasks during load, including framework hydration and the contact form.
The page has no heavy page-specific dependency; long tasks come from the shared
Next.js/React bundles and vary with host scheduling. INP is a field metric and
must be checked on real devices after launch; the review deployment is the first
place that can be measured properly. No page-specific code change is justified
by this lab variance.

### Home CLS

Home reports CLS 0.035 from the entrance reveal and font swap. It is comfortably
inside the 0.1 target and did not change between runs.

## What was changed

- **Header logo:** `loading="eager"` instead of `priority`, so it is available
  immediately without competing with the page's real LCP element.
- **Dotted ring:** no longer an `<img>`. One SVG sprite is mounted in the root
  layout and every ring uses `<use>`, so the 29 kB motif is not an LCP
  candidate and is not repeated in the HTML for each tile. (An earlier CSS
  background/mask experiment made the ring the LCP element again and was
  discarded.)
- **Cloudinary images:** `sizes` is set on every `CloudImage` call.
  `CloudImage` passes `fetchPriority="high"` only for priority images; Next.js
  lazy-loads the rest.
- **Priority policy:** the product hero is the only prioritised image on a
  product page; the first card is prioritised on Solar, CCTV, Electrical and
  Industrial. Home and Contact have no above-the-fold content image, so none is
  prioritised there.
- **Cloudinary preconnect:** added in `app/layout.tsx` before the first image
  request.
- **Solar Lighting filter:** the product grid stays a server component and is
  passed into the client `WattageFilter` as children. Only the chips, count and
  visibility toggle run in the browser, so opening the area page does not ship
  all 17 product cards as client JavaScript. Filtering still preserves
  `?watt=120` and works without JavaScript (the full grid is rendered).
- **Reveal animations:** content is visible without JavaScript and under
  `prefers-reduced-motion`; the reveal uses transform/opacity only.

## Font preloads on Windows

`next/font/local` is configured with `preload: true` for Cormorant Garamond and
Manrope. On this Windows machine the generated
`.next/server/next-font-manifest.json` is empty, so no `<link rel="preload"
as="font">` appears in the local HTML. Next's font manifest plugin matches the
loader path with forward slashes; Windows paths use backslashes, so the match
fails. This is a Next.js build-environment issue, not a site configuration
issue. Vercel builds on Linux and is expected to emit the preload links.

Even locally, the two font families load from the render-blocking stylesheet
with VeryHigh priority. The only layout shift Lighthouse records on Home is the
web font swap (CLS 0.035, well inside the 0.1 target); the review deployment in
4.8 is the place to confirm the preload links on Linux and recheck that shift.

## Review deployment check (4.8)

The final review build was deployed from `main` to
<https://kriss-goodnews-solar.vercel.app> and measured on the same Windows host.

- **Font preloads:** the Linux build emits **4** `<link rel="preload" as="font">`
  links on both the home page and the product page. The empty local manifest is
  confirmed to be a Windows-only build issue.
- **Product page:** **97**, LCP **1.8 s**, FCP 1.8 s, TBT 90 ms, CLS 0. The
  2.94 s LCP miss recorded above does not occur on the review deployment.
- **Home page:** LCP **2.2 s** median across five runs (1.6 s to 2.8 s), inside
  the 2.5 s target. Nature of the score: performance varied from 65 to 97
  (median 82) with TBT between 160 ms and 1,140 ms. The same build served locally
  scored 92 and 95 while those runs were taken, and the home page code did not
  change after 4.3, so the spread is host and network scheduling on the shared
  Windows machine, not a deployment regression.
- **Headers:** the deployment sends the exact production CSP (no `unsafe-eval`
  or `ws:`), HSTS, `nosniff`, `frame-ancestors 'none'`, the review
  `X-Robots-Tag: noindex, nofollow`, and immutable one-year caching for
  `/_next/static/*` and `/assets/*`.

## Reproducing

```powershell
npm.cmd run build
npm.cmd run start
npx --yes lighthouse http://localhost:3000/solar-lighting `
  --only-categories=performance --form-factor=mobile
```

Run each URL five times and compare the medians, not a single run. On this
Windows host the `npx` Lighthouse cache was broken; a temporary global install
was used instead, without adding Lighthouse to `package.json`.
