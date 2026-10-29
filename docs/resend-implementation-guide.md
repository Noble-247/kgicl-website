# Resend Implementation Guide: KGICL Contact Form

For Emmanuel (first production use of Resend) and for Copilot. Follow the parts in order. Parts 2 to 5 are one-off setup. Parts 6 to 8 are code. Parts 9 to 12 are testing, launch and support.

**Decision:** the contact form sends its notification through **Resend**, using the Node SDK from a Next.js 15 **Server Action**. Enquiries arrive in the company's `info@kgiclsolar.com` inbox. The visitor's email, if given, becomes the Reply-To.

---

## Setup status (updated 25 Oct 2026)

| Step | Status |
|---|---|
| Resend account (kgiclsolar), registered with the company mailbox | Done |
| Domain `notify.kgiclsolar.com` added (Ireland, eu-west-1), sending on, receiving off | Done, **Verified** |
| DNS at HostAfrica: 1 TXT (DKIM) + 2 CNAME (`rsend.notify`, `send.notify`) | Done. Existing email, Vercel and `_dmarc` (p=reject) records untouched |
| Click and open tracking | Off (not configured) |
| API keys: `kgicl-website-production` and `kgicl-website-dev`, sending access, domain `notify.kgiclsolar.com` | Done. Values are in the password manager only |
| End-to-end test (CMD + curl, dev key) to Gmail and `info@kgiclsolar.com` | Done. SPF, DKIM and DMARC pass, delivered to the inbox in about 3 seconds |
| Vercel environment variables (Part 5) | **To do** when the main site's Vercel project exists |
| Code: form, Server Action, email builder (Parts 6 to 8) | **To do** in the forms task (03-pages-and-forms) |
| Vercel Firewall rate-limit rule (Part 8) | **To do** after the first production deploy |
| Privacy notice mentions Resend and Vercel (Part 10) | **To do** with the Privacy page |

---

## 0. How it works (the big picture)

```
Visitor fills form (browser)
        │  submit
        ▼
Server Action on Vercel  ── checks: honeypot, timing, rate limit, validation
        │
        ▼
Resend API (HTTPS, one short request)  ── sends from website@notify.kgiclsolar.com
        │
        ▼
info@kgiclsolar.com inbox (HostAfrica HMailPlus)   ← Reply-To = visitor's email
```

- Nothing is stored. The email is the record. (No database, as agreed.)
- If sending fails, the visitor sees a friendly error with **WhatsApp and call buttons**, so no enquiry is lost.
- The Resend API key lives only on the server, in Vercel environment variables. It never reaches the browser.

## 1. Decisions and names used in this guide

