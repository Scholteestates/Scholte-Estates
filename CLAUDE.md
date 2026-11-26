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

- Remote: https://github.com/Scholteestates/Scholte-Estates.git (public; keep it public).
  Owned by the separate `Scholteestates` GitHub organisation (moved from
  AIVENA-spain on 2026-11-26)
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
  **Exception — authorised demo listings (2026-11-25):** the user explicitly
  authorised ten fictional demo properties (supplied in
  `Scholte_Estates_Demo_Properties.pdf`). On 2026-11-26 the user extended this
  to the **public demo site** on scholteestates.com, provided they stay clearly
  labelled as fictional and not for sale.
  Rules for them:
  - They live only in `src/data/demo-properties.json` and
    `public/images/demo/` (AI-generated images), loaded via
    `src/lib/properties/index.ts`. Do not add more invented properties.
  - Every record keeps `isDemo: true`, `available: false`, `status: "demo"`.
  - Expanded pack (2026-11-25, `Scholte_Estates_Demo_Properties (2).pdf`,
    replaces the first): five fictional views per home (original, kitchen,
    bedroom, bathroom, outdoor) plus one illustrative neighbourhood scene each
    (60 images, SHA-256 verified). References, names, prices and
    specifications are unchanged. Neighbourhood scenes are atmosphere only:
    always labelled "Illustrative scene", never presented as a real
    restaurant, school, street or proximity.
  - Always label them: "Demo" badge on cards and detail pages, the bilingual
    demo notice near every listing group, "Example price" under prices, and
    "AI-generated demo image" captions. Detail pages are `noindex`.
  - Contact copy stays generic ("Find a similar home"); never imply they are
    for sale.
  - One switch removes all of them: `demoListings.enabled` in
    `src/config/features.ts`. It must be `false` (or the data replaced by
    real inventory) once real listings are available. Demo pages stay
    `noindex`, out of any sitemap and without real-estate structured data.
- No form that pretends to submit. Contact is via WhatsApp, email and phone.
- The floating WhatsApp button sits at `bottom-5` / `md:bottom-6`. The
  "Powered by Netlify" badge was switched off on 2026-11-26 (paid plan); if it
  ever returns, raise the button to `bottom-20` again.
- Area and buying-process text stays general; legal/tax specifics are
  deferred to the buyer's independent lawyer.
- Do not purchase services or paid upgrades without explicit approval.

## Legal pages, privacy and SEO files (2026-11-26)

- Operator details (user-confirmed) live only in `site.legal`
  (`src/config/site.ts`): Christian Scholte, trading as Scholte Estates,
  autónomo, NIF Y1377545C, Calle Galicia 114, Ciudad Quesada, 03170 Rojales
  (Alicante), described as "Legal and correspondence address. No client
  reception." Never use the Nexus address (AIVENA) for Scholte Estates.
- The estate-agent registration is being handled by the user's asesor: do not
  ask again, do not invent a number or membership, do not say it is complete.
  Add the number to the legal notice when the user supplies it.
- Texts: `src/content/legal.ts` (EN/ES), pages `/[lang]/legal-notice` and
  `/[lang]/privacy`, linked in the footer. The privacy/cookie claims rest on an
  audit of the live site (only first-party requests; cookie `NEXT_LOCALE`
  only; no local storage since the Netlify badge was switched off on
  2026-11-26). **Re-audit
  and update the policy before adding any form, analytics, embed, map, chat
  widget or new provider.** Transfers: Netlify, Google LLC and Meta are active
  EU-U.S. DPF participants (checked 2026-11-26).
- Enquiry retention: proposed 24 months after last contact
  (`site.legal.enquiryRetentionMonths`), awaiting the user's confirmation.
- `src/app/robots.ts` allows everything (demo pages must stay crawlable so
  their `noindex` is read); `src/app/sitemap.ts` lists genuine pages only,
  never demo property pages.
