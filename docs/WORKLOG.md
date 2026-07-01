# Worklog

## 2026-06-30

- Inspected the provided mockup from `C:/Users/40799/Documents/Site Sorina Gene/mockup_site_gene_react (1).jsx`.
- Created a Vite + React project in `C:/Users/40799/Documents/Sorina_Site_Gene`.
- Installed project dependencies with Node system certificates:
  - `react`
  - `react-dom`
  - `vite`
  - `oxlint`
  - `lucide-react`
  - `framer-motion`
- Copied the original mockup into `docs/reference/mockup_site_gene_react.jsx`.
- Replaced the default Vite demo with a Sorina landing-page foundation.
- Added `scripts/dev-server.cmd` for repeatable local server startup.
- Added project memory files:
  - `AGENTS.md`
  - `docs/PROJECT_BRIEF.md`
  - `docs/RESEARCH_NOTES.md`
  - `docs/WORKLOG.md`
- Verified:
  - `npm.cmd run build` passes.
  - `npm.cmd run lint` passes.
  - Local Vite server responds with HTTP 200 at `http://127.0.0.1:5173/`.
  - Edge headless check passes on desktop and mobile with no console errors and no horizontal overflow.

## Open Decisions

- Real brand name/logo treatment.
- Final copy tone: fully Romanian, bilingual, or Romanian with selective English service names.
- Booking route: WhatsApp, email form, external booking, or backend.
- Real photo assets and permission to use them.
- Exact prices, durations, promotions, awards, certifications, and testimonials.

## 2026-07-01

- Restored the service effect names from the original mockup:
  - Natural Effect
  - Soft Effect
  - Intense Effect
  - Lash / Brow Lamination
- Added `Learn more` actions to all 4 service cards.
- Reworked the page styling closer to the original mockup: centered service intro, stronger service cards, promo band, gallery, real-results section, booking area, contact card, and footer.
- Added 3 interactive before/after result cards.
- Before/after behavior:
  - Desktop: hover/pointer movement changes the comparison position.
  - Mobile: range/touch drag changes the comparison position.
- Mobile polish:
  - Header nav wraps instead of clipping.
  - Result labels stay visible and are no longer clipped by the comparison mask.
- Verified:
  - `npm.cmd run build` passes.
  - `npm.cmd run lint` passes.
  - Edge headless desktop and mobile checks pass with no console errors, no horizontal overflow, 4 service cards, 4 `Learn more` actions, and 3 interactive comparison cards.

## 2026-07-01 Live Prep

- Created and followed a temporary sequential plan in `docs/TEMP_SEQUENTIAL_GOALS.md`, then deleted it after completion.
- Confirmed project separation:
  - Existing Vercel project `facultate` was not used.
  - Existing Supabase project `facultate-app` was not modified.
- Created a dedicated Vercel project: `adrian22575s-projects/sorina-site-gene`.
- Linked this local repo to the dedicated Vercel project only.
- Did not deploy yet; deployment should happen after the dedicated Sorina Supabase project and env vars are configured, or through Git auto-deploy when origin integration is ready.
- Added current research notes for forms/accessibility, Vite on Vercel, Vercel Functions, Supabase RLS, and LocalBusiness structured data.
- Hardened booking:
  - Required privacy consent checkbox.
  - Hidden bot honeypot.
  - Accessible form status.
  - API validates consent, allowed service names, JSON body, date/time format, and missing env config.
- Corrected `.gitignore` so `.env.local` remains ignored while `.env.example` can be tracked.
- Verified:
  - `npm.cmd run build` passes.
  - `npm.cmd run lint` passes.
  - `api/appointments.js` returns controlled `503` when Supabase env vars are not configured.

## 2026-07-01 Supabase Setup

- Detected renamed organization `Anghel Adrian`.
- Confirmed separate Supabase project exists:
  - Name: `sorina-site-gene`
  - Ref: `yjhkdmbdilzuwhwluico`
  - URL: `https://yjhkdmbdilzuwhwluico.supabase.co`
- Applied migration `create_appointments` only to `sorina-site-gene`.
- Verified:
  - `public.appointments` exists.
  - Columns match the booking data model.
  - RLS is enabled.
  - No public policies exist for `appointments`.
- Did not modify `facultate-app`.
- Next needed step: add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the dedicated Vercel project `sorina-site-gene`.

## 2026-07-01 Romanian SEO Pass

- Created and followed a temporary sequential plan in `docs/TEMP_SEO_RO_GOALS.md`, then deleted it after verification.
- Researched current official SEO guidance from Google Search Central and schema.org, then recorded the sources in `docs/RESEARCH_NOTES.md`.
- Rewrote visible website copy in Romanian:
  - Header navigation and CTAs.
  - Hero, proof strip, services, promo, gallery, results, about, reviews, FAQ, booking, contact, and footer.
  - Booking form labels, submit state, select options, and API fallback messages.
- Replaced English service names with Romanian service names and updated backend validation to match.
- Added SEO foundations:
  - `html lang="ro"`.
  - Romanian title and meta description.
  - Canonical URL for the live Vercel site.
  - Open Graph and Twitter preview tags.
  - BeautySalon JSON-LD with no invented phone, address, hours, reviews, awards, prices, or certifications.
  - `public/robots.txt`.
  - `public/sitemap.xml`.
  - Public Open Graph image copied from the current hero asset.
- Changed the hero visual to render as a standard HTML image with meaningful alt text.
- Left factual business fields pending until supplied by the user/Sorina.

## 2026-07-01 AI/Search Discoverability Pass

- Created and followed a temporary sequential plan in `docs/TEMP_AI_SEARCH_GOALS.md`, then deleted it after verification.
- Added static Romanian fallback content inside `index.html` so the page still exposes core content before React renders.
- Expanded JSON-LD to an `@graph` with:
  - `BeautySalon`
  - `FAQPage`
- Added public AI/search support files:
  - `public/llms.txt`
  - `public/site-summary.md`
- Added `site-summary.md` to `public/sitemap.xml`.
- Recorded the limitation that `llms.txt` is an emerging convention, not a guaranteed ranking mechanism.
