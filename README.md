# Scholte Estates — website

First version of the website for **Scholte Estates**, an independent real
estate agency in Ciudad Quesada on the Costa Blanca. *Integrity first. Always.*

Built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4.
Available in English (`/en`) and Spanish (`/es`).

See [`docs/website-direction.md`](docs/website-direction.md) for the confirmed
website direction, landing-page storyboard and the property-story standard
for future listings.

## Setup

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3210 (redirects to `/en` or `/es` based on browser language).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local development server on port 3210 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on port 3210 |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types and run TypeScript |
| `npm run check` | Lint + typecheck + build |

## Structure

```
src/
  app/[lang]/          Pages: home, properties (+ [slug] detail), services,
                       costa-blanca, how-we-help, contact, 404
  components/          Header, footer, language switch, contact buttons, photo slots
  config/site.ts       Confirmed business details (single source of truth)
  config/media.ts      Photography slots (add photos here)
  i18n/                Locales, dictionaries (en.ts, es.ts), metadata helpers
  components/property/ Cards, carousel, hero search, property browser
  config/features.ts   Demo listings on/off switch
  data/                Demo property fixtures (fictional)
  lib/properties/      Property types, data access, filter/format helpers
  proxy.ts             Redirects / to the visitor's language
docs/                  Website direction and property-story standard
public/brand/          Place the supplied logo here
public/images/         Place photography here (demo/ holds the demo images)
```

### Editing content

All page text is in `src/i18n/dictionaries/en.ts` and `es.ts`. The Spanish
file is type-checked against the English one, so a missing translation fails
the build.

### Adding the logo

1. Put the file in `public/brand/` (SVG preferred, e.g. `logo.svg`).
2. In `src/config/site.ts`, set `brand.logoSrc` to `"/brand/logo.svg"` and
   adjust `logoWidth` / `logoHeight` to its proportions.
3. Fine-tune the colour tokens in `src/app/globals.css` to match the logo
   and business card.

### Demo listings (local preview only)

Ten fictional properties with AI-generated images are included so the search,
cards and carousels can be designed and tested. They are clearly labelled as
demos and are not for sale.

- Data: `src/data/demo-properties.json` · Images: `public/images/demo/`
  (60 images: five views per home plus one illustrative neighbourhood scene
  each, with an SHA-256 manifest in the JSON)
- **Turn them all off:** set `demoListings.enabled = false` in
  `src/config/features.ts`. The hero falls back to an illustration, the
  carousels disappear and the properties page shows a "listings coming soon"
  message with contact links.
- **Replace with real inventory:** make `getAllProperties()` in
  `src/lib/properties/index.ts` return real `Property` records (same shape as
  `src/lib/properties/types.ts`), then delete the demo JSON and images.

### Adding photos

Put images in `public/images/` and set `src` for the matching slot in
`src/config/media.ts` (`hero`, `intro`, `area`).

## Progress

- [x] Standalone Next.js + TypeScript project, separate from AIVENA
- [x] English and Spanish with a language switch (remembers the choice)
- [x] Home, Services (new-build, resale, buyer assistance), Costa Blanca,
      How we help, Contact, branded 404
- [x] WhatsApp, email and phone links on every page; floating WhatsApp button
- [x] Responsive layout with mobile menu
- [x] SEO basics: per-page titles, descriptions, canonical and hreflang links
- [x] Full-screen hero, header over hero with contact bar, scroll animations
- [x] Property search and filters (location, type, max price, bedrooms, sort)
- [x] Featured and new-build carousels, property cards and detail pages
- [x] Ten labelled demo listings for the local preview (one switch to remove)
- [x] Landing-page flow pass (storyboard in `docs/website-direction.md`): hero
      crossfade, property-story preview, tabbed homes, area explorer with
      schematic map, process timeline, contact finale
- [ ] Property detail pages as full stories; area profiles; verified nearby places
- [ ] Supplied logo and business-card colours
- [ ] Real photography
- [ ] Legal notice (aviso legal), privacy and cookie pages
- [ ] German
- [ ] Real property listings (replace demo data)
- [ ] Enquiry handling, CRM / property feeds, database, admin, AIVENA integration
      (Supabase project `scholte-estates` exists in the Scholte Estates
      organisation; not connected yet)
- [ ] Hosting and deployment (not started — no DNS changes made)

## Missing assets and details

- **Logo and business card** were not in the project folder. The header uses
  the company name in plain type until they are added.
- **Photography**: no real photos yet. The demo listings use AI-generated
  images; with demos off, decorative illustrations are shown.
- **Legal details** for the legal notice / privacy policy (business name
  holder, NIF/CIF, registered address, any professional registration such as
  the Valencian real estate agents register) — required by Spanish law before
  going live; not invented here.
