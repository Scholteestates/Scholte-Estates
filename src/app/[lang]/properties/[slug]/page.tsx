import { notFound } from "next/navigation";
import { mailto, site } from "@/config/site";
import { resolveLocale } from "@/i18n/page-params";
import { pageMetadata } from "@/i18n/metadata";
import { cardLabels } from "@/i18n/property-labels";
import {
  formatPrice,
  getAllProperties,
  getPropertyBySlug,
  getRelatedProperties,
  storyImage,
  type PropertyImage,
  type StoryChapter,
} from "@/lib/properties";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyStory, type RoomLayout, type StoryPicture, type StoryView } from "@/components/property/property-story";
import type { GalleryItem } from "@/components/property/story-gallery";

// Every property page is prerendered; render blocking so unknown slugs return a real 404.
export const instant = false;

export function generateStaticParams() {
  const slugs = getAllProperties().map((p) => ({ slug: p.slug }));
  // Keep one placeholder so the route still builds when demo listings are off.
  return slugs.length ? slugs : [{ slug: "none" }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/properties/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) return {};
  const meta = pageMetadata(locale, dict, `/properties/${p.slug}`, `${p.name} · ${p.town}`);
  return { ...meta, description: p.title[locale], robots: p.isDemo ? { index: false, follow: true } : undefined };
}

/** General area copy (landing-page `area.places`) for the towns it describes. */
const PLACE_FOR_TOWN: Record<string, number> = {
  "Ciudad Quesada": 0,
  Torrevieja: 1,
  "Orihuela Costa": 2,
  "Guardamar del Segura": 3,
  Finestrat: 5,
  Altea: 5,
};

/** Layout per room chapter, so each scene reads differently (see PropertyStory). */
const LAYOUT_FOR_KIND: Record<string, RoomLayout> = { kitchen: "a", bedroom: "b", bathroom: "c" };

