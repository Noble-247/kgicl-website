# Task 01: Project Setup, Tokens, Modes and Site Shell

**Read first:** `00-shared-context.md`, `design.md` (sections 3, 4, 5, 6.1, 6.2), PRD sections 5.1 and 10.
**Effort:** 2 to 3 days · **Depends on:** nothing (design.md and the logo asset pack exist).
**Result:** a deployed, empty-but-branded shell on **kriss-goodnews-solar.vercel.app** with header, footer, mode switching, tokens, fonts and primitives. No catalogue yet.

Each sub-task has: **Agent Context** (what to know), **Prompt** (what to do) and **Verify** (how to prove it).

---

## Task 1.1: Create the project

### Agent Context
Repository name `kgicl-website` (not `kgicl-solar`, which is the name of the coming-soon Vercel project). Stack and rules are in `00-shared-context.md` section 1. Start from a clean Next.js 15 App Router project with Tailwind v4.

### Prompt
Create the project:
1. Run `npx create-next-app@latest kgicl-website` with TypeScript, ESLint, Tailwind, App Router, no `src/` directory, import alias `@/*`.
2. Enable `"strict": true`. Add scripts: `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `audit` (`tsx scripts/audit.ts`), `import-products` (`tsx scripts/import-products.ts`), and `prebuild` (`npm run audit`).
3. Install dev dependencies: `vitest`, `tsx`. Install runtime dependencies: `zod`, `lucide-react`, `react-icons`.
4. Create the folders from `00-shared-context.md` section 4 (`data/`, `config/`, `lib/`, `scripts/`, `docs/`, `components/`). Add empty placeholder files only where later tasks will fill them.
5. Copy the six source documents into `docs/`.
6. Add `.gitignore` (include `.env*.local`, `.vercel`, `node_modules`), `.env.example` (all names from section 5, no values), and a stub `README.md` (title and one paragraph; the full README comes in Task 04).
7. Initialise git, commit, push to GitHub.

### Verify
- [ ] `npm run dev` shows the default page.
- [ ] `npm run typecheck`, `npm run lint` and `npm test` pass (the test run may report "no tests" for now; add one trivial test so it passes).
- [ ] `.env.example` lists every variable name and no secrets.

---

## Task 1.2: Design tokens and fonts

### Agent Context
Tokens come from `design.md` 4.1 to 4.5. **Two naming traps** (from the shared rules): do not name spacing tokens `xs/sm/md/lg/xl/2xl`; and the `next/font` CSS variables must be `--font-cormorant` and `--font-manrope`, aliased in `@theme` as `--font-display` and `--font-body`. Using identical names makes the variables point to themselves and no brand font loads.

### Prompt
1. Replace `app/globals.css` with the `@theme` block from `design.md` 4.5, plus: base body styles (`background: var(--color-paper)`, `color: var(--color-text)`, `font-family: var(--font-body)`), heading defaults (display font for H1 and H2), a visible focus ring utility (3 px outline, 3 px offset; white on dark surfaces, `--color-text` on light), a `.skip-link`, and a `prefers-reduced-motion: reduce` block that disables animation, transitions and smooth scrolling.
2. Self-host the fonts with `next/font/local`:
   - Get the `.woff2` files once (do not commit `node_modules`): in a temp folder run `npm i @fontsource/cormorant-garamond @fontsource/manrope`, then copy only the **latin** files `cormorant-garamond-latin-600-normal.woff2`, `manrope-latin-400-normal.woff2`, `manrope-latin-600-normal.woff2`, `manrope-latin-700-normal.woff2` into `app/fonts/`.
   - In `app/layout.tsx` declare both fonts with `variable: "--font-cormorant"` and `variable: "--font-manrope"`, `display: "swap"`, and add the variable classes to `<html>`.
3. Add small utilities for the section rhythm: `.section-y` (64 px mobile, 96 px desktop) and `.container-site` (max 1200 px, side padding 20/32/40 px).
4. Add a temporary `/design-check` page (not linked anywhere, removed in Task 04) that shows every colour token, the type ramp, buttons and focus rings, so the tokens can be checked in a browser.

### Verify
- [ ] In browser dev tools, the H1 computed font family is **Cormorant Garamond** and body text is **Manrope**.
- [ ] No request goes to Google Fonts. Fonts load from your own domain.
- [ ] `/design-check` shows all colours, with the contrast pairs in `design.md` 4.1 readable.
- [ ] Reduced motion (set in dev tools) stops all animation.

---

## Task 1.3: Site config, environment and modes

### Agent Context
This is the most important task for the review plan. Follow `00-shared-context.md` section 2 exactly. `SITE_MODE` is **server-side only**: read it in server code and pass booleans down as props.

### Prompt
1. `data/site.ts`: export the company facts from `00-shared-context.md` section 6 as a typed object (name, tradeName, rc, address lines, phones, whatsapp numbers, hours per day in Africa/Lagos, coverage line, emails with `emailVerified: false`, `foundedOn: "2005-08-26"`).
2. `lib/mode.ts`: `getSiteMode(): "review" | "live"` (default `review`), `isReview()`, `isLive()`, `siteUrl()` (from `SITE_URL`, default `https://kriss-goodnews-solar.vercel.app`), `hideUnverifiedSpecs()` (reads `HIDE_UNVERIFIED_SPECS`, default `false` in review and `true` in live).
3. `lib/env.ts`: validate the environment with Zod. Missing variables are **errors only in live mode** (and warnings in review), per the `missingEnv` gate. Never log values.
4. `config/launch-gates.ts`: add exactly the `GATES` object from `00-shared-context.md` section 2 with its type.
5. Add Vitest tests for `lib/mode.ts` (defaults, both modes, trailing-slash handling of `SITE_URL`).

