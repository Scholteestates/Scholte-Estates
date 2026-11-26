"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  /** Short label such as "Kitchen and dining". */
  label: string;
  /** Extra visible note, e.g. "AI-generated demo image". */
  note?: string;
  illustrative?: boolean;
};

type Labels = { open: string; close: string; prev: string; next: string; counter: string; illustrative: string };

const fill = (tpl: string, v: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

/**
 * Every image of one home in a grid, opening into a modal viewer.
 * Without JavaScript each thumbnail is a plain link to the full image.
 * The viewer uses the native <dialog> (focus containment, Escape to close)
 * and supports arrow keys and swipe.
 */
export function StoryGallery({ items, labels }: { items: GalleryItem[]; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const total = items.length;

  const go = useCallback((d: number) => setIndex((i) => (i + d + total) % total), [total]);

  const open = (i: number, el: HTMLElement) => {
    opener.current = el;
    setIndex(i);
    dialog.current?.showModal();
  };

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => opener.current?.focus();
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const item = items[index];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
        {items.map((it, i) => (
          <li key={it.src}>
            <a
              href={it.src}
              onClick={(e) => {
                e.preventDefault();
                open(i, e.currentTarget);
              }}
              aria-label={fill(labels.open, { n: i + 1, total, title: it.title })}
              className="group block"
            >
              <span className="relative block aspect-[3/2] overflow-hidden bg-ivory-200">
                <Image
                  src={it.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 380px, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                {it.illustrative && (
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-forest-900/80 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-ivory-50 uppercase">
                    {labels.illustrative}
                  </span>
                )}
              </span>
              <span className="mt-2.5 flex items-baseline gap-2 text-sm">
                <span className="font-serif text-gold-600 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-forest-900 group-hover:underline group-hover:decoration-gold-400 group-hover:underline-offset-4">
                  {it.label}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={item ? item.title : undefined}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-forest-950/97 p-0 text-ivory-50 backdrop:bg-forest-950/80"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {item && (
          <div className="flex h-full flex-col">
            <div className="container-page flex items-center justify-between py-4">
              <p className="text-xs tracking-[0.16em] text-ivory-200 uppercase" aria-live="polite">
                {fill(labels.counter, { n: index + 1, total })} · {item.label}
              </p>
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                className="rounded-full border border-ivory-50/25 px-4 py-2 text-sm hover:border-ivory-50/60"
                autoFocus
              >
                {labels.close} <span aria-hidden="true">✕</span>
              </button>
            </div>

            <div
              className="relative min-h-0 flex-1"
              onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
                touchX.current = null;
              }}
            >
              <Image key={item.src} src={item.src} alt={item.alt} fill sizes="100vw" className="swap-in object-contain" />
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.prev}
                className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-forest-950/60 text-xl hover:bg-forest-900 md:left-6"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.next}
                className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-forest-950/60 text-xl hover:bg-forest-900 md:right-6"
              >
                →
              </button>
            </div>

            <div className="container-page py-5 md:py-6">
              <p className="font-serif text-2xl text-ivory-50">{item.title}</p>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ivory-200">{item.caption}</p>
              {item.note && <p className="mt-2 text-xs text-gold-300">{item.note}</p>}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
