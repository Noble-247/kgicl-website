# Task 03: Pages, Contact Form and Remaining Data

**Read first:** `00-shared-context.md`, `design.md` (6.3 to 6.5, 7), PRD sections 5.2, 5.4, 9.4 and Appendix B, `resend-implementation-guide.md`.
**Effort:** 6 to 8 days · **Depends on:** Task 02 verified.
**Result:** every page of the site on the review deployment: Home, Industrial Supply, Services, Projects, About, Contact (with a working Resend form), Privacy notice, 404, plus the testimonial placeholders and the finished audit.

Each sub-task has: **Agent Context**, **Prompt**, **Verify**.

---

## Task 3.1: Data files for projects, testimonials, services and images

### Agent Context
All content that the client may want to change lives in `data/`. **Never copy private contact numbers or contact names from the client's project source file into the repo.** The five projects are given below, already cleaned. Project photos are Cloudinary public IDs. The site-level image slots in `data/images.ts` all start as `null` (see `00-shared-context.md` section 4).

### Prompt
1. `data/images.ts`: create `SITE_IMAGES` exactly as in `00-shared-context.md` section 4 (hero, four tiles, about), all `null`.
2. `data/projects.ts` (type `Project`: `id`, `title`, `client?`, `location?`, `type`, `description`, `image: { publicId, alt }`):
   | id | title | client | location | type | description | publicId |
   |---|---|---|---|---|---|---|
   | `transformer-ikoyi` | 300 kVA Transformer Procurement and Installation | Mr Biggs | Ikoyi, Lagos | Procurement and installation | Procurement and installation of a 300 kVA transformer at Mr Biggs, Ikoyi, Lagos. | `Procure-and-installation-of-300kva-transformer-at-Mr-Biggs-koyi-Lagos` |
   | `foodco-ikotun` | Installation at Foodco Eateries | Foodco Eateries | Ikotun, Lagos | Installation | Completed installation at Foodco Eateries, Ikotun, Lagos. | `Completed-installation-of-Foodco-Eatries-Ikotun-Lagos` |
   | `solar-lights-ph-residence` | KGICL Solar Lights at a Port Harcourt Residence | none | Port Harcourt | Solar lighting installation | Completed installation of KGICL solar lights in a new site at a Port Harcourt residence. | `Completed-installation-of-KGICL-solar-lightd-in-a-new-site-at-a-Port-Harcourt-residence` |
   | `industrial-solar-street-lights` | Supply of Industrial All-in-One Solar Street Lights | none | none | Supply | Supply of industrial all-in-one solar street lights to a client. | `Supply-of-industrial-solar-all-in-one-solar-street-lights-to-a-client` |
   | `flexible-cables-lekki` | Industrial Flexible Cables for Air Conditioning | none | Lekki, Lagos | Procurement | Procurement of industrial flexible cables for the installation of industrial air conditioning at Lekki, Lagos. | `Procurement-of-industrial-flexible-cables-for-installation-of-industrial-air-condition-at-Lekki-Lagos` |

   The public IDs contain the client's original spellings. Keep them exactly. Alt text: `"{title}, {location}"` (omit the location when none).
