<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>MINTLYNC TECHNOLOGIES</strong></p>
<p><strong>Product Requirements Document</strong></p>
<p>KGICL Goodnews Solar website</p></td>
</tr>
</tbody>
</table>

| **Item**              | **Detail**                                                                                                                                                                    |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Revision**          | Rev 1.1, draft for review. CCTV list updated: 63 products (Rev 1.0 had 66)                                                                                                    |
| **Date**              | 26 October 2026 (Rev 1.0: 24 October 2026)                                                                                                                                    |
| **Author**            | Emmanuel Ekpobimi, MintLync Technologies                                                                                                                                      |
| **Client**            | Kris Goodnews Int’l Co. Ltd (KGICL), Port Harcourt. Contact and approver: Michael Chris, CEO                                                                                  |
| **Workflow stage**    | PRD (Brainstorm → Requirements → PRD → design.md → task.md files)                                                                                                             |
| **Related documents** | 01-brainstorm.md · KGICL_Product_Catalogue_Consolidated.xlsx · resend-implementation-guide.md · domain-setup-guide.md · 00-coming-soon-page.md · Quotation MLT-KGICL-2026-001 |

**Contents**

- 1\. Overview

- 2\. Users and their tasks

- 3\. Scope

- 4\. Information architecture

- 5\. Functional requirements

- 6\. Catalogue and product data

- 7\. Featured products (easy to update)

- 8\. Content requirements and status

- 9\. Non-functional requirements

- 10\. Technical architecture

- 11\. Launch gates (pre-launch audit)

- 12\. Delivery plan and task files

- 13\. Risks

- 14\. Open items

- 15\. Decisions log

- Appendix A. Product catalogue summary

- Appendix B. Approved copy and company facts

1\. Overview

1.1 Purpose

This document defines what will be built for the KGICL Goodnews Solar website: the pages, features, data, content, quality targets and launch rules. It is the single reference for design.md and the task.md files that follow. The Requirements stage of the workflow is captured here (sections 5 to 9) and in the consolidated product workbook, so no separate requirements document is needed.

1.2 Background

Kris Goodnews Int’l Co. Ltd (KGICL) is a 100% Nigerian-owned company in Port Harcourt that sells and installs solar lighting, electrical materials, CCTV and industrial supplies. It was registered with the Corporate Affairs Commission on 26 August 2005 as an Enterprise and became a limited liability company on 14 January 2019 (RC 1552853). The shop is at No. 7 Ada George Road. The company has no website. A coming-soon page is live on kgiclsolar.com, and the domains and business email have been bought.

1.3 Product summary

A fast, mobile-first catalogue website with a page for every product. Visitors browse four product areas, read specifications, and contact the company on WhatsApp, by phone, or through a short form. It has no online shop, no prices, no stock status and no database. Content lives in typed data files in the repository.

1.4 Goals

| **ID** | **Goal**                                        | **How we will know**                                                                                                                                                             |
|--------|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| G1     | Turn visitors into WhatsApp enquiries and calls | Every product page carries a prefilled WhatsApp action. Clicks on WhatsApp, call and the form are tracked as events. A target is set with the client after 30 days of real data. |
| G2     | Build trust                                     | Real project photos, address, opening hours, warranty terms and company history are visible within two clicks from any page.                                                     |
| G3     | Be found                                        | All 63 products get their own indexable page. Local search terms are used in titles and descriptions. SEO audit score of 95 or more after the noindex is removed at launch.      |
| G4     | Easy to maintain                                | Adding or changing a product, a project or the featured products means editing one data file and deploying. A written procedure exists.                                          |
| G5     | Launch safely                                   | An automated pre-launch audit blocks the production build if placeholders, stock or missing photos, or unverified claims remain.                                                 |

1.5 Non-goals

- Online shopping, payments, prices or stock status

- Customer accounts, a database or an admin panel (the client does not edit content himself)

- Blog, news, live chat or additional languages

- Certificates or professional credentials on the site (client decision)

- Brand logos (brand names are omitted for now)

- Tracking cookies or a cookie banner

1.6 Constraints and assumptions

| **Item**                  | **Detail**                                                                                                              |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------|
| **Timeline**              | 30 days from payment and receipt of essential content                                                                   |
| **Budget**                | Year 1 total ₦290,000 (₦150,000 received, ₦140,000 balance before go-live)                                              |
| **Team**                  | One developer (Emmanuel). Development in Antigravity or Kiro with a Sonnet copilot, from task.md files                  |
| **Client**                | Non-technical, slow to reply. Cannot use spreadsheets or Word. Communicates by WhatsApp and screenshots                 |
| **Hosting**               | Vercel Pro. DNS stays at HostAfrica. Images on a free Cloudinary account                                                |
| **Email sending**         | Resend free plan: 3,000 emails a month, 100 a day                                                                       |
| **Audience**              | Mostly Nigerian visitors on mobile phones with variable network quality                                                 |
| **Content still to come** | More products (including the CCTV hard disk, power supply kit and smart indoor camera), testimonials, social page links |

2\. Users and Their Tasks

| **Visitor**                            | **Wants**                                     | **What the site must give them**                                      |
|----------------------------------------|-----------------------------------------------|-----------------------------------------------------------------------|
| Estate managers, churches, communities | Solar street lights that work and last        | Model, wattage, backup hours, past installs, a fast quote by WhatsApp |
| Homes and shops                        | Cables, switches, breakers, UPS, lights, CCTV | Clear categories, simple specs, “Enquire on WhatsApp”                 |
| Contractors and corporate buyers       | Supply and installation, reliable terms       | Services, projects, warranty and payment terms, contact details       |
| Oil and gas and industrial buyers      | PPE, earthing, safety pipes, anchor chains    | An on-request page and a quick way to enquire                         |

3\. Scope

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 34%" />
<col style="width: 32%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>In scope at launch</strong></th>
<th><strong>Out of scope</strong></th>
<th><strong>Possible later phases</strong></th>
</tr>
<tr class="odd">
<th><p>Home, four product areas, product pages (63), Services, Projects, About, Contact, Privacy notice, 404</p>
<p>Contact form with email delivery (Resend)</p>
<p>WhatsApp and call actions everywhere</p>
<p>Featured products, testimonials and social links with launch gates</p>
<p>Local SEO, sitemap, analytics, pre-launch audit</p></th>
<th><p>Prices, cart, payments, stock status</p>
<p>Accounts, database, admin panel</p>
<p>Blog, live chat, extra languages</p>
<p>Certificate display, brand logos</p>
<p>Facebook, Instagram and Google Business Profile creation (quoted separately)</p></th>
<th><p>Quote list for industrial items (select several, send one WhatsApp message)</p>
<p>Self-service content editing (CMS)</p>
<p>Google reviews on the site</p>
<p>Brand names or logos once dealer status is confirmed</p>
<p>Blog or buying guides for search traffic</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

