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

## 2026-07-01 Owner Admin Services Pass

- Created and followed a temporary sequential plan in `docs/TEMP_OWNER_ADMIN_GOALS.md`, then deleted it after verification.
- Researched Supabase RLS/API key guidance, Vercel env vars, and admin/dashboard UX guidance.
- Added migration `202607010002_create_site_services.sql`:
  - Creates `public.site_services`.
  - Enables RLS.
  - Seeds the current Romanian service placeholders.
- Applied the services migration to the dedicated Sorina Supabase project `yjhkdmbdilzuwhwluico`.
- Fixed the `set_updated_at` function search path after Supabase security advisor flagged it.
- Verified `site_services` rows exist and RLS is enabled.
- Supabase security advisor now reports only informational `RLS Enabled No Policy` items for `appointments` and `site_services`, which is intentional for server-side-only access.
- Added `/api/content` for public active-service reads with static fallback.
- Added `/api/admin/services` for protected service CRUD using server-side Supabase service role access.
- Updated `/api/appointments` so allowed booking services come from active database services when configured.
- Added `/admin` React interface for owner service management:
  - Login with `ADMIN_PASSWORD`.
  - Add service.
  - Edit title, duration, displayed price label, order, description, and visibility.
  - Save and delete.
- Added Vercel rewrite for `/admin`.
- Updated `.env.example` and `docs/DEPLOYMENT.md` with `ADMIN_PASSWORD`.
- Out of scope for this pass: gallery uploads, contact settings, promo editor, review editor, and FAQ editor.

## 2026-07-01 Owner Admin Expansion Pass

- Added `ADMIN_PASSWORD` to the dedicated Sorina Vercel project environments.
- Added migration `202607010004_create_editable_site_content.sql`:
  - Creates `public.site_settings`.
  - Creates `public.site_gallery`.
  - Creates `public.site_reviews`.
  - Creates `public.site_promotions`.
  - Creates `public.site_faqs`.
  - Enables RLS on each new content table.
  - Seeds Romanian placeholders.
  - Creates public Supabase Storage bucket `site-gallery` for owner gallery images.
- Applied the migration to the dedicated Sorina Supabase project `yjhkdmbdilzuwhwluico`.
- Verified new table row counts and RLS status.
- Ran Supabase security and performance advisors; only expected INFO notices remain for server-side-only RLS tables and unused new appointment indexes.
- Added shared API content helpers in `api/_site-content.js`.
- Expanded `/api/content` so the public site receives services, contact, gallery, reviews, promotions, and FAQ.
- Added `/api/admin/content` for protected owner edits.
- Expanded `/admin`:
  - Services remain editable.
  - Contact/program fields are editable.
  - Gallery supports URL or image upload under 4 MB.
  - Reviews are editable.
  - Promotions are editable.
  - FAQ entries are editable.
- Connected the public site to the new editable content collections.
- Live verification showed Vercel points to the correct Supabase URL, but the stored `SUPABASE_SERVICE_ROLE_KEY` does not behave like a service role key under RLS.
- Added runtime guards so admin and booking endpoints report an explicit service role key configuration error instead of returning empty content.

## 2026-07-02 Gallery Admin UX Pass

- Removed manual editing of gallery image URLs from `/admin`; the owner now sees whether an image is saved and can open the saved image link.
- Kept image upload as the primary editing path for gallery items.
- Disabled save/delete actions while an admin save/delete operation is processing.
- Raised gallery upload limit from 4 MB to 10 MB in both API validation and Supabase Storage bucket `site-gallery`.
- Applied migration `202607020001_raise_gallery_upload_limit.sql` to the dedicated Sorina Supabase project.

## 2026-07-02 Gallery Crop Pass

- Added a square crop workflow to `/admin` gallery uploads:
  - After selecting a JPG, PNG, or WEBP file, the owner sees a 1:1 crop preview.
  - The owner can adjust zoom plus horizontal and vertical framing before saving.
  - The save button stays disabled until the crop is confirmed.
- Processed confirmed crops client-side to a 1200 x 1200 JPEG before uploading through the existing gallery API.
- Kept the existing Supabase Storage bucket and 10 MB upload limit; no database or storage schema change was required.

## 2026-07-02 Service Image Crop Pass

- Extended the same 1:1 crop workflow to service cards in `/admin`.
- Added `image_url` support to service reads/writes so public service cards can show owner-uploaded images.
- Added migration `202607020002_add_service_images.sql` to store service image URLs on `public.site_services`.
- Reused the existing public `site-gallery` Supabase Storage bucket and protected admin upload path.

## 2026-07-02 Before/After Admin Pass

- Added editable before/after results to `/admin`.
- Added migration `202607020003_create_before_after_results.sql`:
  - Creates `public.site_results`.
  - Stores title, before image URL, after image URL, order, and visibility.
  - Enables RLS and seeds the three existing result placeholders.
