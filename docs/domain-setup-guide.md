# Domain Setup Guide: kgiclsolar.com on Vercel (DNS stays at HostAfrica)

For Emmanuel. Do this while the coming-soon page is being built, so the domains are live and tested before the main site arrives.

**What we are setting up**

| Domain | Role | Final behaviour |
|---|---|---|
| `kgiclsolar.com` | **Primary (canonical)** | Serves the website over HTTPS |
| `www.kgiclsolar.com` | Alias | 308 redirect → `https://kgiclsolar.com` |
| `krisgoodnewssolar.com` | Secondary | 308 redirect → `https://kgiclsolar.com` |
| `www.krisgoodnewssolar.com` | Secondary alias | 308 redirect → `https://kgiclsolar.com` |

Why the apex (`kgiclsolar.com`, no www) is the primary: it matches the email addresses (`info@kgiclsolar.com`) and is shorter to type and print. The client asked for both www and non-www to work, and they will.

---

## 0. Two corrections to the plan before you start

**1. The root domain cannot use a CNAME.** DNS does not allow a CNAME on the bare domain (`kgiclsolar.com`), because that name must also hold the NS/SOA (and email MX) records. Vercel's own docs say the apex needs an **A record** and `www` needs a **CNAME**. So each domain gets:
- **A** record on `@` → the IP shown on the Vercel domain card (normally `76.76.21.21`)
- **CNAME** record on `www` → the target shown on the Vercel domain card

**2. Do NOT change the nameservers to Vercel's.** The business email (HMailPlus) lives at HostAfrica and depends on the MX/SPF/DKIM records in the HostAfrica DNS zone. Keep HostAfrica's DNS and only add or edit the web records. If you moved the nameservers to Vercel, the email would stop working until every mail record was re-created by hand.

---

## 1. Vercel: create the project and add the domains