4\. Information Architecture

4.1 Site map

| **Page**            | **Route**            | **Contents**                                                                                                                                   |
|---------------------|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| Home                | /                    | Hero, four product-area tiles, six featured products, why choose us, projects teaser, testimonials (if real), services snapshot, contact strip |
| Solar Lighting      | /solar-lighting      | 17 street lights with a wattage filter                                                                                                         |
| CCTV & Security     | /cctv-security       | Cameras, Camera + Lighting, Recorders & Accessories                                                                                            |
| Electrical Supplies | /electrical-supplies | Cables & Wiring, Switches, Sockets & Conduit, Distribution & Protection, Power Backup & Protection, Lighting & Fans                            |
| Industrial Supply   | /industrial-supply   | PPE & Safety (12), Earthing & Lightning Protection (12), Pipes & Marine (safety pipes, anchor chains)                                          |
| Product page        | /products/\[slug\]   | One page per product                                                                                                                           |
| Services            | /services            | Service list, terms (warranty, consultation, payment), other services                                                                          |
| Projects            | /projects            | Five completed projects, one photo each                                                                                                        |
| About               | /about               | Company history, mission, vision, values, why choose us                                                                                        |
| Contact             | /contact             | Address, hours, phones, WhatsApp, directions link, contact form                                                                                |
| Privacy notice      | /privacy             | Privacy notice under the Nigeria Data Protection Act                                                                                           |
| 404                 | n/a                  | Branded not-found page                                                                                                                         |

4.2 Navigation

- Primary: Solar Lighting, CCTV & Security, Electrical Supplies, Industrial Supply, Services, Projects, About, Contact. A WhatsApp button sits in the header.

- Mobile: menu button plus a sticky bottom bar with WhatsApp and Call.

- Footer: company details, quick links, social icons (only when real), privacy notice link.

- Breadcrumbs on product and listing pages.

4.3 URL rules

- Lowercase kebab-case. No trailing slash.

- Product slugs come from the product name and are permanent once published, so links and search results never break.

- Canonical host is https://kgiclsolar.com. www and krisgoodnewssolar.com redirect to it (set in Vercel, not in code).

5\. Functional Requirements

5.1 Global shell

| **ID** | **Requirement**                                                                                                                                                                   | **Acceptance**                                                          |
|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| FR-01  | Header with logo, primary navigation and a WhatsApp button. Sticky on scroll.                                                                                                     | Works at 320 px width and by keyboard. Logo is the approved white mark. |
| FR-02  | On phones, a sticky bottom bar with WhatsApp and Call buttons.                                                                                                                    | Never covers form fields or the footer. Targets are at least 48 px.     |
| FR-03  | Floating WhatsApp button on desktop. The prefilled message names the page (and the product on product pages).                                                                     | Opens wa.me/2348139027180 with encoded text.                            |
| FR-04  | Footer with registered name KRIS GOODNEWS INT’L CO. LTD, address, hours, phones, “Nationwide delivery”, privacy link, current year. Email is added once the mailbox is confirmed. | All details match Appendix B exactly.                                   |
| FR-05  | Branded 404 page with links to the four product areas and WhatsApp.                                                                                                               | Returns a real 404 status.                                              |
| FR-06  | SEO shell: per-page title and description, canonical URL, Open Graph and Twitter tags, sitemap and robots.                                                                        | Sitemap lists every published page. Robots allow crawling at launch.    |

5.2 Home

| **ID** | **Requirement**                                                                                                                                         | **Acceptance**                                                                   |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| FR-10  | Hero with a clear headline, one supporting line, and two actions: Chat on WhatsApp and Browse products.                                                 | Above the fold on a 360 × 640 phone.                                             |
| FR-11  | Four tiles for Solar Lighting, CCTV & Security, Electrical Supplies and Industrial Supply, each with an image and a one-line description.               | Each tile links to its page.                                                     |
| FR-12  | Featured products: six cards read from the single featured-products file (section 7).                                                                   | Order follows the file. Build fails with a plain message if an entry is invalid. |
| FR-13  | Why choose us: original products with warranty, local speed, 24/7 WhatsApp support, trusted by estates, churches, businesses and oil and gas companies. | Wording from Appendix B, with the history line matching the confirmed dates.     |
| FR-14  | Projects teaser (three projects) with a link to the Projects page.                                                                                      | Only real photos. No stock images.                                               |
| FR-15  | Testimonials section, shown only when real testimonials exist.                                                                                          | Hidden in production if none are real (FR-36).                                   |
| FR-16  | Years-in-business statistic calculated from 26 August 2005 (21 at launch).                                                                              | Correct after the anniversary without a manual deploy (section 10.4).            |

5.3 Catalogue and products

| **ID** | **Requirement**                                                                                                                                                                                                                             | **Acceptance**                                                       |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|
| FR-20  | Product-area pages list products by group, with a short intro and group headings.                                                                                                                                                           | Lists only published products.                                       |
| FR-21  | Solar Lighting wattage filter: All, 80, 100, 120, 150, 180, 200, 300 W. Client-side, with the choice kept in the URL (?watt=120).                                                                                                           | Link shared with a filter opens filtered. Count shown.               |
| FR-22  | Product card: photo (fixed aspect ratio), name, one key line, “Enquire” button. Family products show their range (for example “1 mm to 16 mm”).                                                                                             | No price, no stock badge.                                            |
| FR-23  | Product page: breadcrumbs, name, model code, photo, summary, specification table, variant table for families, warranty note where applicable, WhatsApp and Call actions, link to the form prefilled with the product, and related products. | WhatsApp message contains name, model code and page URL.             |
| FR-24  | Specification lines marked unverified are never rendered. Safety and standard claims appear only when verified.                                                                                                                             | Audit lists every hidden line.                                       |
| FR-25  | Each product has a published flag. Unpublished products are excluded from listings, static pages and the sitemap.                                                                                                                           | A product without a photo stays unpublished until its photo arrives. |
| FR-26  | Industrial Supply page: all items shown as compact cards grouped under PPE & Safety, Earthing & Lightning Protection and Pipes & Marine, each with an Enquire button.                                                                       | Uses the same product pages as every other item.                     |
| FR-27  | Product structured data (JSON-LD) without price or availability.                                                                                                                                                                            | Passes a structured-data validator.                                  |

