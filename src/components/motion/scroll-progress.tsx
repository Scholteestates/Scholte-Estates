"use client";

import { useEffect } from "react";

/**
 * Writes a `--progress` (0–1) custom property on every `[data-progress]`
 * element as the page scrolls. Native scrolling is untouched; this only
 * reads positions once per animation frame. Skipped for reduced motion, so
 * CSS falls back to each effect's resting state.
 *
 * Modes:
 *  - "exit":    0 while the element's top is at the viewport top, 1 once it has scrolled away.
 *  - "enter":   0 when the top enters at the bottom, 1 when it reaches 35% of the viewport.
 *  - "through": 0 when the top reaches 70% of the viewport, 1 when the bottom does.
 */
export function ScrollProgress() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      document.querySelectorAll<HTMLElement>("[data-step-at]").forEach((s) => (s.dataset.reached = "true"));
      return;
    }
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
    if (!els.length) return;

    let frame = 0;
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const mode = el.dataset.progress;
        let p: number;
        if (mode === "exit") p = clamp(-r.top / Math.max(1, r.height * 0.8));
        else if (mode === "through") p = clamp((vh * 0.7 - r.top) / Math.max(1, r.height));
        else p = clamp((vh - r.top) / (vh * 0.65));
        el.style.setProperty("--progress", p.toFixed(4));
        if (mode === "through") {
          el.querySelectorAll<HTMLElement>("[data-step-at]").forEach((step) => {
            step.dataset.reached = String(p >= Number(step.dataset.stepAt) - 0.001);
          });
        }
      }
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
      els.forEach((el) => el.style.removeProperty("--progress"));
    };
  }, []);

  return null;
}
