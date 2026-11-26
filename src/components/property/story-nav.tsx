"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sticky chapter index for a property story.
 *
 * Plain anchor links (work without JavaScript). With JavaScript the active
 * chapter follows the scroll position — forward, backward, fast jumps and
 * resting — measured once per animation frame; native scrolling is untouched.
 */
export function StoryNav({
  label,
  title,
  items,
}: {
  label: string;
  title: string;
  items: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = sections[0]?.id ?? "";
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
      // At the very bottom, the last chapter is the one being read.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1]?.id ?? current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  // Keep the active link visible inside the (horizontally scrolling) list
  // without moving the page itself.
  useEffect(() => {
    const ul = list.current;
    const link = ul?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!ul || !link || ul.scrollWidth <= ul.clientWidth) return;
    const target = link.offsetLeft - ul.clientWidth / 2 + link.offsetWidth / 2;
    ul.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label={label}
      className="sticky top-[4.5rem] z-30 border-y border-ivory-300 bg-brand-beige/95 backdrop-blur-sm lg:top-20"
    >
      <div className="container-page flex items-center gap-8">
        <p className="hidden shrink-0 font-serif text-xl text-forest-900 xl:block">{title}</p>
        <ul ref={list} className="no-scrollbar -mx-1 flex flex-1 gap-1 overflow-x-auto xl:justify-end">
          {items.map((item, i) => {
            const on = item.id === active;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  data-id={item.id}
                  aria-current={on ? "location" : undefined}
                  className={`relative flex items-center gap-2 px-3 py-3.5 text-[0.8rem] whitespace-nowrap transition-colors duration-300 ${
                    on ? "text-forest-900" : "text-muted hover:text-forest-900"
                  }`}
                >
                  <span className="font-serif text-sm text-gold-600 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 bottom-0 h-0.5 origin-left bg-gold-500 transition-transform duration-500 ${
                      on ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
