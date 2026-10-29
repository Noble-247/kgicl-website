# 00: Shared Context for All Tasks

**Read this first, then the task file you were given.** It holds the decisions that apply to every task, and where it differs from PRD Rev 1.1 it **wins** (the PRD gets a Rev 1.2 later).

**Source documents** (all in `docs/` of the repo): `PRD Rev 1.1`, `design.md`, `KGICL_Product_Catalogue_Consolidated.xlsx`, `resend-implementation-guide.md`, `domain-setup-guide.md`, `01-brainstorm.md`.

---

## 1. Stack and rules

| Item | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript (`strict: true`) |
| Styling | Tailwind CSS v4 with the tokens in `design.md` section 4.5. No UI library |
| Validation | Zod |
| Email | Resend, Node SDK, in a Server Action (guide: `resend-implementation-guide.md`) |
| Images | Cloudinary free account through a custom `next/image` loader |
| Hosting | Vercel. A temporary **review project** (`kriss-goodnews-solar`, kriss-goodnews-solar.vercel.app) first. (The address kgicl-solar.vercel.app already belongs to the coming-soon project, which is the production project.) At go-live the existing **production project** (the one that serves kgiclsolar.com) is switched from the coming-soon repository to this repository, and the review project is deleted (Task 04, Part B) |
| Tests | Vitest for pure functions in `lib/` (WhatsApp links, years, schemas, rate limit). No browser test framework |
| Package manager | npm |

**Always:**
- Build UI only from the tokens and components in `design.md`. If something is missing, add it to `design.md` first.
- Use **server components** unless state is needed (menu, filter, form, floating button, reveal wrapper).
- Set `width` and `height` on every image. Give every content image meaningful `alt` text.
- Keep pages static (`generateStaticParams`) except the contact Server Action.
- Plain-language error messages, in English, for every build-time check.
- Small commits, one per sub-task, message format `task-1.4: header and mobile menu`.

**Never:**
- Add price, stock status, "In Stock", cart or checkout anywhere.
- Publish third-party people's phone numbers (project reference contacts are never copied into the repo).
- Put secrets in the repo or use `NEXT_PUBLIC_` on a secret.
- Add tracking cookies or a cookie banner.
- Name custom spacing tokens `xs/sm/md/lg/xl/2xl`, or reuse the same name for a `next/font` variable and a `@theme` alias (see `design.md` 4.5).

---

## 2. Site modes (the key decision)

The first deployment is for the client to **review**. It shows everything exactly as received. The same code later goes **live** with the launch gates switched on. One environment variable controls this:

`SITE_MODE=review` or `SITE_MODE=live` (server-side only, no `NEXT_PUBLIC_` prefix; read in server components and pass values down as props).