- Applied the migration to the dedicated Sorina Supabase project `yjhkdmbdilzuwhwluico`.
- Reused the existing 1:1 crop workflow for both the Inainte and Dupa images.
- Connected the public results section to `site_results`, while preserving placeholder visuals until real images are uploaded.

## 2026-07-02 Editable Content SEO Pass

- Added migration `202607020004_add_image_seo_fields.sql`:
  - Adds `image_alt_text` to `public.site_services`.
  - Adds `before_alt_text`, `after_alt_text`, and `caption` to `public.site_results`.
- Applied the migration to the dedicated Sorina Supabase project `yjhkdmbdilzuwhwluico`.
- Verified the new columns exist in Supabase.
- Added owner-editable SEO text fields in `/admin` for service images and before/after images.
- Public service cards and before/after cards now prefer owner-provided alt text, with Romanian fallbacks.
- Confirmed crop uploads now use descriptive filenames based on section and title.
- Added dynamic JSON-LD generated from the live API content for BeautySalon, services, FAQ, real reviews, and result images.
- Kept placeholder reviews out of dynamic structured data.

## 2026-07-02 Booking Availability Pass

- Added shared booking helpers in `api/_booking.js`.
- Extended `/api/appointments`:
  - `GET /api/appointments?date=YYYY-MM-DD` returns visible appointment slots for that date.
  - `POST /api/appointments` now requires a valid configured slot.
  - Booked active slots return `409` instead of allowing a duplicate request.
- Replaced the free time input in the public booking form with selectable slot buttons.
- Occupied slots remain visible as `Blocat` and cannot be selected.
- Current default slots run every 15 minutes from 10:00 to 18:00 until Sorina saves her exact online booking hours in admin.
- Added migration `202607020005_add_appointment_slot_uniqueness.sql` with a partial unique index for active appointment slots.
- Applied the migration to the dedicated Sorina Supabase project `yjhkdmbdilzuwhwluico` after checking there were no existing duplicate active slots.

## 2026-07-02 Admin Appointments And Email Notifications

- Added migration `202607020006_add_appointment_admin_notifications.sql`:
  - Adds `internal_notes` and `updated_at` to `public.appointments`.
  - Creates `public.appointment_notifications` for notification logs.
  - Keeps RLS enabled and revokes direct anon/authenticated table access.
- Added admin API support for appointment list/create/update.
- Added owner-editable notification settings in `site_settings.notifications`.
- Added Resend-based email notifications:
  - Immediate email when a new public appointment is saved.
  - Scheduled one-hour-before reminder for active appointments.
  - Cancellation/replacement of scheduled reminders when an admin moves or cancels an appointment.
- Added a Vercel Cron endpoint for the daily "tomorrow appointments" digest, protected by `CRON_SECRET`.
- Added `/admin` UI for managing client appointments, statuses, date/time moves, notes, and notification email settings.

## 2026-07-02 Appointments Admin Separation

- Added `/admin/programari` as a dedicated appointments admin page.
- Kept `/admin` focused on editable site content, with a header link to the appointments page.
- Added a real delete action for appointments in the admin API and UI.
- Delete cancels/replaces any pending reminder before removing the appointment row.

## 2026-07-02 Client Appointment Reminders

- Added notification log types for client reminders:
  - `client_one_day_before`
  - `client_one_hour_before`
- Client reminders are scheduled through Resend only when the appointment has a valid client email.
- Client emails include only appointment details, not internal notes or admin status.
- Saving notification settings now reschedules reminders for active appointments.
- Updated the live email preview page with client reminder examples.

## 2026-07-02 Email Test And Resend Limits

- Added a protected admin action for sending a test email to the notification email currently set in `/admin/programari`.
- Added Resend Free plan awareness in the appointments admin:
  - 3,000 emails/month.
  - 100 emails/day.
  - If the quota is exceeded, notifications can stop until reset or plan upgrade.
- Test email responses surface Resend quota headers when Resend returns them.
- Added the test email layout to the public email preview page.

## 2026-07-02 Owner Booking Hours

- Added owner-editable booking hours in `/admin/programari`.
- Stored the booking schedule in `site_settings.booking`, reusing the existing server-side settings table.
- Public booking availability and admin appointment validation now generate 15-minute slots from Sorina's saved start/end hours.
- Existing appointments outside the current schedule stay visible in admin and are labelled in the time dropdown instead of disappearing.

## 2026-07-03 Appointment Service Constraint Fix

- Added migration `202607030001_allow_dynamic_appointment_services.sql`.
- Removed the old `appointments.service` fixed English service-name check.
- Replaced it with a length-only check because services are now owner-editable and validated by the booking API against active `site_services`.
- Applied the migration to the dedicated Sorina Supabase project `yjhkdmbdilzuwhwluico`.
- Verified a Romanian service name (`Efect natural`) can be inserted in a rollback transaction.
