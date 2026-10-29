# Kickoff Prompts for the Coding Agent

How to use: open a **new agent session for each task**. Paste the **Universal rules** block first, then the **task kickoff** for that task. Wait for the agent's plan before it writes code. After the task, paste the **Close-out review** prompt.

---

## 0. Before the first session (Emmanuel's checklist)

Put these files in the repository (create the repo `kgicl-website` first):

| Repo path | File |
|---|---|
| `README.md` | README.md (draft, finished in Task 04) |
| `tasks/` | 00-shared-context.md, 01-setup.md, 02-catalogue-core.md, 03-pages-and-forms.md, 04-polish-and-launch.md, this file |
| `docs/` | PRD-v1.1.md, design.md, resend-implementation-guide.md, domain-setup-guide.md, 01-brainstorm.md, KGICL_Product_Catalogue_Consolidated.xlsx, kgicl-coming-soon-assets.zip |

Have ready (do **not** paste secrets into the agent chat; put them in `.env.local` and Vercel yourself):
- Cloudinary **cloud name**.
- Resend **dev** API key (for Task 03).
- Access to GitHub and the Vercel account (for the dashboard steps).

Run one task per session, in order: 01, 02, 03, 04 (Part A), then 04 (Part B) only after the client approves.

---

## 1. Universal rules (paste at the start of EVERY session)

```text
You are a senior Next.js engineer building the KGICL Goodnews Solar website (Port Harcourt, Nigeria) in this repository. I am Emmanuel, the developer and your reviewer. The client is non-technical.

READ FIRST, IN THIS ORDER, before doing anything:
1. tasks/00-shared-context.md   (decisions that apply to every task; it overrides the PRD where they differ)
2. The task file I name below.
3. docs/design.md               (the only source for look, tokens and components)
4. docs/PRD-v1.1.md             (read only the sections the task file lists)
5. Any other doc the task file names.

If two documents disagree, follow this priority: 00-shared-context.md, then the task file, then design.md, then the PRD. Tell me about every conflict you find.

HOW TO WORK
- Start by replying with: (a) a 10-bullet summary of what you understood, (b) the list of files you will create or change, (c) any questions or missing inputs. Do NOT write code until I reply "go".
- Work one sub-task at a time, in order. For each sub-task: do it, run its "Verify" checks, and fix problems before moving on.
- Commit after each sub-task with the format "task-1.4: header and mobile menu".
- After each sub-task, report in this format:
  DONE: what you built (files)
  VERIFIED: each Verify item, with the command and its result, or "not verified" with the reason
  DEVIATIONS: anything that differs from the task file or design.md, and why
  QUESTIONS: anything you need from me
- Never mark a Verify item as passed without running it.

HARD RULES
- Build UI only from the tokens and components in docs/design.md. If something is missing, add it to design.md first and tell me.
- Do not invent content: no prices, no stock status, no claims, no testimonials, no statistics, no phone numbers. Use only the content given in the task files and PRD Appendix B.
- Never copy any private customer phone number or contact name into the repo.
- Never ask me for, print, or commit secrets. Use environment variable names only. Dashboard steps (Vercel, Cloudinary, Resend, GitHub settings) are mine: give me exact, numbered steps and wait.
- Do not change config/launch-gates.ts values. Those are my decisions.
- Do not add dependencies that the task file does not list without asking me first.
- Keep to TypeScript strict mode, server components by default, no tracking cookies, no UI library.
- If something is ambiguous, or you are about to do something outside the task, stop and ask.
- Do not start the next task. Stop at the end of the task and wait for me.
```

---

## 2. Task 01 kickoff (setup, tokens, modes, shell)

