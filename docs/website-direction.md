# Website direction

Source: *Scholte Estates — Website direction and the next design pass*, decision
record and implementation brief supplied by the user on 25 November 2026.

This file has four parts:

1. **Confirmed requirements.** The user decided these. They are binding.
2. **Recommended storyboard.** This is the brief's first suggested direction for the landing page.
3. **Second pass.** The user's feedback, the lessons from the reference, the revised six-section sequence, the proportions and the **motion plan**. Where it differs from part 2, this part applies.
4. **Property stories.** This is the lasting listing standard. It is recorded now and implemented later.

---

## 1. Confirmed requirements (user decisions)

- **Landing-page flow.** The landing page lacked the flow and varied movement the user liked in the InterNest reference. The design must improve the whole journey through the page, not individual sections.
- **Property presentation is a core strength.** Scholte Estates should present each home as a story:
  - images in a sensible order, each with its own specific caption
  - illustrated information about the surrounding area, restaurants, schools and other useful places
- **Scope of this pass.** Document the long-term property experience now. Implement only on the landing page, including a preview of the property-story approach.
- **Devices and languages.** Desktop is a priority. Mobile needs a deliberately designed version too. English and Spanish stay.
- **Keep working:** search, filters, the language switch, contact links (WhatsApp, email, phone) and the demo labels.
- **Brand.** Keep the plain company name until the logo and business card arrive. Keep the forest green, ivory and restrained champagne/gold direction. Do not make a replacement logo.
- **Stay local.**
  - No public deployment, purchases, DNS changes or AIVENA work.
  - Pushing to the public repository is still an open decision. Do not infer approval to publish demo content from the brief.

### Positioning

> **Understand the home. Discover the life around it.**

The aim is to help buyers make a better-informed decision before a viewing: how the spaces work, what the surroundings offer, and which practical details matter.

This is a direction to build towards. It is not a claim that every current listing already offers it. Copy must not suggest otherwise.

### Diagnosis of the previous version

- The desktop layouts kept repeating one pattern: a centred container, a large heading, broad padding and a three-column row.
- Featured homes and new-builds used the same tall card rows.
- Villa Oliva appeared in the hero and in both listing groups.
- The area panel showed another property exterior, which introduced the area itself very little.

---

## 2. Recommended storyboard (landing page)

Each section answers a different buyer question and uses a distinct composition. Movement comes from a small, coherent set of motions.

| # | Section | Content and movement |
|---|---|---|
| 1 | **Arrive** | **Hero.** Establish the Costa Blanca, the agency and the home-and-area promise. Use a brighter, readable image treatment, a short headline and the working search. Reveal the heading, supporting line and search in a controlled sequence. Add a very slow image pan or a small set of deliberate crossfades. |
| 2 | **Understand** | **Concise introduction.** Explain in two or three sentences what buyers gain. Use an asymmetric image/text layout with a short image reveal. Keep it brief so the page moves on quickly. |
| 3 | **Explore one home** | **Signature property-story preview.** One substantial image with two or three short chapters (*The spaces*, *Life outside*, *The setting*). Desktop: the image stays briefly in view while captions change as the visitor scrolls, with native scrolling. Mobile: a simple vertical sequence. |
| 4 | **Find possibilities** | **Curated homes.** A compact browse section. Use All / New build / Resale tabs, not two near-identical card rows. Each preview has a specific descriptive hook; price, location, rooms and area stay easy to compare. Subtle image movement on hover, and clear carousel feedback. |
| 5 | **Explore the setting** | **Area discovery.** An image-led selector of towns and areas; choosing one changes its image and copy together. Use verified area material when it exists. Label any concept imagery or sample content clearly. |
| 6 | **Understand the process** | **Buying support.** Keep it concise. A restrained line or active-step indicator progresses as the steps come into view. Do not repeat the property section's layout. |
| 7 | **Take the next step** | **Contact.** One clear invitation with working WhatsApp and email links. A deliberate transition into the final green section, with minimal motion. |