5.4 Company pages

| **ID** | **Requirement**                                                                                                                                                                                                                                           | **Acceptance**                                                                                |
|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| FR-30  | Services page: solar consultation and installation, electrical installation and wiring, UPS supply, procurement and logistics, civil and electrical installation of all types. Secondary section for other services. Terms block (section 8, Appendix B). | Wording matches Appendix B.                                                                   |
| FR-31  | Projects page: five projects, each with title, location, type of work, short description and one real photo. No private phone numbers. Names of clients only where the client approved.                                                                   | No stock photos on this page.                                                                 |
| FR-32  | About page: history text, years statistic, mission, vision, values, why choose us.                                                                                                                                                                        | Text from Appendix B. “renewable” spelled in full.                                            |
| FR-33  | Contact page: address, hours, phones, WhatsApp, a “Get directions” link to Google Maps, and the contact form.                                                                                                                                             | No third-party embeds that add cookies or scripts.                                            |
| FR-34  | Contact form sends an email through Resend (implementation guide).                                                                                                                                                                                        | Honeypot, timing check, rate limit, consent checkbox, WhatsApp and call fallback on failure.  |
| FR-35  | Privacy notice page under the Nigeria Data Protection Act, linked from the footer and the form.                                                                                                                                                           | Contains the items listed in section 9.4.                                                     |
| FR-36  | Testimonials component driven by a data file. Entries carry an isPlaceholder flag.                                                                                                                                                                        | Placeholders never render in production. A production build fails if any placeholder remains. |
| FR-37  | Social icons read FACEBOOK_URL, INSTAGRAM_URL, LINKEDIN_URL on the server and render only when the value is a valid URL on the right domain.                                                                                                              | Blank means hidden. A set but invalid value fails the production build.                       |

6\. Catalogue and Product Data

6.1 Structure (63 products)

| **Product area**               | **Groups**                                                                                                                                  | **Products** |
|--------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| Solar Lighting                 | Street Lights (designs: Eye, Bar, D-Series, Flagship; 80 W to 300 W)                                                                        | 17           |
| CCTV & Security                | Cameras (2) · Camera + Lighting (4) · Recorders & Accessories (1)                                                                           | 7            |
| Electrical Supplies            | Cables & Wiring (3) · Switches, Sockets & Conduit (4) · Distribution & Protection (4) · Power Backup & Protection (2) · Lighting & Fans (2) | 15           |
| Industrial Supply (on request) | PPE & Safety (12) · Earthing & Lightning Protection (12) · Pipes & Marine (no product data yet)                                             | 24           |
| **Total**                      |                                                                                                                                             | **63**       |

A product belongs to one group. Cross-links are allowed (the Solar CCTV + Floodlight unit sits in CCTV & Security and is linked from Solar Lighting). Two levels only: area, then group.

6.2 Naming pattern

**\[Key rating\] \[Product type\], \[Variant\]**, for example “120W Solar Street Light, 12-Eye”.

- Lead with the defining rating (W, MP, mm², kVA) when the product is sold by rating.

- Plain product words, singular, Title Case. “12-Eye”, “6-Bar”, “D-Series”, not “12-eye” or “6-BAR”.

- Variants after a comma. Never “All Sizes” or “All Types” in a name (sizes go in the variant table).

- Model code is its own field (KG-SL-120W). Keep names under about 60 characters.

- No marketing words. No voltage rating or standard in a name unless verified.

- Slug = kebab-case of the name, permanent after publishing.

6.3 Product data model

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>type Product = {</p>
<p>slug: string; // permanent, e.g. "120w-solar-street-light-12-eye"</p>
<p>name: string; // naming pattern above</p>
<p>modelCode?: string; // e.g. "KG-SL-120W"</p>
<p>area: "solar-lighting" | "cctv-security" | "electrical-supplies" | "industrial-supply";</p>
<p>group: string; // e.g. "street-lights"</p>
<p>summary: string; // one plain sentence</p>
<p>specs: { label: string; value: string; verified: boolean }[];</p>
<p>variants?: { label: string; values: string[] }[]; // families: sizes, wattages, gangs</p>
<p>wattage?: number; // street lights, for the filter</p>
<p>warranty?: string; // e.g. "1 year" (solar lights only)</p>
<p>image: { publicId: string; alt: string; status: "real" | "stock" | "unverified" | "missing" };</p>
<p>published: boolean; // false = hidden everywhere</p>
<p>related?: string[]; // slugs</p>
<p>};</p></td>
</tr>
</tbody>
</table>

Data lives in typed files and is validated with Zod during the build. A bad slug, a duplicate, a missing field or an unknown group stops the build with a plain-language message.

6.4 Product families

Some source entries are families, not single products: PVC Single-Core Copper Wire (1 mm to 16 mm), LED Bulb (3 W to 50 W), Wall Switch and Socket (1 to 4 gang), Flexible Cable, and many CCTV, earthing and PPE items. A family gets one page with a variant table, and its card shows the range, not a single specification.

6.5 Photo and claims status

| **Value**            | **Meaning**                                                                                  | **Launch rule**                                                                                                                                              |
|----------------------|----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Photo: real          | Client confirmed it is his own photo of the product                                          | Allowed                                                                                                                                                      |
| Photo: stock         | Stock image, not the company’s own photo                                                     | Allowed while building only. Before go-live Emmanuel replaces it with a real photo or unpublishes the product. Never on Projects or street-light site photos |
| Photo: unverified    | A photo link exists but nobody has confirmed whether it is real or stock (57 products today) | Emmanuel classifies it as real or stock before launch                                                                                                        |
| Photo: missing       | No photo yet                                                                                 | Product must be unpublished (none today)                                                                                                                     |
| Spec verified: true  | Checked by Emmanuel or confirmed by the client                                               | Shown                                                                                                                                                        |
| Spec verified: false | Not checked yet                                                                              | Hidden (section 5.3, FR-24). Voltage ratings are confirmed by the client; standards and other safety claims still need checking                              |