```text
TASK: Task 01 (tasks/01-setup.md): Project setup, design tokens, site modes and the site shell.

Extra reading: docs/design.md sections 3, 4, 5, 6.1, 6.2; docs/PRD-v1.1.md sections 5.1 and 10; the asset pack docs/kgicl-coming-soon-assets.zip (unzip it somewhere outside public/ first).

CONTEXT
- Greenfield repo named kgicl-website. Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4.
- The most important design decision is SITE_MODE (review or live), described in 00-shared-context.md section 2. Build lib/mode.ts and the mode-aware behaviour exactly as specified: noindex meta, X-Robots-Tag header and robots.txt in review mode only; "Review version" tag in review mode only.
- Two Tailwind v4 traps: never name spacing tokens xs/sm/md/lg/xl/2xl; and the next/font variables must be --font-cormorant and --font-manrope, aliased in @theme as --font-display and --font-body. Prove the fonts load by checking computed styles.
- The existing og-image.png in the asset pack says "launching soon". Do not use it. Build the new Open Graph image as described in sub-task 1.7.
- The Vercel review project is named kriss-goodnews-solar (address kriss-goodnews-solar.vercel.app). Do NOT use the name kgicl-solar and do NOT attach kgiclsolar.com.

INPUTS YOU NEED FROM ME (ask in your plan): the Cloudinary cloud name (a public value), and whether the GitHub repo already exists.

SCOPE
Sub-tasks 1.1 to 1.8. For 1.8 (Vercel project and deployment), give me the exact dashboard steps and the environment variable names and values; I will do them and tell you when the deployment is live. Then run the Verify checks against https://kriss-goodnews-solar.vercel.app (including the x-robots-tag header).

DONE MEANS
The definition of done in 00-shared-context.md section 7, plus every Verify item in 01-setup.md. Leave the temporary /design-check page in place.
```

---

## 3. Task 02 kickoff (catalogue core)

```text
TASK: Task 02 (tasks/02-catalogue-core.md): data model, workbook import, Cloudinary images, product pages, featured products, audit v1.

Extra reading: docs/design.md section 6.3 and 8; docs/PRD-v1.1.md sections 5.3, 6, 7 and 11; the workbook docs/KGICL_Product_Catalogue_Consolidated.xlsx (sheet "Products", then the "Summary" and "Excluded" sheets).

CONTEXT
- Task 01 is complete and deployed. The site runs in review mode.
- The catalogue has exactly 63 products: Solar 17, CCTV 7, Electrical 15, Industrial 24. If your import produces any other number, stop and tell me before continuing.
- In review mode every product name, detail, claim, voltage rating and photo is published exactly as in the workbook. The published name is the column "Proposed name (draft)". The concerns (cut-off names, unverified claims, photo status) stay in each product's `review` object; the website does NOT display them.
- Store Cloudinary public IDs only, never full URLs. Do not store prices or stock.
- The featured list in data/featured.ts has exactly six slugs and is the only source of truth for featured products. Build the validation with the plain-language error messages in sub-task 2.4 and prove each error case.
- scripts/import-products.ts must not overwrite hand edits (no --force, no overwrite).
- The launch-gate severities already exist in config/launch-gates.ts. Implement the audit rules listed in sub-task 2.8, and leave stubs for testimonialPlaceholders, socialInvalid, missingEnv and modeMismatch.

INPUTS YOU NEED FROM ME: confirm the Cloudinary cloud name is set in .env.local and in Vercel. Ask me for the 3 to 5 public IDs you want to test with if any of the workbook IDs fail to load.

SCOPE
Sub-tasks 2.1 to 2.8. Show me the import summary (counts per area, group, photo status and claims status) before generating pages. At the end deploy to the review project and spot-check ten product pages there, including one with no model code and one with a long name.

DONE MEANS
All Verify items in 02-catalogue-core.md plus the definition of done in 00-shared-context.md section 7. 63 product pages build.
```

---

## 4. Task 03 kickoff (pages, form, remaining data)

