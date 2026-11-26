# Real listings: plan for RedSP and MLS (prepared 26 Nov 2026)

Status: **plan only.** Nothing here is implemented yet. It replaces the ten demo homes
with real inventory while keeping the property-story experience
(`docs/website-direction.md` §4–5). Scholte Estates stays separate from AIVENA:
no AIVENA systems, accounts, keys or data are used.

## 1. Principles

- **Two kinds of information, always labelled.**
  - *Supplied*: facts, photos and descriptions from the developer or listing
    agency via RedSP or the MLS. Shown with "Information supplied by the
    developer / listing agency", with the feed date.
  - *Verified*: anything Scholte Estates checked itself (nearby places,
    distances, area facts, our own photos). Shown with "Verified by Scholte
    Estates on ‹date›", with the source.
  - Our own editorial text (chapter captions) describes only what the supplied
    photos and facts show; it never adds unverified claims.
- **One home per tour.** Chapters use only that property's own photos.
  New-build feeds often contain renders and show-home photos: these are
  labelled "Computer-generated image" or "Show home" and never presented as the
  actual unit.
- **No invented facts.** Missing data stays missing ("on request"), never guessed.
- **Publishing rights first.** No photo or description goes live without written
  permission from the provider covering scholteestates.com.

## 2. What we need from each provider

### RedSP (new-build feed)

No public price list or feed documentation was found; everything below must come
from RedSP directly.

1. **Account and cost:** subscription price, contract term, notice period, and
   any per-listing or per-development fees. (RedSP states it keeps no part of the
   agency commission; confirm in the contract.)
2. **Feed access:** feed URL, authentication, update frequency, and how
   withdrawn/sold units are signalled.
3. **Format documentation:** field list and schema (Kyero-style XML or own
   format), languages available (English and Spanish descriptions?), units.
4. **Sample data:** a full export of 3–5 real developments in the Ciudad
   Quesada / Rojales area, including all photos.
5. **Publishing licence (written):** permission to show photos and texts on
   scholteestates.com; whether we may store copies of photos or must link to
   theirs; watermark/credit requirements; how long we may keep them after
   withdrawal; whether the developer's name and exact location may be shown.
6. **Per-unit facts:** price and whether VAT is included, availability per unit,
   completion date, energy rating (or "pending" for off-plan), plans.

### MLS

"MLS" on the Costa Blanca covers several separate networks (for example
PropertyList, UltraIT MLS, Inmobalia and local agent groups). **We need to know
which one(s) you use** before anything else.

1. **Membership and cost:** fees, the collaboration/commission-sharing agreement
   and its terms.
2. **Export access:** whether members may export listings to their own website
   (API or XML), URL/authentication, update frequency, removal signals.
3. **Format documentation and sample data:** 3–5 real listings, all photos.
4. **Publishing licence (written), per listing agency:** permission to publish
   photos and descriptions; required credit; whether the listing agency's name
   must or must not appear; rules for contacting owners (normally only via the
   listing agency).
5. **Facts:** price, energy rating (with certificate), built/plot/terrace areas,
   community fees, IBI, licence/legal status where supplied.

### For every listing (legal, both providers)

- **Energy rating:** Spanish law (RD 390/2021) requires the energy class in all
  property advertising. Listings without one cannot be published as normal ads.
- **Price clarity:** state whether taxes (VAT/AJD for new builds, ITP for resale)
  are excluded.
- **Agent registration:** your asesor is handling the real estate activity
  registration. Before publishing real listings, confirm with them whether
  listings may be advertised before the number is issued and whether the number
  must appear on each listing.

## 3. The standard: one complete real listing first

Before any import, we build **one** real listing by hand from the sample data and
treat it as the template. It must have:

