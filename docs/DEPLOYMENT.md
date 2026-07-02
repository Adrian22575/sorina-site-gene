# Deployment And Booking Setup

Date: 2026-07-01

## Current Architecture

- Frontend: Vite + React, deployed on Vercel.
- Booking endpoint: `api/appointments.js`, a Vercel Serverless Function.
- Public content endpoint: `api/content.js`, used for active editable services.
- Admin services endpoint: `api/admin/services.js`, protected by `ADMIN_PASSWORD`.
- Admin content endpoint: `api/admin/content.js`, protected by `ADMIN_PASSWORD`.
- Database: Supabase tables `public.appointments`, `public.site_services`, `public.site_settings`, `public.site_gallery`, `public.site_reviews`, `public.site_promotions`, and `public.site_faqs`.
- Storage: Supabase public bucket `site-gallery` for owner-uploaded gallery images.
- Secret handling: `SUPABASE_SERVICE_ROLE_KEY` is server-only and must be stored in Vercel environment variables. Do not expose it in `VITE_` or `NEXT_PUBLIC_` variables.

## Current Link Status

- Dedicated Vercel project created: `adrian22575s-projects/sorina-site-gene`.
- Local repo linked to project ID `prj_pkQBvh2Jyv4M0jlTyeGorKMcAyOS`.
- Existing Vercel project `facultate` remains separate and was not linked.
- Dedicated Supabase project created: `sorina-site-gene`.
- Sorina Supabase project ref: `yjhkdmbdilzuwhwluico`.
- Sorina Supabase URL: `https://yjhkdmbdilzuwhwluico.supabase.co`.
- Existing Supabase project `facultate-app` remains separate and was not modified.

## Required Vercel Environment Variables

Set these for Production, Preview, and Development:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
```

The repo includes `.env.example` with names only.

`ADMIN_PASSWORD` is the password Sorina uses at `/admin` to manage services. It must be stored only in Vercel/local env, never in Git.

## Supabase Migration

Migration file:

```text
supabase/migrations/202607010001_create_appointments.sql
supabase/migrations/202607010002_create_site_services.sql
supabase/migrations/202607010003_fix_site_services_updated_at_search_path.sql
supabase/migrations/202607010004_create_editable_site_content.sql
supabase/migrations/202607020001_raise_gallery_upload_limit.sql
```

The appointment migration creates `public.appointments`, enables RLS, revokes `anon` and `authenticated` access, and expects inserts to go through the Vercel API using the server-side service role key.

The services migration creates `public.site_services`, enables RLS, and seeds the current Romanian service placeholders. Public reads and admin writes go through Vercel API routes using the server-side service role key.

The editable content migration creates settings, gallery, reviews, promotions, FAQ tables, and the `site-gallery` storage bucket. These tables also keep RLS enabled and are accessed only through Vercel API routes.

## Project Separation Rule

The connected Supabase account currently exposes one project named `facultate-app`.

Do not apply the appointment migration there. The user confirmed on 2026-07-01 that the Sorina site must be a totally separate project and must not be combined with the faculty app.

The connected Vercel account currently exposes one project named `facultate`.

Do not link or deploy this repository to that project. The Sorina site needs its own Vercel project.

## Manual Dashboard Steps If Needed

1. Copy the Sorina Supabase project URL into the Sorina Vercel project as `SUPABASE_URL`.
2. Copy the Sorina Supabase service role key into the Sorina Vercel project as `SUPABASE_SERVICE_ROLE_KEY`.
3. Add a strong private password as `ADMIN_PASSWORD`.
4. Deploy after env vars are present, or let Git integration deploy automatically after push.
5. Test `/admin`, edit a service, contact field, gallery image, review, promotion, and FAQ item.
6. Confirm `public.site_services`, `public.site_settings`, `public.site_gallery`, `public.site_reviews`, `public.site_promotions`, and `public.site_faqs` update in Supabase.
7. Test the booking form and confirm a row appears in the Sorina `public.appointments` table.

## CLI Notes

Use CLI only against a dedicated Sorina project:

```powershell
vercel project add sorina-site-gene --scope adrian22575s-projects
vercel link --yes --scope adrian22575s-projects --project sorina-site-gene
vercel env add SUPABASE_URL production preview development
vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development
vercel env add ADMIN_PASSWORD production preview development
```

Do not use `--project facultate` and do not run `vercel link` if the CLI proposes the `facultate` project.

## Verification Checklist

- `npm.cmd run build` passes locally.
- `npm.cmd run lint` passes locally.
- Vercel deployment builds with `npm run build`.
- `/api/appointments` returns `503` if env vars are missing.
- `/api/appointments` returns `200` after env vars and Supabase table are configured.
- `/api/content` returns fallback services if env vars are missing.
- `/admin` loads the owner panel after `ADMIN_PASSWORD` is configured.
- Gallery upload accepts JPG, PNG, and WEBP images under 10 MB.
- Supabase table has RLS enabled and no public insert policy.

## Supabase Verification

Completed on 2026-07-01:

- Migration `create_appointments` applied to `yjhkdmbdilzuwhwluico`.
- Migration `create_site_services` applied to `yjhkdmbdilzuwhwluico`.
- Migration `fix_site_services_updated_at_search_path` applied to `yjhkdmbdilzuwhwluico`.
- Migration `create_editable_site_content` applied to `yjhkdmbdilzuwhwluico`.
- `public.appointments` exists.
- `public.site_services` exists and contains the current Romanian service placeholders.
- Editable content tables exist and contain Romanian placeholders.
- Storage bucket `site-gallery` exists, is public, and accepts JPG/PNG/WEBP files up to 10 MB.
- RLS is enabled on `public.appointments`.
- RLS is enabled on `public.site_services`.
- RLS is enabled on editable content tables.
- `pg_policies` for `public.appointments` returns no public policies.
- Supabase security advisor only reports `RLS Enabled No Policy` as INFO for server-side-only content tables; this is intentional because API routes use server-side service role access.
- Supabase performance advisor only reports unused appointment indexes as INFO while the project is new.
- Project URL is `https://yjhkdmbdilzuwhwluico.supabase.co`.

Still needed:

- Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `ADMIN_PASSWORD` to the dedicated Vercel project `sorina-site-gene`.
- The service role key is secret and should be copied from the Supabase dashboard; do not commit it.
- If `/admin` reports that `SUPABASE_SERVICE_ROLE_KEY` is not a valid `service_role` key, replace the Vercel value with the real Supabase service role/secret key, then redeploy.
