# Task 02: Catalogue Core (Data, Images, Product Pages, Audit)

**Read first:** `00-shared-context.md`, `design.md` (6.3, 8), PRD sections 5.3, 6, 7, 11, and the workbook `docs/KGICL_Product_Catalogue_Consolidated.xlsx`.
**Effort:** 6 to 8 days · **Depends on:** Task 01 verified.
**Result:** 63 product pages and the three area pages (Solar Lighting, CCTV & Security, Electrical Supplies) on the review deployment, with a data-driven image system, the featured-products config, and the first version of the pre-launch audit.

Each sub-task has: **Agent Context**, **Prompt**, **Verify**.

---

## Task 2.1: Data model and schemas

### Agent Context
Types follow PRD 6.3, adjusted for the data we actually have (the workbook). Everything is validated with Zod at build time. A bad slug, a duplicate, or an unknown group stops the build with a plain message.

### Prompt
1. `lib/areas.ts`: the four areas with `slug`, `title`, `intro` (one sentence each) and their ordered groups:
   - `solar-lighting`: Street Lights
   - `cctv-security`: Cameras, Camera + Lighting, Recorders & Accessories
   - `electrical-supplies`: Cables & Wiring, Switches Sockets & Conduit, Distribution & Protection, Power Backup & Protection, Lighting & Fans
   - `industrial-supply`: PPE & Safety, Earthing & Lightning Protection, Pipes & Marine (no products yet; render nothing for an empty group)
2. `lib/schemas/product.ts` with Zod and an inferred `Product` type:
   ```ts
   id: string;                 // "P-001" (from the workbook, stable reference)
   slug: string;               // kebab-case, unique, permanent
   name: string;
   modelCode?: string;
   area: "solar-lighting" | "cctv-security" | "electrical-supplies" | "industrial-supply";
   group: string;              // must exist in lib/areas.ts for that area
   summary: string;
   specs: { label: string; value: string }[];
   wattage?: number;           // street lights only (for the filter)
   warranty?: string;          // "1 year" for solar lights only
   claimsVerified: boolean;    // false = hide specs when HIDE_UNVERIFIED_SPECS is true
   familyLikely: boolean;      // from "Size table likely"
   image: { publicId: string | null; alt: string; status: "real" | "stock" | "unverified" | "missing" };
   published: boolean;
   related?: string[];         // slugs
   review: { nameStatus: string; detailsStatus: string; claimsStatus: string; photoStatus: string; notes: string };
   ```
3. A `validateProducts()` function that throws plain errors: duplicate slug, unknown group for the area, slug not kebab-case, `published` product with empty name.
4. Vitest tests for the schema and `validateProducts()`.

### Verify
- [ ] Tests pass, including a deliberately bad record for each rule.
- [ ] Error messages name the product ID and the file to fix.

---

## Task 2.2: Import the workbook into data files

### Agent Context
The workbook is the source of truth for the first load. Sheet `Products`, header names exactly as in row 1: `ID`, `Pillar`, `Group`, `Proposed name (draft)`, `Name status`, `Slug (draft)`, `Slug status`, `Model code`, `Name as received`, `Details as received`, `Details status`, `Standard / material (as received)`, `Size table likely`, `Photo status`, `Cloudinary public ID`, `Photo URL (as received)`, `Featured (order)`, `Claims status`, `Source`, `Notes`.
**Published names are the "Proposed name (draft)" column.** Details, claims and photos are published as received in review mode. The concerns stay in each product's `review` object and in the spreadsheet; the website does not display them. Ignore the "Featured" column (`data/featured.ts` is the source of truth). Never store the full photo URL, only the public ID.