| Item | Value | Why |
|---|---|---|
| Provider and plan | Resend, **Free** plan | 3,000 emails a month and 100 a day. At the limit, sending **pauses**; you are never billed by surprise |
| Sending domain | **`notify.kgiclsolar.com`** (a subdomain) | Resend recommends a subdomain. It keeps these emails separate from the company's real mailboxes, so nothing at the main domain's email records changes |
| From | `KGICL Website <website@notify.kgiclsolar.com>` | Automated sender, no mailbox needed |
| To | `info@kgiclsolar.com` | The company inbox |
| Reply-To | The visitor's email (if provided) | Pressing "Reply" answers the customer |
| Resend account | A **dedicated** account for KGICL, registered with `info@kgiclsolar.com` | The free plan allows 1 domain per account. Keeps the 100-a-day cap separate from your other projects |
| Env var names | `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | See Part 5 |

If you prefer the root domain (`kgiclsolar.com`) instead of a subdomain, everything works the same, but the DNS record names change and Resend warns that a root domain with inbound enabled can clash with existing mail records. The subdomain avoids that.

---

## 2. Create the Resend account

1. Make sure the `info@kgiclsolar.com` mailbox exists and you can open it (webmail). Resend sends a verification email there.
2. Go to resend.com and sign up with `info@kgiclsolar.com`. Confirm the email.
3. Turn on two-factor authentication in the account settings if offered.
4. Write the login in your password manager. Later, hand the client the account details if you want him to own it.

You do not need to enter payment details for the Free plan.

---

## 3. Add and verify the domain (about 15 minutes of work)

### 3.1 Add the domain in Resend
1. Resend dashboard → **Domains** → **Add Domain**.
2. Enter **`notify.kgiclsolar.com`**.
3. Leave the **Custom Return-Path** as `send`.
4. Region: this project uses **Ireland (eu-west-1)**.
5. Leave **Enable Sending** on and **Enable Receiving** off (we only send).
6. Open the domain's **Records** tab. It lists the DNS records to add. **Copy each record exactly as shown.**

### 3.2 What the records look like (as shown for this project)
Resend gave **three records**: one TXT for DKIM and **two CNAME records** for SPF and bounce handling (not TXT and MX, as older guides describe). The values and types come from the dashboard, so always trust it over this table:

| Purpose | Type | Name to enter in HostAfrica | Value |
|---|---|---|---|
| DKIM (proves the mail is yours) | TXT | `resend._domainkey.notify` | The long `p=MIGfMA…` key. Copy with the copy icon in Resend |
| SPF / sending | CNAME | `rsend.notify` | `rsend-euw1.forge.rmta.net.` (with the final dot) |
| Bounce handling | CNAME | `send.notify` | `send.forge.rmta.net.` (with the final dot) |

Everything sits under the `notify` subdomain, so the company's mail records at the main domain are untouched.

### 3.3 Add them at HostAfrica
1. HostAfrica client area → **Domains → DNS Management → Domains DNS** → `kgiclsolar.com` → **Add DNS Record**.
2. Choose the record type, then fill in the form.
3. **Name:** use the short form, as in the zone list (`rsend.notify`, not `rsend.notify.kgiclsolar.com`).
4. **Value:** paste with the copy icon, never retype. For the **CNAME** values, **end the value with a dot**. HostAfrica shows existing CNAME values with a trailing dot (for example `…vercel-dns-017.com.`), and without it some DNS panels add the domain name to the end and break the record. Do **not** add a dot to the TXT value.
5. TTL: the default (3600) is fine.
6. Do not edit or delete any existing record. Zones created at HostAfrica already hold email records (MX, DKIM `mail1._domainkey`, SPF TXT) and a DMARC record.

### 3.4 Verify
1. Back in Resend, click **Verify DNS Records**.
2. It often verifies within about 15 minutes, but can take up to 72 hours. Status goes `pending` → `verified`.
3. You can check that the records are visible publicly with Resend's `dns.email` tool, or:
   ```
   nslookup -type=TXT   resend._domainkey.notify.kgiclsolar.com
   nslookup -type=CNAME rsend.notify.kgiclsolar.com
   nslookup -type=CNAME send.notify.kgiclsolar.com
   ```
4. If Resend says `failed`, re-check the host names and values, then verify again.

### 3.5 DMARC (check, don't add)
HostAfrica creates a `_dmarc` TXT record when a domain is registered. In this project it reads `v=DMARC1; p=reject`. A domain can have only one DMARC record, so **do not add another**. Because the policy is `reject`, mail that fails verification is refused outright. That is fine once the Resend domain shows **Verified**, because the form emails are signed with the `notify.kgiclsolar.com` key. Check the first test email's headers (Part 9B) to confirm SPF, DKIM and DMARC all pass.

---

## 4. Create the API key

1. Resend → **API Keys** → **Create API Key**.
2. Name: `kgicl-website-production`.
3. Permission: **Sending access** (not Full access). If it offers to restrict the key to a domain, choose `notify.kgiclsolar.com`.
4. Copy the key (starts with `re_`). **Resend shows it only once.** Put it straight into your password manager and Vercel (Part 5).
5. Create a second key, `kgicl-website-dev`, for local development and preview deployments.

Never put a key in the repo, in chat or in a screenshot. If one is exposed, delete it in Resend and make a new one. This takes a minute.

---

## 5. Environment variables

| Name | Value | Where |
|---|---|---|
| `RESEND_API_KEY` | the `re_…` key | Vercel (mark **Sensitive**), `.env.local` |
| `CONTACT_FROM_EMAIL` | `KGICL Website <website@notify.kgiclsolar.com>` | Vercel, `.env.local` |
| `CONTACT_TO_EMAIL` | **Production:** `info@kgiclsolar.com`. **Preview and Development:** your own email | Vercel (per environment), `.env.local` |

In Vercel → Project → Settings → **Environment Variables**: when adding each one, choose which environments it applies to. Setting `CONTACT_TO_EMAIL` to **your** address for Preview and Development means test submissions never reach the client. Use the dev key for Preview and Development, and the production key for Production only.

`.env.local` (never committed, add to `.gitignore`):
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_FROM_EMAIL="KGICL Website <website@notify.kgiclsolar.com>"
CONTACT_TO_EMAIL=you@example.com
```

