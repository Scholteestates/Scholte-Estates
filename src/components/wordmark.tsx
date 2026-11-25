import Image from "next/image";
import { site } from "@/config/site";

/**
 * The approved Scholte Estates logo (docs/brand.md).
 * - "dark": gold lettering on forest green; place on `bg-brand-forest`.
 * - "light": forest-green lettering on beige; place on `bg-brand-beige`.
 * The files keep their own background, so always use the matching colour.
 * Edges are feathered in CSS so the crop never shows as a box.
 */
export function Logo({
  variant,
  className = "h-12",
  preload = false,
  alt = `${site.name} — ${site.brandLine}`,
  sizes = "180px",
}: {
  variant: "dark" | "light";
  className?: string;
  preload?: boolean;
  alt?: string;
  /** Rendered width, so the optimiser serves a sharp (2×) copy. */
  sizes?: string;
}) {
  const f = site.brand[variant];
  return (
    <Image
      src={f.src}
      alt={alt}
      width={f.width}
      height={f.height}
      preload={preload}
      sizes={sizes}
      quality={90}
      className={`logo-feather w-auto ${className}`}
    />
  );
}