6.6 Source data and known issues

Source: five Word tables built from screenshots the client sent, with Cloudinary photo links. They are consolidated in **KGICL_Product_Catalogue_Consolidated.xlsx**, which flags every gap. Summary of issues:

- **11 product names are cut off** in the source (2 CCTV, 5 earthing, 4 PPE). The workbook gives a draft name; the client must confirm. Slugs for these are provisional.

- **Many detail cells are cut off** (rough automatic count: 24). Verify against the supplier datasheet before publishing.

- **The CCTV list was updated on 26 October.** It now has seven products, all with photo links. The hard disk, the power supply and cable kit, and the smart indoor camera are not listed because the client does not have them yet. They can be added later as content updates.

- **57 products have a photo link** whose source (real or stock) is not yet classified. They start as “unverified”.

- **One demo row removed** (“EXAM Solar 100W”, KG-SL-100-AC).

- **Ignored columns:** Stock (not requested). “In Stock” is not shown anywhere.

- **Inconsistency:** “MCB Breakers Single Pole” lists 1P, 2P and 3P. One typo fixed (“Warniing”).

- **Photo links contain a version number** that changes when an image is re-uploaded. Store the Cloudinary public ID instead (6.7).

6.7 Image delivery

- Store only the Cloudinary public ID, never the full URL or version. Example: 5-120W_12-eye.

- Build URLs in one function: https://res.cloudinary.com/\<cloud-name\>/image/upload/f_auto,q_auto,w\_\<width\>/\<publicId\>. The cloud name comes from NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (not a secret).

- Use next/image with a custom loader that returns the Cloudinary URL, so Cloudinary does the resizing and Vercel image optimisation is not also used.

- Always set width, height and meaningful alt text. First image on a page is eager and high priority; all others lazy.

- Keep original files backed up outside Cloudinary and watch free-plan usage after launch.

7\. Featured Products (easy to update)

**Requirement:** the client may want to swap a featured product during a content update. The change must be a one-line edit to a single file, with no other file touched and no risk of a half-finished swap.

7.1 Design

One ordered list of product slugs is the only source of truth. Products do not carry a “featured” flag, so there is never a second place to forget.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>// data/featured.ts: controls the six products on the homepage.</p>
<p>// To swap one, replace its slug with the slug of another product. Save, commit, deploy.</p>
<p>export const HOME_FEATURED = [</p>
<p>"120w-solar-street-light-12-eye",</p>
<p>"150w-solar-street-light-6-bar",</p>
<p>"200w-solar-street-light-16-eye",</p>
<p>"wall-switch-and-socket",</p>
<p>"pvc-single-core-copper-wire",</p>
<p>"led-bulb",</p>
<p>] as const;</p>
<p>export const FEATURED_COUNT = 6; // change here if the design ever shows more or fewer</p></td>
</tr>
</tbody>
</table>

7.2 Build-time checks

| **Check**                   | **Plain-language error**                                                        |
|-----------------------------|---------------------------------------------------------------------------------|
| Count equals FEATURED_COUNT | Featured list has 5 products; it must have 6. Edit data/featured.ts.            |
| No duplicates               | "led-bulb" is featured twice.                                                   |
| Slug exists                 | Featured product "xyz" was not found. Check the spelling against data/products. |
| Product is published        | Featured product "xyz" is unpublished.                                          |
| Photo is not missing        | Featured product "xyz" has no photo yet.                                        |

7.3 How to swap (maintenance procedure)

1\. Client sends the name of the new product (WhatsApp is fine).

2\. Find its slug in the product data (or the workbook).

3\. Confirm it is published, has a real photo and verified specs.

4\. Replace one slug in data/featured.ts, commit, and let Vercel deploy. Check the homepage.

5\. The removed product keeps its page and stays in its category.

The change is charged as a content update (₦5,000 a request) and takes minutes.

7.4 Card rules

- Family products show the range (“Available in 1 mm to 16 mm”), not one spec.

- Cards never show price or stock.

- Order on the page follows the order in the file.

- The same file pattern can later feed featured rows on the area pages (for example FEATURED_SOLAR) without changing the model.

7.5 Current six (confirmed by the client)

| **\#** | **Product**                                      | **Slug**                       | **Photo** |
|--------|--------------------------------------------------|--------------------------------|-----------|
| 1      | 120W Solar Street Light, 12-Eye (KG-SL-120W)     | 120w-solar-street-light-12-eye | Real      |
| 2      | 150W Solar Street Light, 6-Bar (KG-SL-150W-6BAR) | 150w-solar-street-light-6-bar  | Real      |
| 3      | 200W Solar Street Light, 16-Eye (KG-SL-200W)     | 200w-solar-street-light-16-eye | Real      |
| 4      | Wall Switch and Socket                           | wall-switch-and-socket         | Real      |
| 5      | PVC Single-Core Copper Wire                      | pvc-single-core-copper-wire    | Real      |
| 6      | LED Bulb                                         | led-bulb                       | Real      |

8\. Content Requirements and Status

| **Item**                                                     | **Status**                                                                                             | **Owner**         | **Needed by**                                |
|--------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|-------------------|----------------------------------------------|
| 63 products (names, details, photos)                         | Received. 11 names cut off, details to check, all photos linked (57 still to be classed real or stock) | Client / Emmanuel | Before launch                                |
| Remaining products                                           | To come later; added as content updates                                                                | Client            | After launch is fine                         |
| 5 projects, one photo each                                   | Received. Photos must be real                                                                          | Client            | Before launch                                |
| 10 street-light site photos                                  | Received. Some are stock. Only real photos may carry a location                                        | Client            | Before launch                                |
| About text, mission, vision, values                          | Received and confirmed (Appendix B)                                                                    | Done              | n/a                                          |
| Terms to show (warranty, consultation, payment)              | Received (Appendix B)                                                                                  | Done              | n/a                                          |
| Services list                                                | Confirmed                                                                                              | Done              | n/a                                          |
| Testimonials (2 promised)                                    | Not received. Placeholders in development only                                                         | Client            | Before launch, or launch without the section |
| Social page links                                            | Pages not created yet. Environment variables stay blank until real                                     | Client / Emmanuel | Before launch, or hidden                     |
| Privacy notice decisions (privacy contact, retention period) | Open                                                                                                   | Client            | Before launch                                |
| Business email mailbox and email address in footer           | Mailbox to be confirmed live                                                                           | Emmanuel          | Before launch                                |
| Certificates                                                 | Not displayed (client decision)                                                                        | n/a               | n/a                                          |