`.env.example` (committed, no real values):
```
RESEND_API_KEY=
CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=
```

Do **not** prefix any of these with `NEXT_PUBLIC_`. That would expose them in the browser.

After changing Vercel variables, **redeploy**. Existing deployments keep the old values.

---

## 6. Install and file layout

```
npm install resend zod
```

```
app/
  contact/
    page.tsx           ← page + `maxDuration`
    ContactForm.tsx    ← client component (the form UI)
    actions.ts         ← 'use server' (only async functions exported)
    schema.ts          ← validation schema, options, types
lib/
  contact/email.ts     ← builds the subject, text and HTML
  rate-limit.ts        ← small best-effort limiter
```

Important rule: a file starting with `'use server'` may export **only async functions**. That is why the schema, constants and types live in `schema.ts`.

---

## 7. The code

### 7.1 `app/contact/schema.ts`
```ts
import { z } from 'zod';

export const NEED_OPTIONS = [
  'Solar lighting',
  'CCTV & security',
  'Electrical supplies',
  'Industrial supply',
  'Other',
] as const;

export const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(80),
  phone: z
    .string()
    .regex(/^[+()\d\s-]{7,20}$/, 'Please enter a valid phone number'),
  email: z.union([
    z.literal(''),
    z.string().email('Please enter a valid email address').max(120),
  ]),
  location: z.string().min(2, 'Please enter your location').max(100),
  need: z
    .string()
    .refine((v) => (NEED_OPTIONS as readonly string[]).includes(v), 'Please choose an option'),
  message: z
    .string()
    .min(10, 'Please tell us a little more (at least 10 characters)')
    .max(1000, 'Please keep your message under 1000 characters'),
  product: z.string().max(120),
  consent: z.string().refine((v) => v === 'on', 'Please tick the box so we can reply to you'),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
  values?: Partial<Record<keyof ContactInput, string>>;
};
```

### 7.2 `lib/contact/email.ts`
```ts
import type { ContactInput } from '@/app/contact/schema';

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

/** "0803 613 6883" or "+234 803 613 6883" → "2348036136883" */
export function toWhatsAppDigits(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('234')) return digits;
  if (digits.startsWith('0')) return '234' + digits.slice(1);
  return digits;
}

export function buildEnquiryEmail(d: ContactInput) {
  const subject = oneLine(`New website enquiry: ${d.need} (${d.name})`);
  const wa = `https://wa.me/${toWhatsAppDigits(d.phone)}`;

  const rows: [string, string][] = [
    ['Name', d.name],
    ['Phone', d.phone],
    ['Email', d.email || 'Not given'],
    ['Location', d.location],
    ['Interested in', d.need],
    ['Product page', d.product || 'None (general enquiry)'],
  ];

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\n\nMessage:\n${d.message}\n\nReply on WhatsApp: ${wa}\n` +
    `\nSent from the KGICL website contact form.`;

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111;max-width:560px">
  <h2 style="margin:0 0 12px">New website enquiry</h2>
  <table cellpadding="6" style="border-collapse:collapse;width:100%">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="border-bottom:1px solid #eee;color:#555;width:140px">${escapeHtml(k)}</td>` +
          `<td style="border-bottom:1px solid #eee"><strong>${escapeHtml(v)}</strong></td></tr>`,
      )
      .join('')}
  </table>
  <p style="margin:16px 0 4px;color:#555">Message</p>
  <p style="margin:0;white-space:pre-wrap">${escapeHtml(d.message)}</p>
  <p style="margin:20px 0 0"><a href="${wa}">Reply on WhatsApp</a></p>
  <p style="margin:20px 0 0;color:#888;font-size:12px">Sent from the KGICL website contact form.</p>