### Prompt
Write `scripts/import-products.ts` (`npm run import-products`), using the `xlsx` (SheetJS) dev dependency:
1. Read the `Products` sheet and map columns:
   - `Pillar` to `area` (`Solar Lighting` to `solar-lighting`, `CCTV & Security` to `cctv-security`, `Electrical Supplies` to `electrical-supplies`, `Industrial Supply` to `industrial-supply`).
   - `Group` to a kebab-case group key matching `lib/areas.ts`.
   - `Proposed name (draft)` to `name`, `Slug (draft)` to `slug`, `Model code` to `modelCode`, `ID` to `id`.
   - `Cloudinary public ID` to `image.publicId` (empty string becomes `null`). `Photo status`: `Real…` to `real`, `Missing` to `missing`, `Link present…` to `unverified`.
   - `Claims status`: `claimsVerified` is `true` only when the value is exactly `n/a`. Any other value (`Unverified`, `Verify with supplier`, or `Voltage rating verified by client… Standards unverified`) gives `false`.
   - `Size table likely` to `familyLikely` (`Likely` is true).
   - `Name status`, `Details status`, `Claims status`, `Photo status` and `Notes` into `review`.
2. **Specs:**
   - Solar lights: split `Details as received` on ` | ` and then on the first `: ` into `{label, value}` pairs. Set `wattage` from the name (`/^(\d+)W/`). Set `warranty: "1 year"`.
   - Everything else: `specs = [{ label: "Details", value: <Details as received> }]` plus `{ label: "Standard / material", value: <value> }` when that column is not empty.
3. **Summary:** solar: `"{wattage}W solar street light, {Type}. {Backup} backup."` using the parsed values. Others: the first part of the details up to about 110 characters, cut at the last comma or space, with no ellipsis and no invented facts. If details are empty, use the name.
4. `image.alt`: `"{name}"` plus `", {modelCode}"` when present.
5. `published: true` for all rows (the review build shows everything).
6. Generate `data/products/solar.ts`, `cctv.ts`, `electrical.ts`, `industrial.ts`, each exporting `export const products: Product[] = [...] ` (typed, formatted, sorted in workbook order) and starting with a comment: `Generated from docs/KGICL_Product_Catalogue_Consolidated.xlsx. Safe to edit by hand.`
7. **Do not overwrite hand edits:** if a target file already exists, print a diff summary and stop unless `--force` is passed.
8. Run `validateProducts()` on the result and print a summary: counts per area and group (expected total **63**), and counts by photo status and claims status.
9. Run the script and commit the generated files.

### Verify
- [ ] Total is 63: Solar 17, CCTV 7, Electrical 15, Industrial 24.
- [ ] `grep -r "http" data/products` finds no URLs (public IDs only).
- [ ] A spot check of five products against the spreadsheet matches name, model code, details and photo ID.
- [ ] Running the script again without `--force` changes nothing.

---

## Task 2.3: Cloudinary images, loader and placeholder

### Agent Context
Specs: PRD 6.7 and `design.md` 8. Public IDs may contain characters that need URL encoding (spaces, parentheses). The cloud name comes from `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.

### Prompt
1. `lib/cloudinary.ts`: `cloudinaryUrl(publicId, { width, quality = "auto", format = "auto" })` returning `https://res.cloudinary.com/<cloud>/image/upload/f_<format>,q_<quality>,w_<width>/<publicId>` with each path segment URL-encoded. Throw a clear error if the cloud name is missing in live mode and return a safe fallback in review.
2. A custom `next/image` loader (`lib/image-loader.ts`) that receives `src` = the public ID and `width`, and returns the Cloudinary URL. Register it with `images.loader: "custom"` and `loaderFile` in `next.config.ts`.
3. `components/CloudImage.tsx`: props `publicId`, `alt`, `sizes`, `priority`, `fit` (`contain` or `cover`), `className`, `width`, `height`. When `publicId` is `null`, render `ImagePlaceholder` (a `--color-stone-100` block with the monogram in `--color-stone-300`, same dimensions, no text). Always set `width` and `height`.
4. Tests for `cloudinaryUrl` (spaces, parentheses, width variants).

### Verify
- [ ] Five real public IDs from the workbook (including one with a space or special character) load as images on a test page.
- [ ] A `null` image renders the placeholder with no layout shift.
- [ ] No request goes to Vercel's `/_next/image` endpoint (images come straight from Cloudinary).

---

## Task 2.4: Catalogue access layer and featured config

### Agent Context
PRD section 7 is the specification for the featured list. One ordered list of slugs is the only source of truth; products carry no featured flag.

