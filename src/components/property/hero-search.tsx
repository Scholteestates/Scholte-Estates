import type { Locale } from "@/i18n/config";
import type { PropertyType } from "@/lib/properties/types";
import { SearchIcon } from "../icons";
import { FilterFields, type FilterLabels } from "./filter-fields";

/** Hero search: a plain GET form to the property browser (no JS required). */
export function HeroSearch({
  locale,
  labels,
  towns,
  types,
}: {
  locale: Locale;
  labels: FilterLabels;
  towns: string[];
  types: PropertyType[];
}) {
  return (
    <form
      action={`/${locale}/properties`}
      method="get"
      role="search"
      aria-label={labels.title}
      className="mx-auto grid w-full max-w-5xl grid-cols-2 overflow-hidden rounded-sm bg-ivory-50/97 text-left shadow-2xl shadow-forest-950/30 sm:grid-cols-2 md:grid-cols-[repeat(4,1fr)_auto]"
    >
      <FilterFields locale={locale} labels={labels} towns={towns} types={types} idPrefix="hero" />
      <button
        type="submit"
        className="col-span-full flex items-center justify-center gap-2.5 bg-forest-800 px-8 py-3.5 text-sm md:py-4 font-semibold tracking-[0.14em] text-ivory-50 uppercase transition-colors hover:bg-forest-700 md:col-span-1"
      >
        <SearchIcon className="size-4 text-gold-300" />
        {labels.search}
      </button>
    </form>
  );
}
