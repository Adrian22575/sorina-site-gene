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

## 2026-07-01 Romanian SEO Pass

Sources checked:

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google structured data intro: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google image SEO best practices: https://developers.google.com/search/docs/appearance/google-images
- schema.org BeautySalon type: https://schema.org/BeautySalon

Applied decisions:

- Changed the document language to Romanian and rewrote visible interface copy in Romanian.
- Added a concise Romanian title and meta description focused on extensii de gene, laminare, Bucuresti, and programare.
- Added canonical URL, Open Graph, Twitter preview tags, robots.txt, and sitemap.xml for the current Vercel URL.
- Added BeautySalon JSON-LD with only safe, non-invented information: name, URL, image, Bucuresti as locality, service names, and appointment action.
- Kept prices, awards, certifications, testimonials, exact phone, exact address, and schedule as pending rather than inventing facts.
- Moved the hero visual into a standard HTML `img` path with meaningful alt text, because Google image guidance says crawlers discover images through `img src`, not CSS backgrounds.
- Important: Google explicitly says SEO best practices help crawling/indexing/understanding, but do not guarantee first place. Further ranking work needs real photos, real reviews, Google Business Profile, backlinks/mentions, Search Console, final domain, and complete local business details.

## 2026-07-01 AI/Search Discoverability Pass

Sources checked:

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google structured data intro: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google image SEO best practices: https://developers.google.com/search/docs/appearance/google-images
- Public discussion around `llms.txt` as an emerging convention, not a formal search ranking standard.

Applied decisions:

- Added static Romanian fallback content inside the initial HTML root so non-JavaScript readers still see brand, services, FAQ, programare, and contact context.
- Added FAQPage JSON-LD that matches the visible FAQ copy.
- Added `/llms.txt` as a concise orientation file for AI agents and language-model crawlers.
- Added `/site-summary.md` as a plain-text Romanian summary linked from `llms.txt` and sitemap.
- Did not add fake keyword stuffing, hidden prompt instructions, fake reviews, fake local details, or claims of guaranteed first ranking.
- Treat `llms.txt` as a low-risk supplemental signal only. It may help some AI tools understand the site, but it has no guaranteed adoption across Google, ChatGPT, Gemini, Claude, Bing, or other AI products.

## 2026-07-01 Owner Admin Pass

Sources checked:

- Supabase Row Level Security docs: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase API keys docs: https://supabase.com/docs/guides/getting-started/api-keys
- Vercel Environment Variables docs: https://vercel.com/docs/environment-variables
- Nielsen Norman Group dashboard guidance: https://www.nngroup.com/articles/dashboards-preattentive/

Applied decisions:

- Start with services because they affect both the public section and the booking form.
- Keep direct database access server-side. The public website calls `/api/content`; the admin calls `/api/admin/services`.
- Keep RLS enabled on `public.site_services` and avoid public table policies for this pass.
- Protect `/api/admin/services` with `ADMIN_PASSWORD` stored in env, not in source control.
- Keep the owner interface narrow: list, edit fields, visibility toggle, save, delete, reload.
- Do not add gallery uploads, reviews, promotions, FAQ editing, or a full CMS until the services flow proves useful.

## 2026-07-01 Owner Admin Expansion

Sources checked:

- Supabase changelog index: https://supabase.com/changelog.md
- Supabase Row Level Security docs: https://supabase.com/docs/guides/database/postgres/row-level-security
- Vercel Environment Variables docs: https://vercel.com/docs/environment-variables

Applied decisions:

- Extend the same admin model instead of adding a separate CMS.
- Keep content access server-side through Vercel API routes and keep RLS enabled on every public-schema table.
- Use `site_settings` for contact/program because there is one editable contact block.
- Use separate tables for gallery, reviews, promotions, and FAQ so each section can be ordered, hidden, edited, or deleted independently.
- Store gallery uploads in a dedicated public Supabase Storage bucket named `site-gallery`; uploads are accepted only through the protected admin API.
- Keep all visible fallback copy in Romanian and avoid inventing real contact details, reviews, prices, or claims.

## 2026-07-02 Editable Content SEO / AI SEO Pass

Sources checked:

- Google AI optimization guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google image SEO best practices: https://developers.google.com/search/docs/appearance/google-images
- Supabase changelog index: https://supabase.com/changelog.md

Applied decisions:

- Treat "AI SEO" as strong normal SEO: useful visible content, crawlable structure, image context, and structured data.
- Add owner-editable image context where it was missing: service image alt text and before/after alt/caption fields.
- Generate more descriptive upload filenames from section and title instead of relying on camera filenames like `IMG_1234`.
- Add dynamic JSON-LD from the current API content, while skipping placeholder reviews so the site does not publish fake testimonials as structured data.
- Keep the implementation on existing tables with small additive columns; no new CMS or public table access.