```text
TASK: Task 03 (tasks/03-pages-and-forms.md): Home, Industrial Supply, Services, Projects, About, Contact with the Resend form, Privacy notice, testimonials, social links, 404, and the audit rules that remain.

Extra reading: docs/design.md sections 6.3 to 6.5 and 7; docs/PRD-v1.1.md sections 5.2, 5.4, 9.4 and Appendix B (approved copy); docs/resend-implementation-guide.md (all of Parts 6, 7, 8, 9 and the "Setup status" table at the top).

CONTEXT
- Tasks 01 and 02 are complete. Products, areas, cards and product pages exist.
- Home tiles use the dark gradient with the dotted ring by default. When data/images.ts holds a Cloudinary public ID for a tile, the tile switches to a photo state. All image slots in data/images.ts start as null. Hero uses the ring motif with no photo.
- The five projects are given in sub-task 3.1, already cleaned. Do not read or copy contact names or phone numbers from any source file. The audit rule privateNumbers must stay green.
- Do not claim "24/7" support anywhere. Use only the copy in PRD Appendix B and the task file.
- Testimonial placeholders are shown in review mode with a visible "Placeholder" tag, and never rendered in live mode. Social links come only from FACEBOOK_URL, INSTAGRAM_URL and LINKEDIN_URL, and an icon renders only for a valid real URL.
- Privacy page: where the client has not decided (privacy contact, retention period) use the visible marker [To be confirmed by KGICL]. Do not invent wording for those two items.
- Years in business is calculated from 2005-08-26 (completed years), never hardcoded, and pages showing it use revalidate = 86400.

CONTACT FORM
Follow resend-implementation-guide.md exactly (file layout, honeypot, 3 second timing check, rate limit, validation, consent checkbox, success and error panels). The Resend account, verified domain and API keys already exist. Do NOT ask me for the API key. Create .env.example entries and a local .env.local template with empty values; I will paste my dev key myself. In review mode the email subject is prefixed "[REVIEW] ". The form reads ?product={slug}.

INPUTS YOU NEED FROM ME: nothing secret. Tell me when you reach the point where I must set RESEND_API_KEY, CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL in .env.local and in the Vercel project (my address as the recipient for review).

SCOPE
Sub-tasks 3.1 to 3.9. After 3.6, STOP and wait while I run the guide's Part 9 tests (A to D) from the review deployment, then continue.

DONE MEANS
All Verify items in 03-pages-and-forms.md plus the definition of done in 00-shared-context.md section 7. Every page exists on the review deployment.
```

---

## 5. Task 04, Part A kickoff (polish and review handover)

```text
TASK: Task 04, Part A only (tasks/04-polish-and-launch.md, sub-tasks 4.1 to 4.8): motion, accessibility, performance, security headers, analytics, smoke test, README and final review build.

Extra reading: docs/design.md sections 4.4, 9 and 10; docs/PRD-v1.1.md sections 9, 10 and 11; the README.md already in the repo root.

CONTEXT
- Tasks 01 to 03 are complete. The site runs in review mode on https://kriss-goodnews-solar.vercel.app.
- Do NOT start Part B (4.9 to 4.11, the go-live runbook). It happens only after the client approves the review site.
- Analytics: Vercel Web Analytics only, live mode only, no Google Analytics, no cookies. Custom events may need a paid Vercel plan: ask me to check before building them.
- Security headers: static Next.js pages need 'unsafe-inline' for scripts and styles, so use the CSP given in sub-task 4.4 and fix any violation you see in the browser console.
- README: the draft in the repo root documents how to replace every picture (products, home tiles, hero, projects). In sub-task 4.7 you must actually perform each listed procedure on a branch, prove it works, and then discard the change. List the five checks in your report.
- Remove the temporary /design-check page and any debugging output in 4.8.

INPUTS YOU NEED FROM ME: Lighthouse runs may need a deployed URL; use the review URL. Tell me if you need me to confirm the Vercel plan for custom analytics events.

SCOPE
Sub-tasks 4.1 to 4.8. At the end, give me the audit warning summary (review mode) so I can match it against the spreadsheet before showing the client.

DONE MEANS
All Verify items for 4.1 to 4.8 plus the definition of done in 00-shared-context.md section 7. Stop. Do not touch Part B.
```

