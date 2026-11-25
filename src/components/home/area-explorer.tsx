"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import type { Locale } from "@/i18n/config";
import { coastline } from "@/config/areas";
import { formatPrice } from "@/lib/properties/helpers";
import type { PropertyImage } from "@/lib/properties/types";
import { DemoBadge } from "@/components/property/demo-badge";

export type AreaHome = { slug: string; name: string; town: string; priceEur: number; isDemo: boolean };
export type AreaEntry = { id: string; name: string; body: string; map: { x: number; y: number }; scene?: PropertyImage; homes: AreaHome[] };

function SchematicMap({ areas, index, label }: { areas: AreaEntry[]; index: number; label: string }) {
  const area = areas[index];
  return (
    <svg viewBox="30 30 340 566" preserveAspectRatio="xMidYMid meet" className="size-full" role="img" aria-label={label}>
      <rect x="0" y="0" width="400" height="600" fill="#0f2118" />
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={coastline} fill="none" stroke="#c9ae7c" strokeOpacity={0.16 - k * 0.03} strokeWidth="1" transform={`translate(${14 + k * 14} ${6 + k * 8})`} />
      ))}
      <path d={`${coastline} L0 0 L0 600 Z`} fill="#1c3729" />
      <path d={coastline} fill="none" stroke="#c9ae7c" strokeOpacity="0.75" strokeWidth="1.5" />
      {areas.map((a, i) => (
        <g key={a.id} opacity={i === index ? 1 : 0.5}>
          {i === index && (
            <circle cx={a.map.x} cy={a.map.y} r="16" fill="none" stroke="#dcc79e">
              <animate attributeName="r" values="8;24;8" dur="3.2s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3.2s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={a.map.x} cy={a.map.y} r={i === index ? 7 : 5} fill={i === index ? "#dcc79e" : "#fcfaf5"} />
        </g>
      ))}
      <text
        x={area.map.x + (area.map.x > 250 ? -14 : 14)}
        y={area.map.y + 6}
        fill="#fcfaf5"
        fontSize="22"
        fontFamily="var(--font-manrope), sans-serif"
        textAnchor={area.map.x > 250 ? "end" : "start"}
      >
        {area.name}
      </text>
    </svg>
  );
}

/** Image-led area selector: scene, map pin, copy and example homes change together. */
export function AreaExplorer({
  areas,
  locale,
  labels,
}: {
  areas: AreaEntry[];
  locale: Locale;
  labels: { select: string; map: string; homes: string; noHomes: string; illustrative: string; demoBadge: string; examplePrice: string };
}) {
  const [index, setIndex] = useState(0);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const area = areas[index];

  const onKey = (e: KeyboardEvent, i: number) => {
    const fwd = ["ArrowDown", "ArrowRight"].includes(e.key);
    const back = ["ArrowUp", "ArrowLeft"].includes(e.key);
    if (!fwd && !back) return;
    e.preventDefault();
    const n = (i + (fwd ? 1 : -1) + areas.length) % areas.length;
    setIndex(n);
    btns.current[n]?.focus();
  };

  const [illustrativeShort] = labels.illustrative.split("·");

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="min-w-0 lg:col-span-4 lg:flex lg:flex-col">
        <div
          role="tablist"
          aria-label={labels.select}
          aria-orientation="vertical"
          className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-ivory-50/10 lg:px-0"
        >
          {areas.map((a, i) => {
            const selected = i === index;
            return (
              <button
                key={a.id}
                ref={(el) => {
                  btns.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`area-tab-${a.id}`}
                aria-selected={selected}
                aria-controls="area-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setIndex(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors lg:flex lg:items-center lg:gap-4 lg:rounded-none lg:border-0 lg:border-b lg:border-ivory-50/10 lg:px-0 lg:py-3 lg:text-left ${
                  selected ? "border-gold-400 bg-gold-400/10 text-ivory-50 lg:bg-transparent" : "border-ivory-50/20 text-ivory-200/65 hover:text-ivory-50"
                }`}
              >
                <span className="hidden w-5 text-[0.7rem] tabular-nums text-gold-400 lg:inline">{String(i + 1).padStart(2, "0")}</span>
                <span className="lg:font-serif lg:text-[1.4rem] lg:leading-tight">{a.name}</span>
                <span aria-hidden="true" className={`ml-auto hidden h-px bg-gold-400 transition-all duration-500 lg:block ${selected ? "w-8" : "w-0"}`} />
              </button>
            );
          })}
        </div>

        <div key={area.id} className="swap-in mt-6 hidden lg:block">
          <p className="leading-relaxed text-ivory-100/85">{area.body}</p>
        </div>
      </div>

      <div id="area-panel" role="tabpanel" aria-labelledby={`area-tab-${area.id}`} className="min-w-0 lg:col-span-8">
        <figure className="relative aspect-[4/3] overflow-hidden rounded-sm bg-forest-900 sm:aspect-[16/10] lg:aspect-auto lg:h-[min(30rem,calc(100svh-21rem))] lg:min-h-[21rem]">
          {areas.map((a, i) =>
            a.scene ? (
              <Image
                key={a.id}
                src={a.scene.src}
                alt={a.scene.alt[locale]}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                data-active={i === index}
                aria-hidden={i !== index}
                className="area-scene object-cover"
              />
            ) : null,
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/10 to-transparent" />
          <span className="absolute top-4 left-4 rounded-full bg-ivory-50/95 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-forest-900 uppercase">
            {illustrativeShort.trim()}
          </span>
          <figcaption className="absolute bottom-4 left-5 right-5 md:right-[34%]">
            <p key={area.id} className="swap-in font-serif text-3xl text-ivory-50 md:text-4xl">{area.name}</p>
            <p className="mt-1 text-[0.68rem] tracking-wide text-ivory-100/75">{labels.illustrative}</p>
          </figcaption>
          <div className="absolute right-4 bottom-4 hidden aspect-[3/5] w-[24%] max-w-[11rem] overflow-hidden rounded-sm border border-ivory-50/15 shadow-xl md:block">
            <SchematicMap areas={areas} index={index} label={labels.map} />
          </div>
        </figure>

        <div key={area.id} className="swap-in mt-5 grid gap-5 md:grid-cols-12">
          <p className="leading-relaxed text-ivory-100/85 md:col-span-6 lg:hidden">{area.body}</p>
          <div className="md:col-span-6 lg:col-span-12">
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-gold-400 uppercase">{labels.homes}</p>
            {area.homes.length ? (
              <ul className="mt-2 grid gap-x-8 lg:grid-cols-2">
                {area.homes.slice(0, 4).map((h) => (
                  <li key={h.slug} className="border-b border-ivory-50/10">
                    <Link href={`/${locale}/properties/${h.slug}`} className="group flex items-center justify-between gap-3 py-2.5">
                      <span className="flex items-center gap-2 text-ivory-50 group-hover:text-gold-300">
                        {h.isDemo && <DemoBadge label={labels.demoBadge} />}
                        {h.name}
                      </span>
                      <span className="shrink-0 text-sm text-ivory-200/80 tabular-nums">
                        {formatPrice(h.priceEur, locale)}
                        {h.isDemo && <span className="ml-1 text-[0.65rem] text-ivory-200/55">({labels.examplePrice.toLowerCase()})</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ivory-200/70">{labels.noHomes}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
