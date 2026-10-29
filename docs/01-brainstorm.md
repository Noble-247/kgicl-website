# KGICL Goodnews Solar Website: Brainstorm

**Stage 1 of the workflow:** Brainstorm → Requirements → PRD.docx → design.md → task.md files
**Date:** 24 October 2026 · **Status:** decisions made, open questions listed in section 10

---

## 1. Project snapshot

| Item | Detail |
|---|---|
| Client | Kris Goodnews Int'l Co. Ltd (KGICL), Port Harcourt. Contact and final approver: Michael Chris, CEO |
| Product | A static catalogue and credibility website. **No e-commerce, no online payment, no database** |
| Domain | `kgiclsolar.com` (primary). `krisgoodnewssolar.com` redirects to it |
| Email | `info@` and `sales@kgiclsolar.com` (HostAfrica HMailPlus) |
| Hosting | Vercel (Pro account), DNS stays at HostAfrica |
| Images | Cloudinary, free account opened for this site |
| Stack (proposed) | Next.js 15 (static generation), TypeScript, Tailwind CSS v4 |
| Timeline | 30 days from payment and receipt of essential content |
| Already live | Coming-soon page (logo approved by the client) |
| Money | Year 1 ₦290,000. Part payment ₦150,000 received, ₦140,000 balance before go-live |

## 2. What the website must achieve

1. **Turn visitors into WhatsApp enquiries and calls.** This is the single most important result. Every product page, the header and the footer carry a WhatsApp action.
2. **Build trust** for a company that is sixty-odd products wide: real projects, real address, real hours, clear warranty terms.
3. **Let people find products** quickly: browse by category, filter street lights by wattage, search engines can land directly on a product ("100W solar street light Port Harcourt").
4. **Show the industrial side** (PPE, earthing, pipes, chains) without crowding the electrical and solar story.

Not goals: online sales, accounts, live stock or prices, blog.

## 3. Audience and what each wants

| Visitor | Wants | Needs from the site |
|---|---|---|
| Estate managers, churches, communities | Solar street lights that work | Model, wattage, backup hours, proof of past installs, a quick quote |
| Homes and shops | Cables, switches, breakers, UPS, CCTV | Clear category, "Enquire on WhatsApp" |
| Contractors and corporate buyers | Bulk supply, installation | Services list, projects, terms (75% advance, 25% on completion for corporate), contact |
| Oil and gas / industrial buyers | PPE, earthing, safety pipes, anchor chains | An "on request" page, quick enquiry |

## 4. Site map

| Page | Route | Notes |
|---|---|---|
| Home | `/` | Hero, four pillar tiles, featured products, projects teaser, why choose us, testimonials, contact strip |
| Solar Lighting | `/solar-lighting` | 17 street-light cards with wattage filter |
| CCTV & Security | `/cctv-security` | 10 products, 3 sub-groups |
| Electrical Supplies | `/electrical-supplies` | 15 products, 5 sub-groups |
| Industrial Supply (on request) | `/industrial-supply` | PPE, earthing, pipes and marine. Enquiry style |
| Product page | `/products/[slug]` | One per product, prefilled WhatsApp message |
| Services | `/services` | Main services, plus a secondary section for other services |
| Projects | `/projects` | 5 projects, one photo each, Lagos and Port Harcourt |
| About | `/about` | History, mission, vision, values, why choose us |
| Contact | `/contact` | Address, hours, phones, WhatsApp, map, short form |
| Privacy notice | `/privacy` | Required because the contact form collects personal data |
| 404 | n/a | Branded |

## 5. Catalogue structure (66 real products; the "EXAM Solar 100W" demo row is dropped)

| Pillar | Sub-groups | Items |
|---|---|---|
| **Solar Lighting** | Street lights by design: eye, bar, D-series, flagship. Filter by wattage (80W to 300W) | 17 |
| **CCTV & Security** | Cameras (dome, bullet, wireless) · Camera plus lighting (all-in-one, solar, dummy, smart indoor) · Recorders and accessories | 10 |
| **Electrical Supplies** | Cables & Wiring (3) · Switches, Sockets & Conduit (4) · Distribution & Protection (4) · Power Backup & Protection (2) · Lighting & Fans (2) | 15 |
| **Industrial Supply (on request)** | PPE & Safety (12) · Earthing & Lightning Protection (12) · Pipes & Marine (safety pipes and anchor chains, no product data yet) | 24+ |

Rules:
- One category per product. A product may be cross-linked elsewhere (the Solar CCTV + Floodlight unit lives in CCTV & Security, with a link from Solar Lighting).
- Two levels only (pillar → sub-group). Use filter chips, not deeper nesting.
- Product titles that say "All Sizes" or "All Wattage" are **families**: one product page with a size/spec table, not one page per size.

## 6. Product data model (typed data file, validated at build)

| Field | Notes |
|---|---|
| `slug`, `name`, `modelCode` | Slug is permanent and keyword-friendly |
| `pillar`, `group` | From section 5 |
| `summary`, `specs[]` | Key-value specs; "family" products get a size table |
| `images[]` | Cloudinary URLs |
| `photoStatus` | `real` · `stock` · `missing` |
| `claimsVerified` | `false` until you verify. Standards, voltage ratings and safety claims render only when `true` |
| `warrantyNote` | e.g. 1 year on solar lights |
| `featured`, `sortOrder` | Homepage and ordering |

No stock or price fields. Every product shows **"Enquire on WhatsApp"**.

