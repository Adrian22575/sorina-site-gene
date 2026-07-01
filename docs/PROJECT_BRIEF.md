# Sorina Lash Studio - Project Brief

Date: 2026-06-30

## Goal

Build a premium, fast, mobile-friendly website for Sorina's lash services. The site should make a visitor understand the offer, trust the artist, see proof/results, and request an appointment.

## Core Conversion

Primary CTA: request an appointment.

Likely routing options, to decide later:

- WhatsApp CTA for fastest launch.
- Simple contact form sent by email.
- External booking tool if Sorina already uses one.

## Visual Thesis

Elegant beauty editorial: close-up lash photography, warm skin tones, dark wine contrast, quiet spacing, and precise typography.

## Content Plan

1. Hero: Sorina brand, premium promise, appointment CTA, strong lash/portrait photo.
2. Proof strip: awards, experience, clients, certification, only after real facts are confirmed.
3. Services: Natural Effect, Soft Effect, Intense Effect, Lash/Brow Lamination.
4. Offer: optional campaign/promo, only with real terms.
5. Gallery: real lash work, studio atmosphere, portrait, details.
6. Results: before/after, ideally slider or paired images.
7. About: Sorina's story, expertise, approach, hygiene, personalization.
8. Reviews + FAQ: social proof and objections.
9. Booking: low-friction request form or WhatsApp flow.
10. Contact: Izvor area, phone, Instagram, schedule, map.

## Interaction Thesis

- Hero entrance: text and visual fade/slide in quietly.
- Gallery/results: subtle hover reveal and future before/after comparison.
- FAQ: accordion interaction, not static rows, once answers are written.

## Required Inputs From User

- Official business/studio name and preferred logo text.
- Real contact details: phone, Instagram, email, schedule.
- Exact address or only public area if privacy matters.
- Services, durations, prices, and maintenance pricing.
- Awards/certifications with exact wording.
- Real testimonials or screenshots that can be quoted.
- Real photos: hero close-up, gallery, before/after, owner portrait, studio.
- Booking preference: WhatsApp, form, Calendly/other, or custom backend.

## Current Technical Stack

- React 19
- Vite 8
- CSS modules by convention through `src/App.css` and `src/index.css`
- `lucide-react` for icons
- `framer-motion` for restrained animation
- Oxlint through `npm.cmd run lint`

## Risk Register

- Trust risk: no real photos/reviews yet. Mitigation: collect assets before final design.
- Legal/privacy risk: booking form collects personal data. Mitigation: privacy text and minimal fields before launch.
- Claim risk: placeholders for awards/certifications must not become final without proof.
- Conversion risk: too many sections can dilute booking. Mitigation: keep hero, services, proof, gallery, booking clear.
- Performance risk: large photos can slow mobile. Mitigation: compress images and use responsive sizes.

## First Implementation State

The Vite demo has been replaced by a Sorina landing-page foundation. It is intentionally not final: images, claims, prices, reviews, answers, and contact details still need real content.