</div>`;

  return { subject, text, html };
}
```
Everything the visitor typed goes through `escapeHtml`, so nobody can inject HTML or links into the email you open.

### 7.3 `lib/rate-limit.ts`
```ts
// Best-effort only: memory is per serverless instance and resets often.
// The real protection is the Vercel Firewall rule in Part 8.
const hits = new Map<string, number[]>();

export function allow(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 500) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}
```

### 7.4 `app/contact/actions.ts`
```ts
'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { buildEnquiryEmail } from '@/lib/contact/email';
import { allow } from '@/lib/rate-limit';
import { contactSchema, type ContactState } from './schema';

const MIN_FILL_MS = 3_000;            // humans take longer than 3 seconds
const MAX_AGE_MS = 24 * 60 * 60_000;  // form older than a day: ask to reload

const FIELDS = ['name', 'phone', 'email', 'location', 'need', 'message', 'product', 'consent'] as const;
const read = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim();

const SEND_FAILED =
  "Sorry, we couldn't send your message. Please message us on WhatsApp or call us instead.";

export async function sendEnquiry(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // 1. Honeypot: a hidden field that real people never fill in.
  if (read(formData, 'website') !== '') return { status: 'success' }; // pretend success

  // 2. Timing: bots submit instantly.
  const startedAt = Number(read(formData, 'startedAt'));
  const elapsed = Date.now() - startedAt;
  if (!startedAt || elapsed < MIN_FILL_MS || elapsed > MAX_AGE_MS) {
    return { status: 'error', message: 'Please reload the page and try again.' };
  }

  // 3. Best-effort rate limit per IP.
  const h = await headers();
  const ip = (h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0] ?? 'unknown').trim();
  if (!allow(ip)) {
    return {
      status: 'error',
      message: 'Too many messages from your connection. Please try again in a few minutes or use WhatsApp.',
    };
  }

  // 4. Validate.
  const raw = Object.fromEntries(FIELDS.map((f) => [f, read(formData, f)]));
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors, values: raw };
  }

  // 5. Check configuration (never reveal details to the visitor).
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    console.error('[contact] Email is not configured (missing env variables)');
    return { status: 'error', message: SEND_FAILED, values: raw };
  }

  // 6. Send. The SDK returns { data, error }; it does not throw for API errors.
  try {
    const resend = new Resend(apiKey); // created here, not at import time, so builds never fail
    const { subject, text, html } = buildEnquiryEmail(parsed.data);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: parsed.data.email || undefined,
      subject,
      text,
      html,
    });

    if (error) {
      console.error('[contact] Resend error:', error.name, error.message);
      return { status: 'error', message: SEND_FAILED, values: raw };
    }
    return { status: 'success' };
  } catch (err) {
    // Unexpected failures only (network, runtime). Log it, never show details.
    console.error('[contact] Unexpected send failure:', err);
    return { status: 'error', message: SEND_FAILED, values: raw };
  }
}
```
Notes:
- `await headers()` is correct for Next.js 15 (it is async now).
- `replyTo` is camelCase in the Node SDK.
- Logs appear in Vercel → Project → **Logs**. They contain the error name and message but not the visitor's details.