9\. Non-Functional Requirements

9.1 Performance

- Measured on a mid-range Android phone over throttled “Fast 4G”: LCP 2.5 s or better, CLS 0.1 or less, INP 200 ms or less. Lighthouse mobile performance 90 or more.

- All pages are statically generated. No third-party scripts except Vercel Web Analytics. Fonts self-hosted, Latin subset only.

- Images served by Cloudinary at the width needed (6.7). Target first-load JavaScript under about 150 KB gzipped per page (confirm with the build report).

9.2 Accessibility

- WCAG 2.2 AA. Visible focus on every interactive element. Full keyboard use. Meaningful alt text. One H1 per page.

- Colour contrast: white on red \#E30613 is 4.88:1 (buttons only). Red on black is 4.05:1, so use red for large text and graphics only; small red text uses the lighter red from the coming-soon page tokens.

- Respect reduced-motion. Touch targets at least 48 px. Forms have labels and announced errors.

9.3 SEO

- Title pattern: “{Product name} \| KGICL Goodnews Solar, Port Harcourt”. Unique descriptions on every page.

- LocalBusiness structured data (address, hours, phones) on Home and Contact. Product structured data without offers.

- Sitemap, canonical URLs, clean slugs, alt text. Remove noindex at launch. Add the domain to Google Search Console after launch.

- Google Business Profile is a separate task (quoted separately).

9.4 Privacy (Nigeria Data Protection Act 2023 and the 2025 directive)

The contact form collects names, phone numbers, emails, locations and messages, so a privacy notice is required, reachable from every page including the home page. It must contain:

- Who the company is, its address, and a privacy contact (client to name one).

- What is collected, and why (to reply to enquiries).

- The lawful basis: consent through the unticked checkbox on the form.

- Who else handles the data: the email service (Resend) and hosting (Vercel), with servers outside Nigeria.

- How long enquiries are kept (client to decide, for example 12 months).

- The visitor’s rights to access, correct and delete their data, to withdraw consent, and to complain to the data protection regulator, with an email address for requests.

- A statement that the site uses no tracking cookies (analytics is cookieless).

- Last-updated date.

The client should confirm any registration or officer obligations with a data-protection compliance organisation. This is not legal advice.

9.5 Security

- Secrets only in Vercel environment variables. No NEXT_PUBLIC prefix on secrets. API key restricted to sending.

- Security headers on every response: nosniff, strict referrer policy, frame protection, a Content Security Policy that allows only this site, Cloudinary images and Vercel Analytics.

- Form protection: honeypot, timing check, rate limit, Vercel Firewall rule, input validation and escaping in the email.

- Dependencies pinned and updated; no unused packages.

9.6 Reliability and maintainability

- Static pages keep working if email or Cloudinary has a problem. Email failure shows WhatsApp and call fallbacks and logs the error.

- README documents the procedures: add a product, change a spec, swap a featured product, add a project, replace a photo, rotate the email key.

- Typed data, build-time validation and the pre-launch audit prevent most content mistakes from reaching production.

9.7 Browser and device support

Latest two versions of Chrome, Safari (iOS), Firefox, Edge and Samsung Internet. Designed mobile first from 320 px. Desktop up to 1920 px.

10\. Technical Architecture

10.1 Stack

| **Layer**  | **Choice**                                                                                 |
|------------|--------------------------------------------------------------------------------------------|
| Framework  | Next.js 15 (App Router), React 19, TypeScript, static generation with generateStaticParams |
| Styling    | Tailwind CSS v4, design tokens from design.md                                              |
| Validation | Zod for product data and the contact form                                                  |
| Email      | Resend, Node SDK, Server Action (see implementation guide)                                 |
| Images     | Cloudinary free account via a custom next/image loader                                     |
| Hosting    | Vercel Pro. Domain kgiclsolar.com, DNS at HostAfrica                                       |
| Analytics  | Vercel Web Analytics (cookieless) with custom events                                       |
| Fonts      | Cormorant Garamond (headlines) and Manrope (body), self-hosted, as on the coming-soon page |

10.2 Repository layout

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>app/ routes: /, /solar-lighting, /cctv-security, /electrical-supplies,</p>
<p>/industrial-supply, /products/[slug], /services, /projects,</p>
<p>/about, /contact (+ actions.ts), /privacy, not-found</p>
<p>components/ header, footer, cards, filters, forms, whatsapp, testimonials</p>
<p>data/ products/, featured.ts, projects.ts, testimonials.ts, site.ts</p>
<p>lib/ cloudinary.ts, whatsapp.ts, years.ts, schemas/, contact/, rate-limit.ts</p>
<p>scripts/ audit.ts (pre-launch audit), import-products.ts</p>
<p>docs/ README procedures, source workbook</p></td>
</tr>
</tbody>
</table>

10.3 Environment variables

| **Name**                                  | **Purpose**            | **Notes**                                                                          |
|-------------------------------------------|------------------------|------------------------------------------------------------------------------------|
| RESEND_API_KEY                            | Send the contact email | Sensitive. Production and dev keys differ                                          |
| CONTACT_FROM_EMAIL                        | Sender address         | KGICL Website \<website@notify.kgiclsolar.com\>                                    |
| CONTACT_TO_EMAIL                          | Receiver               | info@kgiclsolar.com in Production, your address in Preview                         |
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME         | Image URLs             | Public, not secret                                                                 |
| FACEBOOK_URL, INSTAGRAM_URL, LINKEDIN_URL | Social links           | Read on the server. Blank hides the icon. Invalid value fails the production build |

10.4 Years-in-business figure

Calculate from the date 26 August 2005 (completed years, not year subtraction). Because the pages are static, the figure would freeze at build time, so the pages that show it use revalidation of at most one day (Next.js ISR), or a very small client component. It must read 21 at launch and 22 on 26 August 2027 without a manual deploy.

10.5 Analytics events

| **Event**                               | **Properties**                                                  |
|-----------------------------------------|-----------------------------------------------------------------|
| whatsapp_click                          | page type, product slug (if any), location of the button        |
| call_click                              | page type, location of the button                               |
| form_submit_success / form_submit_error | source page, product slug (if any). Never the visitor’s details |

Custom events need a paid Vercel analytics plan. Confirm the plan covers them before building.

