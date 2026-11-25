import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { MediaSlot } from "@/config/media";

/**
 * Renders a supplied photo, or a decorative Mediterranean illustration
 * (sun, hills and sea lines) while no photography is available.
 */
export function Photo({
  slot,
  locale,
  className = "",
  priority = false,
  variant = "coast",
  sizes = "100vw",
}: {
  slot: MediaSlot;
  locale: Locale;
  className?: string;
  priority?: boolean;
  variant?: "coast" | "hills" | "evening";
  sizes?: string;
}) {
  if (slot.src) {
    const pos = className.includes("absolute") ? "" : "relative";
    return (
      <div className={`${pos} overflow-hidden ${className}`}>
        <Image src={slot.src} alt={slot.alt[locale]} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
    );
  }

  const palettes = {
    coast: { sky: ["#f3ead8", "#e6d6b6"], sun: "#d8bd88", hill: "#2f5a43", hill2: "#1c3729", sea: "#244634" },
    hills: { sky: ["#eee6d6", "#dcc79e"], sun: "#c9ae7c", hill: "#3a6a50", hill2: "#244634", sea: "#15291f" },
    evening: { sky: ["#1c3729", "#2f5a43"], sun: "#c9ae7c", hill: "#15291f", hill2: "#0f2118", sea: "#244634" },
  } as const;
  const p = palettes[variant];
  const position = className.includes("absolute") ? "" : "relative";
  const id = `g-${variant}`;

  return (
    <div aria-hidden="true" className={`${position} overflow-hidden ${className}`}>
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.sky[0]} />
            <stop offset="1" stopColor={p.sky[1]} />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill={`url(#${id}-sky)`} />
        <circle cx="560" cy="250" r="78" fill={p.sun} opacity={variant === "evening" ? 0.55 : 0.85} />
        <path d="M0 360 C120 300 220 320 320 345 S520 300 620 330 S760 340 800 320 V600 H0Z" fill={p.hill} opacity="0.9" />
        <path d="M0 410 C140 370 260 395 400 400 S640 380 800 395 V600 H0Z" fill={p.hill2} />
        <rect y="440" width="800" height="160" fill={p.sea} />
        {[460, 490, 520, 555].map((y, i) => (
          <line key={y} x1={80 + i * 30} x2={720 - i * 40} y1={y} y2={y} stroke="#c9ae7c" strokeOpacity={0.35 - i * 0.06} strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
}