### 7.5 `app/contact/ContactForm.tsx`
Styling follows `design.md`. This is the structure and behaviour only.
```tsx
'use client';

import { useActionState, useEffect, useState } from 'react';
import { sendEnquiry } from './actions';
import { NEED_OPTIONS, type ContactState } from './schema';

const initial: ContactState = { status: 'idle' };
const WHATSAPP = 'https://wa.me/2348139027180?text=Hello%20KGICL%2C%20I%27d%20like%20to%20make%20an%20enquiry.';
const PHONE = 'tel:+2348036136883';

export function ContactForm({ product = '' }: { product?: string }) {
  const [state, formAction, pending] = useActionState(sendEnquiry, initial);
  const [startedAt, setStartedAt] = useState('');
  useEffect(() => setStartedAt(String(Date.now())), []);

  if (state.status === 'success') {
    return (
      <div role="status" aria-live="polite">
        <h2>Thank you. Your message has been sent.</h2>
        <p>We will get back to you shortly. For a faster reply, message us on WhatsApp.</p>
        <a href={WHATSAPP}>Chat on WhatsApp</a>
      </div>
    );
  }

  const err = state.fieldErrors ?? {};
  const val = state.values ?? {};

  return (
    <form action={formAction}>
      {state.status === 'error' && state.message && (
        <div role="alert">
          <p>{state.message}</p>
          <p>
            <a href={WHATSAPP}>Chat on WhatsApp</a> · <a href={PHONE}>Call us</a>
          </p>
        </div>
      )}

      {/* Honeypot: hidden from people and screen readers. Keep it out of the tab order. */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label>Website <input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />
      <input type="hidden" name="product" value={product} />

      <label htmlFor="name">Your name</label>
      <input id="name" name="name" required defaultValue={val.name} aria-invalid={!!err.name} aria-describedby={err.name ? 'name-err' : undefined} autoComplete="name" />
      {err.name && <p id="name-err">{err.name}</p>}

      <label htmlFor="phone">Phone / WhatsApp number</label>
      <input id="phone" name="phone" type="tel" required defaultValue={val.phone} aria-invalid={!!err.phone} aria-describedby={err.phone ? 'phone-err' : undefined} autoComplete="tel" />
      {err.phone && <p id="phone-err">{err.phone}</p>}

      <label htmlFor="email">Email (optional)</label>
      <input id="email" name="email" type="email" defaultValue={val.email} aria-invalid={!!err.email} aria-describedby={err.email ? 'email-err' : undefined} autoComplete="email" />
      {err.email && <p id="email-err">{err.email}</p>}

      <label htmlFor="location">Your location</label>
      <input id="location" name="location" required defaultValue={val.location} aria-invalid={!!err.location} aria-describedby={err.location ? 'location-err' : undefined} />
      {err.location && <p id="location-err">{err.location}</p>}

      <label htmlFor="need">What do you need?</label>
      <select id="need" name="need" required defaultValue={val.need ?? ''} aria-invalid={!!err.need}>
        <option value="" disabled>Choose one</option>
        {NEED_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {err.need && <p>{err.need}</p>}

      <label htmlFor="message">Message (power needs, application, quantity)</label>
      <textarea id="message" name="message" rows={5} required minLength={10} maxLength={1000} defaultValue={val.message} aria-invalid={!!err.message} aria-describedby={err.message ? 'message-err' : undefined} />
      {err.message && <p id="message-err">{err.message}</p>}

      <label>
        <input type="checkbox" name="consent" /> I agree that KGICL may use these details to reply to my
        enquiry, as explained in the <a href="/privacy">privacy notice</a>.
      </label>
      {err.consent && <p>{err.consent}</p>}

      <button type="submit" disabled={pending}>{pending ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
```
Behaviour you must keep:
- React 19 clears the form after an action completes, even on errors. That is why `defaultValue={val.x}` repopulates fields from the returned `values`.
- The button is disabled while sending, which prevents double submits and duplicate emails.
- The consent checkbox is **not** pre-ticked, as the privacy law requires.
- Error text sits in `role="alert"`, and field errors use `aria-describedby`, for screen readers.
- Pass `product` from product pages (for example `<ContactForm product={product.name} />`) so you know which product the enquiry came from.

