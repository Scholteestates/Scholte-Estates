import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
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
import { DemoBadge, DemoNotice } from "@/components/property/demo-badge";
import { PropertyCard } from "@/components/property/property-card";
import { StoryNav } from "@/components/property/story-nav";
import { StoryGallery, type GalleryItem } from "@/components/property/story-gallery";
import { MailIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

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

/**
 * Editorial layouts for the four room chapters. Image scale and text
 * position vary so the tour reads as a sequence of distinct scenes.
 */
const LAYOUTS = {
  kitchen: { col: "lg:col-span-8", frame: "aspect-[3/2]", text: "lg:col-span-4 lg:pl-4", sizes: "(min-width: 1024px) 800px, 100vw" },
  bedroom: {
    col: "lg:col-span-7 lg:col-start-6",
    frame: "aspect-[4/3]",
    text: "lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-end lg:pb-6",
    sizes: "(min-width: 1024px) 700px, 100vw",
  },
  bathroom: {
    col: "lg:col-span-5 lg:col-start-2",
    frame: "aspect-[4/3] lg:aspect-[4/5] lg:max-h-[min(40rem,calc(100svh-11rem))]",
    text: "lg:col-span-4 lg:col-start-8",
    sizes: "(min-width: 1024px) 500px, 100vw",
  },
} as const;

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
  const waHref = `${site.contact.whatsappUrl}?text=${encodeURIComponent(waText)}`;
  const aiNote = (img: PropertyImage | null) => (img?.isAiGenerated ? t.aiImage : undefined);

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

  const navItems = [
    { id: "arrival", label: s.arrival },
    ...rooms.map((c) => ({ id: c.id, label: kinds[c.kind] })),
    ...(setting ? [{ id: setting.id, label: kinds.neighbourhood }] : []),
    { id: "facts", label: s.facts },
    { id: "gallery", label: s.gallery },
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

  const chapterNo = (c: StoryChapter) => String(chapters.indexOf(c) + 2).padStart(2, "0");
  const anchor = "scroll-mt-[8.5rem] lg:scroll-mt-[9.5rem]";

  return (
    <>
      {/* 1 · Arrival: the home, its price and the essentials in one scene. */}
      <section id="arrival" className={`container-page pt-5 pb-10 md:pt-7 lg:pb-14 ${anchor}`}>
        <Link href={`/${locale}/properties`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest-900">
          <span aria-hidden="true">←</span> {t.detail.back}
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <figure className="lg:col-span-8">
            <div className="relative aspect-[3/2] overflow-hidden bg-ivory-200 lg:aspect-auto lg:h-[min(36rem,calc(100svh-12.5rem))]">
              <Image
                src={cover.src}
                alt={cover.alt[locale]}
                fill
                preload
                sizes="(min-width: 1216px) 800px, (min-width: 1024px) 66vw, 100vw"
                className="hero-image object-cover"
              />
            </div>
            {cover.isAiGenerated && <figcaption className="mt-2.5 text-xs text-muted">{t.aiImage}</figcaption>}
          </figure>

          <div className="lg:col-span-4 lg:pb-8">
            <div className="flex flex-wrap items-center gap-3">
              {p.isDemo && <DemoBadge label={t.demoBadge} />}
              <span className="text-[0.7rem] font-semibold tracking-[0.18em] text-gold-600 uppercase">
                {t.condition[p.condition]} · {t.types[p.type]}
              </span>
            </div>
            <h1 className="mt-4 text-5xl leading-[0.95] text-forest-900 xl:text-6xl">{p.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-muted">
              <PinIcon className="size-4 text-gold-500" />
              {p.area && p.area !== p.town && !p.area.includes(" ") ? `${p.area}, ${p.town}` : p.town}
            </p>
            <p className="mt-5 font-serif text-lg leading-snug text-forest-800 italic">{p.title[locale]}</p>

            <div className="mt-6 border-t border-ivory-300 pt-5">
              <p className="font-serif text-4xl text-forest-900">{formatPrice(p.priceEur, locale)}</p>
              {p.isDemo && <p className="mt-0.5 text-xs text-muted">{t.examplePrice}</p>}
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t sm:grid-cols-4 border-ivory-300 pt-5">
              {keyFacts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.65rem] tracking-[0.08em] text-muted uppercase">{k}</dt>
                  <dd className="mt-1 font-serif text-xl text-forest-900">{v}</dd>
                </div>
              ))}
            </dl>
            {rooms[0] && (
              <a
                href={`#${rooms[0].id}`}
                className="mt-7 inline-flex items-center gap-3 text-sm font-semibold text-forest-900 underline decoration-gold-400 underline-offset-[6px] hover:decoration-forest-900"
              >
                {s.scroll} <span aria-hidden="true">↓</span>
              </a>
            )}
          </div>
        </div>

        {p.isDemo && (
          <div className="mt-8 border-l-2 border-gold-400 bg-ivory-100 px-5 py-3.5">
            <DemoNotice text={t.demoNoticeLong} />
          </div>
        )}
      </section>

      <div>
        <StoryNav label={s.index} title={p.name} items={navItems} />

        {/* 2–5 · Room chapters, each with its own image and description. */}
        {rooms.map((c) => {
          const img = storyImage(p, c.image);
          if (!img) return null;
          const no = chapterNo(c);

          if (c.kind === "outdoor") {
            return (
              <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className={`relative mt-14 md:mt-24 ${anchor}`}>
                <div className="relative">
                  <figure data-reveal="mask">
                    <div className="relative h-[56svh] min-h-[18rem] overflow-hidden bg-ivory-200 lg:h-[min(44rem,calc(100svh-11rem))]">
                      <Image src={img.src} alt={img.alt[locale]} fill sizes="100vw" className="object-cover" />
                    </div>
                    {img.isAiGenerated && (
                      <figcaption className="container-page mt-2.5 text-xs text-muted lg:text-right">{t.aiImage}</figcaption>
                    )}
                  </figure>
                  <div className="container-page lg:absolute lg:inset-x-0 lg:bottom-14">
                    <div
                      data-reveal
                      style={{ "--reveal-delay": "0.25s" } as CSSProperties}
                      className="mt-6 max-w-md bg-ivory-50 lg:mt-0 lg:p-10 lg:shadow-[0_30px_60px_-30px_rgba(20,35,25,0.45)]"
                    >
                      <ChapterText no={no} kind={kinds[c.kind]} id={`${c.id}-h`} heading={c.heading[locale]} body={c.body[locale]} />
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          const l = LAYOUTS[c.kind as keyof typeof LAYOUTS] ?? LAYOUTS.kitchen;
          return (
            <section
              key={c.id}
              id={c.id}
              aria-labelledby={`${c.id}-h`}
              className={`container-page mt-14 grid gap-6 md:mt-24 lg:grid-cols-12 lg:items-center lg:gap-10 ${anchor}`}
            >
              <figure data-reveal="mask" className={l.col}>
                <div className={`relative w-full overflow-hidden bg-ivory-200 ${l.frame}`}>
                  <Image src={img.src} alt={img.alt[locale]} fill sizes={l.sizes} className="object-cover" />
                </div>
                {img.isAiGenerated && <figcaption className="mt-2.5 text-xs text-muted">{t.aiImage}</figcaption>}
              </figure>
              <div data-reveal style={{ "--reveal-delay": "0.15s" } as CSSProperties} className={l.text}>
                <ChapterText no={no} kind={kinds[c.kind]} id={`${c.id}-h`} heading={c.heading[locale]} body={c.body[locale]} />
              </div>
            </section>
          );
        })}

        {/* 6 · The setting: a separate, clearly illustrative area chapter. */}
        {setting && settingImage && (
          <section
            id={setting.id}
            aria-labelledby={`${setting.id}-h`}
            className={`mt-16 bg-brand-forest text-ivory-50 md:mt-28 ${anchor}`}
          >
            <div className="container-page grid gap-8 py-14 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-12">
              <figure data-reveal="mask" className="lg:col-span-7">
                <div className="relative aspect-[3/2] overflow-hidden bg-forest-900">
                  <Image src={settingImage.src} alt={settingImage.alt[locale]} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
                  <span className="absolute top-3 left-3 rounded-full bg-forest-950/80 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-ivory-50 uppercase">
                    {s.illustrative}
                  </span>
                </div>
                <figcaption className="mt-2.5 text-xs text-ivory-200/80">{dict.landing.illustrative}</figcaption>
              </figure>
              <div data-reveal style={{ "--reveal-delay": "0.15s" } as CSSProperties} className="lg:col-span-5">
                <p className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl text-gold-300 tabular-nums">{chapterNo(setting)}</span>
                  <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold-300 uppercase">{kinds.neighbourhood}</span>
                </p>
                <h2 id={`${setting.id}-h`} className="mt-4 text-3xl leading-tight md:text-4xl">
                  {setting.heading[locale]}
                </h2>
                <p className="mt-4 leading-relaxed text-ivory-200">{setting.body[locale]}</p>
                {place && (
                  <div className="mt-7 border-t border-ivory-50/15 pt-6">
                    <h3 className="font-sans text-[0.7rem] font-semibold tracking-[0.2em] text-gold-300 uppercase">
                      {s.area} · {place.name}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ivory-200">{place.body}</p>
                  </div>
                )}
                <p className="mt-6 border-l-2 border-gold-400 pl-4 text-sm leading-relaxed text-ivory-200/90">{s.standard}</p>
              </div>
            </div>
          </section>
        )}

        {/* 7 · Practical facts and the next step. */}
        <section id="facts" aria-labelledby="facts-h" className={`container-page grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-16 ${anchor}`}>
          <div className="lg:col-span-7">
            <p className="eyebrow">{s.facts}</p>
            <h2 id="facts-h" className="mt-4 text-3xl leading-tight text-forest-900 md:text-4xl">
              {s.overview}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">{p.description[locale]}</p>

            <h3 className="mt-12 text-2xl text-forest-900">{t.detail.features}</h3>
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
              {p.features[locale].map((f) => (
                <li key={f} className="flex items-center gap-3 border-b border-ivory-200 py-3.5 text-forest-900">
                  <span aria-hidden="true" className="block h-px w-4 bg-gold-500" />
                  {f}
                </li>
              ))}
            </ul>

            <h3 className="mt-12 text-2xl text-forest-900">{t.detail.details}</h3>
            <dl className="mt-4 grid gap-x-8 text-sm sm:grid-cols-2">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-ivory-200 py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-medium text-forest-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-ivory-200 bg-ivory-100 p-7 md:p-9 lg:sticky lg:top-40">
              {p.isDemo && <DemoNotice text={t.demoNotice} className="mb-5" />}
              <h2 className="text-3xl text-forest-900">{t.detail.similarTitle}</h2>
              <span className="gold-rule mt-5" />
              <p className="mt-5 leading-relaxed text-muted">{t.detail.similarBody}</p>
              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-forest-800 px-6 py-3.5 text-sm font-semibold text-ivory-50 transition-colors hover:bg-forest-700"
                >
                  <WhatsAppIcon /> {dict.cta.whatsapp}
                </a>
                <a
                  href={mailto(`${t.detail.similarTitle} — ${p.reference}`)}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-forest-800/30 px-6 py-3.5 text-sm font-semibold text-forest-900 transition-colors hover:border-forest-800"
                >
                  <MailIcon /> {dict.cta.email}
                </a>
              </div>
            </div>
          </aside>
        </section>

        {/* 8 · Gallery: every image, inspectable directly. */}
        <section id="gallery" aria-labelledby="gallery-h" className={`border-t border-ivory-200 ${anchor}`}>
          <div className="container-page py-16 md:py-20">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">{p.name}</p>
                <h2 id="gallery-h" className="mt-3 text-3xl text-forest-900 md:text-4xl">
                  {s.gallery}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted">{s.galleryLead}</p>
            </div>
            <div className="mt-10">
              <StoryGallery
                items={gallery}
                labels={{ open: s.open, close: s.close, prev: s.prev, next: s.next, counter: s.counter, illustrative: s.illustrative }}
              />
            </div>
          </div>
        </section>
      </div>

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
    </>
  );
}

function ChapterText({ no, kind, id, heading, body }: { no: string; kind: string; id: string; heading: string; body: string }) {
  return (
    <>
      <p className="flex items-baseline gap-3">
        <span className="font-serif text-3xl text-gold-500 tabular-nums">{no}</span>
        <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold-600 uppercase">{kind}</span>
      </p>
      <h2 id={id} className="mt-4 text-3xl leading-tight text-forest-900 md:text-4xl">
        {heading}
      </h2>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">{body}</p>
    </>
  );
}
