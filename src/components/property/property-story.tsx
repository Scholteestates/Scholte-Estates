import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { DemoBadge, DemoNotice } from "@/components/property/demo-badge";
import { StoryNav } from "@/components/property/story-nav";
import { StoryGallery, type GalleryItem } from "@/components/property/story-gallery";
import { MailIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { AreaExplorer } from "@/components/area/area-explorer";
import type { AreaSection } from "@/lib/areas/view";

/**
 * The property-story template (docs/website-direction.md §4–5), shared by the
 * demo homes and real listings. Callers turn their data into a StoryView;
 * this component only lays it out. Only supported chapters are passed in:
 * a chapter without its own image, or an area without verified information,
 * is simply left out.
 */

export type StoryPicture = {
  src: string;
  alt: string;
  /** Visible caption under the image, e.g. "Computer-generated image". */
  note?: string;
  /** Short badge over the image, e.g. "Illustrative scene" or "Render". */
  badge?: string;
  unoptimized?: boolean;
};

/** a: wide image, text right · b: image right, text left · c: portrait image. */
export type RoomLayout = "a" | "b" | "c";

export type StoryRoom = {
  id: string;
  label: string;
  heading: string;
  body: string;
  image: StoryPicture;
  /** Full-bleed scene with an overlaid card (outdoors). */
  fullBleed?: boolean;
  layout?: RoomLayout;
};

/** A block of description text: paragraph, small heading or list. */
export type DescBlock = { kind: "p" | "h"; text: string } | { kind: "ul"; items: string[] };

export type StoryView = {
  backHref: string;
  backLabel: string;
  name: string;
  eyebrow: string;
  place: string;
  tagline?: string;
  badges: string[];
  price: string;
  priceNotes: string[];
  /** Small facts under the price (e.g. the energy rating). */
  priceFacts?: [string, string][];
  keyFacts: [string, string][];
  /** Longer notice under the arrival scene (demo or preview notice). */
  notice?: string;
  cover: StoryPicture;
  rooms: StoryRoom[];
  setting?: {
    id: string;
    label: string;
    heading: string;
    body: string;
    image: StoryPicture;
    area?: { title: string; body: string };
    standard?: string;
  };
  /** Verified places on an interactive map (only when an area profile exists). */
  area?: AreaSection;
  facts: {
    overview: string;
    description: DescBlock[];
    /** Small source line above the description, e.g. "Supplied by the developer". */
    descriptionSource?: string;
    featuresTitle: string;
    features: string[];
    featuresNote?: string;
    detailsTitle: string;
    specs: [string, string][];
    /** Extra fact list, e.g. the provider's own distances. */
    extra?: { title: string; items: [string, string][]; note: string };
  };
  contact: {
    notice?: string;
    title: string;
    body: string;
    whatsappHref: string;
    whatsappLabel: string;
    emailHref: string;
    emailLabel: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    lead: string;
    items: GalleryItem[];
    labels: { open: string; close: string; prev: string; next: string; counter: string; illustrative: string };
  };
  labels: { index: string; arrival: string; facts: string; scroll: string };
  /** Optional closing section (e.g. related homes). */
  after?: ReactNode;
};

const LAYOUTS = {
  a: { col: "lg:col-span-8", frame: "aspect-[3/2]", text: "lg:col-span-4 lg:pl-4", sizes: "(min-width: 1024px) 800px, 100vw" },
  b: {
    col: "lg:col-span-7 lg:col-start-6",
    frame: "aspect-[4/3]",
    text: "lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-end lg:pb-6",
    sizes: "(min-width: 1024px) 700px, 100vw",
  },
  c: {
    col: "lg:col-span-5 lg:col-start-2",
    frame: "aspect-[4/3] lg:aspect-[4/5] lg:max-h-[min(40rem,calc(100svh-11rem))]",
    text: "lg:col-span-4 lg:col-start-8",
    sizes: "(min-width: 1024px) 500px, 100vw",
  },
} as const;

const DEFAULT_LAYOUTS: RoomLayout[] = ["a", "b", "c"];

function Badge({ text }: { text: string }) {
  return (
    <span className="absolute top-3 left-3 rounded-full bg-forest-950/80 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-ivory-50 uppercase">
      {text}
    </span>
  );
}

export function PropertyStory({ v }: { v: StoryView }) {
  const anchor = "scroll-mt-[8.5rem] lg:scroll-mt-[9.5rem]";
  const chapterCount = v.rooms.length + (v.setting ? 1 : 0) + (v.area ? 1 : 0);
  const no = (i: number) => String(i + 2).padStart(2, "0");

  const navItems = [
    { id: "arrival", label: v.labels.arrival },
    ...v.rooms.map((r) => ({ id: r.id, label: r.label })),
    ...(v.setting ? [{ id: v.setting.id, label: v.setting.label }] : []),
    ...(v.area ? [{ id: "area", label: v.area.label }] : []),
    { id: "facts", label: v.labels.facts },
    { id: "gallery", label: v.gallery.title },
  ];

  let framed = 0;

  return (
    <>
      {/* 1 · Arrival: the home, its price and the essentials in one scene. */}
      <section id="arrival" className={`container-page pt-5 pb-10 md:pt-7 lg:pb-14 ${anchor}`}>
        <Link href={v.backHref} className="inline-flex items-center gap-2 text-sm text-muted hover:text-forest-900">
          <span aria-hidden="true">←</span> {v.backLabel}
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <figure className="lg:col-span-8">
            <div className="relative aspect-[3/2] overflow-hidden bg-ivory-200 lg:aspect-auto lg:h-[min(36rem,calc(100svh-12.5rem))]">
              <Image
                src={v.cover.src}
                alt={v.cover.alt}
                fill
                preload
                unoptimized={v.cover.unoptimized}
                sizes="(min-width: 1216px) 800px, (min-width: 1024px) 66vw, 100vw"
                className="hero-image object-cover"
              />
              {v.cover.badge && <Badge text={v.cover.badge} />}
            </div>
            {v.cover.note && <figcaption className="mt-2.5 text-xs text-muted">{v.cover.note}</figcaption>}
          </figure>

          <div className="lg:col-span-4 lg:pb-8">
            <div className="flex flex-wrap items-center gap-3">
              {v.badges.map((b) => (
                <DemoBadge key={b} label={b} />
              ))}
              <span className="text-[0.7rem] font-semibold tracking-[0.18em] text-gold-600 uppercase">{v.eyebrow}</span>
            </div>
            <h1 className="mt-4 text-5xl leading-[0.95] text-forest-900 xl:text-6xl">{v.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-muted">
              <PinIcon className="size-4 text-gold-500" />
              {v.place}
            </p>
            {v.tagline && <p className="mt-5 font-serif text-lg leading-snug text-forest-800 italic">{v.tagline}</p>}

            <div className="mt-6 border-t border-ivory-300 pt-5">
              <p className="font-serif text-4xl text-forest-900">{v.price}</p>
              {v.priceNotes.map((n) => (
                <p key={n} className="mt-0.5 text-xs text-muted">
                  {n}
                </p>
              ))}
              {v.priceFacts?.length ? (
                <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                  {v.priceFacts.map(([k, val]) => (
                    <div key={k} className="flex gap-1.5">
                      <dt className="text-muted">{k}</dt>
                      <dd className="font-semibold text-forest-900">{val}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t sm:grid-cols-4 border-ivory-300 pt-5">
              {v.keyFacts.map(([k, val]) => (
                <div key={k}>
                  <dt className="text-[0.65rem] tracking-[0.08em] text-muted uppercase">{k}</dt>
                  <dd className="mt-1 font-serif text-xl text-forest-900">{val}</dd>
                </div>
              ))}
            </dl>
            {chapterCount > 0 && (
              <a
                href={`#${v.rooms[0]?.id ?? v.setting?.id}`}
                className="mt-7 inline-flex items-center gap-3 text-sm font-semibold text-forest-900 underline decoration-gold-400 underline-offset-[6px] hover:decoration-forest-900"
              >
                {v.labels.scroll} <span aria-hidden="true">↓</span>
              </a>
            )}
          </div>
        </div>

        {v.notice && (
          <div className="mt-8 border-l-2 border-gold-400 bg-ivory-100 px-5 py-3.5">
            <DemoNotice text={v.notice} />
          </div>
        )}
      </section>

      <div>
        <StoryNav label={v.labels.index} title={v.name} items={navItems} />

        {/* Room chapters, each with its own image and description. */}
        {v.rooms.map((r, i) => {
          const img = r.image;
          if (r.fullBleed) {
            return (
              <section key={r.id} id={r.id} aria-labelledby={`${r.id}-h`} className={`relative mt-14 md:mt-24 ${anchor}`}>
                <div className="relative">
                  <figure data-reveal="mask">
                    <div className="relative h-[56svh] min-h-[18rem] overflow-hidden bg-ivory-200 lg:h-[min(44rem,calc(100svh-11rem))]">
                      <Image src={img.src} alt={img.alt} fill unoptimized={img.unoptimized} sizes="100vw" className="object-cover" />
                      {img.badge && <Badge text={img.badge} />}
                    </div>
                    {img.note && <figcaption className="container-page mt-2.5 text-xs text-muted lg:text-right">{img.note}</figcaption>}
                  </figure>
                  <div className="container-page lg:absolute lg:inset-x-0 lg:bottom-14">
                    <div
                      data-reveal
                      style={{ "--reveal-delay": "0.25s" } as CSSProperties}
                      className="mt-6 max-w-md bg-ivory-50 lg:mt-0 lg:p-10 lg:shadow-[0_30px_60px_-30px_rgba(20,35,25,0.45)]"
                    >
                      <ChapterText no={no(i)} kind={r.label} id={`${r.id}-h`} heading={r.heading} body={r.body} />
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          const l = LAYOUTS[r.layout ?? DEFAULT_LAYOUTS[framed % DEFAULT_LAYOUTS.length]];
          framed++;
          return (
            <section
              key={r.id}
              id={r.id}
              aria-labelledby={`${r.id}-h`}
              className={`container-page mt-14 grid gap-6 md:mt-24 lg:grid-cols-12 lg:items-center lg:gap-10 ${anchor}`}
            >
              <figure data-reveal="mask" className={l.col}>
                <div className={`relative w-full overflow-hidden bg-ivory-200 ${l.frame}`}>
                  <Image src={img.src} alt={img.alt} fill unoptimized={img.unoptimized} sizes={l.sizes} className="object-cover" />
                  {img.badge && <Badge text={img.badge} />}
                </div>
                {img.note && <figcaption className="mt-2.5 text-xs text-muted">{img.note}</figcaption>}
              </figure>
              <div data-reveal style={{ "--reveal-delay": "0.15s" } as CSSProperties} className={l.text}>
                <ChapterText no={no(i)} kind={r.label} id={`${r.id}-h`} heading={r.heading} body={r.body} />
              </div>
            </section>
          );
        })}

        {/* The setting: a separate area chapter, shown only when supported. */}
        {v.setting && (
          <section id={v.setting.id} aria-labelledby={`${v.setting.id}-h`} className={`mt-16 bg-brand-forest text-ivory-50 md:mt-28 ${anchor}`}>
            <div className="container-page grid gap-8 py-14 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-12">
              <figure data-reveal="mask" className="lg:col-span-7">
                <div className="relative aspect-[3/2] overflow-hidden bg-forest-900">
                  <Image
                    src={v.setting.image.src}
                    alt={v.setting.image.alt}
                    fill
                    unoptimized={v.setting.image.unoptimized}
                    sizes="(min-width: 1024px) 700px, 100vw"
                    className="object-cover"
                  />
                  {v.setting.image.badge && <Badge text={v.setting.image.badge} />}
                </div>
                {v.setting.image.note && <figcaption className="mt-2.5 text-xs text-ivory-200/80">{v.setting.image.note}</figcaption>}
              </figure>
              <div data-reveal style={{ "--reveal-delay": "0.15s" } as CSSProperties} className="lg:col-span-5">
                <p className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl text-gold-300 tabular-nums">{no(v.rooms.length)}</span>
                  <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold-300 uppercase">{v.setting.label}</span>
                </p>
                <h2 id={`${v.setting.id}-h`} className="mt-4 text-3xl leading-tight md:text-4xl">
                  {v.setting.heading}
                </h2>
                <p className="mt-4 leading-relaxed text-ivory-200">{v.setting.body}</p>
                {v.setting.area && (
                  <div className="mt-7 border-t border-ivory-50/15 pt-6">
                    <h3 className="font-sans text-[0.7rem] font-semibold tracking-[0.2em] text-gold-300 uppercase">{v.setting.area.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ivory-200">{v.setting.area.body}</p>
                  </div>
                )}
                {v.setting.standard && (
                  <p className="mt-6 border-l-2 border-gold-400 pl-4 text-sm leading-relaxed text-ivory-200/90">{v.setting.standard}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* The area: verified places on a self-hosted interactive map. */}
        {v.area && (
          <section id="area" aria-labelledby="area-h" className={`border-t border-ivory-200 bg-ivory-50 ${anchor}`}>
            <div className="container-page py-16 md:py-24">
              <AreaExplorer
                places={v.area.places}
                centre={v.area.centre}
                home={v.area.home}
                pinLabel={v.area.pinLabel}
                google={v.area.google}
                lang={v.area.lang}
                labels={v.area.labels}
                intro={
                  <div data-reveal>
                    <p className="flex items-baseline gap-3">
                      <span className="font-serif text-3xl text-gold-500 tabular-nums">{no(v.rooms.length + (v.setting ? 1 : 0))}</span>
                      <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold-600 uppercase">{v.area.label}</span>
                    </p>
                    <h2 id="area-h" className="mt-4 text-3xl leading-tight text-forest-900 md:text-4xl">
                      {v.area.heading}
                    </h2>
                    <p className="mt-4 leading-relaxed text-muted">{v.area.lead}</p>
                    {v.area.notice && <DemoNotice text={v.area.notice} className="mt-5" />}
                  </div>
                }
                footer={<p className="text-xs leading-relaxed text-muted">{v.area.method}</p>}
              />
            </div>
          </section>
        )}

        {/* Practical facts and the next step. */}
        <section id="facts" aria-labelledby="facts-h" className={`container-page grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-16 ${anchor}`}>
          <div className="lg:col-span-7">
            <p className="eyebrow">{v.labels.facts}</p>
            <h2 id="facts-h" className="mt-4 text-3xl leading-tight text-forest-900 md:text-4xl">
              {v.facts.overview}
            </h2>
            {v.facts.descriptionSource && (
              <p className="mt-6 text-[0.7rem] font-semibold tracking-[0.16em] text-gold-600 uppercase">{v.facts.descriptionSource}</p>
            )}
            <div className={v.facts.description.length > 1 ? "mt-3 space-y-3 leading-relaxed text-muted" : "mt-6 text-lg leading-relaxed text-muted"}>
              {v.facts.description.map((b, i) =>
                b.kind === "h" ? (
                  <h3 key={i} className="pt-4 font-serif text-xl text-forest-900">
                    {b.text}
                  </h3>
                ) : b.kind === "ul" ? (
                  <ul key={i} className="space-y-1.5">
                    {b.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.7em] block h-px w-3 shrink-0 bg-gold-500" />
                        {it}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={i}>{b.text}</p>
                ),
              )}
            </div>

            {v.facts.features.length > 0 && (
              <>
                <h3 className="mt-12 text-2xl text-forest-900">{v.facts.featuresTitle}</h3>
                {v.facts.featuresNote && <p className="mt-2 text-xs text-muted">{v.facts.featuresNote}</p>}
                <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
                  {v.facts.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 border-b border-ivory-200 py-3.5 text-forest-900">
                      <span aria-hidden="true" className="block h-px w-4 bg-gold-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h3 className="mt-12 text-2xl text-forest-900">{v.facts.detailsTitle}</h3>
            <FactList items={v.facts.specs} />

            {v.facts.extra && v.facts.extra.items.length > 0 && (
              <>
                <h3 className="mt-12 text-2xl text-forest-900">{v.facts.extra.title}</h3>
                <p className="mt-2 text-xs text-muted">{v.facts.extra.note}</p>
                <FactList items={v.facts.extra.items} />
              </>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-ivory-200 bg-ivory-100 p-7 md:p-9 lg:sticky lg:top-40">
              {v.contact.notice && <DemoNotice text={v.contact.notice} className="mb-5" />}
              <h2 className="text-3xl text-forest-900">{v.contact.title}</h2>
              <span className="gold-rule mt-5" />
              <p className="mt-5 leading-relaxed text-muted">{v.contact.body}</p>
              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={v.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-forest-800 px-6 py-3.5 text-sm font-semibold text-ivory-50 transition-colors hover:bg-forest-700"
                >
                  <WhatsAppIcon /> {v.contact.whatsappLabel}
                </a>
                <a
                  href={v.contact.emailHref}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-forest-800/30 px-6 py-3.5 text-sm font-semibold text-forest-900 transition-colors hover:border-forest-800"
                >
                  <MailIcon /> {v.contact.emailLabel}
                </a>
              </div>
            </div>
          </aside>
        </section>

        {/* Gallery: every image, inspectable directly. */}
        <section id="gallery" aria-labelledby="gallery-h" className={`border-t border-ivory-200 ${anchor}`}>
          <div className="container-page py-16 md:py-20">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">{v.gallery.eyebrow}</p>
                <h2 id="gallery-h" className="mt-3 text-3xl text-forest-900 md:text-4xl">
                  {v.gallery.title}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted">{v.gallery.lead}</p>
            </div>
            <div className="mt-10">
              <StoryGallery items={v.gallery.items} labels={v.gallery.labels} />
            </div>
          </div>
        </section>
      </div>

      {v.after}
    </>
  );
}

function FactList({ items }: { items: [string, string][] }) {
  return (
    <dl className="mt-4 grid gap-x-8 text-sm sm:grid-cols-2">
      {items.map(([k, val]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-ivory-200 py-2.5">
          <dt className="text-muted">{k}</dt>
          <dd className="text-right font-medium text-forest-900">{val}</dd>
        </div>
      ))}
    </dl>
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