### 7.6 `app/contact/page.tsx` (timeout setting)
```tsx
import { ContactForm } from './ContactForm';

export const maxDuration = 15; // seconds. A Resend call takes well under 2 s. Fail fast.

export default function ContactPage() {
  return <ContactForm />;
}
```
Any other page that embeds the form (for example product pages) needs the same `maxDuration` line, because Server Actions run with the limits of the page that calls them. Check the current maximum allowed on your Vercel plan.

---

## 8. Spam and abuse protection (layers)

Bots are the real risk on the free plan: each fake submission uses one of the **100 emails a day**.

| Layer | What it stops | Where |
|---|---|---|
| Honeypot field | Simple bots that fill every input | Code (7.4, 7.5) |
| Timing check | Bots that submit instantly | Code (7.4) |
| Validation and length limits | Junk and huge messages | Code (7.1) |
| In-code rate limit | Casual repeat submissions | Code (7.3), best effort only |
| **Vercel Firewall rate-limit rule** | Floods from one IP. This is the strong one | Vercel dashboard |
| Optional later: Cloudflare Turnstile (free CAPTCHA) | Smarter bots, if you ever see spam | Add only if needed |

**Vercel Firewall rule:** Project → **Firewall** → **Custom Rules** → add a rule: path equals `/contact`, method `POST`, rate limit about 5 requests per minute per IP, action **Deny** (or Challenge). Check which rate-limit options your plan includes. Server Actions are POST requests to the page URL, so this protects them. Add the same rule for any other page that embeds the form.

---

## 9. Testing (in this order)

**A. Before the domain is verified (local)**
1. In `.env.local`, set `CONTACT_FROM_EMAIL="KGICL Website <onboarding@resend.dev>"` and `CONTACT_TO_EMAIL` to the email you registered the Resend account with (`info@kgiclsolar.com`).
2. Run `npm run dev`, submit the form. You should see the success panel and the email arrives.
3. Resend's test sender can only send to your own account address. Anything else is refused. That is expected.

**A2. Quick test before any code exists (done for this project, 25 Oct 2026)**
Send one email straight to the API to prove DNS and DMARC work. On Windows CMD, with a `resend-test.json` file holding `from`, `to`, `subject` and `text`:
```
set RESEND_API_KEY=<dev key>
curl -X POST https://api.resend.com/emails -H "Authorization: Bearer %RESEND_API_KEY%" -H "Content-Type: application/json" -d @resend-test.json
```
Result for this project: delivered to Gmail and to `info@kgiclsolar.com` in 3 seconds, and the inbox (not spam). SPF, DKIM (domain `notify.kgiclsolar.com`) and DMARC all passed. Delete the JSON file afterwards and close CMD so the key is cleared.

**B. After the domain shows "verified"**
1. Set `CONTACT_FROM_EMAIL` to the real `website@notify.kgiclsolar.com` address.
2. Send a test to **your own** email address. Check the inbox **and spam**.
3. In Gmail, open the message → **Show original**. SPF, DKIM and DMARC should all say `PASS`.
4. Check the Resend dashboard → **Emails**. Status should be `Delivered`.

**C. Break it on purpose**
- Submit the empty form → field errors show, nothing is sent.
- Fill the hidden honeypot with dev tools → looks like success, no email arrives.
- Submit within 3 seconds → rejected.
- Use a wrong API key → friendly error with WhatsApp and call links, and the real error in the logs.
- Click Send twice quickly → only one email (the button disables).
- Type `<script>alert(1)</script>` in the message → the email shows it as plain text.
- Submit with the consent box unticked → blocked with a message.

**D. Preview deployment**
Deploy a branch. Submit from the preview URL. The email must go to **your** address (Preview `CONTACT_TO_EMAIL`), not the client's.

**E. Production, after launch**
Submit a real test from `https://kgiclsolar.com/contact`. Confirm it reaches `info@kgiclsolar.com`.

---

## 10. Go-live checklist