**Motion principles**

- One signature sequence, varied supporting reveals and consistent easing.
- Keep native scrolling, readable text and useful controls. Respect reduced motion.
- Keep sticky scenes brief.
- Touch should feel natural, and every core action must work without hover.

### Review criteria for landing-page work

- **Desktop:** check the full page at about 1440 × 900 and at 1920 × 1080. Give composition and motion explicit attention.
- **Mobile:** check about 390 × 844 plus a narrower phone. The sticky story must become a clear, touch-friendly sequence.
- **Live flow:** scroll at normal speed and in reverse. Images, captions and transitions must stay coordinated, readable and smooth. Screenshots alone do not show motion, so demonstrate it live or with a short recording.
- **Function and accessibility:** keyboard navigation, native scrolling, reduced motion, search, carousel and tab controls, the language switch and contact links.
- **Build:** lint, typecheck and production build. Report what changed and what remains.

---

## 3. Second pass (25 Nov 2026): decisions and motion plan

**Status: approved by the user on 25 November 2026** (second-pass landing page, local preview). Later changes to the landing page should preserve this structure, proportions and motion plan unless the user asks otherwise.

### User feedback driving this pass

- **Direction:** closer, but not approved. Refine the proportions, the flow and how deliberate the motion feels.
- **Desktop sections that felt oversized:**
  - the introduction
  - the story image, which hid its caption and facts under the sticky header
  - the featured-homes block, whose parts felt disconnected
  - the area section, which was unbalanced
- **Copy:** development explanations belong in this document, not on the page. Visitor copy should show the approach to buyers.
- **Story preview:** one convincing preview, using real views of the same home. The remaining assets are prepared for later listing pages.

### What we took from the InterNest reference (principles, not assets)

- **Compact sections.** At 900 px high, most sections are about one screen. The heading sits close to its content, with roughly 40–56 px between them.
- **Headings in two weights** (a light line plus an emphasised line) give hierarchy without large sizes. We adapt this using Cormorant Garamond, with an italic gold emphasis.
- **One motion vocabulary throughout:**
  - lines rise out of a mask (about 1.2–1.5 s, ease-out)
  - supporting text fades up 16–24 px (about 1 s) with a small stagger
  - images use a clip-path wipe while the photo settles from a slight zoom
- **Hero slideshow:** a slow zoom of about 6.5 s per slide, with a visible progress tick for each slide.
- **Image scenes:** an interactive image with markers that open short information cards. We adapt this as the story's chapter index, with photos changing with the chapter.
- **A distinct closing scene,** a door that opens as you scroll. Ours is the green contact panel widening to full width.
- **Not adopted:**
  - smooth-scroll hijacking (Lenis); scrolling stays native
  - review sections and other content we cannot support

### Revised page sequence (six sections)

1. **Arrive (hero).** The slideshow, headline and search.
2. **Approach.** A compact band: a short statement, three service links, and two overlapping images of one home.
3. **One home, chapter by chapter (signature).** A sticky scene in which the photos change with the chapters. It ends with a separately labelled neighbourhood scene.
4. **Homes to explore.** The heading, tabs and carousel sit close together as one block.
5. **Areas.** A selector beside an illustrative neighbourhood scene, with an inset map. Copy and example homes change together.
6. **Buying process, then contact.** A quiet timeline, then the green contact panel opening out.

Quiet sections (2, 4 and 6) alternate with the stronger moments (1, 3, 5 and the contact panel).

### Proportions

- **Viewports.** Design for 1366 × 768, 1440 × 900 and 1920 × 1080. Each composition must fit below the scrolled header (80 px on desktop) at 768 px high.
- **Spacing and type.**
  - Section padding is about 80–96 px on desktop and 64 px on mobile.
  - Section headings are at most about 3 rem on desktop.
  - Body text stays at 16–18 px.