| Part | Content | Source label |
|---|---|---|
| Arrival | Cover photo, name/development, town, price (tax note), key facts, energy rating | Supplied, feed date |
| Room chapters | Kitchen/living, bedroom, bathroom, outdoor: that home's own photos, our short captions describing only what is visible | Supplied photos; captions ours |
| Renders / show home | Clearly labelled if present | Supplied |
| Description | Provider's English and Spanish text (or our translation, marked as such) | Supplied / translated by us |
| Area chapter | Verified places nearby (restaurants, cafés, schools, shops, beaches, healthcare, transport) with name, category, source link, date verified, distance and how it was measured; our own or licensed photos only | Verified by Scholte Estates |
| Facts | Full table, features, plans if supplied | Supplied |
| Next step | WhatsApp/email with the reference | — |

Review with you, adjust, then reuse for everything else.

## 4. Data model changes (`src/lib/properties/types.ts`)

- `source`: `{ provider: "redsp" | "mls" | "own", providerRef, providerName?, feedUpdatedAt, licence: { photos, texts, confirmedAt, credit? } }`
- `energy`: `{ consumption: "A"…"G" | "pending" | "exempt", emissions? }`
- `priceIncludesTax`, `communityFeesEur?`, `ibiEur?`, `completionDate?`
- `PropertyImage`: add `origin: "supplied" | "own" | "licensed"`, `credit?`,
  `isRender?`, `isShowHome?`, and kinds `plan`, `view`, `development`.
- `area`: `{ verifiedPlaces: NearbyPlace[]; summary?: Localized }` where
  `NearbyPlace = { name, category, sourceUrl, verifiedAt, distanceKm?, travel?: { mode, minutes, method }, photo? }`.
- `story`: chapter overlay written by us, keyed by provider reference, picking
  images by their position/ID in the feed. Kept separate from the feed data so a
  feed update never overwrites our captions.
- `isDemo` stays; demos are switched off (`demoListings.enabled = false`) when the
  first real listing goes public, so real and fictional homes never mix.

## 5. Implementation phases

| Phase | Work | Depends on |
|---|---|---|
| 0 | Provider access, documentation, samples, written licences, MLS name, costs | You and the providers |
| 1 | Extend the data model and UI labels (supplied vs verified, energy rating, renders) | — (can start now) |
| 2 | Build the one standard listing from real sample data, with a verified area chapter; your review | Phase 0 samples + licence |
| 3 | Importer for the first provider: reads the feed, normalises to our model, validates required fields (energy, price, licence), reports problems; run manually and reviewed in a deploy preview | Phase 0 docs |
| 4 | Two listing levels: **Story** (curated chapters + verified area, for selected homes) and **Standard** (supplied facts, full gallery, description; area chapter only once verified) | Phase 3 |
| 5 | Scheduled sync and storage (the reserved `scholte-estates` Supabase project) once volume and update frequency are known | Phases 3–4; your approval |
| 6 | Second provider | Same steps |

Every phase ships through the tested pull-request workflow (preview first).

## 6. Blockers and costs

**Blockers (cannot proceed without):**
1. Which MLS network(s).
2. RedSP account, documentation and sample feed.
3. Written publishing licences for photos and descriptions.
4. Energy ratings for each listing.
5. Confirmation from your asesor about publishing listings during registration.

**Costs to expect (none committed; each needs your approval):**
- **RedSP subscription:** price unknown, request a quote.
- **MLS membership:** varies by network; some (e.g. PropertyList) advertise free
  agent accounts, others charge fees.
- **Hosting:** real listings with full photo galleries will use far more
  bandwidth than the demo site. Netlify Free has 300 credits/month (bandwidth 20
  credits per GB, each production deploy 15). A busy listings site is likely to
  need Netlify Personal (US$9/month, 1,000 credits) or Pro (US$20/month).
  Measure after Phase 3 before deciding.
- **Supabase:** the free tier is likely enough at first; scheduled syncing may
  need a paid tier later.
- **Verification time:** visiting/checking nearby places, and own or licensed
  photos of real places.
- **Translation review** where providers only supply one language.
