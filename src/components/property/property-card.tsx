import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Property } from "@/lib/properties/types";
import { formatPrice } from "@/lib/properties/helpers";
import { BathIcon, BedIcon, AreaIcon, PinIcon } from "../icons";
import { DemoBadge } from "./demo-badge";

export type CardLabels = Pick<Dictionary["properties"], "demoBadge" | "examplePrice" | "types" | "condition" | "specs">;

export function PropertyCard({
  property: p,
  locale,
  labels,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw",
}: {
  property: Property;
  locale: Locale;
  labels: CardLabels;
  sizes?: string;
}) {
  const img = p.images[0];
  return (
    <article className="group relative flex h-full flex-col bg-ivory-50">
      <div className="relative aspect-[3/2] overflow-hidden bg-ivory-200">
        {img && (
          <Image
            src={img.src}
            alt={img.alt[locale]}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-950/35 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          {p.isDemo && <DemoBadge label={labels.demoBadge} />}
          <span className="rounded-full bg-ivory-50/95 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.16em] text-forest-900 uppercase">
            {labels.condition[p.condition]}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col border border-t-0 border-ivory-200 px-5 pt-5 pb-4 transition-colors group-hover:border-gold-300">
        <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-[0.18em] text-gold-600 uppercase">
          <PinIcon className="size-3.5" />
          {p.town} · {labels.types[p.type]}
        </p>
        <h3 className="mt-3 text-[1.75rem] leading-tight text-forest-900">
          <Link href={`/${locale}/properties/${p.slug}`} className="after:absolute after:inset-0">
            {p.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 min-h-[2.6em] text-[0.92rem] leading-snug text-muted">{p.title[locale]}</p>

        <dl className="mt-4 flex gap-5 border-y border-ivory-200 py-3 text-sm text-forest-900">
          <div className="flex items-center gap-1.5">
            <dt><BedIcon className="size-4 text-gold-500" /><span className="sr-only">{labels.specs.beds}</span></dt>
            <dd>{p.bedrooms}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt><BathIcon className="size-4 text-gold-500" /><span className="sr-only">{labels.specs.baths}</span></dt>
            <dd>{p.bathrooms}</dd>
          </div>
          {p.builtAreaM2 && (
            <div className="flex items-center gap-1.5">
              <dt><AreaIcon className="size-4 text-gold-500" /><span className="sr-only">{labels.specs.built}</span></dt>
              <dd>{p.builtAreaM2} m²</dd>
            </div>
          )}
        </dl>

        <div className="mt-3 flex items-end justify-between gap-3">
          <p>
            <span className="block font-serif text-2xl text-forest-900">{formatPrice(p.priceEur, locale)}</span>
            {p.isDemo && <span className="text-[0.7rem] tracking-wide text-muted">{labels.examplePrice}</span>}
          </p>
          <span aria-hidden="true" className="mb-1 inline-flex size-9 items-center justify-center rounded-full border border-gold-400 text-gold-600 transition-colors group-hover:bg-forest-800 group-hover:text-ivory-50">
            →
          </span>
        </div>
      </div>
    </article>
  );
}