- **Story.** The sticky stage is `100svh − header − margins`, capped at about 46 rem. The image, caption, chapter index, active text and key facts are all visible together.

### Motion plan

All motion uses one ease-out curve, `cubic-bezier(0.215, 0.61, 0.355, 1)`. Scrolling is always native, with no snapping or hijacking.

| Effect | Purpose | Trigger | Sequence | Settled state | Fast / reverse / stopped |
|---|---|---|---|---|---|
| **Hero entrance** | Orientation; the headline is read first | Page load | Image settles 1.08→1 (2.4 s). Eyebrow at 0.1 s; headline lines rise from a mask at 0.25 s and 0.4 s (1.2 s each); lead at 0.75 s; search at 0.95 s | Everything static and fully legible | Runs once. The search works during the animation. |
| **Hero slideshow** | Atmosphere without competing with the text | Starts after the entrance (first change at 8 s) | 1.6 s crossfade; each slide zooms slowly over 9 s; a progress tick fills per slide | The current slide holds | Pauses when the tab is hidden or the pause button is pressed. With reduced motion, the first image stays still. |
| **Hero background drift** | Depth while leaving the hero | Scroll position (0→1 as the hero leaves) | The image moves 0→6% at a slower rate than the text. The text itself does not move or fade. | Rest position at the top | Follows the scroll position exactly, so it reverses naturally. |
| **Section reveals** | Pace reading; quieter in quiet sections | An element 12% into view, or already passed | Headline lines rise from a mask; text fades up 20 px; staggered 0.08–0.12 s; about 1 s each | Visible, with no transforms left | Plays once and never re-hides on reverse. Anything already above the viewport (fast scroll, jump links, End key) is revealed at once. If scripts fail, nothing is hidden. |
| **Image wipe** | Introduce photographs | As above | Clip from the bottom (1.2 s) while the image scales 1.12→1 (1.6 s) | Full image | As above |
| **Story chapters (signature)** | Show how a home works, room by room, then the setting | Scroll position within the story section (about 55 svh per chapter) | On a chapter change: the photo crossfades (0.8 s) with a 1.04→1 settle; the caption and active text fade up (0.5 s); the index marker moves; the progress bar follows the scroll | The current chapter's photo, caption and text, all aligned | Derived from position, so photo, caption and index always match, including in reverse or after a jump. Index entries are buttons that scroll to their chapter. With reduced motion, changes are instant. |
| **Homes tabs** | Switch sets without leaving the block | Click or arrow keys | Cards fade up 0.5 s, staggered 0.06 s; the tab underline slides | The new set is visible and the counter updated | No scroll movement |
| **Area selector** | Compare places | Click or arrow keys | The scene crossfades (0.7 s); copy and homes fade up (0.45 s); the map pin moves and pulses | The selected area's scene, copy and pin | Not scroll-driven |
| **Process timeline** | Quiet progress cue | Scroll position | The line fills; dots light as they are reached | All dots lit once passed | Follows position, so it reverses naturally. With reduced motion, it is fully drawn. |
| **Contact panel** | A deliberate closing transition | Scroll position | Opens from an inset, rounded card to full width | Full width | Follows position. With reduced motion, it is full width. |

**Fail-safes**

- Reveal styles only apply when the html element has the `motion-ready` class. The motion script sets it.
- If scripts fail or hydration breaks, all content stays visible.
- Reduced motion removes transforms and transitions. Content is never hidden.

## 4. Property stories — the lasting listing standard

Every real listing should eventually offer the following.

