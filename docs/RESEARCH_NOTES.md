# Research Notes

Date: 2026-06-30

Scope: initial preparation for a Romanian lash studio website. These notes are for product/design decisions, not final legal advice.

## Useful Findings

- Appointment flow should be visible early. For a local service business, the main action should be easy to find from hero, header, service cards, and contact.
- Lash content should include realistic care and safety information. Avoid implying that extensions are risk-free or maintenance-free.
- Before/after images and real reviews will matter more than decorative beauty copy.
- If a contact/booking form collects name, phone, preferred date, or message, the site needs clear privacy information and should collect only necessary fields.
- Mobile speed is important because many users will come from Instagram/Google and decide quickly.

## Sources To Revisit

- American Academy of Ophthalmology, eyelash extension safety background: https://www.aao.org/eye-health/tips-prevention/eyelash-extension-facts-safety
- Google Business Profile help, bookings/appointment presence: https://support.google.com/business/
- GDPR Article 13 source text, information required when collecting personal data: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- W3C WCAG quick reference for accessibility checks: https://www.w3.org/WAI/WCAG22/quickref/

## Practical Implications For This Site

- Add a short "before appointment" and "aftercare" FAQ once Sorina confirms her process.
- Keep booking fields minimal: name, phone, service, preferred date/time, optional notes.
- Add a privacy note near the form before launch.
- Use real work photography as the main persuasive asset.
- Make Google/Instagram pathways obvious once links are available.

## 2026-07-01 Live-Readiness Research

Sources checked:

- W3C WAI form labeling: https://www.w3.org/WAI/tutorials/forms/labels/
- WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/
- Vercel Vite docs: https://vercel.com/docs/frameworks/frontend/vite
- Vercel Functions docs: https://vercel.com/docs/functions
- Supabase RLS docs: https://supabase.com/docs/guides/database/postgres/row-level-security
- Google LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business

Applied decisions:

- Booking form keeps visible labels. W3C notes that labels identify controls and are especially useful on mobile.
- Inputs use native types where possible (`date`, `time`, `email`, `tel`) so mobile devices can show better controls/keyboards.
- Form status must use `role="status"` / live feedback and avoid silent failures.
- A privacy consent checkbox is required before collecting appointment data.
- The Supabase `service_role` key must stay server-side only. The frontend calls `/api/appointments`; the serverless function writes to Supabase.
- RLS remains enabled on `public.appointments`; no public `anon` insert policy is added.
- Vercel can deploy Vite with build output `dist`; Functions can be added for backend work, but live deployment should wait until a separate Sorina Vercel project and separate Sorina Supabase project exist.
- Local business structured data should wait for real name, address/area, phone, URL, opening hours, and image assets.