- [ ] Resend domain `notify.kgiclsolar.com` shows **Verified**.
- [ ] DMARC checked (HostAfrica's existing `p=reject` record, Part 3.5). Do not add a second one.
- [ ] Production key created, stored in Vercel as **Sensitive**, applied to **Production** only.
- [ ] `CONTACT_TO_EMAIL` is `info@kgiclsolar.com` for Production and your own address for Preview/Development.
- [ ] Redeployed after setting variables.
- [ ] Vercel Firewall rate-limit rule active.
- [ ] Test email received in the real inbox (not spam). Show the client how to mark it "Not spam" and add the sender to contacts.
- [ ] Privacy notice mentions the email service and hosting, and that servers are outside Nigeria. The form links to `/privacy`.
- [ ] Failure path checked: the WhatsApp and call fallback shows on error.
- [ ] Resend account login saved in your password manager (and handed over if the client will own it).

---

## 11. Monitoring and maintenance

- **Weekly for the first month, then monthly:** open Resend → Emails. Look for `Bounced` or `Complained` items. Free-plan logs are kept only briefly, so check soon after any complaint.
- **Check Vercel Logs** if the client says an enquiry is missing. Search for `[contact]`.
- **The daily cap:** 100 emails a day. If a spam wave hits it, sending pauses and real visitors see the fallback message. They can still reach WhatsApp. If it happens more than once, add Turnstile.
- **Key rotation:** if the key is ever exposed or a developer leaves, create a new key in Resend, update Vercel, redeploy, then delete the old key.
- **Renewals:** nothing renews. The free plan stays free. The DNS records live as long as the domain does, so they depend on the domain renewal.
- **Costs to expect:** none, unless volume passes the free limits. Upgrading is optional and is the client's decision.

---

## 12. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| Domain stays `pending` or goes `failed` | Wrong host name (extra `.kgiclsolar.com`, or missing `.notify`), wrong value, or DNS not propagated. Compare with the Records tab. Re-verify. |
| Error: you can only send testing emails to your own address | You are still using `onboarding@resend.dev`, or the domain isn't verified. Verify the domain and change the From address. |
| Error: domain is not verified / invalid `from` | `CONTACT_FROM_EMAIL` uses a domain that isn't the verified one. It must end `@notify.kgiclsolar.com`. |
| Build fails with a missing API key message | `new Resend(...)` was created at import time. Create it inside the function as in 7.4. |
| Works locally but not on Vercel | The variables weren't added for that environment, or you didn't redeploy. |
| Success shown but no email | Check Resend → Emails for the status, then the spam folder. A honeypot or timing rejection also looks like success or an error depending on the case. |
| Emails land in spam | Check SPF, DKIM and DMARC pass (Show original). Add DMARC. Mark "Not spam" and add the sender to contacts. |
| Replies go to the wrong person | `replyTo` is empty when the visitor gave no email. Use the phone or WhatsApp link in the email. |
| Many `429` or quota errors | You hit the daily cap, or sent too many in a second. Look for spam, then add the firewall rule or Turnstile. |
| Message shows `undefined` fields | A form field name doesn't match the schema. Names must be exactly: `name`, `phone`, `email`, `location`, `need`, `message`, `product`, `consent`. |

---

## 13. Acceptance criteria (for the Copilot task)

- The form submits through the Server Action only. No API route and no client-side call to Resend.
- Validation errors are shown per field. Fields are repopulated after an error.
- The success panel shows after sending. The error panel shows WhatsApp and call links.
- All user input is escaped in the HTML email. The subject is a single line.
- The honeypot, timing check and rate limit are all in place.
- No secrets in the repo. `.env.example` exists. No `NEXT_PUBLIC_` on email variables.
- `new Resend()` is created inside the action, so a missing key never breaks the build.
- `maxDuration` is set on every page that embeds the form.
- The consent checkbox is unchecked by default and required.
- Keyboard use and screen readers work: labels, `aria-invalid`, `aria-describedby`, `role="alert"`.
- All tests in Part 9 pass.