- **Immediate overview.** Price, location, size, bedrooms, bathrooms and availability stay easy to find and compare. The story adds understanding around these facts and never replaces them.
- **Guided visual tour.** Images follow a sensible route through the home. Each caption is specific: what the space is, a useful feature, how it connects to another room, or a practical consideration. No interchangeable marketing lines.
- **Life in the spaces.** How the terrace, kitchen, living area, garden and other relevant spaces work. Use the actual property's material, and include known limitations or trade-offs.
- **The neighbourhood.** The surrounding streets or area, with images and short context on the setting and day-to-day conveniences. Never imply that a generic regional photo shows the immediate surroundings.
- **Places nearby.** Relevant restaurants, schools, shops, healthcare, beaches, transport and other useful places, with images and factual descriptions. Choose them to show practical life around the home.
- **A useful next step.** Offer a viewing or a conversation based on the buyer's questions, and carry the listing reference through. Key details stay accessible throughout.

### Content and image rules

- **Nearby places.** For every real nearby place, store its name, category, source link and verification date.
- **Distances.** Verify the place's relationship to the property before publishing a distance or travel time, and state the travel mode.
- **Real places.** Use owned or licensed photographs for any identifiable real place.
- **Generated images.** Label them as illustrative. Never present them as evidence of a real restaurant, school or neighbourhood.
- **The demo set has one image per property.**
  - Never combine images of different houses into a "tour" of one home.
  - A multi-image prototype needs coherent extra views of the same fictional property, clearly presented as a demo.

### Future content model (record now, implement later)

- Ordered **story chapters**, each with a heading, body, image, caption, alt text and language variants.
- An **area profile.**
- **Nearby places**, with image attribution and verification fields: name, category, source link, verified date, distance and travel mode.
- **Practical notes.**
- The existing structured **property facts**.
- English and Spanish content is always paired.

This is a content requirement. It does **not** authorise a new database or admin system yet; Supabase, CRM/feeds and AIVENA integration keep their existing later stages.

**Status (25 Nov 2026, second pass):**

- **Expanded demo assets.** Every demo home now has five fictional views (original, kitchen, bedroom, bathroom, outdoor) and one separately labelled illustrative neighbourhood scene.
  - All views are stored in `src/data/demo-properties.json` with a specific bilingual title and caption.
  - Each home has an ordered `story` and an `areaVerification` record listing what must be verified before a real neighbourhood chapter is published.
- **Extraction.** The 60 images were extracted from *Scholte_Estates_Demo_Properties (2).pdf* using `pdfdetach`/`pdfimages`, rather than the supplied PyMuPDF helper (reviewed; same steps). Each was verified against the embedded SHA-256 manifest, which is kept in the fixture.
- **Landing page.** Only SE-DEMO-006 *Horizonte Azul* is told on the landing page, in four chapters: kitchen, bedroom, outdoor, and the illustrative setting.
- **Kept for later listing pages:** the other nine stories, and the bathroom chapter.
- **Illustrative scenes.** The neighbourhood scenes illustrate atmosphere only. They name no real restaurant or school and claim no proximity. They are always labelled "Illustrative scene".

**Development notes moved off the landing page**

These explanations used to appear on the page and are recorded here instead:

- "This is how we want to present every home."
- "Next in a real listing": each real home continues its story with the neighbourhood and useful places nearby (restaurants, schools, shops, beaches, healthcare), with photographs and verified details.
- From the asset pack, a real neighbourhood chapter will add:
  - **Food and cafés:** name, address, original or licensed photograph, opening information and source date.
  - **Schools and family needs:** verified school details and admissions information, with no unsupported catchment claims.
  - **Daily life and getting around:** shops, transport and outdoor spaces. Measure routes only once an exact property address exists.

---

## Remaining asset needs and follow-up

- **Real photography:**
  - several coherent images per real listing, for the guided tour
  - owned or licensed photos of towns and areas, for area discovery (currently a schematic map plus demo homes)
  - photos of nearby places
- **Verified local information:** restaurants, schools, healthcare, beaches and transport, with source links and verification dates.
- **Logo and business card,** to finalise the colour tokens and header.
- **Next build stages, after the landing page is approved:**
  1. property detail pages as full stories
  2. area profiles
  3. nearby-place data
