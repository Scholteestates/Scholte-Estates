---
name: listing-story
description: Turn a provider listing (RedSP or MLS Costa Kyero XML feed, or an owner's own home) into a Scholte Estates property story — import, photo classification, renders/show-home labels, chapters, gap report, area map with exact pin. Use for any real-listing or property-feed work in the Scholte Estates project.
---

# Listing story: feed → reviewed property story

Read `docs/real-listings-plan.md` first. Real listings are **on hold** until
the user's estate-agent (autónomo) registration and the provider agreement are
in place; do not push the user on this. Until a provider's terms allow
publication, everything stays private and local.

## Privacy rules

- Provider feeds, downloaded photos, overlays and review captures live only in
  the git-ignored `/.private/listings/<dataset>/`. Never commit them, never
  move them into `public/`.
- Preview routes (`src/app/[lang]/preview/[slug]/page.preview.tsx`,
  `src/app/preview-media/[...path]/route.preview.ts`) exist only on the local
  dev server (`next.config.ts` page extensions). They must 404 in production.
- A listing's exact coordinates come from the provider: use them for its own
  page only, never in shared area profiles or committed files.

## 1. Import and build

```bash
node scripts/listings/preview.mts import --feed <xml> --dir .private/listings/<set> --ref <REF>
node scripts/listings/preview.mts build --dir .private/listings/<set>
```

Import writes `supplied/<ref>.json` and downloads photos; build merges the
overlay and writes `stories.json` plus an internal `gap-report.md`.

## 2. Overlay (`overlays/<ref>.json`, types in `src/lib/listings/types.ts`)

- **Classify every photo**: room, origin `photo | render | drawing | unclear`,
  `otherUnit` for show homes / other units, `example` for a floor plan the
  feed does not tie to this unit. `reviewedBy` stays `null` until the user
  checks the photos; the page then marks every label "provisional".
- **Chapters**: living, kitchen, bedroom, bathroom, outdoor, each only with a
  photo that supports it. Text from supplied facts only; say when a photo is a
  show home or a render.
- **Floor plans**: a plan marked with a unit number is an *example* unless the
  feed links it to this listing. Its sizes are provisional ("about 10 m²").
- **Contradictions** (e.g. airport 23 km in features vs 30 km in text):
  withhold the figure (`withheldDistances`) and note it.
- Never invent: VAT, completion date, availability, garden, appliances stay
  "to be confirmed" and go in the gap report.

## 3. Area chapter

The listing uses its town's profile (`src/data/areas/`, see the
**area-places** skill) with an exact "This home" pin and straight-line
distances, labelled as such. Missing or thin town → research it first.

## 4. Review with the user

Run the dev server, open `/en/preview/<slug>` and `/es/preview/<slug>`, and
send desktop + mobile screenshots and a short scroll recording (Playwright
script pattern in the scratchpad history: screenshots per viewport, video of
scrolling chapters → facts → gallery). List the gap report's main items.

## 5. Publishing (only when licensed)

Record the licence clause and date in `source.licence`, switch the listing
from preview to the public data source, keep labels, and release with the
**release** skill. When the first real listing goes live, set
`demoListings.enabled = false` (`src/config/features.ts`).

## Lessons log

- 2026-11-26 — Treated a floor plan marked "home 23" as this unit; the feed
  never linked it. Plans are examples unless the feed says otherwise.
- 2026-11-26 — Photo classifications must stay visibly provisional until the
  user reviews them (show home vs render is easy to get wrong).
