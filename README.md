# KGICL Goodnews Solar Website

Official website for Kris Goodnews Int'l Co. Ltd (KGICL), a Port Harcourt-based company specializing in solar lighting, electrical materials, CCTV systems, and industrial supplies.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Hosting**: Vercel
- **Images**: Cloudinary
- **Email**: Resend

## Deployment

The review build is deployed on Vercel as **`kriss-goodnews-solar`**:

- Production URL: <https://kriss-goodnews-solar.vercel.app>
- Production branch: `main` (pushes to `main` deploy production)
- Development branch: `dev` (pushes create a Vercel **preview** deployment; merge to `main` after review)
- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Node.js: 22.x

While a task is in progress, work on `dev` and review the Vercel preview deployment for that branch. `kriss-goodnews-solar.vercel.app` updates only when `dev` is merged into `main` and pushed.

Environment variables (set for **all** environments in the Vercel project):

| Variable | Review value |
|---|---|
| `SITE_MODE` | `review` |
| `SITE_URL` | `https://kriss-goodnews-solar.vercel.app` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | See Vercel project settings |

Resend and social variables are added in Task 03. After changing an environment
variable, redeploy so the change takes effect.

Review mode keeps the site out of search: `/robots.txt` disallows everything and
responses send `x-robots-tag: noindex, nofollow`. The fixed "Review version"
badge is visible only in review mode.

> **This is a temporary review project.** Do not attach `kgiclsolar.com` to it and
> do not reuse the existing `kgicl-solar` project. The production switch happens in
> Task 04.

To check a local production build:

```bash
npm run build
npm run start
```

Then open <http://localhost:3000>. A missing `SITE_MODE` defaults to review mode.

## Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript checks
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run audit` - Run pre-launch audit checks
