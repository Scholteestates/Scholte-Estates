@AGENTS.md

# Scholte Estates — project instructions

Website for **Scholte Estates**, an independent real estate agency in
Ciudad Quesada serving the Costa Blanca and international buyers.

## Separation from AIVENA (strict)

- This project is fully separate from AIVENA.
- Work only inside this folder and the repository below.
- Never read, modify, start, stop or reuse AIVENA files, services,
  credentials, databases, deployment settings or running processes.
- AIVENA integration is a later stage and must not be implemented now.
- The local dev server uses port **3210** so it does not collide with
  other projects. Never kill processes you did not start.

## Repository

- Remote: https://github.com/AIVENA-spain/Scholte-Estates.git (public; keep it public)
- Never commit: credentials, API keys, `.env*` files (except `.env.example`
  with placeholders), customer data, `node_modules`, `.next` or build output.
- Review `git status` / staged files before every commit; verify the remote
  before pushing.

## Confirmed business details (single source: `src/config/site.ts`)

| Field | Value |
|---|---|
| Company | Scholte Estates |
| Brand line | Integrity first. Always. |
| Contact | Christian Scholte — Founder & Real Estate Agent |
| Location | Ciudad Quesada, Costa Blanca, Spain |
| Domain | scholteestates.com (exists — do not buy or change settings) |
| Email | christian@scholteestates.com (exists — do not change settings) |
| Phone | +34 611 159 859 |
| WhatsApp | https://wa.me/34611159859 |

## Content rules

- Do not invent properties, testimonials, qualifications, sales figures,
  company history, years of experience, languages spoken or legal identifiers.
- No form that pretends to submit. Contact is via WhatsApp, email and phone.
- Area and buying-process text stays general; legal/tax specifics are
  deferred to the buyer's independent lawyer.
- Do not purchase services, change DNS or deploy publicly without explicit
  approval.

## Design

- Follow the supplied logo and business card (**not yet in the project** —
  see README "Missing assets"). Do not create a replacement logo or brand.
  Until supplied, the header shows the company name as plain typography.
- Premium, understated, welcoming European style: forest green, ivory,
  subtle gold (tokens in `src/app/globals.css`), Cormorant Garamond headings
  + Manrope body, generous spacing, clear navigation, mobile-first care.
- Photography slots live in `src/config/media.ts`; until real photos are
  supplied, a decorative illustration is shown.

## Languages

- English (`/en`) and Spanish (`/es`) with a working switch. German later:
  add `de` to `src/i18n/config.ts` and a `de.ts` dictionary typed as `Dictionary`.
- `src/proxy.ts` redirects un-prefixed paths using the `NEXT_LOCALE`
  cookie, then `Accept-Language`, defaulting to English.

## Later stages (do not implement yet)

Property listings and pages (`/[lang]/properties/[slug]`, types in
`src/lib/properties/types.ts`), enquiry handling, CRM, property feeds,
database, admin dashboard, AIVENA integration, German.

## Confirmed decisions

- Next.js 16 App Router + TypeScript + Tailwind CSS v4, no i18n library.
- Locale-prefixed routes; same English slugs for both languages.
- Static prerendering of all pages.