11\. Launch Gates (Pre-Launch Audit)

A script (scripts/audit.ts) runs before every production build. Rules marked “Fail” stop the build.

| **Check**                                                                         | **Result** | **Note**                                                          |
|-----------------------------------------------------------------------------------|------------|-------------------------------------------------------------------|
| Any testimonial with isPlaceholder true                                           | Fail       | To launch without testimonials, empty the list. The section hides |
| A social variable set but not a valid URL for that site                           | Fail       | Blank is fine (icon hidden)                                       |
| Published product whose photo status is not “real” (stock, unverified or missing) | Fail       | Replace with a real photo or unpublish the product                |
| Published product with a provisional slug (name not confirmed)                    | Fail       | Confirm the full name first                                       |
| Featured list invalid (section 7.2)                                               | Fail       | Plain-language error                                              |
| Placeholder text in data (“Customer Name”, “lorem”, “EXAM”)                       | Fail       |                                                                   |
| A private-looking phone number in project or testimonial data                     | Fail       | Only the company numbers are allowed                              |
| Image without alt text                                                            | Fail       |                                                                   |
| Production environment variable missing                                           | Fail       | Email keys and addresses                                          |
| Hidden specs (verified false)                                                     | Warn       | List so they can be verified                                      |

Manual checks before go-live

- Redirect and HTTPS tests from the domain guide pass for all four hostnames.

- Contact form test from the production URL arrives in info@ (not spam). Failure path shows the fallback.

- Lighthouse mobile run on Home, a product page and Contact.

- noindex removed; sitemap reachable; coming-soon page retired.

- Privacy notice reviewed with the client. Cloudinary originals backed up.

- Client has reviewed the site on a preview link and approved.

12\. Delivery Plan and Task Files

Task files follow the standard format: Agent Context, Prompt, Verify for each task, written for Antigravity or Kiro with a Sonnet copilot. design.md comes first so the UI tokens and components exist before the setup task.

| **Task file**        | **Covers**                                                                                                                                                                           | **Indicative effort** |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| 01-setup             | Project, Tailwind v4 tokens, fonts, layout shell (header, footer, WhatsApp button, mobile bar), site config, env handling, Vercel project and preview                                | 2 to 3 days           |
| 02-catalogue-core    | Data model and Zod, import from the consolidated workbook, Cloudinary loader, area and group pages, product pages, wattage filter, featured config and checks, SEO, JSON-LD, sitemap | 6 to 8 days           |
| 03-pages-and-forms   | Home, Industrial Supply, Services, Projects, About with the years figure, Contact with the Resend form, Privacy notice, testimonials, social links                                   | 6 to 8 days           |
| 04-polish-and-launch | Accessibility, performance, audit script, analytics events, client review, content completion, DNS cutover, noindex removal, README and handover                                     | 5 to 7 days           |

Roughly 19 to 26 working days of effort, inside the 30-day window if essential content arrives on time. Day 0 is the day both sides agree the essential content is complete. A pre-task (outside the code) is the Resend account and DNS records, which can start now.

13\. Risks

| **Risk**                                   | **Impact** | **Response**                                                                                                              |
|--------------------------------------------|------------|---------------------------------------------------------------------------------------------------------------------------|
| Client is slow to reply on content         | High       | Short WhatsApp batches. Timeline clock starts when content is complete. Launch without optional sections rather than wait |
| Stock or missing photos at launch          | High       | Status flags and audit. Unpublish items. Stock never on Projects or site photos                                           |
| Unverified safety claims (PPE, earthing)   | High       | Hidden until verified. Voltage ratings confirmed by the client; check standards against datasheets                        |
| Cut-off names and details in the source    | Medium     | Workbook flags them. Client confirms the 11 names. Items stay unpublished or provisional until done                       |
| “24/7 WhatsApp support” vs closed Sundays  | Medium     | Client confirms what he can honour before the claim is published                                                          |
| Cloudinary free-plan limits                | Medium     | Public IDs only, originals backed up, usage watched                                                                       |
| Spam burning the 100-a-day email cap       | Medium     | Layered protection and a visible WhatsApp fallback                                                                        |
| Static site and a years figure going stale | Low        | Revalidation (10.4)                                                                                                       |

14\. Open Items

| **\#** | **Item**                                                                                                                                               | **Owner**         | **Blocks**                  |
|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|-----------------------------|
| 1      | Photos for the CCTV hard disk, power supply kit and smart indoor camera (client does not have them yet)                                                | Client            | Adding those products later |
| 2      | Classify the 57 unverified photos and the 10 street-light site photos as real or stock; collect real photos for every stock one, or unpublish the item | Emmanuel / Client | Launch                      |
| 3      | Confirm the 11 cut-off names and complete the cut-off details                                                                                          | Client            | Publishing those items      |
| 4      | Verify standards and other safety claims for earthing and PPE                                                                                          | Emmanuel          | Showing those specs         |
| 5      | Two testimonials with names, roles and permission                                                                                                      | Client            | Testimonials section        |
| 6      | Facebook, Instagram, LinkedIn pages (separate quote) and the links                                                                                     | Client / Emmanuel | Social icons                |
| 7      | Privacy contact and retention period                                                                                                                   | Client            | Privacy notice              |
| 8      | Confirm “24/7 WhatsApp support” wording; update “registered since 2018” to 2005                                                                        | Client / Emmanuel | Why-choose-us text          |
| 9      | Resend account, DNS records and info@ mailbox                                                                                                          | Emmanuel          | Contact form                |
| 10     | Domain registrant contact change to the company, and Vercel DNS records                                                                                | Emmanuel          | Launch                      |
| 11     | Optional: quote list for industrial items                                                                                                              | Emmanuel / Client | Nothing                     |
| 12     | Remaining products and the Pipes & Marine items                                                                                                        | Client            | After launch                |

15\. Decisions Log

- Four product areas. PPE and earthing live on the Industrial Supply page, same product page pattern.

- One card and one page per street-light model, with a wattage filter.

- A page per product with a prefilled WhatsApp message. “Enquire on WhatsApp” everywhere. No stock badges, no prices.

- Naming pattern \[Key rating\] \[Product type\], \[Variant\]. Voltage ratings confirmed verified by the client.

- Years in business count from 2005 (21). Company history confirmed from the client’s text.

- Primary domain kgiclsolar.com. Brand names omitted for now. No certificates on the site.