### Verify
- [ ] Tests pass for all mode combinations.
- [ ] With `SITE_MODE` unset, the app behaves as `review`.
- [ ] No `NEXT_PUBLIC_` variable holds a secret.

---

## Task 1.4: Layout shell (header, menu, bars, footer)

### Agent Context
Specs are in `design.md` 6.1 and 5. Header is solid black, sticky, 72 px desktop and 64 px mobile. Navigation has eight links, so the desktop navigation needs the **1024 px** breakpoint. The footer shows the email only when `emailVerified` is true. Social icons come from environment variables and render only for valid URLs (`FACEBOOK_URL`, `INSTAGRAM_URL`, `LINKEDIN_URL`). Brand glyphs use `react-icons/fa`; UI icons use `lucide-react`.

### Prompt
Build these components in `components/` and wire them into `app/layout.tsx`:
1. `Header` (logo lockup: white mark 44 px + "KGICL" over "Goodnews Solar"; nav links; compact WhatsApp button; `aria-current="page"` on the active link; border after scroll).
2. `MobileMenu` (client component): slide-in panel from the right, backdrop, Escape to close, focus trap, focus returns to the menu button, body scroll locked while open, links in 56 px rows, WhatsApp and Call buttons at the bottom.
3. `MobileActionBar` (below 768 px): fixed bottom bar with WhatsApp (red) and Call (outline), safe-area padding, hides while the menu is open. Add bottom padding to the page content equal to the bar height.
4. `FloatingWhatsApp` (768 px and above): 56 px red circle, white WhatsApp glyph, tooltip, `aria-label="Chat on WhatsApp"`.
5. `Footer`: four columns per `design.md` 6.1 (brand and "Nationwide delivery", Products, Company, Visit us with address, hours and phones). Bottom line: `© {year} Kris Goodnews Int'l Co. Ltd. All rights reserved.`
6. `SocialLinks` (server component reading the three env variables; returns `null` when none are valid).
7. `ReviewBadge`: shown only in review mode. Small pill "Review version", bottom-left, `pointer-events: none` except the text, never covering the action bar or form controls.
8. Skip link "Skip to content" as the first focusable element. `<main id="main">`.
9. Root metadata: `metadataBase` from `siteUrl()`, title template `%s | KGICL Goodnews Solar`, default title, description, icons, `manifest`, `themeColor`, Open Graph defaults.
10. Mode-aware search-engine rules:
    - Review: in `generateMetadata`/layout set `robots: { index: false, follow: false }`; in `next.config.ts` `headers()` add `X-Robots-Tag: noindex, nofollow`; `app/robots.ts` returns `Disallow: /`.
    - Live: robots allow all and list the sitemap.

### Verify
- [ ] Menu opens and closes by click, Escape and backdrop. Focus is trapped and restored. Tab order is logical.
- [ ] At 320 px nothing overflows horizontally. The action bar never covers the footer content.
- [ ] In review mode, the response has `X-Robots-Tag: noindex, nofollow`, the meta tag is present, and `/robots.txt` disallows all. In live mode none of these is present.
- [ ] The footer shows no email and no social icons (none configured yet), and shows hours and phones correctly.
- [ ] The "Review version" tag is visible in review mode and absent in live mode.

---

## Task 1.5: WhatsApp and phone helpers

### Agent Context
WhatsApp number for the site buttons is `+2348139027180`. Messages must be URL-encoded. Templates are in `design.md` section 11.

