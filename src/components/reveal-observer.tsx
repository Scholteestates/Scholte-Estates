"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reveals every [data-reveal] element once (never re-hides on reverse).
 *
 * - Marks <html> with .motion-ready first; reveal styles only apply then,
 *   so content stays visible if this script never runs.
 * - Reveals an element when it is 12% into view, and also anything the
 *   visitor has already scrolled past (fast scroll, End key, jump links),
 *   so no blank states are left behind.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    const pending = new Set(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)"));
    if (!pending.size) return;

    const reveal = (el: Element) => {
      el.classList.add("is-revealed");
      pending.delete(el as HTMLElement);
    };

    if (!("IntersectionObserver" in window)) {
      pending.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );
    pending.forEach((el) => io.observe(el));

    let frame = 0;
    const sweep = () => {
      frame = 0;
      const limit = window.innerHeight * 0.88;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < limit) {
          reveal(el);
          io.unobserve(el);
        }
      });
      if (!pending.size) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sweep);
    };
    sweep();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