---

## 6. Task 04, Part B kickoff (go-live; use only after client approval)

```text
TASK: Task 04, Part B (tasks/04-polish-and-launch.md, sub-tasks 4.9 to 4.11): switch the existing production Vercel project to this repository and go live.

Extra reading: docs/domain-setup-guide.md (sections 3 and 4), docs/resend-implementation-guide.md (Parts 8, 10 and 11), config/launch-gates.ts.

CONTEXT
- The client has approved the review site. This session prepares and verifies; I perform the dashboard steps.
- Approach (decided): keep the production project that serves kgiclsolar.com, disconnect the coming-soon repo, connect this repo, set environment variables BEFORE the first deploy, reset the build settings (Framework Next.js, remove the Output Directory "public" override and the other overrides), deploy by pushing a commit (never the "Redeploy" button), verify, then delete the review project 24 to 48 hours later.
- The launch gates are my decisions. Run SITE_MODE=live npm run audit, give me the report grouped by gate, and walk me through each failing gate. I will decide for each: fix the data, unpublish the product, or consciously relax the gate myself. Do not change gate values.
- Marker text [To be confirmed by KGICL] in the privacy page and any placeholder testimonials must be resolved or the build will fail in live mode, which is intended.

SCOPE
1. 4.9: run the live audit and walk me through the results. Stop for my decisions.
2. 4.10: give me the exact numbered dashboard steps (Step 0 to Step 8 in the task file), one stage at a time, and wait for me to confirm each. After the deployment, run the Verify checks: domain test table, npm run smoke against https://kgiclsolar.com, header and robots checks, a form test, analytics loading.
3. 4.11: give me the post-launch steps (delete the review project later, Search Console DNS TXT verification and sitemap, Google Business Profile reminder, Cloudinary backup, monitoring, archive the coming-soon repo, redirect the production project's own vercel.app address).

If anything fails after the switch, tell me the rollback steps from the task file (Instant Rollback to the last good deployment) before trying anything else.

DONE MEANS
All Verify items in 4.9 to 4.11.
```

---

## 7. Close-out review (paste after each task, before you accept it)

```text
Close-out review for the task you just finished. Do not write new features. Re-check your own work and report honestly.

1. Open the task file and go through every sub-task and every "Verify" checkbox. For each one, state PASS or FAIL or NOT RUN, with the exact command or page you used as evidence.
2. Compare what you built against docs/design.md (tokens, components, states, responsive behaviour). List every deviation.
3. Run: npm run lint, npm run typecheck, npm test, npm run build, npm run audit (review mode). Paste the summary lines.
4. Search the repo for: hard-coded wa.me links outside lib/whatsapp.ts, the words "In Stock" or price symbols, any phone number not in data/site.ts, "launching soon", "TODO", "console.log", and any secret-looking string. Report findings.
5. Check mobile (320, 390 px) and keyboard-only use on the pages this task touched.
6. List anything you were unsure about, anything you skipped, and anything I should decide.
Then stop and wait.
```

---

## 8. Handy corrections (use when needed)

**The agent drifted from the design:**
```text
Stop. Re-read docs/design.md sections for the component you just built and compare. List every difference in tokens, spacing, states and responsive behaviour. Fix them, then report in the DONE / VERIFIED / DEVIATIONS / QUESTIONS format.
```

**The agent invented content:**
```text
You added content that is not in the task file, PRD Appendix B or design.md. Remove everything you invented and replace it with the approved copy, or with a visible placeholder marker if none exists. List what you removed.
```

**The agent hit an error loop:**
```text
Stop changing code. State the exact error, what you tried, and your best two hypotheses for the cause. Do not try a third fix until I choose a hypothesis.
```

**Resuming after a break:**
```text
Resume Task <number>. Re-read tasks/00-shared-context.md and the task file, run git log and git status, tell me which sub-tasks are finished and verified, which are partly done, and what is next. Wait for "go".
```
