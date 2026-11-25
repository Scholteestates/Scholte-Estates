/** Pure helpers, safe to import from client components (no data imports). */
import type { Property, PropertyFilters } from "./types";

export function filterProperties(list: Property[], f: PropertyFilters): Property[] {
  const out = list.filter(
    (p) =>
      (!f.town || p.town === f.town) &&
      (!f.type || p.type === f.type) &&
      (!f.maxPrice || p.priceEur <= f.maxPrice) &&
      (!f.minBeds || p.bedrooms >= f.minBeds),
  );
  if (f.sort === "price-asc") out.sort((a, b) => a.priceEur - b.priceEur);
  if (f.sort === "price-desc") out.sort((a, b) => b.priceEur - a.priceEur);
  return out;
}

export function getFilterOptions(list: Property[]) {
  return {
    towns: [...new Set(list.map((p) => p.town))].sort((a, b) => a.localeCompare(b, "es")),
    types: [...new Set(list.map((p) => p.type))],
  };
}

export const priceSteps = [200_000, 300_000, 400_000, 500_000, 750_000, 1_000_000];
export const bedroomSteps = [1, 2, 3, 4];

export function formatPrice(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    useGrouping: "always",
  } as Intl.NumberFormatOptions).format(value);
}