### Prompt
1. `lib/catalogue.ts`: `getAllProducts()`, `getPublishedProducts()`, `getByArea(area)`, `getByGroup(area, group)`, `getBySlug(slug)`, `getRelated(product, limit = 4)` (same group first, then same area), `getFeatured()`. All pure and cached per build.
2. `data/featured.ts`: the exported `HOME_FEATURED` array and `FEATURED_COUNT = 6`, exactly as in PRD 7.1, with the explanatory comment:
   `120w-solar-street-light-12-eye`, `150w-solar-street-light-6-bar`, `200w-solar-street-light-16-eye`, `wall-switch-and-socket`, `pvc-single-core-copper-wire`, `led-bulb`.
3. `lib/featured.ts`: validate the list with these plain-language errors: wrong count ("Featured list has 5 products; it must have 6. Edit data/featured.ts."), duplicate ("'led-bulb' is featured twice."), unknown slug ("Featured product 'xyz' was not found. Check the spelling against data/products."), unpublished, missing photo (`image.status === "missing"`). Validation runs during the build and in the audit.
4. Tests: valid list passes; each error case fails with the exact message.

### Verify
- [ ] `getFeatured()` returns the six products in the file's order.
- [ ] Changing one slug in `data/featured.ts` to another existing product and rebuilding updates the result with no other edit (try it, then revert).
- [ ] Each invalid case fails the build with its message.

---

## Task 2.5: Catalogue components

### Agent Context
Specs: `design.md` 6.3. Cards never show price or stock. In review mode every spec is shown. In live mode, when `hideUnverifiedSpecs()` is true and `claimsVerified` is false, hide the spec table and show the line "Full specifications on request. Ask us on WhatsApp." with a WhatsApp button.

### Prompt
Build in `components/catalogue/`:
1. `ProductCard` (variants `standard`, `family`, `compact`):
   - Standard: image area (4:3, `--color-stone-100`, `object-contain`, 12 px padding), group eyebrow, name (H3, two lines), one key line, "Enquire" button (opens WhatsApp with `messages.product`).
   - Family (when `familyLikely` is true): same, but the button reads "See sizes" and goes to the product page.
   - Compact (Industrial page, dark): 1:1 image, `--color-ink-3` card, name, group label, "Enquire".
   - Key line: solar `"{Type} · {wattage}W · {Backup} backup"`; others the first 80 characters of the details, cut at a word boundary with "…".
   - The whole card links to the product page; the button is a separate control.
2. `WattageFilter` (client): chips All, 80, 100, 120, 150, 180, 200, 300 W (generate from the data, not hard-coded), horizontally scrollable on mobile, selection stored in the URL (`?watt=120`), live count "Showing X of Y" with `aria-live="polite"`, empty state text from `design.md` 6.3.
3. `SpecTable` (two columns, zebra, label muted) and `EnquiryPanel` (heading "Interested in {name}?", primary WhatsApp button with `messages.product`, secondary Call, link "Or send a message" to `/contact?product={slug}`, opening-hours line from `data/site.ts`).
4. `ProductGrid` (1 column below 480 px, 2 from 480, 3 from 1024, 4 from 1280; compact grid 2/3/4).
5. Show every variant and state on `/design-check`.

### Verify
- [ ] Cards render for a solar, a family, and a compact example with long and short names.
- [ ] The WhatsApp message from a card contains the product name, model code and the page URL.
- [ ] Filter state survives a reload and a shared link. Screen reader announces the count.
- [ ] No price or stock text anywhere (`grep -ri "in stock\|₦\|price" components app` is empty, except the privacy and quote text later).

---

## Task 2.6: Area pages and product pages

### Agent Context
Wireframes: `design.md` 7.2 and 7.3. Routes: `/solar-lighting`, `/cctv-security`, `/electrical-supplies`, `/products/[slug]`. The Industrial page is built in Task 03. Title pattern: `{Product name} | KGICL Goodnews Solar, Port Harcourt`. Structured data is Product **without** price or availability.

