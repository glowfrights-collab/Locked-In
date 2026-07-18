# Unlock — Digital Wallpaper Platform (MVP)

A mobile-first site that gives away wallpapers, AI prompts, prompt bundles, and
themed art collections. Instead of paying, visitors unlock each product by
watching a (mock) ad, completing a (mock) survey, or referring a friend.

Built for TikTok-driven traffic: no account required to browse, fast
mobile-first pages, and a sticky bottom nav (Home / Explore / Saved / Account).

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM — SQLite locally (zero setup), Postgres/Supabase-ready
- Anonymous, cookie-based sessions (no login required to browse)
- Mock ad + survey integrations, built to be swapped for real vendors later

## Getting started

```bash
npm install
cp .env.example .env        # already done if you're reading this from the repo
npx prisma migrate dev      # creates prisma/dev.db and applies the schema
npm run db:seed             # seeds ~28 example products across 8 categories
npm run dev                 # http://localhost:3000
```

The default `.env` ships with a working `DATABASE_URL` (local SQLite file) and
placeholder secrets so the app runs immediately. **Replace
`DOWNLOAD_TOKEN_SECRET`, `ADMIN_PASSWORD`, and `ADMIN_COOKIE_SECRET`** before
deploying anywhere real — see `.env.example` for how to generate strong
secrets.

### Admin dashboard

Visit `/admin` and sign in with the `ADMIN_PASSWORD` from your `.env`. From
there you can add/edit/remove products, configure unlock requirements per
product, and view unlock/download/referral activity.

## How unlocking works

Each product has one or more `UnlockRequirement`s (AD, SURVEY, REFERRAL), each
with a `targetCount` (e.g. "watch 2 ads"). Progress is tracked per user per
method in `UnlockProgress`; a product is considered **Unlocked** for a visitor
the moment *any one* method reaches its target — it's derived at read time,
never stored as a flag on the product itself. See
[`src/lib/unlock/progress.ts`](src/lib/unlock/progress.ts).

Downloads are never available at a public URL. Unlocking a product lets the
client request a short-lived, HMAC-signed token
(`src/lib/download/token.ts`); only that token can pull bytes through
`GET /api/download/[token]`, which re-verifies the unlock server-side before
streaming anything.

## Anonymous sessions

No login is required to browse. On first visit, `src/middleware.ts` sets an
httpOnly `session_id` cookie (no database write). A `User` row is only created
the first time something needs to be persisted — saving a product, starting an
unlock, generating a referral link, or submitting an email
(`src/lib/session.ts`). Email is optional and only ever requested when it's
actually needed (download link backup, account settings).

## Referral abuse prevention — what's real, what's best-effort

- **Enforced**: a referral link is single-use (the first non-self, non-suspicious
  visitor to open it is the one who counts); self-referrals (same session
  cookie) are silently ignored so the link stays valid for a real friend.
- **Best-effort, not bulletproof**: a coarse fingerprint (hash of User-Agent +
  Accept-Language) flags a referrer who appears to be "referring" the same
  device repeatedly. This is a weak signal — it can produce both false
  positives (shared devices/browsers) and false negatives (trivially spoofed
  headers).
- **Known gap, not addressed in this MVP**: clearing cookies resets the
  anonymous session entirely, which defeats self-referral detection. There's
  no CAPTCHA, no real device fingerprinting, and no IP-based rate limiting.
  Treat this as a soft deterrent, not a security boundary, until a production
  pass hardens it (e.g. requiring a verified account before crediting
  referrals).

## Mock integrations — swap points for production

- **Ads**: `src/components/product/AdModal.tsx` simulates a rewarded ad with a
  countdown. Replace its "on complete" call with your ad network's real
  completion callback; the server-side logic in
  `src/lib/unlock/progress.ts#recordAdView` doesn't need to change.
- **Surveys**: `src/components/product/SurveyForm.tsx` is a 3-question
  placeholder. Swap it for an iframe/redirect to a real survey vendor that
  calls back to `POST /api/unlock/survey/submit` on completion.
- **Downloadable files**: `src/lib/download/stream.ts` currently fetches a
  picsum.photos placeholder image server-side and streams it through. See
  `DEPLOYMENT.md` for the Supabase Storage swap.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm run start` | Production build / start |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Run/create Prisma migrations |
| `npm run db:seed` | Re-seed example product data |
| `npm run db:studio` | Open Prisma Studio to inspect the local database |

## Project structure

```
prisma/               Prisma schema, migrations, seed script
src/
  app/                Next.js App Router routes
    (main)/           Consumer pages (Header + BottomNav shell)
    admin/            Admin dashboard (own auth, own shell)
    api/              Route handlers
    r/[code]/         Referral link redirect handler
  components/         ui/, layout/, home/, product/, explore/, account/, admin/
  lib/                db, session, products, unlock/, referral/, download/,
                      admin-auth, admin-products, admin-stats, analytics,
                      validation, types, images, utils
```
