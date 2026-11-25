# Brand: approved logos

The user approved two versions of the Scholte Estates logo on 25 November 2026. Both carry the brand line *Integrity first. Always*.

Do not redraw, recolour, re-typeset, stretch or otherwise alter the logo. Do not create replacement or alternative logos.

## Approved versions

| Version | Look | Original file (full resolution, untouched) | Web copy used on the site |
|---|---|---|---|
| **Dark** | Gold lettering and a muted roofline on forest green | `public/brand/scholte-estates-dark.png` (1254 × 1254) | `public/brand/scholte-estates-dark-web.png` (755 × 321) |
| **Light** | Forest-green lettering and roofline on beige | `public/brand/scholte-estates-light.png` (1254 × 1254) | `public/brand/scholte-estates-light-web.png` (796 × 338) |

**Originals.** These are byte-for-byte copies of the files supplied by the user:
- `Scholte Estates classic estate logo.png` (dark)
- `Scholte Estates Forest Green Logo.png` (light)

SHA-256 checksums:
- dark: `da56c13d8f267653a363bd983822eb74b2f0ddb1c1015c7bf25ea3cd6f5ea277`
- light: `fa4d9ab2639c230fa7cc86744fdd82cf8230d01ddc094b92a285a28caa867049`

**Web copies.** These are tight crops of the originals:
- Only the excess empty space was removed. A 24 px margin of the original background is kept around the artwork.
- Pixels, colours, typography, spacing and proportions are unchanged.
- To recreate them, crop the originals to the artwork's bounding box plus 24 px.

The signature monogram file (`Scholte Estates Signature Monogram.png`) was **not** part of this approval and is not used.

## Background colours

The logo files are not transparent; each has its own lightly textured background. Always place a logo on its matching colour, so it sits seamlessly without a visible box:

| Token (Tailwind) | Hex | Measured from | Use with |
|---|---|---|---|
| `brand-forest` (`bg-brand-forest`) | `#20311e` | dark logo background | dark logo |
| `brand-beige` (`bg-brand-beige`) | `#efe9e0` | light logo background | light logo |

The tokens are defined in `src/app/globals.css`.

The `.logo-feather` class (applied automatically) softly fades the outer 24 px crop margin into the surrounding colour. It affects only the display, never the files.

## Where each version is used

| Place | Background | Version |
|---|---|---|
| Header over the home-page hero (top of page) | `brand-forest` | Dark |
| Header after scrolling, and on all inner pages | `brand-beige` | Light (cross-fades from dark) |
| Thin contact bar above the header | `brand-forest` | (no logo) |
| Mobile menu | `brand-beige` (below the light header) | Light, in the header |
| Footer | `brand-forest` | Dark, larger |
| Closing contact panel (home) | `brand-forest`, flowing into the footer | (no logo) |

## Usage in code

- **Component:** `Logo` in `src/components/wordmark.tsx`, used as `<Logo variant="dark" | "light" className="h-…" sizes="…px" />`.
  - **`sizes`:** set it to roughly the rendered width so a sharp 2× copy is served.
  - **Quality:** logos render at quality 90. `images.qualities` in `next.config.ts` allows it.
- **Paths:** `site.brand` in `src/config/site.ts`.

**Sizes (readability checked on desktop and mobile):**

| Place | Logo height | Name lettering | Tagline |
|---|---|---|---|
| Header, mobile | 48 px (`h-12`) | clearly legible | decorative at this size |
| Header, desktop | about 58 px (`lg:h-[3.6rem]`) | about 24 px equivalent | decorative at this size |
| Footer | 96–112 px (`h-24 md:h-28`) | legible | legible |

Do not render the logo smaller than about 40 px high.

**Accessibility:**
- The header link carries the accessible name ("Scholte Estates — Home"), so the header images use empty `alt`.
- Elsewhere, `alt` is "Scholte Estates — Integrity first. Always."

## Not yet done or open

- **Business card:** not yet supplied. When it arrives, compare its colours with the tokens above and with the site palette (forest, ivory and gold in `globals.css`).
- **Favicon and social image:** not created. The square originals could serve as a basis, but only with the user's approval.
- **Transparent (cut-out) versions:** not made. They would alter the supplied files, so they need the user's approval first. They would allow the logo directly over photographs.