- Favicon (`src/app/favicon.ico`, `icon.png`, `apple-icon.png`): a crop of the
  capital S from the approved dark logo on its own background tone (approved
  by the user 2026-11-26). Regenerate from the logo, never redraw.

## Hosting and domain (approved 2026-11-26)

- **Netlify**, in a separate Scholte Estates Netlify account, connected
  only to this repository (`netlify.toml`). Never use AIVENA's Vercel or any
  AIVENA hosting. Started on Free; on 2026-11-26 the user upgraded to a paid
  plan themself to switch off the "Powered by Netlify" badge (now off). Ask
  before any further upgrade or paid add-on.
- The plan runs on a monthly credit allowance (production deploys and
  traffic use credits): refine on deploy previews (branches / pull requests)
  and merge to `main` only for real releases.
- **DNS stays at GoDaddy** (nameservers `ns25/ns26.domaincontrol.com`; never
  move nameservers). Change only the website records (apex `A`, `www`
  `CNAME`). Keep every email record exactly as is: `MX 1 smtp.google.com`,
  the SPF `TXT` (`v=spf1 include:dc-bdaca08905._spfm.scholteestates.com ~all`),
  `_dmarc` and the `google-site-verification` `TXT`.
- **Live records (set 2026-11-26):** apex `A @` → `75.2.60.5` (Netlify load
  balancer; GoDaddy has no ALIAS) and `CNAME www` → `scholte-estates.netlify.app`.
  Previous values, to restore if ever needed: `A @` "Parked" (GoDaddy parking,
  3.33.130.190 / 15.197.148.33) and `CNAME www` → `scholteestates.com.`.
  GoDaddy asks for an identity code on every DNS save (the user enters it).
