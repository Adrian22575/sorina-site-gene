# Agent Rules For Sorina Lash Studio

Read this file before editing the project. The goal is a premium, conversion-focused website for Sorina, a lash artist/studio, based on `docs/reference/mockup_site_gene_react.jsx`.

## Project Intent

- Primary outcome: visitors trust Sorina quickly and request an appointment.
- Audience: women looking for lash extensions, lamination, careful technique, central Bucharest location, and a premium but warm experience.
- Tone: refined, calm, precise, feminine without becoming generic beige beauty-template.
- First viewport: brand, promise, appointment CTA, and a strong beauty/lash visual.

## Work Rules

- Keep changes scoped and easy to review.
- Prefer existing React + CSS structure unless there is a clear reason to add tooling.
- Do not invent real prices, awards, certifications, phone numbers, testimonials, or addresses. Mark them as pending until the user supplies them.
- Use real images only when provided by the user or clearly licensed/approved. Place source notes in `docs/RESEARCH_NOTES.md` if using external references.
- Use `lucide-react` for icons and `framer-motion` only for restrained motion that improves hierarchy.
- Avoid hidden complexity: no CMS, backend, analytics, tracking, or form delivery until the user approves the path.
- Keep visible UI copy in Romanian unless the user asks otherwise.
- Before finalizing any implementation turn, run `npm.cmd run build` when relevant.

## Design Guardrails

- No boxed hero card. The hero should feel full-bleed or image-led.
- Cards are acceptable for repeated services, reviews, FAQ rows, and forms, but keep radius restrained.
- Avoid one-note beige/pink-only palettes; use wine, soft neutrals, ink, and a small gold accent.
- Do not use negative letter spacing.
- Do not scale font size continuously with viewport width; use fixed sizes with media-query adjustments.
- Check mobile and desktop for text overlap before calling UI work finished.

## Collaboration Memory

- `docs/PROJECT_BRIEF.md` is the source of truth for what the site needs to become.
- `docs/WORKLOG.md` records decisions and completed setup.
- `docs/RESEARCH_NOTES.md` records external research and source links.
- `docs/reference/mockup_site_gene_react.jsx` is the copied mockup reference from the user's original file.

## Safety

- Do not commit, push, deploy, or connect third-party services unless the user explicitly asks.
- Do not store secrets in this repository.
- If adding booking/contact handling, include privacy notice requirements before collecting personal data.
- Never connect Sorina to the existing `facultate` Vercel project or `facultate-app` Supabase project. The user confirmed these must stay separate.
