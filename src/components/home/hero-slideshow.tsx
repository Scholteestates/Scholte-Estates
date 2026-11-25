"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { PropertyImage } from "@/lib/properties/types";

const INTERVAL = 8000;

/**
 * Hero background: a few demo images cross-fading slowly, each with a gentle
 * pan. A pause control is always available; with reduced motion the first
 * image stays still and nothing advances.
 */
export function HeroSlideshow({
  images,
  locale,
  pauseLabel,
  playLabel,
  caption,
}: {
  images: PropertyImage[];
  locale: Locale;
  pauseLabel: string;
  playLabel: string;
  caption?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reduced || images.length < 2) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % images.length);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, reduced, images.length]);

  return (
    <>
      <div className="hero-drift absolute -inset-y-[4%] inset-x-0 -z-20">
      <div className="hero-image absolute inset-0" data-paused={paused || reduced}>
        {images.map((img, i) => (
          <div key={img.src} className="hero-slide absolute inset-0" data-active={i === index} aria-hidden={i !== index}>
            <Image
              src={img.src}
              alt={i === 0 ? img.alt[locale] : ""}
              fill
              preload={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      </div>

      <div className="absolute bottom-5 left-20 z-10 flex items-center gap-4 lg:left-24">
        {images.length > 1 && !reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? playLabel : pauseLabel}
            aria-pressed={paused}
            className="inline-flex size-8 items-center justify-center rounded-full border border-ivory-50/40 text-ivory-50/90 transition-colors hover:bg-ivory-50 hover:text-forest-900"
          >
            {paused ? (
              <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>
            )}
          </button>
        )}
        {images.length > 1 && (
          <div className="flex gap-1.5" aria-hidden="true" data-paused={paused || reduced}>
            {images.map((img, i) => (
              <span key={img.src} className="relative block h-px w-8 overflow-hidden bg-ivory-50/35">
                {i === index && (
                  <span
                    key={index}
                    className="hero-tick absolute inset-0 bg-gold-300"
                    style={{ ["--tick" as string]: `${INTERVAL}ms`, animationPlayState: paused || reduced ? "paused" : undefined }}
                  />
                )}
                {i < index && <span className="absolute inset-0 bg-ivory-50/70" />}
              </span>
            ))}
          </div>
        )}
        {caption && <p className="hidden text-[0.65rem] tracking-wide text-ivory-100/75 md:block">{caption}</p>}
      </div>
    </>
  );
}