export default async function PropertyPage({ params }: PageProps<"/[lang]/properties/[slug]">) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) notFound();

  const t = dict.properties;
  const s = t.story;
  const kinds = dict.landing.kinds;
  const cover = p.images.find((i) => i.kind === "original") ?? p.images[0];
  const chapters = (p.story ?? []).filter((c) => storyImage(p, c.image));
  const rooms = chapters.filter((c) => c.kind !== "neighbourhood");
  const setting = chapters.find((c) => c.kind === "neighbourhood");
  const settingImage = setting ? storyImage(p, setting.image) : null;
  const place = PLACE_FOR_TOWN[p.town] !== undefined ? dict.area.places[PLACE_FOR_TOWN[p.town]] : null;

  const waText = t.detail.whatsappText.replace("{name}", p.name).replace("{ref}", p.reference);
  const aiNote = (img: PropertyImage | null) => (img?.isAiGenerated ? t.aiImage : undefined);
  const pic = (img: PropertyImage): StoryPicture => ({ src: img.src, alt: img.alt[locale], note: aiNote(img) });

  const specs: [string, string][] = [
    [t.specs.price, formatPrice(p.priceEur, locale) + (p.isDemo ? ` (${t.examplePrice.toLowerCase()})` : "")],
    [t.specs.type, t.types[p.type]],
    [t.specs.condition, t.condition[p.condition]],
    [t.specs.location, p.area && p.area !== p.town ? `${p.area}, ${p.town}` : p.town],
    [t.specs.beds, String(p.bedrooms)],
    [t.specs.baths, String(p.bathrooms)],
    ...(p.builtAreaM2 ? ([[t.specs.built, `${p.builtAreaM2} m²`]] as [string, string][]) : []),
    ...(p.plotAreaM2 ? ([[t.specs.plot, `${p.plotAreaM2} m²`]] as [string, string][]) : []),
    ...(p.terraceAreaM2 ? ([[t.specs.terrace, `${p.terraceAreaM2} m²`]] as [string, string][]) : []),
    [t.specs.pool, t.specs.poolTypes[p.pool]],
    [t.specs.seaView, p.seaView ? t.specs.yes : t.specs.no],
    [t.specs.reference, p.reference],
  ];

  const keyFacts: [string, string][] = [
    [t.specs.beds, String(p.bedrooms)],
    [t.specs.baths, String(p.bathrooms)],
    ...(p.builtAreaM2 ? ([[t.specs.built, `${p.builtAreaM2} m²`]] as [string, string][]) : []),
    ...(p.plotAreaM2
      ? ([[t.specs.plot, `${p.plotAreaM2} m²`]] as [string, string][])
      : p.terraceAreaM2
        ? ([[t.specs.terrace, `${p.terraceAreaM2} m²`]] as [string, string][])
        : []),
  ];

  const gallery: GalleryItem[] = [
    ...p.images.map((img) => ({
      src: img.src,
      alt: img.alt[locale],
      title: img.title?.[locale] ?? p.name,
      caption: img.kind === "original" ? p.title[locale] : (img.caption?.[locale] ?? ""),
      label: kinds[img.kind ?? "original"],
      note: aiNote(img),
    })),
    ...(p.neighbourhood
      ? [
          {
            src: p.neighbourhood.src,
            alt: p.neighbourhood.alt[locale],
            title: p.neighbourhood.title?.[locale] ?? kinds.neighbourhood,
            caption: p.neighbourhood.caption?.[locale] ?? "",
            label: kinds.neighbourhood,
            note: dict.landing.illustrative,
            illustrative: true,
          },
        ]
      : []),
  ];

  const view: StoryView = {
    backHref: `/${locale}/properties`,
    backLabel: t.detail.back,
    name: p.name,
    eyebrow: `${t.condition[p.condition]} · ${t.types[p.type]}`,
    place: p.area && p.area !== p.town && !p.area.includes(" ") ? `${p.area}, ${p.town}` : p.town,
    tagline: p.title[locale],
    badges: p.isDemo ? [t.demoBadge] : [],
    price: formatPrice(p.priceEur, locale),
    priceNotes: p.isDemo ? [t.examplePrice] : [],
    keyFacts,
    notice: p.isDemo ? t.demoNoticeLong : undefined,
    cover: pic(cover),
    rooms: rooms.flatMap((c: StoryChapter) => {
      const img = storyImage(p, c.image);
      if (!img) return [];
      return [
        {
          id: c.id,
          label: kinds[c.kind],
          heading: c.heading[locale],
          body: c.body[locale],
          image: pic(img),
          fullBleed: c.kind === "outdoor",
          layout: LAYOUT_FOR_KIND[c.kind] ?? "a",
        },
      ];
    }),
    setting:
      setting && settingImage
        ? {
            id: setting.id,
            label: kinds.neighbourhood,
            heading: setting.heading[locale],
            body: setting.body[locale],
            image: { src: settingImage.src, alt: settingImage.alt[locale], badge: s.illustrative, note: dict.landing.illustrative },
            area: place ? { title: `${s.area} · ${place.name}`, body: place.body } : undefined,
            standard: s.standard,
          }
        : undefined,
    facts: {
      overview: s.overview,
      description: [{ kind: "p", text: p.description[locale] }],
      featuresTitle: t.detail.features,
      features: p.features[locale],
      detailsTitle: t.detail.details,
      specs,
    },
    contact: {
      notice: p.isDemo ? t.demoNotice : undefined,
      title: t.detail.similarTitle,
      body: t.detail.similarBody,
      whatsappHref: `${site.contact.whatsappUrl}?text=${encodeURIComponent(waText)}`,
      whatsappLabel: dict.cta.whatsapp,
      emailHref: mailto(`${t.detail.similarTitle} — ${p.reference}`),
      emailLabel: dict.cta.email,
    },
    gallery: {
      eyebrow: p.name,
      title: s.gallery,
      lead: s.galleryLead,
      items: gallery,
      labels: { open: s.open, close: s.close, prev: s.prev, next: s.next, counter: s.counter, illustrative: s.illustrative },
    },
    labels: { index: s.index, arrival: s.arrival, facts: s.facts, scroll: s.scroll },
    after: (
      <section className="bg-ivory-100">
        <div className="container-page py-16 md:py-24">
          <h2 className="text-3xl text-forest-900 md:text-4xl">{t.detail.more}</h2>
          <span className="gold-rule mt-5" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getRelatedProperties(p).map((r) => (
              <li key={r.slug}>
                <PropertyCard property={r} locale={locale} labels={cardLabels(dict)} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
  };

  return <PropertyStory v={view} />;
}
