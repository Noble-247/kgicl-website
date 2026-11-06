# KGICL Goodnews Solar Website

Official website for Kris Goodnews Int'l Co. Ltd (KGICL), a Port Harcourt company
supplying solar lighting, CCTV and security equipment, electrical materials and
industrial supplies.

The catalogue is data-driven. Prices and stock are never shown; visitors enquire
by WhatsApp, phone or the contact form.

## Tech stack

- Next.js 15 (App Router) and React 19
- TypeScript, strict mode
- Tailwind CSS v4 with the tokens in `docs/design.md`
- Cloudinary for every photograph, through a custom `next/image` loader
- Resend for contact-form email
- Vercel for hosting
- Vitest for the pure-function tests

## Site modes

One server-side variable, `SITE_MODE`, controls the whole site. It is never
exposed to the browser.

| Behaviour | `review` | `live` |
|---|---|---|
| Used on | `kriss-goodnews-solar.vercel.app` | `kgiclsolar.com` |
| Search engines | `noindex, nofollow` meta tag and `X-Robots-Tag` header; `robots.txt` disallows all | Indexable; `robots.txt` allows all and links the sitemap |
| `SITE_URL` | `https://kriss-goodnews-solar.vercel.app` | `https://kgiclsolar.com` |
| Product data | Published exactly as received | Launch gates in `config/launch-gates.ts` apply |
| Unverified spec lines | Shown | Hidden by default (`HIDE_UNVERIFIED_SPECS`) |
| Analytics | Off | Vercel Web Analytics, page views only |
| Contact form recipient | `CONTACT_TO_EMAIL` (Emmanuel during review), subject starts `[REVIEW]` | `info@kgiclsolar.com` |
| Review label | Small "Review version" tag | None |

A missing `SITE_MODE` is treated as `review`, which is the safe default. Live
mode with the wrong `SITE_URL`, or review mode on the live domain, is a blocking
audit error.

## Local development

Requires Node.js 22 or later and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with the values for the mode you are testing. Never commit
`.env.local` or a real `RESEND_API_KEY`. On Windows PowerShell this machine
blocks the `npm` shim, so use `npm.cmd` for the same commands.

Open <http://localhost:3000>.

To check a production build locally:

```bash
npm run build
npm run start
```

`npm run build` runs the audit first (`prebuild`).

## Deployments

There are two Vercel projects:

| Project | Purpose | Branch | Mode | Address |
|---|---|---|---|---|
| `kriss-goodnews-solar` | Temporary client review | `main` deploys; `dev` creates previews | `review` | <https://kriss-goodnews-solar.vercel.app> |
| `kgicl-solar` | Existing production project; keeps the domain, certificates and DNS | switched from the coming-soon repository at go-live | `live` | <https://kgiclsolar.com> |

- Work on `dev`. A push to `dev` creates a preview deployment.
- Merge `dev` into `main` and push to update the review URL.
- The review project is deleted after the production project has been switched
  to this repository and checked.
- Never attach `kgiclsolar.com` to the review project.
- Do not use "Redeploy" on the old coming-soon deployment during the switch; it
  would rebuild the old commit.

Both projects use the Next.js framework preset, `npm install`, `npm run build`,
Node.js 22.x, and no Output Directory override.

### Environment variables

Set these in each Vercel project before deploying. The same names are listed in
`.env.example`.

| Variable | Review project | Live project |
|---|---|---|
| `SITE_MODE` | `review` | `live` |
| `SITE_URL` | `https://kriss-goodnews-solar.vercel.app` | `https://kgiclsolar.com` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Same cloud name |
| `RESEND_API_KEY` | Resend key (review can use a restricted key) | Production Resend key, marked Sensitive |
| `CONTACT_FROM_EMAIL` | Verified Resend sender, e.g. `KGICL Website <website@notify.kgiclsolar.com>` | Same verified sender |
| `CONTACT_TO_EMAIL` | Emmanuel's inbox | `info@kgiclsolar.com` |
| `FACEBOOK_URL`, `INSTAGRAM_URL`, `LINKEDIN_URL` | Blank unless the real page exists | Same rule |
| `HIDE_UNVERIFIED_SPECS` | `false` (default) | `true` unless Emmanuel decides otherwise |