### Prompt
1. Area pages: page hero (dark, breadcrumb, H1 from `lib/areas.ts`, intro), group sections with headings, product grids; the Solar page adds `WattageFilter`; a "Not sure which one fits?" help band with a WhatsApp button (`messages.general`).
2. `app/products/[slug]/page.tsx`: `generateStaticParams` from published products, `generateMetadata` (title, description from `summary`, Open Graph with the product image URL, canonical from `siteUrl()`), breadcrumbs (Home / Area / Product), two-column layout (image left; eyebrow, H1, model code, warranty note for solar lights, summary, sticky `EnquiryPanel` right), `SpecTable` (with the live-mode hiding rule above), `RelatedProducts` (3 to 4 cards), and JSON-LD `Product` (`name`, `image`, `sku` from `modelCode`, `description`, no `offers`).
3. `notFound()` for unknown slugs.
4. Link the four area routes from the header and footer (the Industrial link may point to a placeholder until Task 03).

### Verify
- [ ] All 63 product pages build and open. Spot-check 10, including one with no model code and one with a long name.
- [ ] Page source of a product shows valid JSON-LD without `offers`. Title and description are unique per product.
- [ ] Mobile layout puts image, name and model, summary, specs, then the enquiry panel, with the action bar still visible.
- [ ] `/solar-lighting?watt=120` shows only the 120 W light(s).

---

## Task 2.7: SEO plumbing

### Prompt
1. `app/sitemap.ts`: all published pages (home, areas, products, services, projects, about, contact, privacy) using `siteUrl()`, with `lastModified`.
2. `lib/seo.ts`: `buildTitle()`, `buildDescription()` (max 160 characters, no ellipsis in the middle of words) and JSON-LD helpers (`productJsonLd`; `localBusinessJsonLd` is added in Task 03).
3. Confirm the mode-aware robots rules from Task 1.4 apply to every page (meta tag and header in review).

### Verify
- [ ] `/sitemap.xml` lists the correct URLs for the current `SITE_URL`.
- [ ] No page has a duplicate title.

---

## Task 2.8: Pre-launch audit, version 1

### Agent Context
Rules and severities are in `config/launch-gates.ts` (see `00-shared-context.md` section 2). In **review** mode most rules warn; in **live** mode the "error" rules fail the build. The audit runs as `prebuild`.

### Prompt
Write `scripts/audit.ts` (`npm run audit`):
1. Determine the mode with `getSiteMode()` and the severity of each rule from `GATES`.
2. Implement these rules now: `featuredInvalid`, `photoNotReal` (published product whose `image.status` is not `real`), `provisionalSlug` (`review.nameStatus` starts with "Cut off"), `placeholderText` (scan names, summaries and specs for `EXAM`, `lorem`, `Customer Name`, `Placeholder`), `missingAlt` (product images without alt), `privateNumbers` (scan all files in `data/` for Nigerian phone patterns such as `0[789]\d{9}` and `+234…`, allowing only the numbers in `data/site.ts`), and `unverifiedClaims` (count of products with `claimsVerified: false`).
3. Print a grouped report: rule, severity, count, and the first ten product IDs or file locations. Exit with code 1 when any rule at severity `error` for the current mode has findings. Always print a one-line total.
4. Leave stubs for `testimonialPlaceholders`, `socialInvalid`, `missingEnv` and `modeMismatch`; Task 03 completes them.
5. Vitest tests for each implemented rule (with small fixtures) and for the exit-code logic in both modes.

### Verify
- [ ] In review mode (`SITE_MODE=review npm run audit`) it prints warnings (photo status, cut-off names, unverified claims) and exits 0.
- [ ] In live mode (`SITE_MODE=live npm run audit`) it exits 1, listing the 57 unverified photos and 11 provisional slugs.
- [ ] A fake phone number added to `data/` is caught in **both** modes.
- [ ] `npm run build` runs the audit first.

---

## Task 02 is done when

- [ ] Sub-tasks 2.1 to 2.8 are verified.
- [ ] 63 product pages and three area pages are live on `kriss-goodnews-solar.vercel.app`.
- [ ] The Definition of Done in `00-shared-context.md` section 7 is met.
