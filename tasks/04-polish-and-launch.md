# Task 04: Polish, Review Handover and Go-Live

**Read first:** `00-shared-context.md`, `design.md` (sections 4.4, 9, 10), PRD sections 9, 10, 11, `domain-setup-guide.md`, `resend-implementation-guide.md` (Parts 8 to 11).
**Effort:** 5 to 7 days · **Depends on:** Task 03 verified.
**Result:** a polished review site the client can approve, a finished README, and a go-live runbook that switches the same code to `live` on kgiclsolar.com.

This task has two parts:
- **Part A (4.1 to 4.7):** polish and hand over the **review** site at kriss-goodnews-solar.vercel.app. Do these first.
- **Part B (4.9 to 4.11):** the **go-live runbook**. Run it only after the client has reviewed and approved, and after Emmanuel has made the content decisions the launch gates require.

Each sub-task has: **Agent Context**, **Prompt**, **Verify**.

---

## Task 4.1: Motion pass

### Agent Context
Specs: `design.md` 4.4 and 9. Animate only `transform` and `opacity`. No entrance animation on the hero's first screen text. Everything stops under `prefers-reduced-motion: reduce`.

### Prompt
1. `components/Reveal.tsx` (client): fades a section's children up 12 px once when they enter the viewport (`IntersectionObserver`), 70 ms stagger between children, 600 ms, `--ease-brand`. Renders children immediately when reduced motion is set or JavaScript is off (use a CSS class toggle, not `opacity: 0` in the HTML).
2. Apply `Reveal` at section level on Home (from "Popular products" down), Services, Projects, About, Industrial. Not on any hero or page-hero.
3. Card hover (lift 2 px, shadow, image scale 1.03), button hover and press, tile hover (ring opacity, glow, arrow nudge) as in `design.md` 9.
4. Hero ring rotation and tile ring effects respect reduced motion.

### Verify
- [ ] With reduced motion on, nothing moves and all content is visible.
- [ ] With JavaScript disabled, all content is visible.
- [ ] No layout shift (CLS 0) when reveals run.

---

## Task 4.2: Accessibility pass

### Prompt
1. Run an automated check (axe via the browser extension or `@axe-core/cli`) on Home, an area page, two product pages, Industrial, Contact, Privacy and 404. Fix every serious and critical finding.
2. Manual checks: keyboard only through every page (visible focus, logical order, menu and form operable), zoom to 200% and 400% (no horizontal scroll except inside tables), heading order, landmarks, alt text, form labels and error announcements, link names.
3. Confirm the contrast pairs from `design.md` 4.1 on the real pages (no small red text on black; small red text on light uses `--color-red-deep`).

### Verify
- [ ] Zero serious or critical axe issues on the pages listed.
- [ ] Skip link works. Menu traps and restores focus. The form can be completed and submitted by keyboard.

---

## Task 4.3: Performance pass

### Agent Context
Targets (PRD 9.1), measured on mobile with throttled Fast 4G: LCP 2.5 s or better, CLS 0.1 or less, INP 200 ms or less, Lighthouse mobile performance 90 or more. First-load JavaScript about 150 KB gzipped or less per page.

### Prompt
1. Run Lighthouse (mobile) on Home, `/solar-lighting`, a product page, `/industrial-supply` and `/contact`. Record the scores in `docs/performance.md`.
2. Fix what is below target: oversized images (check the `sizes` attribute on every `CloudImage`), missing `priority` on the first image only, font preload for the two fonts, unused client components, large dependencies (check `next build` output).
3. Confirm only the first image on a page is `priority`; all others lazy.

### Verify
- [ ] All pages listed meet the targets, or each miss is explained in `docs/performance.md` with a reason.
- [ ] No layout shift from images or fonts.

---

## Task 4.4: Security headers

