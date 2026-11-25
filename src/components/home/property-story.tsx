"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { ImageKind, Property, PropertyImage, StoryChapter } from "@/lib/properties/types";
import { formatPrice } from "@/lib/properties/helpers";
import { DemoBadge } from "@/components/property/demo-badge";
import { ArrowIcon } from "@/components/icons";
import { Carousel } from "@/components/property/carousel";

export type StoryLabels = {
  chapters: string;
  kinds: Record<ImageKind, string>;
  illustrative: string;
  aiImage: string;
  demoBadge: string;
  examplePrice: string;
  viewHome: string;
  beds: string;
  baths: string;
  built: string;
  plot: string;
  prev: string;
  next: string;
  of: string;
};

export type ResolvedChapter = StoryChapter & { photo: PropertyImage };

const pad = (n: number) => String(n).padStart(2, "0");
/** Desktop scroll distance per chapter, as a fraction of the viewport height. */
const PER_CHAPTER = 0.55;

/**
 * Signature sequence (docs/website-direction.md §3, "Story chapters").
 * Desktop: a sticky stage that fits below the header; the active chapter is
 * derived from scroll position, so photo, caption and index always agree,
 * including when scrolling backwards or jumping. Mobile: a swipeable
 * sequence of chapter cards.
 */
export function PropertyStory({
  property: p,
  chapters,
  locale,
  labels,
}: {
  property: Property;
  chapters: ResolvedChapter[];
  locale: Locale;
  labels: StoryLabels;
}) {
  const n = chapters.length;
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const t = track.current;
    const s = stage.current;
    if (!t || !s || !t.offsetParent) return null;
    const top = parseFloat(getComputedStyle(s).top) || 0;
    const span = Math.max(1, t.offsetHeight - s.offsetHeight);
    const r = t.getBoundingClientRect();
    return { top, span, absTop: r.top + window.scrollY, progress: Math.min(1, Math.max(0, (top - r.top) / span)) };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const m = measure();
      if (!m) return;
      track.current!.style.setProperty("--story", m.progress.toFixed(4));
      setActive(Math.min(n - 1, Math.floor(m.progress * n)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [measure, n]);

  const goTo = (i: number) => {
    const m = measure();
    if (!m) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: m.absTop - m.top + ((i + 0.5) / n) * m.span, behavior: reduce ? "auto" : "smooth" });
  };

  const facts: [string, string][] = [
    [labels.beds, String(p.bedrooms)],
    [labels.baths, String(p.bathrooms)],
    ...(p.builtAreaM2 ? ([[labels.built, `${p.builtAreaM2} m²`]] as [string, string][]) : []),
    ...(p.plotAreaM2 ? ([[labels.plot, `${p.plotAreaM2} m²`]] as [string, string][]) : []),
  ];
  const href = `/${locale}/properties/${p.slug}`;
  const photoNote = (c: ResolvedChapter) => (c.photo.isIllustrative ? labels.illustrative : labels.aiImage);

  const factsBlock = (
    <div className="border-t border-ivory-300 pt-4">
      <dl className="grid grid-cols-4 gap-3 text-sm">
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[0.68rem] tracking-[0.12em] text-muted uppercase">{k}</dt>
            <dd className="mt-0.5 font-medium text-forest-900">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <p>
          <span className="font-serif text-2xl text-forest-900">{formatPrice(p.priceEur, locale)}</span>
          {p.isDemo && <span className="ml-2 text-xs text-muted">{labels.examplePrice}</span>}
        </p>
        <Link href={href} className="group inline-flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.14em] text-forest-800 uppercase hover:text-gold-600">
          {labels.viewHome} <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );

  const heading = (
    <div className="flex items-center gap-3">
      {p.isDemo && <DemoBadge label={labels.demoBadge} />}
      <p className="font-serif text-2xl leading-none text-forest-900">
        {p.name} <span className="ml-1 font-sans text-[0.7rem] tracking-[0.16em] text-muted uppercase">{p.town}</span>
      </p>
    </div>
  );

  return (
    <>
      <noscript>
        <style>{`.story-text{display:block!important}`}</style>
      </noscript>

      {/* Desktop: sticky stage */}
      <div ref={track} className="relative hidden lg:block" style={{ height: `calc(${n} * ${PER_CHAPTER * 100}svh + 100svh - 7.5rem)` }}>
        <div ref={stage} className="sticky top-24 grid h-[calc(100svh-7.5rem)] max-h-[46rem] min-h-[32rem] grid-cols-12 gap-10 xl:gap-14">
          <figure className="relative col-span-7 overflow-hidden rounded-sm bg-forest-900">
            {chapters.map((c, i) => (
              <Image
                key={c.id}
                src={c.photo.src}
                alt={c.photo.alt[locale]}
                fill
                sizes="(min-width: 1280px) 760px, 60vw"
                data-active={i === active}
                aria-hidden={i !== active}
                className="story-photo object-cover"
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-950/70 to-transparent" />
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              {p.isDemo && <DemoBadge label={labels.demoBadge} />}
              {chapters[active]?.photo.isIllustrative && (
                <span className="rounded-full bg-ivory-50/95 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-forest-900 uppercase">
                  {labels.illustrative.split("·")[0].trim()}
                </span>
              )}
            </div>
            <figcaption className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-6 text-ivory-50">
              <span className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
                {pad(active + 1)} · {labels.kinds[chapters[active]?.kind ?? "original"]}
              </span>
              <span className="text-right text-[0.68rem] tracking-wide text-ivory-100/80">{chapters[active] && photoNote(chapters[active])}</span>
            </figcaption>
          </figure>

          <div className="col-span-5 flex min-h-0 flex-col py-1">
            {heading}

            <ol aria-label={labels.chapters} className="relative mt-6 space-y-0.5 pl-5">
              <span aria-hidden="true" className="absolute top-1 bottom-1 left-0 w-px bg-ivory-300" />
              <span aria-hidden="true" className="story-progress absolute top-1 bottom-1 left-0 w-px bg-gold-500" />
              {chapters.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === active ? "step" : undefined}
                    className={`flex w-full items-baseline gap-3 py-1.5 text-left transition-colors duration-500 ${
                      i === active ? "text-forest-900" : "text-muted/70 hover:text-forest-900"
                    }`}
                  >
                    <span className="text-[0.7rem] tabular-nums text-gold-600">{pad(i + 1)}</span>
                    <span className="text-[0.95rem]">{labels.kinds[c.kind]}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-6 min-h-0 flex-1" aria-live="polite">
              {chapters.map((c, i) => (
                <div key={c.id} className="story-text" data-active={i === active}>
                  <h3 className="text-[2rem] leading-[1.1] text-forest-900 xl:text-[2.4rem]">{c.heading[locale]}</h3>
                  <p className="mt-4 max-w-md leading-relaxed text-muted">{c.body[locale]}</p>
                </div>
              ))}
            </div>

            {factsBlock}
          </div>
        </div>
      </div>

      {/* Mobile and tablet: swipeable chapters */}
      <div className="lg:hidden">
        {heading}
        <div className="mt-6">
          <Carousel label={labels.chapters} prevLabel={labels.prev} nextLabel={labels.next} ofLabel={labels.of} itemClassName="w-[86%] sm:w-[60%]">
            {chapters.map((c, i) => (
              <figure key={c.id} className="h-full">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-forest-900">
                  <Image src={c.photo.src} alt={c.photo.alt[locale]} fill sizes="(min-width: 640px) 60vw, 86vw" className="object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {p.isDemo && <DemoBadge label={labels.demoBadge} />}
                    {c.photo.isIllustrative && (
                      <span className="rounded-full bg-ivory-50/95 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-forest-900 uppercase">
                        {labels.illustrative.split("·")[0].trim()}
                      </span>
                    )}
                  </div>
                </div>
                <figcaption className="mt-4">
                  <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-gold-600 uppercase">
                    {pad(i + 1)} · {labels.kinds[c.kind]}
                  </p>
                  <h3 className="mt-2 text-2xl leading-tight text-forest-900">{c.heading[locale]}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{c.body[locale]}</p>
                  <p className="mt-2 text-[0.7rem] text-muted">{photoNote(c)}</p>
                </figcaption>
              </figure>
            ))}
          </Carousel>
        </div>
        <div className="mt-8">{factsBlock}</div>
      </div>
    </>
  );
}