- **Releases (authorised by the user 2026-11-26):** for changes the user
  requests, Claude may merge tested pull requests itself (`gh pr merge`, allowed
  only in this project's `.claude/settings.local.json`) and verify the live
  deploy. Process: branch → PR → Netlify deploy preview tested → merge → check
  scholteestates.com. Never push directly to `main`, never use bypass mode,
  never touch AIVENA permissions or repositories.
- Netlify team `crisscholte` (paid plan since 2026-11-26), project `scholte-estates`; production
  visibility Public, deploy previews Private. `main` deploys to production;
  pull requests get previews.

## Website direction and property stories (lasting requirement)

Read **`docs/website-direction.md`** before any design or listing work. It
records the user's confirmed requirements (2026-11-25), the recommended
landing-page storyboard and motion principles, and the **property-story
standard**: every real listing should eventually tell the story of the home
through ordered images with specific captions, plus the surrounding area,
restaurants, schools and other useful places, with images and verified
details. Generated images stay labelled illustrative; never assemble images
of different houses into one home's tour. The content model is recorded there;
no database/admin work is authorised by it.

## Design

- **Approved logos are in the project** (2026-11-25): read **`docs/brand.md`**
  before any branding work. Dark (gold on forest) and light (forest on beige)
  originals plus cropped web copies live in `public/brand/`; use the `Logo`
  component on its matching background (`bg-brand-forest` / `bg-brand-beige`).
  Never alter, recolour or replace the logo. Business card still pending.
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

## Property data

- `src/lib/properties/types.ts` defines the `Property` shape; real inventory
  must implement the same shape.
- `src/lib/properties/index.ts` is the single data entry point (today: demo
  fixtures). Replace its source when a CRM / property feed is connected.
- `src/lib/properties/helpers.ts` holds pure filter/format helpers that are
  safe for client components (no data imports).
- Search/filter runs locally in the browser (town, type, max price,
  bedrooms, sort) and keeps state in the URL query string.

## External services

- **Supabase:** a separate project named `scholte-estates` exists under the
  **Scholte Estates** Supabase organisation (created by the user,
  2026-11-25). It is reserved for the later database stage and is **not
  connected yet**: no client, schema, migrations or keys in this repo. When
  integrating, use only this project — never an AIVENA Supabase project or
  organisation — and keep keys in `.env.local` (placeholders only in
  `.env.example`).

## Real listings (planning, 2026-11-26)

Read **`docs/real-listings-plan.md`** before any listings work: RedSP and MLS
Costa facts, publication-rights check (provider agreement first), the full
property story as the target for every listing (unsupported chapters omitted
and listed in a gap report), supplied vs verified labelling, phases, blockers
and costs. Nothing is implemented yet. Provider sample feeds (e.g. the RedSP
trial feed) are for private compatibility tests only: never commit them or
publish their properties. MLS Costa membership/feed access is unconfirmed
until the user supplies it. Stay on the current Netlify plan; no further purchases or upgrades.
Enquiry retention is done by hand: **`docs/retention-procedure.md`**.

**Private listing previews (Phase 1, 2026-11-26):** provider data, downloaded
photos and our overlays live only in the git-ignored `/.private/listings/`
(never commit, never move into `public/`). Pipeline:
`node scripts/listings/preview.mts import|build --dir .private/listings/<set>`
(writes `stories.json` and an internal `gap-report.md`). Preview routes use the
`.preview.tsx` / `.preview.ts` extensions, which `next.config.ts` enables only
on the local dev server, so they never exist in a production build
(`/[lang]/preview/<slug>`, photos via `/preview-media/…`). Both demo and real
listings render through `src/components/property/property-story.tsx`; types in
`src/lib/listings/types.ts`.

## Area maps and verified places (2026-11-26)

- Every property story can show an area chapter: a square, self-hosted map
  (`src/components/area/area-explorer.tsx`, MapLibre + Protomaps style) with
  tappable points; the text beside the map shows the selected place.
- **No third-party map service.** Tiles (OpenStreetMap data from a Protomaps
  build) live in `public/map/tiles`, label fonts in `public/map/fonts`, the
  MapLibre worker is copied to `public/map` before dev/build. Rebuild tiles
  with `node scripts/map/extract-tiles.mts` (coverage: `scripts/map/regions.json`).
- Places: `src/data/areas/<id>.json` (one profile per town, reused by every
  property there). Each place: OSM coordinates, a current source link,
  verification date, bilingual factual note. Import researched files with
  `node scripts/map/import-places.mts <dir>` (validates, resets approval when
  places change).
- **User approval gate:** an area renders on the public site only when
  `approval.approvedBy` is set; until then it shows on the local dev server
  only, with an "awaiting approval" notice.
- Real listings: exact home pin (user decision 2026-11-26) and straight-line
  distances, labelled as such. Demo homes: town map only, no home pin, no
  distances ("About {town}").

## Later stages (do not implement yet)

Real listings via CRM / property feeds, enquiry handling, database, admin
dashboard, AIVENA integration, German.

## Confirmed decisions

- Landing page approved (2026-11-25): the second-pass design recorded in
  `docs/website-direction.md` §3 (six sections, fitted sticky property story,
  motion plan).
- Property detail pages are full stories (2026-11-26): arrival, four room
  chapters, a separate illustrative setting chapter, facts with the contact
  action, and an accessible gallery of all six images, for all 10 homes in
  English and Spanish. Template: `src/app/[lang]/properties/[slug]/page.tsx`;
  see `docs/website-direction.md` §5.

- Next.js 16 App Router + TypeScript + Tailwind CSS v4, no i18n library.
- Locale-prefixed routes; same English slugs for both languages.
- Static prerendering of all pages.
- Design direction (2026-11-25): InterNest-style polish adapted to our
  palette — full-screen hero image with centred headline and search, header
  over the hero with a thin phone/email bar, restrained gold accents, gentle
  reveal animations (respecting reduced motion), featured and new-build
  carousels. Inspiration only; never copy another site's assets or text.