For preview deployments, use `SITE_MODE=review`, the review `SITE_URL`, and the
review recipient. A preview must never behave as a live site.

After changing an environment variable, redeploy so the build picks it up.

## Replacing photographs

Every photograph is stored as a **Cloudinary public ID**, never as a full URL.
`lib/cloudinary.ts` builds the delivery URL and the custom loader requests the
right width. Upload the new photo in Cloudinary's Media Library first, then copy
its **Public ID** (for example `products/100w-street-light`), not the delivery
URL. Do not paste `https://res.cloudinary.com/...`.

Rules for every photo:

- Use a real KGICL photo for a live site. Stock, unverified or missing photos
  are review warnings and live blocking errors.
- Use a clear, high-resolution image. Home tiles need 1280 px wide or more.
- Write useful alt text. Product alt text follows `{Name}, {model code}`.
- Keep the aspect ratio in `docs/design.md` section 8: product 4:3, project 3:2,
  tile 4:3 (cover), hero 16:9 (cover).
- Commit the data change. The image itself lives in Cloudinary, not in Git.

### Method 1: replace a product photo

1. Upload the photo to Cloudinary and copy its Public ID.
2. Open the product's data file:
   `data/products/solar.ts`, `cctv.ts`, `electrical.ts` or `industrial.ts`.
3. Find the product by its `slug` or `id`. Change the image block:

   ```ts
   image: {
     publicId: "products/new-street-light",
     alt: "100W Solar Street Light, 10-Eye, KG-SL-100W",
     status: "real",
   },
   ```

4. Use `status: "real"` only when the photo is confirmed to be the real
   product. `stock`, `unverified` and `missing` are allowed in review, but they
   block a live build.
5. Update `review.photoStatus` to a short note, for example
   `"Real photo supplied 2026-11"`. This field is a record, not site copy.
6. If the product is featured on the home page, it must not have
   `status: "missing"`.
7. Run:

   ```bash
   npm run audit
   npm run build
   ```

8. Check the product page, then commit and deploy.

### Method 2: add or remove a home area-tile photo

The four home tiles are dark gradients with the dotted ring by default. A photo
is optional and needs no component change.

1. Upload a real, high-resolution (1280 px or wider) photo to Cloudinary.
2. Open `data/images.ts` and set the tile key:

   ```ts
   export const SITE_IMAGES = {
     hero: null as string | null,
     tiles: {
       solar: "home/tiles/solar-street-light",
       cctv: null,
       electrical: null,
       industrial: null,
     } as Record<string, string | null>,
     about: null as string | null,
   } as const;
   ```

3. The tile switches to the photo automatically. Its alt text is the tile
   title. The dark gradient stays over the photo for legibility.
4. To return to the gradient and ring, set the value back to `null`.
5. Run `npm run audit` and `npm run build`, then check the home page.

The valid keys are `solar`, `cctv`, `electrical` and `industrial`.

### Other image slots

| What | Where | Notes |
|---|---|---|
| Optional home hero photo | `data/images.ts`, `hero` | Decorative, 16:9 or 4:5 on mobile, 1280 px wide. `null` removes it. |
| Project photos | `data/projects.ts`, each project's `image.publicId` and `image.alt` | 3:2, `object-cover`, 640 px wide. |
| Product photos | `data/products/*.ts`, each product's `image` block | Method 1 above. |

The `about` key in `data/images.ts` is reserved. No component renders it at
present, so do not treat it as an active photo slot.

## Routine content updates

Always work on `dev`, run the checks, then merge to `main` when the change is
approved.

### Swap a featured product on the home page

`data/featured.ts` is the only list of the six home-page products.

1. Choose another product that is already published, has a photo (not
   `status: "missing"`), and has verified claims if it will go live.