### Prompt
Create `lib/whatsapp.ts`:
1. `waLink(message: string): string` returning `https://wa.me/2348139027180?text=<encoded>`.
2. `messages.general`, `messages.product({ name, modelCode?, url })`, `messages.industrial({ name, url })` using exactly the templates in `design.md` section 11.
3. `telLink(phone)` returning a `tel:+234…` link from a Nigerian local number (`0803 613 6883` becomes `tel:+2348036136883`).
4. Use these helpers in the header, bars, footer and floating button (no hard-coded `wa.me` strings elsewhere).
5. Vitest tests: apostrophes, ampersands, accents and the naira sign encode correctly; empty model code omitted; phone formatting.

### Verify
- [ ] Tests pass.
- [ ] Clicking each WhatsApp button on a phone opens WhatsApp with the right prefilled text.
- [ ] `grep -r "wa.me" app components` finds nothing (only `lib/whatsapp.ts`).

---

## Task 1.6: Primitive components

### Agent Context
Specs: `design.md` 6.2. Focus ring on every interactive element. Buttons are 52 px high (44 px compact), radius 14.

### Prompt
Build `Container`, `Button` (variants: primary, secondary-dark, secondary-light, link; sizes: default, compact; supports `href` or `onClick`; icon slot; disabled state), `Chip` (selectable), `Breadcrumbs`, `SectionHeading` (eyebrow + H2 + intro), `Divider` (dotted), and `DottedRing`:
- `DottedRing` renders `public/assets/img/logo-ring-white.svg` through `next/image` with props `size`, `opacity`, `rotate` (slow rotation, 120 s) and a `className`. It is `aria-hidden`, `alt=""`, and never animates under reduced motion.
- Show every primitive and state on `/design-check`.

### Verify
- [ ] All states (default, hover, focus, active, disabled) look right on dark and light surfaces.
- [ ] Contrast matches `design.md` 4.1: white on red buttons, `--color-red-deep` for small red text on light.
- [ ] Ring does not rotate with reduced motion enabled.

---

## Task 1.7: Brand assets and default Open Graph image

### Agent Context
The asset pack `kgicl-coming-soon-assets.zip` holds logos, icons and a favicon set. Its `og-image.png` says "Our new website is launching soon", which must **not** be used on the main site.

### Prompt
1. Copy the logo SVGs and PNGs to `public/assets/img/`, and the icons to `public/` (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`) and `public/assets/icons/` (192, 512). Add `site.webmanifest` (name "KGICL Goodnews Solar", short name "KGICL", theme and background `#0A0A0B`, icons 192 and 512). Reference them in the root metadata.
2. Do not copy the original JPEG logos (`img/source`) into `public/`.
3. Create a default Open Graph image with `app/opengraph-image.tsx` (Next.js `ImageResponse`, 1200 × 630): black background, white logo mark on the left, text "KGICL Goodnews Solar" and "Solar lighting, electrical supplies and industrial supply. Port Harcourt, Nigeria", red bar at the bottom. Use only system fonts.

### Verify
- [ ] Favicon and manifest load. No 404s in the network tab.
- [ ] `/opengraph-image` renders the new image with no "launching soon" text.
- [ ] `grep -r "launching soon" app public` finds nothing.

---

## Task 1.8: Review deployment on Vercel

### Agent Context
This is a **temporary review project**. It uses the default Vercel domain `kriss-goodnews-solar.vercel.app` and is deleted after go-live (Task 04, Part B, where the existing production project is switched to this repository). **Do not attach kgiclsolar.com to it.** That domain still serves the coming-soon page from a different Vercel project. Use the Pro account. Ask Emmanuel to perform the dashboard steps if you lack access, and give him the exact values.

### Prompt
1. Create the Vercel project **`kriss-goodnews-solar`** from the GitHub repo (framework: Next.js). Its default address is `kriss-goodnews-solar.vercel.app`. (`kgicl-solar.vercel.app` already belongs to the coming-soon project, so do not use that name.)
2. Set environment variables for **all environments**: `SITE_MODE=review`, `SITE_URL=https://kriss-goodnews-solar.vercel.app`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (from Emmanuel). Leave the Resend and social variables for Task 03.
3. Deploy and confirm the production URL is `https://kriss-goodnews-solar.vercel.app`.
4. Record the deployment steps in `README.md` under "Deployment" (stub is fine).

### Verify
- [ ] `https://kriss-goodnews-solar.vercel.app` loads the shell with the "Review version" tag.
- [ ] `curl -I https://kriss-goodnews-solar.vercel.app` shows `x-robots-tag: noindex, nofollow`.
- [ ] kgiclsolar.com still shows the coming-soon page (untouched).

---

## Task 01 is done when

- [ ] Sub-tasks 1.1 to 1.8 are verified.
- [ ] The Definition of Done in `00-shared-context.md` section 7 is met.
- [ ] `/design-check` is still present (it is removed in Task 04).
