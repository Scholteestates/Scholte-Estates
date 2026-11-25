import Image from "next/image";
import { site } from "@/config/site";

/**
 * Shows the supplied logo when `site.brand.logoSrc` is set; otherwise a
 * plain typographic rendering of the company name (not a replacement logo).
 */
export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  if (site.brand.logoSrc) {
    return (
      <Image
        src={site.brand.logoSrc}
        alt={site.name}
        width={site.brand.logoWidth}
        height={site.brand.logoHeight}
        preload
        className="h-10 w-auto md:h-12"
      />
    );
  }
  const main = tone === "dark" ? "text-forest-900" : "text-ivory-50";
  return (
    <span className="flex flex-col leading-none">
      <span className={`font-serif text-2xl tracking-wide md:text-[1.7rem] ${main}`}>
        Scholte <span className="text-gold-500">Estates</span>
      </span>
      <span
        className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] ${
          tone === "dark" ? "text-muted" : "text-ivory-200/80"
        }`}
      >
        {site.brandLine}
      </span>
    </span>
  );
}
