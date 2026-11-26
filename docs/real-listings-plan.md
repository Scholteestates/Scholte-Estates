# Real listings: plan for RedSP and MLS Costa (updated 26 Nov 2026)

Status: **plan only.** Nothing is implemented. It replaces the ten demo homes with
real inventory while keeping the property-story experience
(`docs/website-direction.md` §4–5). Scholte Estates stays separate from AIVENA.
Hosting is Netlify (the user moved to a paid plan on 26 Nov 2026 to switch off the badge); no further purchases or upgrades
without the user's approval.

## 1. Principles

- **The full property story is the target for every listing**, not only selected
  homes. A chapter is shown only when it is supported: a photo of that home for a
  room chapter, verified information for the area chapter. Unsupported chapters are
  omitted (never filled with generic text or another home's photos) and listed in the
  listing's **gap report** so they can be completed later.
- **Supplied vs verified, always labelled.**
  - *Supplied*: facts, photos, descriptions and the provider's own "nearby" figures
    (e.g. "Beach: 17000 Meters" in the RedSP features). Labelled "Supplied by the
    developer / listing agency", with the feed date. Never presented as verified.
  - *Verified*: what Scholte Estates checked itself (places, distances, area facts,
    own photos). Labelled "Verified by Scholte Estates on ‹date›", with the source.
  - Our captions describe only what the supplied photo and facts show.
- **One home per tour.** Renders are labelled "Computer-generated image", show homes
  "Show home", floor plans "Floor plan"; they are never presented as the actual unit.
- **No invented facts.** Missing data stays missing ("on request").
- **Provider data is private until licensed.** The RedSP trial feed is used only for
  private compatibility testing (kept outside the repository); none of its properties
  is published.

## 2. Providers

### RedSP (new builds) — public facts checked

- **Pricing** (redsp.info/es/precios, Zone 1 = Castellón, Valencia, Alicante, Murcia,
  Almería; all + VAT): set-up fee €125; €40/month
  billed monthly, €105 per quarter, or €348 per year (€29/month). Includes 1 back-end
  user, 1 zone feed set, 1 custom export XML feed, 12 languages, updates by WhatsApp.
  Extra custom feed €8/month; extra users from €4–5/month. No minimum term is stated.
  The page also says "Free Setup fee on MLS Costa". It does **not** confirm that
  RedSP's own €125 set-up fee is waived for MLS Costa members; treat the €125 as
  payable until RedSP confirms otherwise in writing.
- **Feed format** (trial feed, private test, 16 listings): Kyero v3 XML. See §4.
- **Publication rights:** RedSP sells the feed as data "ready to publish" on an
  agency's website or CRM. Only a privacy and a cookie policy are public, so the
  **subscription terms must be read before anything is published** (see §3).

### MLS Costa (resales) — public facts checked

- Resale sharing network for Costa Blanca, Costa Cálida, Almería and Costa del Sol,
  about 3,000 properties, operated by Fabra Costa SL (Dénia).
- **Free account:** share your own direct listings with other members.
- **Paid account:** "XML feed out for your own website/property portals", listing
  agents' contact details and commission rates, a microsite and a basic CRM.
  **The paid price is not published.**
- Its public disclaimer: shared properties come from third-party agencies; prices
  change without notice; prices exclude taxes and costs; items in photos/renders may
  not be included.
- **Membership and feed access are unconfirmed** until the user supplies them.

## 3. Publication rights: check the provider agreement first

Both providers offer exports explicitly meant for the member's own website, so the
rights may already be granted centrally. Order of checks:

1. **Read the RedSP subscription terms and the MLS Costa (paid) membership terms.**
   Look for: a licence for members to reproduce photos and descriptions on their own
   website; a statement that the provider holds or has obtained those rights from
   developers / listing agencies; conditions (credit, hiding the developer's or listing
   agency's name, exact location/map rules, removal when withdrawn, whether photos may
   be stored or must be loaded from the provider).
2. **If the terms grant it:** no separate permission per developer or agency is
   needed; we follow the stated conditions and record the clause and date.
3. **If the terms are silent or unclear:** ask the provider for one written
   confirmation covering all listings in the feed.
4. **Only if the provider cannot confirm:** ask the individual developer or listing
   agency for each listing.

## 4. Compatibility test: RedSP trial feed (private)

| Need | In the feed | Consequence |
|---|---|---|
| Reference, price, type, town, area, beds, baths, built/plot m² | Yes, all 16 | Maps directly |
| Energy rating (required in adverts, RD 390/2021) | Yes, all 16 (A–C) | Shown on every listing |
| English and Spanish descriptions | Yes, all 16 (+9 languages) | Texts contain literal `&#13;` codes; convert to line breaks |
| Features | English only | Spanish labels needed (translation table) |
| Supplied distances (beach, shops, airport…) | In features | Shown as *supplied*, never as verified |
| Photos | 10–50 per listing (median 23), ~230 KB, hosted on `fotos15.apinmo.com` | Gallery fine; bandwidth to measure |
| Room labels for photos | **No** (only 25 images tagged `floorplan`) | Room chapters need photo classification by us (manual, or AI-assisted with human check) |
| Captions per photo | **No** | We write short captions from what each photo shows |
| Renders vs real photos | **Not marked** | Must be identified during classification |
| VAT included?, completion date, per-unit availability, development name | **No** | Ask RedSP; show "prices exclude taxes" until confirmed |
| Exact coordinates | Yes | Use only as the provider's terms allow |

## 5. One complete real listing first

Before any import, one real listing (licensed, from the actual subscription) is built
by hand as the template: arrival with facts and energy rating; room chapters from that
home's own classified photos; renders/plans labelled; EN/ES description; facts table;
an **area chapter with verified places** (name, category, source link, date verified,
distance and how it was measured; own or licensed photos only); contact action with
the reference. Reviewed with the user, then reused.

## 6. Every listing after that

Same template for all listings. Per listing, the importer produces:
- the supplied data, normalised;
- a **photo classification** step (kitchen/living, bedroom, bathroom, outdoor, render,
  floor plan, development, view) reviewed by a person;
- the chapters that are supported, in order; the rest omitted;
- a **gap report**: missing room photos, unclassified photos, missing Spanish text,
  missing tax/completion info, no verified area chapter yet.
Area chapters are verified per area or development and reused by every listing there.

## 7. Data model changes (`src/lib/properties/types.ts`)

- `source`: `{ provider: "redsp" | "mlscosta" | "own", providerRef, feedDate, licence: { clause, checkedAt, conditions } }`
- `energy`: `{ consumption, emissions }` (required to publish)
- `priceIncludesTax?`, `completionDate?`, `availability?`
- `PropertyImage`: `origin`, `kind` (+ `render`, `floorplan`, `development`, `view`),
  `classifiedBy`, `reviewedAt`, `credit?`
- `suppliedNearby`: provider figures (e.g. beach 17 km), shown as supplied
- `area`: `{ verifiedPlaces: NearbyPlace[] }`, `NearbyPlace = { name, category, sourceUrl, verifiedAt, distanceKm?, travel?: { mode, minutes, method }, photo? }`
- `story`: chapter overlay keyed by provider reference (our captions and photo choices),
  kept separate so feed updates never overwrite it
- `gaps`: generated list of missing chapters/data
- Demos switched off (`demoListings.enabled = false`) when the first real listing goes live.

## 8. Phases

| Phase | Work | Depends on |
|---|---|---|
| 0 | Subscription/membership decision, terms checked for publication rights, real feed access | User; providers |
| 1 | Data model, labels (supplied/verified, render, energy), gap report; tested on the trial feed privately | **Built 26 Nov 2026** (local preview of RedSP N8791; see CLAUDE.md) |
| 2 | One complete real listing with a verified area chapter; user review | Phase 0 |
| 3 | RedSP importer: normalise, validate (energy, licence), classification review, preview deploy | Phases 0–2 |
| 4 | All listings through the same template; area chapters verified area by area | Phase 3 |
| 5 | Scheduled sync and storage (reserved `scholte-estates` Supabase project) | Measured need; approval |
| 6 | MLS Costa (same steps, once membership and feed are confirmed) | User supplies access |

All phases ship through the tested pull-request workflow.

## 9. Blockers and costs

**Blockers**
1. RedSP subscription (decision) and its terms on publication rights.
2. MLS Costa paid membership and feed access: unconfirmed until supplied; paid price unknown.
3. VAT/completion/availability data for new builds (ask RedSP).
4. Your asesor's confirmation that listings may be advertised during registration, and whether the number must appear on listings.

**Costs (none committed)**
- RedSP Zone 1: €348/year + VAT (annual) or €40/month + VAT; €125 set-up + VAT (a waiver for MLS Costa members is not confirmed).
- MLS Costa paid account: price not published.
- Netlify: stays Free (300 credits/month). Real galleries (median 23 photos per listing)
  will use more bandwidth; usage is measured after Phase 3 before any recommendation.
- Supabase: free tier first.
- Time: photo classification and verification of area information.