1. Push the coming-soon repo to GitHub, then **Vercel → Add New → Project** and import it.
   - Framework Preset: **Other**. Build command: empty. Output directory: `public` (the repo's `vercel.json` already says this).
   - Use your **Pro** account for this (a client's business website counts as commercial use).
2. Deploy once. Confirm the `*.vercel.app` URL shows the page.
3. **Project → Settings → Domains → Add**, and add all four, one at a time:
   `kgiclsolar.com`, `www.kgiclsolar.com`, `krisgoodnewssolar.com`, `www.krisgoodnewssolar.com`
4. Each domain shows a card with **"Invalid Configuration"** and the exact DNS record it wants. **Copy the values from your cards.** They can be project-specific (the `www` CNAME target often looks like `xxxxxxxxxxxxxxxx.vercel-dns-017.com`). The general values (`76.76.21.21` and `cname.vercel-dns.com`) are fallbacks, not guaranteed for your project.

---

## 2. HostAfrica: edit the DNS zone

> HostAfrica's help article for the DNS manager: **Domains → Manage DNS → Edit Zone → (pen icon) → Add record**. Their article says the domain must use HostAfrica's nameservers (`ns1.host-ww.net` / `ns2.host-ww.net`) for this to apply. Confirm under **Domains → your domain → Manage Nameservers** that you are on HostAfrica's nameservers, and don't change them.

### 2.1 Before touching anything

- [ ] **Screenshot the entire existing DNS zone** of both domains (every record). This is your undo button.
- [ ] Note which records belong to **email** (MX, TXT for SPF, DKIM records, `autodiscover`/`autoconfig` if present). **Leave all of these exactly as they are.**
- [ ] Set **TTL to 300 seconds** on the records you add, so mistakes fix themselves quickly. (Raise it later.)

### 2.2 Records to add

Do this for **both** `kgiclsolar.com` and `krisgoodnewssolar.com`:

| Type | Name / Host | Value | TTL |
|---|---|---|---|
| **A** | `@` | `76.76.21.21` (or the value on that domain's Vercel card) | 300 |
| **CNAME** | `www` | The CNAME target on the `www` card in Vercel | 300 |

### 2.3 Records to remove (only these)

- Any existing **A record on `@`** pointing at a HostAfrica parking/hosting IP (the help article mentions `102.130.117.96` as their default). Two A records on `@` will send some visitors to the wrong place.
- Any existing **record on `www`** that conflicts with the new CNAME. A CNAME cannot sit beside any other record with the same name.
- **Do not remove** MX, SPF/DKIM TXT or any mail-related record.

### 2.4 If "Manage DNS" is missing

Some HostAfrica setups only show DNS management if the free **DNS Management** add-on is enabled on the domain. If you can't see it:
1. Check the domain's add-ons in the client area and enable DNS Management, or ask HostAfrica support (billing@hostafrica.com / chat).
2. Last resort: move DNS to a third party such as Cloudflare. This works, but you **must re-create every email record there first**, so avoid it unless support can't help.

---

## 3. Vercel: set up the redirects (dashboard)

After the DNS records have been added and Vercel shows the domains as valid:

| Domain in Vercel | Setting |
|---|---|
| `kgiclsolar.com` | **Production** (primary). No redirect. |
| `www.kgiclsolar.com` | **Redirect to `kgiclsolar.com`**, status **308 (permanent)** |
| `krisgoodnewssolar.com` | **Redirect to `kgiclsolar.com`**, status **308** |
| `www.krisgoodnewssolar.com` | **Redirect to `kgiclsolar.com`**, status **308** |

In the dashboard: **Settings → Domains →** `Edit` on a domain **→ Redirect to Another Domain**. Vercel will also offer this automatically when you add the apex together with `www`.

HTTP → HTTPS is automatic on Vercel, and SSL certificates are issued automatically once DNS is correct.

### Fallback: redirects in code

If the dashboard redirect doesn't preserve the path (test URL below), or you want redirects tracked in Git, put this in the repo's `vercel.json` (merge with the existing keys) **and remove the dashboard redirects so the two never fight each other**:

```json
{
  "redirects": [
    { "source": "/(.*)", "has": [{ "type": "host", "value": "www.kgiclsolar.com" }],        "destination": "https://kgiclsolar.com/$1", "permanent": true },
    { "source": "/(.*)", "has": [{ "type": "host", "value": "krisgoodnewssolar.com" }],     "destination": "https://kgiclsolar.com/$1", "permanent": true },
    { "source": "/(.*)", "has": [{ "type": "host", "value": "www.krisgoodnewssolar.com" }], "destination": "https://kgiclsolar.com/$1", "permanent": true }
  ]
}
```

(The domains must still be added to the Vercel project and pointed with DNS for this to work.)

---

## 4. Test everything

DNS changes usually take effect in minutes, but allow up to 24 to 48 hours. Check progress at dnschecker.org or with:

```bash
dig +short A kgiclsolar.com            # expect 76.76.21.21 (or your card's value)
dig +short CNAME www.kgiclsolar.com    # expect the Vercel target
dig +short A krisgoodnewssolar.com
dig +short CNAME www.krisgoodnewssolar.com
dig +short MX kgiclsolar.com           # expect HostAfrica's mail servers, unchanged
```
(Windows: `nslookup -type=A kgiclsolar.com`.)

**Redirect and SSL tests**, using `curl -sI <url>` or a browser:

| URL | Expected |
|---|---|
| `http://kgiclsolar.com` | 308 → `https://kgiclsolar.com/` |
| `https://kgiclsolar.com` | 200, shows the coming-soon page |
| `https://www.kgiclsolar.com` | 308 → `https://kgiclsolar.com/` |
| `https://krisgoodnewssolar.com` | 308 → `https://kgiclsolar.com/` |
| `https://www.krisgoodnewssolar.com` | 308 → `https://kgiclsolar.com/` |
| `https://krisgoodnewssolar.com/products?x=1` | lands on `https://kgiclsolar.com/products?x=1` (path and query kept) |
| `https://kgiclsolar.com/anything-random` | custom 404 page |
| All four hostnames | valid HTTPS certificate, no browser warning |

- [ ] Open `https://kgiclsolar.com` in an **incognito window on your phone using mobile data** (not Wi-Fi) so you see what a real visitor sees. It must load without any Vercel login or password prompt.
- [ ] Response headers on the home page include `X-Robots-Tag: noindex` (intentional during construction).

**Email check (do it right after the DNS edit):**
- [ ] Send a message **to** `info@kgiclsolar.com` from Gmail and confirm it arrives.
- [ ] Send a message **from** `info@kgiclsolar.com` to Gmail and confirm it arrives (not in spam).
- [ ] Same test for `sales@kgiclsolar.com`.

---

## 5. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| Vercel still says **Invalid Configuration** | Wrong value copied, an old A/CNAME record still exists, or DNS hasn't propagated yet. Re-check section 2.2 and 2.3, wait, then press **Refresh** on the domain card. |
| Site opens on one network but not another | Propagation in progress. Wait; lower TTL helps. |
| **Certificate pending / not secure** | DNS not yet correct, or a **CAA** record in the zone blocks the certificate authority. If the zone has CAA records, make sure they allow `letsencrypt.org`, or delete them. |
| `www` doesn't work but the apex does | The `www` CNAME is missing, wrong, or clashing with another `www` record. |
| Visitors see an old parking page | An old A record on `@` is still present (see 2.3). |
| Email stopped working | A mail record (MX/TXT) was edited or deleted. Restore from your screenshot in 2.1. |
| Redirect loops | Dashboard redirects and `vercel.json` redirects are both active. Keep only one. |

---

## 6. Other configuration to finish while you're here

**Domain security and ownership**
- [ ] Domain **lock** (transfer protection) is ON for both domains in HostAfrica.
- [ ] **Auto-renew** is ON, and the contact email on the account is one you monitor.
- [ ] Registrant details: set the **company's** details as registrant if HostAfrica lets you (the quotation says the domains are registered in the company's name).
- [ ] **Two-factor authentication** on HostAfrica, Vercel and GitHub.
- [ ] Store all logins in a password manager. Keep a backup of the DNS zone screenshots.

**Email (HMailPlus)**
- [ ] Create the two mailboxes: `info@` and `sales@`. Note the **webmail address** and give the client his login details (this is the only login he needs).
- [ ] Check HostAfrica's email product page for any DNS records it says are required (SPF, DKIM). Confirm they are present in the zone.
- [ ] Optional but recommended once mail works: add a DMARC record. Name `_dmarc`, type TXT, value `v=DMARC1; p=none; rua=mailto:info@kgiclsolar.com`. `p=none` only monitors; tighten it later.
- [ ] After the mailbox exists, add `info@kgiclsolar.com` to the coming-soon page footer.

**Renewal calendar** (set reminders now)
- Business email service runs to **30 September 2027**. Domains run to **12 October 2027**. Hosting and maintenance run 12 months from go-live.
- Send the client the **renewal quotation a few months before each expiry**, as the quotation promises. For example, set a reminder for **1 June 2027**.

**Later, not now**
- Google Search Console: add the domain property (DNS TXT verification) **at launch**, after `noindex` is removed.
- Google Business Profile: separate task, already requested by the client.
- Vercel Web Analytics (cookieless): enable with the main site.

---

## 7. Done when

- [ ] All four hostnames behave exactly as in the test table in section 4.
- [ ] HTTPS valid everywhere, no warnings.
- [ ] Email sends and receives on both mailboxes, with the original mail records untouched.
- [ ] Section 6 security items are ticked, and the renewal reminders are in your calendar.
