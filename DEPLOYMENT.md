# Deployment Guide

## 1. Deploying the app to Vercel

1. Push this repository to GitHub (or another Vercel-supported Git provider).
2. In Vercel, "Add New Project" → import the repo.
3. Set the environment variables (Project Settings → Environment Variables) —
   see `.env.example` for the full list:
   - `DATABASE_URL` — see step 2 below (Supabase Postgres connection string)
   - `NEXT_PUBLIC_SITE_URL` — your production URL, e.g. `https://your-app.vercel.app`
   - `DOWNLOAD_TOKEN_SECRET` — generate with `openssl rand -hex 32`
   - `ADMIN_PASSWORD` — a real password, not the local dev default
   - `ADMIN_COOKIE_SECRET` — generate with `openssl rand -hex 32`
4. Deploy. Vercel runs `npm run build`, which triggers `prisma generate` via
   the `postinstall` script.

SQLite (the local dev database) **will not work on Vercel** — its filesystem
is ephemeral/read-only at runtime. You must move to Supabase Postgres before
deploying (step 2).

## 2. Moving from local SQLite to Supabase Postgres

1. Create a Supabase project at supabase.com. Grab the Postgres connection
   string from Project Settings → Database (use the "connection pooling" URI
   for serverless environments like Vercel).
2. In `prisma/schema.prisma`, change:
   ```diff
   datasource db {
   -  provider = "sqlite"
   +  provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   No other schema changes are required — every field was written to be
   Postgres-compatible from the start (the SQLite-only limitation was the lack
   of native enums, which are already modeled as validated strings; see the
   comment block at the top of `schema.prisma` if you want to promote them to
   real Postgres `enum` types instead).
3. Set `DATABASE_URL` in your environment to the Supabase connection string.
4. Run the migration against Supabase:
   ```bash
   npx prisma migrate deploy
   npm run db:seed   # optional — seeds the same example catalog
   ```
5. If you want real Supabase Auth or Row Level Security instead of the
   anonymous-cookie session model, that's a larger follow-up change — the MVP
   intentionally keeps its own lightweight session model so browsing never
   requires an account.

## 3. Moving downloadable files from picsum.photos to Supabase Storage

Today, `src/lib/download/stream.ts` fetches a placeholder image from
picsum.photos server-side and streams it back through the protected
`/api/download/[token]` route. To swap in real files stored in Supabase
Storage:

1. Create a **private** Supabase Storage bucket (not public) for downloadable
   files.
2. Upload real files, and store their storage path in `ProductFile.seed`
   (repurpose this field, or add a new column — either is a small migration).
3. Replace the body of `fetchDownloadableFile` in
   `src/lib/download/stream.ts` with a Supabase signed URL fetch, e.g.:
   ```ts
   const { data } = await supabase.storage
     .from("downloads")
     .createSignedUrl(file.seed, 60); // seconds
   const upstream = await fetch(data.signedUrl);
   ```
4. No changes are needed anywhere else — the token-minting, unlock
   re-verification, and streaming/logging logic in
   `src/app/api/download/[token]/route.ts` stays the same, since it already
   treats "fetch the bytes" as a black box.

## 4. Swapping in a real ad network or survey provider

- **Ads**: replace the cosmetic countdown in
  `src/components/product/AdModal.tsx` with your ad network's SDK. Call the
  existing `POST /api/unlock/ad/start` endpoint from the network's real
  "reward granted" callback instead of a local timer.
- **Surveys**: replace `src/components/product/SurveyForm.tsx` with an
  iframe/redirect to your survey vendor, and have their completion webhook (or
  redirect-back URL) call `POST /api/unlock/survey/submit`.

Neither swap requires touching `src/lib/unlock/progress.ts` — the
"advance progress → check target → mark complete" logic is vendor-agnostic.

## 5. Production checklist

- [ ] `DATABASE_URL` points at Supabase Postgres (not the local SQLite file)
- [ ] `DOWNLOAD_TOKEN_SECRET` and `ADMIN_COOKIE_SECRET` are freshly generated, not the dev defaults
- [ ] `ADMIN_PASSWORD` is a real password
- [ ] `NEXT_PUBLIC_SITE_URL` matches your production domain (used to build referral share links)
- [ ] Downloadable files are served from private storage, not a public bucket/URL
