"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { Locale } from "@/i18n/config";
import type { Property, PropertyFilters, PropertyType } from "@/lib/properties/types";
import { filterProperties, getFilterOptions } from "@/lib/properties/helpers";
import { FilterFields, type FilterLabels } from "./filter-fields";
import { PropertyCard, type CardLabels } from "./property-card";
import { ChevronDownIcon } from "../icons";

const SORTS = ["", "price-asc", "price-desc"] as const;

function readFilters(params: URLSearchParams, towns: string[], types: string[]): PropertyFilters {
  const num = (k: string) => {
    const n = Number(params.get(k));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const town = params.get("town") ?? "";
  const type = params.get("type") ?? "";
  const sort = params.get("sort") ?? "";
  return {
    town: towns.includes(town) ? town : undefined,
    type: types.includes(type) ? (type as PropertyType) : undefined,
    maxPrice: num("maxPrice"),
    minBeds: num("minBeds"),
    sort: (SORTS as readonly string[]).includes(sort) && sort ? (sort as PropertyFilters["sort"]) : undefined,
  };
}

export function PropertyBrowser({
  properties,
  locale,
  filterLabels,
  cardLabels,
  emptyCta,
}: {
  properties: Property[];
  locale: Locale;
  filterLabels: FilterLabels;
  cardLabels: CardLabels;
  emptyCta: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const { towns, types } = useMemo(() => getFilterOptions(properties), [properties]);
  const filters = readFilters(new URLSearchParams(params.toString()), towns, types);
  const results = filterProperties(properties, filters);
  const active = Boolean(filters.town || filters.type || filters.maxPrice || filters.minBeds || filters.sort);

  const update = (field: keyof PropertyFilters, value: string) => {
    // Read the live URL so quick successive changes don't overwrite each other.
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(field, value);
    else next.delete(field);
    const qs = next.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  };

  const count = results.length === 1 ? filterLabels.resultsOne : `${results.length} ${filterLabels.resultsMany}`;

  return (
    <div>
      <div
        role="search"
        aria-label={filterLabels.title}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <FilterFields
          locale={locale}
          labels={filterLabels}
          towns={towns}
          types={types}
          values={filters}
          onChange={update}
          tone="plain"
          idPrefix="browse"
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 border-b border-ivory-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="font-serif text-2xl text-forest-900">
          {count}
        </p>
        <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-5">
          {active && (
            <button
              type="button"
              onClick={() => window.history.replaceState(null, "", pathname)}
              className="text-sm whitespace-nowrap font-semibold text-forest-800 underline decoration-gold-400 underline-offset-4 hover:text-gold-600"
            >
              {filterLabels.reset}
            </button>
          )}
          <label className="relative ml-auto flex items-center gap-2 text-sm text-muted">
            <span className="sr-only whitespace-nowrap sm:not-sr-only">{filterLabels.sort}</span>
            <select
              value={filters.sort ?? ""}
              onChange={(e) => update("sort", e.target.value)}
              className="cursor-pointer appearance-none border border-ivory-200 bg-ivory-50 py-2 pr-9 pl-3 text-forest-900"
            >
              <option value="">{filterLabels.sortDefault}</option>
              <option value="price-asc">{filterLabels.sortAsc}</option>
              <option value="price-desc">{filterLabels.sortDesc}</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 size-4 text-gold-600" />
          </label>
        </div>
      </div>

      {results.length > 0 ? (
        <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <li key={p.slug}>
              <PropertyCard property={p} locale={locale} labels={cardLabels} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 border border-dashed border-gold-400/60 bg-ivory-100 px-6 py-14 text-center">
          <p className="font-serif text-3xl text-forest-900">{filterLabels.empty}</p>
          <p className="mx-auto mt-3 max-w-md text-muted">{filterLabels.emptyHint}</p>
          <div className="mt-8 flex justify-center">{emptyCta}</div>
        </div>
      )}
    </div>
  );
}

/** Static fallback while search params resolve on the client. */
export function PropertyGridFallback({
  properties,
  locale,
  cardLabels,
}: {
  properties: Property[];
  locale: Locale;
  cardLabels: CardLabels;
}) {
  return (
    <ul className="mt-36 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => (
        <li key={p.slug}>
          <PropertyCard property={p} locale={locale} labels={cardLabels} />
        </li>
      ))}
    </ul>
  );
}