- Contact form uses Resend on the subdomain notify.kgiclsolar.com.

- Social links through environment variables. Testimonial placeholders only in development, blocked at launch.

- Featured six confirmed by the client, controlled by one file.

- Stock photos may be used while building, but none ship: real photos are collected before go-live or the product is unpublished. Missing photos are never replaced by stock.

- Service coverage shown as “Nationwide delivery”. Project phone numbers are never published.

Appendix A. Product Catalogue Summary

Draft names and flags for all 63 products. Full detail, source rows and Cloudinary public IDs are in KGICL_Product_Catalogue_Consolidated.xlsx. Flags: N name cut off in the source (confirm), D details possibly cut off (check), C claims unverified, V claims to verify with the supplier, F1 to F6 featured position. Photo: Real confirmed, Check link present, real or stock to confirm, Missing none.

| **ID** | **Draft name**                                              | **Group**                                          | **Photo** | **Flags** |
|--------|-------------------------------------------------------------|----------------------------------------------------|-----------|-----------|
| P-001  | 100W Solar Street Light, 10-Eye                             | Solar Lighting: Street Lights                      | Check     |           |
| P-002  | 100W Solar Street Light, 10-Eye D-Series                    | Solar Lighting: Street Lights                      | Check     |           |
| P-003  | 100W Solar Street Light, 4-Bar                              | Solar Lighting: Street Lights                      | Check     |           |
| P-004  | 120W Solar Street Light, 12-Eye                             | Solar Lighting: Street Lights                      | Real      | F1        |
| P-005  | 120W Solar Street Light, 12-Eye D-Series                    | Solar Lighting: Street Lights                      | Check     |           |
| P-006  | 120W Solar Street Light, 4-Eye Square White                 | Solar Lighting: Street Lights                      | Check     |           |
| P-007  | 120W Solar Street Light, 5-Bar                              | Solar Lighting: Street Lights                      | Check     |           |
| P-008  | 150W Solar Street Light, 14-Eye                             | Solar Lighting: Street Lights                      | Check     |           |
| P-009  | 150W Solar Street Light, 5-Bar                              | Solar Lighting: Street Lights                      | Check     |           |
| P-010  | 150W Solar Street Light, 6-Bar                              | Solar Lighting: Street Lights                      | Real      | F2        |
| P-011  | 180W Solar Street Light, 6-Bar                              | Solar Lighting: Street Lights                      | Check     |           |
| P-012  | 200W Solar Street Light, 16-Eye                             | Solar Lighting: Street Lights                      | Real      | F3        |
| P-013  | 200W Solar Street Light, 16-Eye D-Series                    | Solar Lighting: Street Lights                      | Check     |           |
| P-014  | 300W Solar Street Light, 20-Eye D-Series                    | Solar Lighting: Street Lights                      | Check     |           |
| P-015  | 300W Solar Street Light, 20-Eye Flagship                    | Solar Lighting: Street Lights                      | Check     |           |
| P-016  | 80W Solar Street Light, 4-Bar                               | Solar Lighting: Street Lights                      | Check     |           |
| P-017  | 80W Solar Street Light, 8-Eye                               | Solar Lighting: Street Lights                      | Check     |           |
| P-018  | Indoor Dome CCTV Camera                                     | CCTV & Security: Cameras                           | Check     | N         |
| P-019  | AI Solar Camera with Lighting, 2-in-1                       | CCTV & Security: Camera + Lighting                 | Check     | V         |
| P-020  | Solar 3PTZ CCTV Camera                                      | CCTV & Security: Cameras                           | Check     | V         |
| P-021  | AI Solar Camera with Lighting, 2-in-1 with 3 Video Channels | CCTV & Security: Camera + Lighting                 | Check     | V         |
| P-022  | Solar CCTV Camera with Floodlight, All-in-One               | CCTV & Security: Camera + Lighting                 | Check     |           |
| P-023  | CCTV Floodlight with Dummy Camera                           | CCTV & Security: Camera + Lighting                 | Check     |           |
| P-024  | CCTV DVR / NVR Recorder                                     | CCTV & Security: Recorders & Accessories           | Check     | N         |
| P-025  | PVC Single-Core Copper Wire                                 | Electrical Supplies: Cables & Wiring               | Real      | F5        |
| P-026  | PVC Surface Wiring Cable                                    | Electrical Supplies: Cables & Wiring               | Check     |           |
| P-027  | Flexible Cable                                              | Electrical Supplies: Cables & Wiring               | Check     | D         |
| P-028  | LED Bulb                                                    | Electrical Supplies: Lighting & Fans               | Real      | D F6      |
| P-029  | Wall Switch and Socket                                      | Electrical Supplies: Switches, Sockets & Conduit   | Real      | F4        |
| P-030  | PVC and Iron Electrical Box                                 | Electrical Supplies: Switches, Sockets & Conduit   | Check     | D         |
| P-031  | Single-Phase Distribution Board                             | Electrical Supplies: Distribution & Protection     | Check     | D         |
| P-032  | MCB Circuit Breaker                                         | Electrical Supplies: Distribution & Protection     | Check     | D         |
| P-033  | Switchgear                                                  | Electrical Supplies: Distribution & Protection     | Check     | D         |
| P-034  | Changeover Switch, Manual and Automatic                     | Electrical Supplies: Distribution & Protection     | Check     | D         |
| P-035  | Conduit Pipe and Trunking                                   | Electrical Supplies: Switches, Sockets & Conduit   | Check     | D         |
| P-036  | Ceiling Fan and Standing Fan                                | Electrical Supplies: Lighting & Fans               | Check     | D         |
| P-037  | Voltage Stabilizer and UPS                                  | Electrical Supplies: Power Backup & Protection     | Check     |           |
| P-038  | Power Socket and Extension                                  | Electrical Supplies: Switches, Sockets & Conduit   | Check     | D         |
| P-039  | TV, Fridge and AC Guard                                     | Electrical Supplies: Power Backup & Protection     | Check     | D         |
| P-040  | Pure Copper Earth Rod, Solid                                | Industrial Supply: Earthing & Lightning Protection | Check     | D C       |
| P-041  | Copper Bonded Earth Rod                                     | Industrial Supply: Earthing & Lightning Protection | Check     | N D C     |
| P-042  | Bare Copper Earth Tape                                      | Industrial Supply: Earthing & Lightning Protection | Check     | D C       |
| P-043  | Bare Copper Earth Wire                                      | Industrial Supply: Earthing & Lightning Protection | Check     | D C       |
| P-044  | Insulated Copper Earth Cable                                | Industrial Supply: Earthing & Lightning Protection | Check     | D C       |
| P-045  | Heavy Copper Earth Rod Clamp                                | Industrial Supply: Earthing & Lightning Protection | Check     | N D C     |
| P-046  | Copper Earth Tape Clamp                                     | Industrial Supply: Earthing & Lightning Protection | Check     | D C       |
| P-047  | Copper Earth Bar / Busbar                                   | Industrial Supply: Earthing & Lightning Protection | Check     | N D C     |
| P-048  | Pure Copper Earth Plate                                     | Industrial Supply: Earthing & Lightning Protection | Check     | D C       |
| P-049  | Earth Inspection Pit                                        | Industrial Supply: Earthing & Lightning Protection | Check     | D C       |
| P-050  | Earth Enhancement Compound (Bentonite / Marconite)          | Industrial Supply: Earthing & Lightning Protection | Check     | N D C     |
| P-051  | Lightning Protection Air Rod, Copper                        | Industrial Supply: Earthing & Lightning Protection | Check     | N D C     |
| P-052  | Electrical Safety Helmet                                    | Industrial Supply: PPE & Safety                    | Check     |           |
| P-053  | Insulated Electrical Gloves                                 | Industrial Supply: PPE & Safety                    | Check     | N         |
| P-054  | Steel Toe Leather Safety Boots                              | Industrial Supply: PPE & Safety                    | Check     | C         |
| P-055  | PVC Rain Safety Boots                                       | Industrial Supply: PPE & Safety                    | Check     | C         |
| P-056  | Anti-Fog Safety Goggles                                     | Industrial Supply: PPE & Safety                    | Check     | D C       |
| P-057  | High-Visibility Safety Vest                                 | Industrial Supply: PPE & Safety                    | Check     | C         |
| P-058  | Electrical Coveralls                                        | Industrial Supply: PPE & Safety                    | Check     | N C       |
| P-059  | Disposable Coveralls                                        | Industrial Supply: PPE & Safety                    | Check     | N C       |
| P-060  | Electrical Safety Harness                                   | Industrial Supply: PPE & Safety                    | Check     | C         |
| P-061  | Ear Muffs and N95 Dust Mask Combo                           | Industrial Supply: PPE & Safety                    | Check     | C         |
| P-062  | Cut-Resistant Safety Gloves                                 | Industrial Supply: PPE & Safety                    | Check     | N C       |
| P-063  | First Aid Kit with Electrical Warning Tape                  | Industrial Supply: PPE & Safety                    | Check     | C         |