### Agent Context
Static pages in Next.js use inline scripts for hydration, so a nonce-based CSP is not possible here. Use a CSP that allows `'unsafe-inline'` for scripts and styles, and is strict about everything else. Vercel Web Analytics loads from the same origin (`/_vercel/insights/...`), so no extra host is needed. Test in the browser console and fix any violation.

### Prompt
In `next.config.ts` `headers()` for all routes:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `Content-Security-Policy: default-src 'self'; img-src 'self' data: https://res.cloudinary.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`
- Keep the review-mode `X-Robots-Tag` from Task 1.4.
- Cache long for `/assets/*` and `/_next/static/*` (`public, max-age=31536000, immutable`).

### Verify
- [ ] The browser console shows no CSP violations on any page, including the form and product images.
- [ ] A security-headers scanner shows all headers present.

---

## Task 4.5: Analytics (live mode only)

### Agent Context
Decision: **Vercel Web Analytics only** (cookieless). No Google Analytics, so no cookie banner. Analytics is off in review mode. Custom events may need a paid Vercel plan, so confirm in the dashboard; if unavailable, keep page views and skip custom events.

### Prompt
1. Install `@vercel/analytics`. Render `<Analytics />` in the root layout **only when `isLive()`**.
2. `lib/analytics.ts`: `trackEvent(name, props)` that does nothing in review mode.
3. Click tracking without making every link a client component: a small client component `AnalyticsEvents` mounted once in the layout, listening to document clicks and reading `data-track`, `data-track-location` and `data-track-product` attributes. Add the attributes in `Button` and in the WhatsApp and call links (`whatsapp_click`, `call_click`).
4. In `ContactForm`, call `trackEvent("form_submit_success")` and `trackEvent("form_submit_error")` when the result changes. Never send the visitor's details.

### Verify
- [ ] In review mode, no analytics script loads.
- [ ] In live mode (`SITE_MODE=live` locally with a production build), the script loads and events fire with the right properties and no personal data.

---

## Task 4.6: Smoke test script

### Prompt
Write `scripts/smoke.ts` (`npm run smoke -- <base-url>`) that fetches a list of URLs (Home, the four area pages, five product pages, Services, Projects, About, Contact, Privacy, `/sitemap.xml`, `/robots.txt`, an unknown URL) and checks: status 200 (404 for the unknown URL), a unique `<title>`, no `launching soon` text, and the `x-robots-tag: noindex` header present in review and absent in live. Print a pass/fail table and exit non-zero on any failure.

### Verify
- [ ] `npm run smoke -- https://kriss-goodnews-solar.vercel.app` passes.
- [ ] Run it again after every deployment.

---

## Task 4.7: README and replacement procedures

### Agent Context
A draft `README.md` is provided with this task set (repo root). It contains the procedures for replacing **every** picture and for the routine content updates. The client pays per update request, so these steps must be accurate and short. Finish it, and **prove each procedure works** by doing it.

### Prompt
1. Place the provided `README.md` in the repo root. Adjust paths to match the real file names if anything differs.
2. Perform each of these procedures once on a branch, confirm it works, then discard the change:
   - Replace a product photo (method 1).
   - Put a photo into the Solar home tile through `data/images.ts`, and remove it again to return to the gradient and ring.
   - Swap one featured product.
   - Add a new product (copy an existing record, new slug, run `npm run audit`).
   - Unpublish a product.
3. Add a "Deployment" section listing the Vercel projects, environment variables per mode, and the go-live runbook link (4.9 to 4.11).

### Verify
- [ ] Each procedure in the README worked exactly as written (list the five checks in the PR).
- [ ] The README states the review and live modes clearly.

---

## Task 4.8: Remove scaffolding and final review build