3. `data/testimonials.ts` (type `Testimonial`: `quote`, `name`, `role`, `isPlaceholder`): three placeholders with `name: "Customer Name"`, `role: "Role, Company"`, `quote: "Placeholder text for layout only. Replace with a real customer's words."`, `isPlaceholder: true`.
4. `data/services.ts`: the five main services, each with a one-line description (plain words, no claims beyond what is given):
   - Solar consultation and installation: "We advise on the right solar lighting for your site and install it." Note line: "Free solar consultation for Port Harcourt clients."
   - Electrical installation and wiring: "Electrical installation and wiring for homes, shops, offices and industrial sites."
   - UPS supply: "Supply of UPS and power backup equipment."
   - Procurement and logistics: "Sourcing and delivery of electrical, mechanical and industrial supplies."
   - Civil and electrical installation of all types: "Civil and electrical installation works, large or small."

   Secondary "Other services" list: Provision of skilled and semi-skilled personnel; Oil spill control and bioremediation; Provision of marine equipment; Welding and fabrication of flow-lines and steel structures; Radio and telecommunications. (The 2019 brochure says "Oil Spill Control/Bioremediation" while the client's form said "well control". Use the brochure wording and add `// confirm wording with client` in the file.)
5. `data/terms.ts`: four terms as in PRD Appendix B (free solar consultation for Port Harcourt clients; 1-year warranty on solar lights; 6-month warranty on electrical installations; corporate clients 75% advance and 25% on completion).
6. Extend the audit `placeholderText` rule to also flag the text `[To be confirmed` and `Replace with a real`.

### Verify
- [ ] The audit's `privateNumbers` rule finds nothing in `data/`.
- [ ] Project public IDs load on a test page (five images).
- [ ] No contact names or numbers appear anywhere in the repo.

---

## Task 3.2: Utilities (years in business and opening hours)

### Agent Context
Years are **completed years since 2005-08-26** (21 in October 2026, 22 on 26 August 2027). Because pages are static, pages that show the figure use `export const revalidate = 86400` (Next.js ISR), so it updates itself. Opening hours are in `Africa/Lagos` (UTC+1, no daylight saving).

### Prompt
1. `lib/years.ts`: `yearsSince(date: Date, now = new Date())` returning completed years; `companyYears()` using `data/site.ts` `foundedOn`.
2. `lib/hours.ts`: `isOpenNow(now = new Date())` and `todayHours(now)` using `data/site.ts` hours and the `Africa/Lagos` time zone (use `Intl.DateTimeFormat` with `timeZone`, no external library).
3. Vitest tests: years on 2026-08-25 (20), 2026-08-26 (21), 2027-08-26 (22); open at 07:00 and 21:59 Mon to Fri, closed at 22:00, Saturday closes at 20:00, closed all day Sunday; correct result when the server is in UTC.

### Verify
- [ ] Tests pass.
- [ ] Changing the system clock in a test never crashes at midnight or on a leap day.

---

## Task 3.3: Home page

### Agent Context
Wireframe: `design.md` 7.1. Dark hero with the ring motif (no photo, `SITE_IMAGES.hero` is `null`; build the photo slot but leave it unused). The four tiles use the **default dark gradient with the dotted ring**; when `SITE_IMAGES.tiles.<area>` holds a public ID, the tile switches to the photo state (see `design.md` 6.3). Featured products come from `getFeatured()`. Copy is in PRD Appendix B. Do not claim "24/7" support.

### Prompt
Build `app/page.tsx` with `export const revalidate = 86400` and these sections, in order:
1. **Hero** (dark): eyebrow "Port Harcourt, Nigeria"; H1 "Solar and electrical supplies you can rely on."; one supporting line "Solar street lights, CCTV, electrical materials and industrial supply, with nationwide delivery."; buttons "Chat on WhatsApp" and "Browse products" (to `/solar-lighting`); four small chips; large faint `DottedRing` (520 to 720 px, 6 to 10% opacity, 120 s rotation, desktop only larger). No entrance animation on the first screen text.
2. **PillarTiles**: four tiles linking to the four areas. Build `components/home/PillarTile.tsx` with both states, driven by `SITE_IMAGES.tiles`.
3. **Featured products**: H2 "Popular products", six `ProductCard`s from `getFeatured()`, link "See all products".
4. **Why choose us** (dark band): three points from PRD Appendix B (original products with warranty; based in Port Harcourt with fast delivery and installation and WhatsApp support; in business since 2005 and trusted by estates, churches, businesses and oil and gas companies) and the stat `"{companyYears()} years of proven experience"`.
5. **Projects teaser**: three project cards from `data/projects.ts`, link "See all projects".
6. **Testimonials** (see Task 3.7): rendered only when allowed.
7. **Services snapshot**: five service cards.
8. **Contact strip** (dark): address, hours, WhatsApp and Call buttons.
Add `localBusinessJsonLd` (Task 3.9) and page metadata.

### Verify
- [ ] At 360 × 640 the hero headline and both buttons are visible without scrolling.
- [ ] Setting `SITE_IMAGES.tiles.solar` to a real public ID switches that tile to the photo state with no other code change (try it, then revert).
- [ ] The years figure reads 21. No "24/7" text anywhere.
- [ ] Reduced motion stops the ring.

---

## Task 3.4: Industrial Supply page

### Agent Context
Wireframe: `design.md` 7.4. Fully dark page. Uses the same `/products/[slug]` pages. Group "Pipes & Marine" has no products yet: show a short text card ("Safety pipes and anchor chains, supplied on request. Ask us on WhatsApp.") with a WhatsApp button, using `messages.industrial`.

### Prompt
Build `app/industrial-supply/page.tsx`: dark page hero with the line "Supplied on request. Tell us what you need and we will quote." and a WhatsApp button; group sections for PPE & Safety (12) and Earthing & Lightning Protection (12) using compact `ProductCard`s on a `--color-black` background; the Pipes & Marine text card; and the 3-step "How it works" band (1 Tell us what you need, 2 We quote, 3 We deliver) with a WhatsApp button. Each compact card's Enquire button uses `messages.industrial`.

### Verify
- [ ] All 24 products appear in two groups with working links to their pages.
- [ ] Text contrast on the dark page meets `design.md` 4.1.
- [ ] The Pipes & Marine card opens WhatsApp with the right message.

---

## Task 3.5: Services, Projects and About pages

### Agent Context
Wireframes: `design.md` 7.5. Copy: PRD Appendix B. About text must say "registered with CAC on 26 August 2005 as an Enterprise" and "limited liability company on 14 January 2019 (RC 1552853)", and spell "renewable" in full.

### Prompt
1. `app/services/page.tsx`: page hero, five `ServiceCard`s from `data/services.ts`, the terms list from `data/terms.ts`, the secondary "Other services" simple list, and a dark WhatsApp band.
2. `app/projects/page.tsx`: page hero, `ProjectCard`s (3:2 image, title, location pill, type, description) in two columns on desktop, dark band "Need something similar? Talk to us on WhatsApp".
3. `app/about/page.tsx` (`revalidate = 86400`): history text (two paragraphs from Appendix B), the years statistic, Mission and Vision cards, Values as six chips, "Why choose us", WhatsApp band.
4. Each page gets metadata (unique title and description) and breadcrumbs.

### Verify
- [ ] Texts match Appendix B word for word. The About page shows the correct dates and RC number.
- [ ] Project cards show no phone numbers, names of contacts, or the "none" values.
- [ ] Layouts hold at 320 px.

---

## Task 3.6: Contact page and Resend form

### Agent Context
The full, tested implementation is in `resend-implementation-guide.md` (Parts 6 to 8). **Follow it.** Differences for this project:
- Environment: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` (review: Emmanuel's address, set in Vercel).
- In **review mode** the email subject is prefixed `[REVIEW] `; in live mode it is not.
- The form reads `?product={slug}` and prefills the hidden `product` field with the product name.
- Account, domain, DNS and keys are already set up and tested (guide "Setup status").

### Prompt
1. Files (from the guide, section 6): `app/contact/schema.ts`, `app/contact/actions.ts` (`'use server'`, only async exports), `app/contact/ContactForm.tsx`, `app/contact/page.tsx` (`maxDuration = 15`), `lib/contact/email.ts`, `lib/rate-limit.ts`. Install `resend`.
2. Contact page layout per `design.md` 7.6: details column (address, phones as tap-to-call, WhatsApp button, hours card with the open-now pill from `isOpenNow()`, "Get directions" link to a Google Maps search URL for the address) and the form column. Mobile shows details first.
3. Form behaviour exactly as in the guide: honeypot, 3-second timing check, best-effort rate limit, Zod validation with field errors, values repopulated after an error, disabled button while sending, unchecked required consent checkbox linking to `/privacy`, success panel, error panel with WhatsApp and Call links.
4. Add the `[REVIEW]` subject prefix in `buildEnquiryEmail` when `isReview()`.
5. Add `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` handling to `lib/env.ts` (required in live mode).
6. Vitest tests for the schema, `escapeHtml`, `toWhatsAppDigits`, the rate limiter and the subject prefix.

### Verify
- [ ] Guide Part 9 tests A to D pass (empty form, honeypot, instant submit, wrong key, double click, script injection, unticked consent).
- [ ] A submission from the review deployment reaches Emmanuel's inbox with `[REVIEW]` in the subject. Reply-To is the visitor's email.
- [ ] No secret appears in the client bundle (`grep` the build output for `re_`).

---

## Task 3.7: Testimonials and social links

### Agent Context
Testimonial rules: placeholders show in review mode with a visible "Placeholder" tag (dashed border) so the client understands the layout; in **live mode they never render and the build fails** if any remain (`testimonialPlaceholders` gate). With no real testimonials in live mode, the section is hidden. Social links come only from `FACEBOOK_URL`, `INSTAGRAM_URL` and `LINKEDIN_URL`.

### Prompt
1. `components/home/Testimonials.tsx` and `TestimonialCard` per `design.md` 6.4 with the placeholder variant. Logic: `visible = testimonials.filter(t => !t.isPlaceholder || isReview())`; render nothing if empty.
2. `lib/social.ts`: `getSocialLinks()` reading the three variables; a link is valid only when it is an `https://` URL on the matching host (`facebook.com`, `instagram.com`, `linkedin.com`) and contains none of `placeholder`, `example`, `your`. Return only valid links. Use it in the footer and the contact page.
3. Complete four audit rules in `scripts/audit.ts`: `modeMismatch` (on a Vercel production build, `SITE_MODE` must be set; `SITE_MODE=live` requires `SITE_URL` to be `https://kgiclsolar.com`; `SITE_MODE=review` must not use `https://kgiclsolar.com`; severity `error` in both modes), and the three below: `testimonialPlaceholders` (any `isPlaceholder: true` in `data/testimonials.ts`), `socialInvalid` (a variable that is set but invalid), and `missingEnv` (live mode: `SITE_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`).
4. Tests for `getSocialLinks()` (valid, blank, wrong host, placeholder text) and the audit rules.

### Verify
- [ ] Review mode shows three clearly tagged placeholder cards. Live mode (`SITE_MODE=live`) renders no testimonial section and `npm run audit` fails with `testimonialPlaceholders`.
- [ ] With no social variables set, no social icons appear. Setting `FACEBOOK_URL=https://facebook.com/example` shows none (placeholder text). A real-looking URL shows the icon.

---

## Task 3.8: Privacy notice

### Agent Context
Required content: PRD section 9.4 (Nigeria Data Protection Act 2023 and the 2025 directive). Two items are decided by the client later: the privacy contact and the retention period. Until then show visible markers `[To be confirmed by KGICL]` so nothing is invented. In live mode the audit flags these markers.

### Prompt
Build `app/privacy/page.tsx` in the prose style (`design.md` 6.4), 70-character line length, last-updated date at the top, with these headings: Who we are; What we collect and why; Lawful basis (consent through the form checkbox); Who handles the data (Resend for email delivery and Vercel for hosting, with servers outside Nigeria); How long we keep enquiries (`[To be confirmed by KGICL]`); Your rights (access, correction, deletion, withdraw consent, complain to the data protection regulator); Cookies (none for tracking; analytics is cookieless); Contact for privacy requests (`[To be confirmed by KGICL]`, with `info@kgiclsolar.com` once verified). Link it from the footer and the contact form.

### Verify
- [ ] All headings present. Nothing claims facts that were not provided.
- [ ] `npm run audit` in live mode lists the two markers.

---

## Task 3.9: 404, errors and LocalBusiness data

### Prompt
1. `app/not-found.tsx`: dark, faint ring at 10%, "Page not found", links to the four areas and WhatsApp. `app/error.tsx` with a friendly message and a retry button.
2. `localBusinessJsonLd()` in `lib/seo.ts` (name, address, phones, opening hours, url) used on Home and Contact. Opening hours use the `data/site.ts` values.

### Verify
- [ ] An unknown URL returns a real 404 with the branded page.
- [ ] JSON-LD validates in a structured data validator.

---

## Task 03 is done when

- [ ] Sub-tasks 3.1 to 3.9 are verified.
- [ ] Every page exists on `kriss-goodnews-solar.vercel.app`; the contact form delivers to Emmanuel's inbox.
- [ ] The Definition of Done in `00-shared-context.md` section 7 is met.
