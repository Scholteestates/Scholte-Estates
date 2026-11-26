import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mailto, site } from "@/config/site";
import { resolveLocale } from "@/i18n/page-params";
import { formatPrice } from "@/lib/properties";
import { getPreviewListing, getPreviewListings, previewMediaUrl, type PreviewListing } from "@/lib/listings/preview-source";
import type { PhotoClassification } from "@/lib/listings/types";
import { PropertyStory, type DescBlock, type RoomLayout, type StoryPicture, type StoryView } from "@/components/property/property-story";
import type { GalleryItem } from "@/components/property/story-gallery";

/**
 * PRIVATE PREVIEW of a real-listing story built from a provider feed.
 * The `.preview.tsx` extension keeps this route on the local dev server only
 * (next.config.ts). Data and photos come from the git-ignored /.private folder.
 */
export const instant = false;

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  const slugs = getPreviewListings().map((l) => ({ slug: l.slug }));
  return slugs.length ? slugs : [{ slug: "none" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const l = getPreviewListing((await params).slug);
  return { title: l ? `${l.overlay.name[locale]} · Preview` : "Preview", robots: { index: false, follow: false } };
}

const LAYOUT_FOR_KIND: Record<string, RoomLayout> = { living: "a", kitchen: "b", bedroom: "a", bathroom: "c" };

/**
 * Supplied descriptions arrive as plain lines; the wording is kept exactly as
 * supplied, only its structure is restored. Kinds are read from the English
 * text (headings there are in Title Case) and reused for the Spanish text when
 * both have the same lines, since Spanish headings are in sentence case.
 */
type LineKind = "p" | "h" | "li";

function lineKinds(lines: string[]): LineKind[] {
  const kinds: LineKind[] = [];
  lines.forEach((line, i) => {
    const short = line.length <= 90 && !/[.!?:]$/.test(line);
    const words = line.split(/\s+/).filter((w) => w.length > 3);
    const title = words.length > 0 && words.filter((w) => /^[A-Z]/.test(w)).length / words.length >= 0.6;
    const prev = kinds[i - 1];
    if (!short) kinds.push("p");
    else if (/ [–-] /.test(line)) kinds.push("li");
    else if (title) kinds.push("h");
    else if (prev === "li" || (prev === "p" && lines[i - 1].endsWith(":"))) kinds.push("li");
    else kinds.push("h");
  });
  return kinds;
}

function toBlocks(lines: string[], kinds: LineKind[]): DescBlock[] {
  const blocks: DescBlock[] = [];
  lines.forEach((text, i) => {
    const prev = blocks[blocks.length - 1];
    if (kinds[i] === "li") {
      if (prev?.kind === "ul") prev.items.push(text);
      else blocks.push({ kind: "ul", items: [text] });
    } else blocks.push({ kind: kinds[i], text });
  });
  return blocks;
}

const fill = (tpl: string, v: Record<string, string | number>) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

export default async function ListingPreviewPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const l: PreviewListing | undefined = getPreviewListing((await params).slug);
  if (!l) notFound();

  const t = dict.properties;
  const L = t.listing;
  const s = t.story;
  const { supplied: d, overlay: o } = l;
  const num = (n: number) => new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-GB", { maximumFractionDigits: 1 }).format(n);
  const m2 = (n?: number) => (n ? `${num(n)} m²` : undefined);

  const photos = new Map(o.classification.photos.map((c) => [c.id, c]));
  const fileFor = (id: number) => d.images.find((i) => i.id === id)?.file;

  /** Label every image for what it is: render, floor plan, show-home photo or photo. */
  const unreviewed = o.classification.reviewedBy === null;
  const baseLabel = (c?: PhotoClassification): { note: string; badge?: string } => {
    if (!c) return { note: L.photo };
    if (c.origin === "render") return { note: L.render, badge: L.renderBadge };
    if (c.origin === "drawing" && c.example) return { note: L.floorPlanExample, badge: L.floorPlanExampleBadge };
    if (c.origin === "drawing") return { note: L.floorPlan, badge: L.floorPlanBadge };
    if (c.otherUnit) return { note: L.showHome };
    return { note: L.photo };
  };
  /** Until a person has checked the classification, every label says it is provisional. */
  const labelFor = (c?: PhotoClassification) => {
    const b = baseLabel(c);
    return unreviewed ? { ...b, note: `${b.note} ${L.provisional}` } : b;
  };

  const pic = (id: number): StoryPicture | null => {
    const file = fileFor(id);
    const c = photos.get(id);
    if (!file || !c) return null;
    return { src: previewMediaUrl(l.dataset, file), alt: c.alt[locale], unoptimized: true, ...labelFor(c) };
  };

  const cover = pic(o.cover);
  if (!cover) notFound();

  const typeLabel = d.type in t.types ? t.types[d.type as keyof typeof t.types] : d.typeSupplied;
  const pool = t.specs.poolTypes[d.pool];
  const energy = d.energy;

  const keyFacts: [string, string][] = [
    [t.specs.beds, String(d.bedrooms)],
    [t.specs.baths, String(d.bathrooms)],
    ...(d.builtM2 ? ([[t.specs.built, m2(d.builtM2)!]] as [string, string][]) : []),
    ...(d.plotM2 ? ([[t.specs.plot, m2(d.plotM2)!]] as [string, string][]) : d.terraceM2 ? ([[t.specs.terrace, m2(d.terraceM2)!]] as [string, string][]) : []),
  ];

  const specs: [string, string][] = [
    [t.specs.price, formatPrice(d.priceEur, locale)],
    [t.specs.type, typeLabel],
    [t.specs.condition, t.condition[d.condition]],
    [t.specs.location, `${d.town}, ${d.province}`],
    [t.specs.beds, String(d.bedrooms)],
    [t.specs.baths, String(d.bathrooms)],
    ...([
      [t.specs.built, m2(d.builtM2)],
      [L.useful, m2(d.usefulM2)],
      [t.specs.plot, m2(d.plotM2)],
      [t.specs.terrace, m2(d.terraceM2)],
      [L.parking, d.parkingSpaces ? String(d.parkingSpaces) : undefined],
    ].filter(([, v]) => v) as [string, string][]),
    [t.specs.pool, pool],
    ...(energy
      ? ([[`${L.energy} · ${L.consumption}`, energy.consumption], [`${L.energy} · ${L.emissions}`, energy.emissions]] as [string, string][])
      : []),
    [L.availability, L.toConfirm],
    [L.completion, L.toConfirm],
    [t.specs.reference, d.source.providerRef],
    [L.source, `RedSP · ${fill(L.updated, { date: d.source.updatedAt.slice(0, 10) })}`],
  ];

  const withheld = new Set((o.withheldDistances ?? []).map((w) => w.key));
  const distances: [string, string][] = d.distances
    .filter((x) => !withheld.has(x.key))
    .map((x) => [x.label[locale], x.metres >= 1000 ? `${num(x.metres / 1000)} km` : `${num(x.metres)} m`]);

  const rooms = o.chapters.flatMap((c) => {
    const image = pic(c.image);
    if (!image) return [];
    return [
      {
        id: c.kind,
        label: L.rooms[c.kind],
        heading: c.heading[locale],
        body: c.body[locale],
        image,
        fullBleed: c.kind === "outdoor",
        layout: LAYOUT_FOR_KIND[c.kind] ?? "a",
      },
    ];
  });

  const gallery: GalleryItem[] = d.images.flatMap((img) => {
    const c = photos.get(img.id);
    if (!img.file || !c) return [];
    const { note, badge } = labelFor(c);
    return [
      {
        src: previewMediaUrl(l.dataset, img.file),
        alt: c.alt[locale],
        title: L.rooms[c.room],
        caption: c.caption[locale],
        label: L.rooms[c.room],
        note,
        badge,
        unoptimized: true,
      },
    ];
  });

  const en = d.description.en ?? [];
  const lines = d.description[locale] ?? en;
  const description = toBlocks(lines, lines.length === en.length ? lineKinds(en) : lineKinds(lines));

  const name = o.name[locale];
  const waText = fill(L.whatsappText, { name, ref: d.source.providerRef });

  const view: StoryView = {
    backHref: `/${locale}/properties`,
    backLabel: t.detail.back,
    name,
    eyebrow: `${t.condition[d.condition]} · ${typeLabel}`,
    place: `${d.town}, ${d.province}`,
    tagline: o.summary[locale],
    badges: [L.previewBadge],
    price: formatPrice(d.priceEur, locale),
    priceNotes: [L.priceSupplied, L.taxesUnknown],
    priceFacts: energy ? [[`${L.energy}:`, `${L.consumption} ${energy.consumption} · ${L.emissions} ${energy.emissions}`]] : undefined,
    keyFacts,
    notice: unreviewed ? `${L.previewNotice} ${L.labelsProvisional}` : L.previewNotice,
    cover,
    rooms,
    // The area chapter appears only once its places are verified (none yet).
    setting: undefined,
    facts: {
      overview: s.overview,
      description,
      descriptionSource: L.descriptionSource,
      featuresTitle: t.detail.features,
      features: d.features.map((f) => f[locale]),
      featuresNote: L.featuresNote,
      detailsTitle: t.detail.details,
      specs,
      extra: { title: L.distancesTitle, items: distances, note: L.distancesNote },
    },
    contact: {
      notice: L.previewNotice,
      title: L.contactTitle,
      body: fill(L.contactBody, { ref: d.source.providerRef }),
      whatsappHref: `${site.contact.whatsappUrl}?text=${encodeURIComponent(waText)}`,
      whatsappLabel: dict.cta.whatsapp,
      emailHref: mailto(`${name} — ${d.source.providerRef}`),
      emailLabel: dict.cta.email,
    },
    gallery: {
      eyebrow: name,
      title: s.gallery,
      lead: unreviewed ? `${fill(L.galleryLead, { n: gallery.length })} ${L.labelsProvisional}` : fill(L.galleryLead, { n: gallery.length }),
      items: gallery,
      labels: { open: s.open, close: s.close, prev: s.prev, next: s.next, counter: s.counter, illustrative: s.illustrative },
    },
    labels: { index: s.index, arrival: s.arrival, facts: s.facts, scroll: s.scroll },
  };

  return <PropertyStory v={view} />;
}