Appendix B. Approved Copy and Company Facts

Source text for the pages. Where the client’s earlier wording conflicted with later confirmation, the confirmed version is used and the change is noted.

Company details

| **Item**            | **Value**                                                                                                                            |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| **Registered name** | KRIS GOODNEWS INT’L CO. LTD (KGICL). Trade name on the site: KGICL Goodnews Solar                                                    |
| **Registration**    | RC 1552853. First registered with CAC on 26 August 2005 as an Enterprise; upgraded to a limited liability company on 14 January 2019 |
| **Address**         | No. 7 Ada George Road, opposite Cosy Plaza, by Wide Choice Supermarket, Port Harcourt, Rivers State, Nigeria                         |
| **Phone**           | 0803 613 6883 and 0805 420 7519                                                                                                      |
| **WhatsApp**        | 0813 902 7180 and 0803 613 6883. Site button uses +234 813 902 7180                                                                  |
| **Email**           | info@kgiclsolar.com and sales@kgiclsolar.com (add to the site once the mailboxes are confirmed)                                      |
| **Opening hours**   | Monday to Friday 7am to 10pm. Saturday 7am to 8pm. Sunday closed                                                                     |
| **Coverage**        | Nationwide delivery                                                                                                                  |

About text (history)

KRIS GOODNEWS INT’L CO LTD was first registered by the Corporate Affairs Commission on 26 August 2005 as an Enterprise to deal in electrical, mechanical, construction and industrial equipment, safety materials, import, export and general contracting. Due to expansion and growth, and collaboration with professional interest groups to ensure best practice, the company was upgraded to a Limited Liability Company on 14 January 2019 (RC 1552853).

We are a 100% Nigerian-owned company duly registered to carry out business in Nigeria, with special focus on delivering value-added services to the energy, oil and gas, and renewable sectors.

*Statistic: “{years} years of proven experience”, calculated from 26 August 2005.*

Mission, vision, tagline, values

| **Item**    | **Text**                                                                                                                                                                                                  |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Mission** | To provide reliable, affordable solar lighting, electrical materials and industrial solutions that help homes, businesses and government save energy cost, with excellent service, on time and on budget. |
| **Vision**  | To become the most trusted solar and electrical company in Nigeria, known for original products, quality installation and 100% customer satisfaction.                                                     |
| **Tagline** | Customer Satisfaction Always                                                                                                                                                                              |
| **Values**  | Integrity, Quality, Service, Respect, Excellence, Customer Satisfaction Always                                                                                                                            |

Why choose us

- Original products with warranty. No fake products.

- Based in Port Harcourt: fast delivery and installation, with WhatsApp support (client to confirm the exact support claim, see open item 8).

- In business since 2005 and trusted by estates, churches, businesses and oil and gas companies. (The earlier line “registered since 2018” is replaced.)

Terms to show

- Free solar consultation for Port Harcourt clients.

- 1-year warranty on solar lights.

- 6-month warranty on electrical installations.

- Corporate clients: 75% advance payment, 25% on completion of the project.

Services

- Solar consultation and installation

- Electrical installation and wiring

- UPS supply

- Procurement and logistics

- Civil and electrical installation of all types

- Other services (secondary section): per the client’s earlier list, wording to be agreed during content entry

Projects (titles as supplied)

- 300 kVA transformer procurement and installation, Ikoyi, Lagos

- Foodco eatery electrical installation, Ikotun, Lagos

- KGICL solar lights at a residence, Port Harcourt

- Supply of industrial all-in-one solar street lights

- Industrial flexible cables for industrial air-conditioning, Lekki, Lagos

*Descriptions and photo links are in the client’s project source file. Contact numbers in that file are not published.*