### Prompt
1. Delete the `/design-check` page and any `TODO` or leftover debug output (`grep -rn "TODO\|console.log" app components lib`).
2. Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run audit` (review mode) and `npm run smoke` against the review URL.
3. Deploy to `kriss-goodnews-solar.vercel.app` and send Emmanuel the link for the client review. Provide him the audit warning summary so he can match it to the spreadsheet.

### Verify
- [ ] The review site is complete on all pages. The footer, forms and WhatsApp buttons work on a real phone.
- [ ] The audit report (review mode) lists only warnings that match the spreadsheet's concerns.

---

# Part B: Go-Live Runbook (live mode)

**Do not start until the client has approved the review site.** These steps switch the existing production project (the one that serves kgiclsolar.com) from the coming-soon repository to this repository, with `SITE_MODE=live`. Emmanuel performs the dashboard steps; the agent prepares code changes and checks.

## Task 4.9: Pre-launch decisions and gates

### Agent Context
`config/launch-gates.ts` holds the live severities (PRD defaults). Each `live` value is a **launch decision** made by Emmanuel. If he chooses to relax one, he edits the value himself and records the reason in the commit message. Do not change gates on your own.

### Prompt
1. Run `SITE_MODE=live npm run audit` and give Emmanuel the report, grouped by gate.
2. Walk through each failing gate with him and resolve it by one of: fix the data (confirm a name, replace a photo, verify a claim), unpublish the product, or consciously relax the gate.
3. Confirm the privacy notice markers `[To be confirmed by KGICL]` are replaced with the client's decisions (privacy contact, retention period).
4. Confirm testimonials: add the real ones, or empty `data/testimonials.ts` so the section hides.
5. Confirm social links: set the three environment variables when the pages exist; otherwise leave them blank.
6. Set `emailVerified: true` in `data/site.ts` once the `info@` and `sales@` mailboxes are confirmed live.

### Verify
- [ ] `SITE_MODE=live npm run audit` exits 0.

## Task 4.10: Switch the production project to the new repository

### Agent Context
**Approach (decided by Emmanuel):** keep the existing production Vercel project that already serves kgiclsolar.com. Its domain, certificates, redirects and DNS records stay exactly as they are. Disconnect the coming-soon repository, connect the main website repository, and deploy. The review project is deleted afterwards.

Why this is safe: disconnecting a repository does **not** take the site down. The coming-soon deployment keeps serving until a new deployment succeeds, so a failed first build leaves the site as it is. The old deployment also stays in the project's history for an instant rollback.

**Order matters.** Set the environment variables **before** the first deployment from the new repository. If `SITE_MODE` were missing, the site would default to review mode and publish `noindex` on the live domain. The audit's `modeMismatch` gate catches this, but do not rely on it.

### Prompt (Emmanuel does the dashboard steps; the agent prepares the code and checks)
**Step 0: preparation**
1. Run `SITE_MODE=live npm run audit` and `SITE_MODE=live npm run build` locally. Both must pass.
2. Tag the release (`git tag v1.0.0`) and push the tag.
3. In the production project, record the current state: Domains list (primary and redirects), Build and Development Settings, and Environment Variables. Note the URL of the current production deployment (for rollback).

**Step 1: environment variables in the production project**
- **Production:** `SITE_MODE=live`, `SITE_URL=https://kgiclsolar.com`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `RESEND_API_KEY` (production key, mark **Sensitive**), `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL=info@kgiclsolar.com`, `FACEBOOK_URL` / `INSTAGRAM_URL` / `LINKEDIN_URL` (only if real), `HIDE_UNVERIFIED_SPECS` (as decided).
- **Preview and Development:** `SITE_MODE=review`, `SITE_URL=https://kgiclsolar.com`, the **dev** Resend key, and `CONTACT_TO_EMAIL` set to Emmanuel's address. Preview deployments therefore always behave as review builds.

**Step 2: disconnect the coming-soon repository**
Project, Settings, Git, **Disconnect**. The current deployment keeps serving.

**Step 3: connect the main website repository**
Settings, Git, **Connect Git Repository**, choose the website repo, production branch `main`.

