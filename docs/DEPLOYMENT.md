# Deployment And Booking Setup

Date: 2026-07-01

## Current Architecture

- Frontend: Vite + React, deployed on Vercel.
- Booking endpoint: `api/appointments.js`, a Vercel Serverless Function.
- Database: Supabase table `public.appointments`.
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
```

The repo includes `.env.example` with names only.

## Supabase Migration

Migration file:

```text
supabase/migrations/202607010001_create_appointments.sql
```

It creates `public.appointments`, enables RLS, revokes `anon` and `authenticated` access, and expects inserts to go through the Vercel API using the server-side service role key.

## Project Separation Rule

The connected Supabase account currently exposes one project named `facultate-app`.

Do not apply the appointment migration there. The user confirmed on 2026-07-01 that the Sorina site must be a totally separate project and must not be combined with the faculty app.

The connected Vercel account currently exposes one project named `facultate`.

Do not link or deploy this repository to that project. The Sorina site needs its own Vercel project.

## Manual Dashboard Steps If Needed

1. Copy the Sorina Supabase project URL into the Sorina Vercel project as `SUPABASE_URL`.
2. Copy the Sorina Supabase service role key into the Sorina Vercel project as `SUPABASE_SERVICE_ROLE_KEY`.
3. Deploy after env vars are present, or let Git integration deploy automatically after push.
4. Test the booking form and confirm a row appears in the Sorina `public.appointments` table.

## CLI Notes

Use CLI only against a dedicated Sorina project:

```powershell
vercel project add sorina-site-gene --scope adrian22575s-projects
vercel link --yes --scope adrian22575s-projects --project sorina-site-gene
vercel env add SUPABASE_URL production preview development
vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development
```

Do not use `--project facultate` and do not run `vercel link` if the CLI proposes the `facultate` project.

## Verification Checklist

- `npm.cmd run build` passes locally.
- `npm.cmd run lint` passes locally.
- Vercel deployment builds with `npm run build`.
- `/api/appointments` returns `503` if env vars are missing.
- `/api/appointments` returns `200` after env vars and Supabase table are configured.
- Supabase table has RLS enabled and no public insert policy.

## Supabase Verification

Completed on 2026-07-01:

- Migration `create_appointments` applied to `yjhkdmbdilzuwhwluico`.
- `public.appointments` exists.
- RLS is enabled on `public.appointments`.
- `pg_policies` for `public.appointments` returns no public policies.
- Project URL is `https://yjhkdmbdilzuwhwluico.supabase.co`.

Still needed:

- Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the dedicated Vercel project `sorina-site-gene`.
- The service role key is secret and should be copied from the Supabase dashboard; do not commit it.