| Behaviour | `review` (kriss-goodnews-solar.vercel.app) | `live` (kgiclsolar.com) |
|---|---|---|
| Search engines | `noindex, nofollow` meta tag **and** `X-Robots-Tag` header; `robots.txt` disallows all | Indexable. `robots.txt` allows all and links the sitemap |
| Base URL (`SITE_URL`) | `https://kriss-goodnews-solar.vercel.app` | `https://kgiclsolar.com` |
| Product names, details, claims, voltage ratings, photos | **Published exactly as in the spreadsheet** (including unverified items and stock or unclassified photos) | Per the launch gates below |
| Unverified spec lines | Shown | Hidden unless the gate is relaxed (setting `HIDE_UNVERIFIED_SPECS`) |
| Testimonial placeholders | Shown with a visible "Placeholder" tag | Never rendered. Build fails if any remain |
| Social icons | Only when the variable holds a real URL | Same. A set but invalid value fails the build |
| Analytics | Off | Vercel Web Analytics on |
| Contact form | Emails go to `CONTACT_TO_EMAIL` (Emmanuel's address). Subject is prefixed `[REVIEW]` | Emails go to `info@kgiclsolar.com` |
| Visible label | Small "Review version" tag, bottom-left, not covering controls | None |
| Pre-launch audit | Prints warnings. Exit code 0 unless an "always" rule fails | Rules marked "error" fail the build |

**The concerns stay in the spreadsheet.** The website does not show review notes. Each product's data keeps a `review` object (name status, details status, claims status, photo status, notes) copied from the workbook, so the audit can report them and nothing is lost.

**Launch gates are configurable.** Severity per rule and mode lives in one file, `config/launch-gates.ts`:

```ts
export type Severity = "off" | "warn" | "error";
export const GATES: Record<string, { review: Severity; live: Severity; note: string }> = {
  featuredInvalid:        { review: "error", live: "error", note: "Always on" },
  privateNumbers:         { review: "error", live: "error", note: "Never publish third-party phone numbers. Always on" },
  testimonialPlaceholders:{ review: "off",   live: "error", note: "Placeholders must not go live" },
  socialInvalid:          { review: "warn",  live: "error", note: "Set but not a valid URL" },
  photoNotReal:           { review: "warn",  live: "error", note: "stock, unverified or missing photo on a published product" },
  provisionalSlug:        { review: "warn",  live: "error", note: "Product name still cut off in the source" },
  placeholderText:        { review: "warn",  live: "error", note: "e.g. Customer Name, lorem, EXAM" },
  missingAlt:             { review: "warn",  live: "error", note: "Content image without alt text" },
  missingEnv:             { review: "warn",  live: "error", note: "Required environment variable missing" },
  unverifiedClaims:       { review: "off",   live: "warn",  note: "Earthing and PPE specs not yet verified" },
  modeMismatch:           { review: "error", live: "error", note: "Always on: SITE_MODE unset on a Vercel production build, or SITE_MODE and SITE_URL disagree (live mode on a vercel.app address, or review mode on kgiclsolar.com)" },
};
```
The `live` column follows the PRD defaults. Changing a `live` value is a deliberate launch decision made by Emmanuel and recorded in the commit message. Do not change it in a task.

**The review URL is public to anyone who has the link.** It carries unverified safety claims and some stock photos, so it stays unlisted and `noindex`, is not shared publicly, and is deleted after the production project has been switched to this repository and checked.

---

## 3. Decisions that change the PRD

| Topic | Decision |
|---|---|
| Catalogue | **63 products** (CCTV list updated: 7 products). 3 CCTV items (hard disk, power supply and cable kit, smart indoor camera) are not listed yet and can be added later |
| Home tiles | **Dark gradient with the dotted ring.** Photos can replace them later through `data/images.ts` |
| Hero | Ring motif and glow. No photo. Optional photo slot `images.hero = null` |
| Street-light site photos | **Dropped** until real photos exist. Do not use the two sample photos |
| Image replacement | Every image is data-driven and replaceable (section 4). Procedure documented in `README.md` |
| Google Search Console | Added **after go-live** (DNS TXT verification, submit sitemap). Independent of analytics |
| Analytics | **Vercel Web Analytics only** (live mode). No Google Analytics, so no cookie banner |
| Product names | Use the "Proposed name (draft)" column of the workbook as published names |

---

## 4. Data layout (everything replaceable lives in data files)

```
data/
  products/solar.ts cctv.ts electrical.ts industrial.ts   generated by scripts/import-products.ts, then hand-editable
  featured.ts       ordered slugs for the home page (PRD section 7)
  images.ts         site-level image slots: hero, tiles.{solar,cctv,electrical,industrial}, about, services
  projects.ts       five projects, one image each
  testimonials.ts   placeholders now, real ones later
  site.ts           company details, hours, phones, WhatsApp number, social env names
config/launch-gates.ts
lib/                cloudinary.ts, whatsapp.ts, years.ts, catalogue.ts, seo.ts, schemas/, contact/, rate-limit.ts, mode.ts
docs/               the six source documents
README.md
```

**Image slots in `data/images.ts`** (`null` means "use the default visual"):
```ts
export const SITE_IMAGES = {
  hero: null as string | null,
  tiles: { solar: null, cctv: null, electrical: null, industrial: null } as Record<string, string | null>,
  about: null as string | null,
} as const;
```
Values are **Cloudinary public IDs** (for example `home/tiles/solar`), never full URLs. A single function builds the URL (`lib/cloudinary.ts`).

---

## 5. Environment variables

| Name | Used for | Notes |
|---|---|---|
| `SITE_MODE` | `review` or `live` | Server-side only. Default `review` if missing |
| `SITE_URL` | Canonical URLs, sitemap, Open Graph | No trailing slash |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Image URLs | Public |
| `RESEND_API_KEY` | Contact form | Sensitive |
| `CONTACT_FROM_EMAIL` | Sender | `KGICL Website <website@notify.kgiclsolar.com>` |
| `CONTACT_TO_EMAIL` | Recipient | Review: Emmanuel's address. Live: `info@kgiclsolar.com` |
| `FACEBOOK_URL`, `INSTAGRAM_URL`, `LINKEDIN_URL` | Footer social icons | Blank hides the icon |
| `HIDE_UNVERIFIED_SPECS` | `true` or `false` | Default `false` in review, `true` in live |

Provide `.env.example` with every name and no values.

---

## 6. Company facts (single source: `data/site.ts`)

- Name: KRIS GOODNEWS INT'L CO. LTD. Trade name: KGICL Goodnews Solar. RC 1552853. Registered with CAC on 26 August 2005 as an Enterprise, limited company since 14 January 2019.
- Address: No. 7 Ada George Road, opposite Cosy Plaza, by Wide Choice Supermarket, Port Harcourt, Rivers State, Nigeria.
- Phone: 0803 613 6883, 0805 420 7519. WhatsApp: 0813 902 7180 (site button: `+2348139027180`), 0803 613 6883.
- Hours (Africa/Lagos): Mon to Fri 7:00 to 22:00, Sat 7:00 to 20:00, Sun closed.
- Coverage line: "Nationwide delivery".
- Email (show in footer only when `data/site.ts` has `emailVerified: true`): info@kgiclsolar.com, sales@kgiclsolar.com.
- Years in business: calculated from `2005-08-26` (completed years).
- Full approved copy: PRD Appendix B.

---

## 7. Definition of done (every task)

- [ ] `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` pass.
- [ ] Checked at 320, 390, 768, 1024 and 1440 px, and with the keyboard only.
- [ ] No console errors and no layout shift.
- [ ] Matches `design.md`. Any deviation is written into `design.md` in the same commit.
- [ ] Deployed to the review project and spot-checked there.