**Step 4: reset the build settings (the coming-soon project was set up as a plain static site)**
Settings, Build and Development Settings:
- Framework Preset: **Next.js**.
- Turn **off** the overrides for Build Command, Output Directory (it was `public`) and Install Command, so the defaults apply.
- Root Directory: blank.
A leftover `public` output-directory override makes the Next.js build fail.

**Step 5: analytics**
Project, **Analytics**, enable Web Analytics (it is switched on per project).

**Step 6: deploy**
Push a commit to `main` (for example `git commit --allow-empty -m "go live"` then `git push`). **Do not use "Redeploy" on the old deployment.** That would rebuild the coming-soon commit.

**Step 7: confirm domains**
Project, Settings, Domains: `kgiclsolar.com` is Production; `www.kgiclsolar.com`, `krisgoodnewssolar.com` and `www.krisgoodnewssolar.com` still redirect to it (308). No DNS change is needed.

**Step 8: firewall**
Add the Vercel Firewall rate-limit rule for `POST /contact` (resend guide, Part 8).

### Rollback plan
If something serious appears after the switch: Deployments tab, open the last good coming-soon deployment, **Instant Rollback** (or "Promote to Production"). The site is back in seconds. Fix the problem on a branch and try again. As a last resort, reconnect the old repository in Settings, Git.

### Verify
- [ ] The first build succeeded. The build log shows the audit ran in live mode.
- [ ] The test table in `domain-setup-guide.md` section 4 passes for all four hostnames.
- [ ] `npm run smoke -- https://kgiclsolar.com` passes. There is **no** `x-robots-tag: noindex` header, and `robots.txt` allows crawling and lists the sitemap.
- [ ] A real form submission from kgiclsolar.com arrives in `info@kgiclsolar.com`, not in spam.
- [ ] The "Review version" tag is gone and the analytics script loads.

## Task 4.11: After going live

### Prompt (Emmanuel)
1. **Delete the review project** (`kriss-goodnews-solar`): Settings, General, Delete Project. Do this **after** 24 to 48 hours of checks, not before, so you keep a copy to compare with if something looks wrong. Make sure the client no longer relies on the old review link.
2. **Google Search Console** (free, independent of analytics):
   - Add a **Domain** property for `kgiclsolar.com`. It asks for a DNS TXT record. At HostAfrica add TXT, name `@`, value `google-site-verification=…` as shown. The zone already has an SPF TXT at `@`; adding another TXT is fine, but never add a second SPF record.
   - Verify, then submit `https://kgiclsolar.com/sitemap.xml`. Use "Inspect URL" on the home page and request indexing.
3. Create the Google Business Profile (separate task) and add the website address.
4. Back up the original photos from Cloudinary to a folder outside Cloudinary.
5. Watch Resend (weekly for a month) and Vercel logs for `[contact]` errors.
6. Archive the coming-soon repository (keep it for history).
7. **The production project's own address.** It still has its default address `kgicl-solar.vercel.app`, which will now serve the live site as a second hostname. The canonical tags point to `https://kgiclsolar.com`, which prevents duplicate-content problems. If Vercel offers it in Settings, Domains, set that address to redirect to kgiclsolar.com.

### Ongoing review of future changes
Every branch or pull request now gets a **preview deployment** with its own URL, running in review mode (noindex, emails to the developer, `[REVIEW]` subject). Use these to show the client changes before they go live. Vercel protects previews by default, so use a shareable preview link or adjust the protection setting so the client can open it.

### Verify
- [ ] Search Console shows the property verified and the sitemap read.
- [ ] A `site:kgiclsolar.com` search begins to show pages within days to weeks (indexing is not instant).
- [ ] A test branch shows a preview deployment with the "Review version" tag.

---

## Task 04 is done when

- [ ] Part A is verified and the client has reviewed the review site.
- [ ] Part B is completed at go-live and the live checks pass.
- [ ] The Definition of Done in `00-shared-context.md` section 7 is met.