## 7. Content inventory (what we have, what is missing)

| Item | Status |
|---|---|
| 66 products (5 Word tables) | Received. Names, categories and specs truncated in the source; to be flagged and completed |
| Product photos | Most have Cloudinary links. 6 CCTV items have none. Some are stock photos |
| 5 projects | Received, one photo each. Contact numbers in the source must never be published |
| 10 street-light site photos | Received. Some are stock. **Only genuine installs may carry a location label** |
| About text | Received. History: established 2005 (undocumented), limited company 14 January 2019, RC 1552853 |
| Mission, vision, values, hours, coverage, terms | Received (earlier form and message) |
| Industrial and other services content | Partial: safety pipes, anchor chains, civil and electrical installation |
| Testimonials | Not received. Placeholders until real ones arrive |
| Social links | Not created yet. Environment variables, hidden until real |
| Logo | Approved. Traced SVG and PNG set exists |
| Certificates | Not shown on the website (client decision) |

## 8. Technical approach

**Rendering and data.** Next.js static generation. Products live in a typed data file (TypeScript or JSON with Zod validation at build). Every product, category and project page is generated at build time. Updating a product means editing the data and redeploying, which matches the maintenance plan (₦5,000 per update request).

**Images.** Cloudinary free plan with `f_auto,q_auto` and width transformations, served through `next/image` with a remote pattern limited to this account. Free-plan bandwidth limits apply, so keep original files backed up outside Cloudinary and watch usage after launch.

**WhatsApp enquiries.** `https://wa.me/2348139027180?text=...` with the product name, model code and page URL in the message. Second number `0803 613 6883` for calls.

**Contact form.** A server action that stores nothing and emails the company. Options: (a) Resend on the verified domain (we control DNS), (b) SMTP through the company mailbox. Decide in Requirements. Add a honeypot and basic rate limiting, plus a consent line linking to the privacy notice.

**SEO.** Per-product metadata, a sitemap, canonical `https://kgiclsolar.com`, LocalBusiness structured data on Home and Contact, descriptive alt text. No price markup. Remove `noindex` from the coming-soon setup at launch.

**Analytics.** Vercel Web Analytics (cookieless, no consent banner) with custom events for WhatsApp, call and form clicks.

**Dynamic bits.**
- Years in business computed from 2019 (never hard-coded).
- Social links read from `FACEBOOK_URL`, `INSTAGRAM_URL`, `LINKEDIN_URL`. Read these in server components so they need no `NEXT_PUBLIC_` prefix. An icon renders only when the value is a real URL.
- Testimonials render placeholders only behind a flag.

**Pre-launch audit (build check on production).** Fails the build if: a testimonial placeholder is enabled, a social variable holds a placeholder or invalid value, or any product has `photoStatus: missing` while published. It reports `stock` photos and unverified claims as warnings so you can decide at launch.

## 9. Risks and what we do about them

| Risk | Response |
|---|---|
| Stock or missing photos at launch | `photoStatus` flag and audit report. Replace with real photos or hide the item before go-live |
| Stock photos labelled with real places | Rule: only real photos get location captions. Stock photos stay generic and out of the Projects section |
| Safety and standard claims (PPE, earthing) | `claimsVerified` flag, shown only once you verify against supplier datasheets |
| "Established 2005" is undocumented | Display as the client's statement and keep a verification flag. Ask the client for the 2005 registration document if one exists |
| Truncated product names and specs | Flag each during consolidation; complete from the client by WhatsApp |
| Client is non-technical and slow to reply | Timeline clock starts only on content. Content requests in short WhatsApp batches |
| Private phone numbers in project data | Strip at consolidation. They never enter the repo's published data |
| Cloudinary free-plan limits | Back up originals, monitor bandwidth, move to self-hosted images if limits bite |
| Hosting on a commercial site | Vercel Pro (already planned) |

## 10. Decisions so far

- Four pillars, PPE and earthing on the Industrial page.
- One card and one page per street-light model, with a wattage filter.
- A dedicated page per product, with a prefilled WhatsApp message.
- Stock badges dropped. "Enquire on WhatsApp" everywhere.
- "Established 2005, incorporated as a limited company in 2019". Years counted from 2019.
- No certificate information on the website. Brands shown as text, no logos.
- Primary domain `kgiclsolar.com`.
- Photo-status and claims-verified flags. Launch checks as in section 8.

## 11. Open questions for the Requirements stage

1. Contact form delivery: Resend on the domain, or company mailbox SMTP?
2. Industrial page: show all 24 items as cards with enquiry buttons, or group summaries only?
3. Product pages for Industrial items: same `/products/[slug]` pattern (recommended for consistency)?
4. Services page: confirm the service list and wording (solar consultation and installation, electrical installation and wiring, UPS supply, procurement and logistics, civil and electrical installation of all types).
5. Service coverage display: the nine states plus Lagos and Abuja, or a simple "nationwide delivery" line?
6. Product name standards for the truncated entries (agree a naming pattern, e.g. "100W Solar Street Light, 10-Eye").
7. Which brands to list as text, and where (footer strip or About page)?
8. Privacy notice wording (Nigeria Data Protection Act).
9. Homepage featured products: which six?

## 12. Next step

**Requirements document**, containing:
- The consolidated table of the 66 products with every gap flagged: truncated name, missing photo, stock photo, unverified claim.
- Page-by-page content requirements.
- Functional and non-functional requirements.
- Answers to section 11.

Then PRD.docx, design.md and the task.md files.