2. Replace one slug in `HOME_FEATURED` with the new slug. Keep exactly six
   entries and do not repeat a slug.
3. Run:

   ```bash
   npm run audit
   npm run build
   ```

   A missing, unpublished or repeated slug fails the build with a plain-language
   error.

4. Check the home page, then commit and deploy.

### Add a product

1. Open the data file for the product's area.
2. Copy an existing record and give it:
   - a new, unused `id` such as `P-064`;
   - a new kebab-case `slug`, unique across all four files;
   - the correct `area` and an existing `group` from `lib/areas.ts`;
   - a name, summary, specs, wattage/warranty where known;
   - `claimsVerified: false` until the claims are confirmed;
   - image fields (Method 1) and a `review` object;
   - `published: true`.
3. Run:

   ```bash
   npm run audit
   npm run build
   ```

   The audit reports photo, claim and naming warnings. Blocking findings must be
   fixed before a live build.

4. The new page is generated at `/products/<slug>` and appears in its area page,
   related products and the sitemap. Check it, then commit and deploy.

### Unpublish a product

1. In its data file, set `published: false`. Do not delete the record; it keeps
   the client's workbook history.
2. If the product is in `data/featured.ts`, replace it first. A featured
   unpublished product fails the build.
3. Run `npm run audit` and `npm run build`.
4. The product disappears from the area page, related products, search results
   and sitemap, and its direct URL returns 404. Commit and deploy.

### Other routine edits

| Change | File |
|---|---|
| Phone, WhatsApp, address, hours, emails | `data/site.ts` |
| Services | `data/services.ts` |
| Projects | `data/projects.ts` |
| Testimonials | `data/testimonials.ts` |
| Privacy notice | `data/privacy.ts` |
| Navigation labels | `data/nav.ts` |
| Home tiles and optional photos | `data/images.ts` |
| Featured products | `data/featured.ts` |

Never add a price, stock status, "In Stock", "New" or "Sale" badge. Never copy a
third-party phone number into the repo.

## Checks and scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Audit, then production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Vitest |
| `npm run audit` | Pre-launch audit in the current `SITE_MODE` |
| `npm run smoke -- <base-url>` | Check every public URL on a deployment |
| `npm run import-products` | Regenerate product data from the workbook (only when asked) |
| `npm run smoke -- <base-url> --mode=live` | Smoke test a live deployment |

The smoke test checks the home page, four area pages, five product pages,
Services, Projects, About, Contact, Privacy, the sitemap, `robots.txt` and an
unknown URL. It checks status codes, unique titles, the absence of "launching
soon", and the `X-Robots-Tag` header for the mode. It exits non-zero on failure.
Use it after every deployment.

## Before and after a deployment

Before pushing:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

After the deployment is live:

```bash
npm run smoke -- https://kriss-goodnews-solar.vercel.app
```

For the production site:

```bash
npm run smoke -- https://kgiclsolar.com --mode=live
```

## Audit and launch gates

`npm run audit` prints findings by rule. Each rule has a severity per mode in
`config/launch-gates.ts`:

- `error` — blocks the build in that mode.
- `warn` — reported, does not block.
- `off` — reported but not enforced.

Review mode is allowed to publish the workbook as received, so it warns about
stock photos and provisional names. Live mode blocks those. Do not edit the
`live` values without Emmanuel's decision; they are launch gates, not code
conveniences.

The audit is not a substitute for checking a page. Always look at the changed
page at 320, 390, 768, 1024 and 1440 px and with the keyboard.

## Go-live

The go-live switch is in Part B of
[`tasks/04-polish-and-launch.md`](tasks/04-polish-and-launch.md#part-b-go-live-runbook-live-mode)
(tasks 4.9 to 4.11). It covers the live audit, the dashboard switch, the
environment variables, the release tag, verification and the post-launch steps.
Emmanuel performs the Vercel and DNS dashboard steps; the code and checks are
prepared in the repository.

Do not start Part B until the client has approved the review site.
