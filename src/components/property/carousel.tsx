"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Accessible scroll-snap carousel. Swipe on touch, arrow buttons on desktop.
 * Controls hide automatically when every slide already fits.
 */
export function Carousel({
  label,
  prevLabel,
  nextLabel,
  children,
  itemClassName = "w-[84%] sm:w-[46%] lg:w-[calc((100%-3rem)/3)]",
  ofLabel,
  tone = "dark",
}: {
  label: string;
  prevLabel: string;
  nextLabel: string;
  children: ReactNode[];
  itemClassName?: string;
  /** When set, shows a progress line and "1–3 of 6" style counter. */
  ofLabel?: string;
  tone?: "dark" | "light";
}) {
  const track = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ atStart: true, atEnd: false, scrollable: true, first: 1, last: 1, ratio: 1, offset: 0 });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const items = Array.from(el.children) as HTMLElement[];
    const box = el.getBoundingClientRect();
    const visible = items
      .map((it, i) => ({ i, r: it.getBoundingClientRect() }))
      .filter(({ r }) => r.left >= box.left - r.width * 0.4 && r.right <= box.right + r.width * 0.4);
    const first = (visible[0]?.i ?? 0) + 1;
    const last = (visible[visible.length - 1]?.i ?? 0) + 1;
    const ratio = el.scrollWidth ? el.clientWidth / el.scrollWidth : 1;
    setState({
      atStart: el.scrollLeft <= 4,
      atEnd: el.scrollLeft >= max - 4,
      scrollable: max > 4,
      first,
      last,
      ratio,
      offset: max > 0 ? (el.scrollLeft / max) * (1 - ratio) : 0,
    });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const item = el.querySelector("li");
    const step = item ? item.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const btn =
    tone === "dark"
      ? "inline-flex size-12 items-center justify-center rounded-full border border-forest-800/25 text-forest-900 transition-colors hover:border-forest-800 hover:bg-forest-800 hover:text-ivory-50 disabled:pointer-events-none disabled:opacity-30"
      : "inline-flex size-12 items-center justify-center rounded-full border border-ivory-50/30 text-ivory-50 transition-colors hover:bg-ivory-50 hover:text-forest-900 disabled:pointer-events-none disabled:opacity-30";
  const count = children.length;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={track}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pb-2 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {children.map((child, i) => (
          <li key={i} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </li>
        ))}
      </ul>
      {state.scrollable && (
        <div className="mt-5 flex items-center justify-end gap-3">
          {ofLabel && (
            <div className="mr-auto flex min-w-0 flex-1 items-center gap-5 pr-4">
              <p className={`shrink-0 text-sm tabular-nums ${tone === "dark" ? "text-forest-900" : "text-ivory-50"}`} aria-live="polite">
                {state.first === state.last ? state.first : `${state.first}–${state.last}`} <span className="opacity-60">{ofLabel} {count}</span>
              </p>
              <div className={`relative h-px max-w-xs flex-1 ${tone === "dark" ? "bg-forest-800/15" : "bg-ivory-50/20"}`} aria-hidden="true">
                <span
                  className="absolute inset-y-0 left-0 bg-gold-500 transition-[transform,width] duration-500 ease-out"
                  style={{ width: `${state.ratio * 100}%`, transform: `translateX(${(state.offset / Math.max(state.ratio, 0.0001)) * 100}%)` }}
                />
              </div>
            </div>
          )}
          <button type="button" onClick={() => go(-1)} disabled={state.atStart} className={btn} aria-label={prevLabel}>
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" onClick={() => go(1)} disabled={state.atEnd} className={btn} aria-label={nextLabel}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
