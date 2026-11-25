"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Property, PropertyCondition } from "@/lib/properties/types";
import { Carousel } from "@/components/property/carousel";
import { PropertyCard, type CardLabels } from "@/components/property/property-card";

type Tab = "all" | PropertyCondition;

/** One browse section with All / New-build / Resale tabs over a single carousel. */
export function CuratedHomes({
  properties,
  locale,
  cardLabels,
  tabLabels,
  tabsLabel,
  carousel,
}: {
  properties: Property[];
  locale: Locale;
  cardLabels: CardLabels;
  tabLabels: Record<Tab, string>;
  tabsLabel: string;
  carousel: { prev: string; next: string; of: string };
}) {
  const tabs: Tab[] = (["all", "new-build", "resale"] as Tab[]).filter(
    (t) => t === "all" || properties.some((p) => p.condition === t),
  );
  const [tab, setTab] = useState<Tab>("all");
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const list = tab === "all" ? properties : properties.filter((p) => p.condition === tab);

  const onKey = (e: KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + tabs.length) % tabs.length;
    setTab(tabs[n]);
    btns.current[n]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={tabsLabel} className="flex gap-1 border-b border-ivory-300">
        {tabs.map((t, i) => {
          const count = t === "all" ? properties.length : properties.filter((p) => p.condition === t).length;
          const selected = t === tab;
          return (
            <button
              key={t}
              ref={(el) => {
                btns.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`homes-tab-${t}`}
              aria-selected={selected}
              aria-controls="homes-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(t)}
              onKeyDown={(e) => onKey(e, i)}
              className={`relative -mb-px px-4 py-3.5 text-[0.78rem] font-semibold tracking-[0.14em] uppercase transition-colors md:px-6 ${
                selected ? "text-forest-900" : "text-muted hover:text-forest-900"
              }`}
            >
              {tabLabels[t]} <span className="ml-1 font-normal tabular-nums opacity-60">{count}</span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 bottom-0 h-0.5 origin-left bg-gold-500 transition-transform duration-500 ${selected ? "scale-x-100" : "scale-x-0"}`}
              />
            </button>
          );
        })}
      </div>

      <div id="homes-panel" role="tabpanel" aria-labelledby={`homes-tab-${tab}`} className="mt-6">
        <Carousel key={tab} label={tabLabels[tab]} prevLabel={carousel.prev} nextLabel={carousel.next} ofLabel={carousel.of} itemClassName="w-[84%] sm:w-[46%] lg:w-[calc((100%-4.5rem)/4)]">
          {list.map((p, i) => (
            <div key={p.slug} className="card-in h-full" style={{ ["--card-delay" as string]: `${Math.min(i, 3) * 0.08}s` }}>
              <PropertyCard property={p} locale={locale} labels={cardLabels} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
