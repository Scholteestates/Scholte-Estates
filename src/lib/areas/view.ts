import "server-only";
import type { AreaExplorerLabels, PlaceView } from "@/components/area/area-explorer";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { AreaProfile } from "./types";
import { distanceM } from "./index";

export type AreaSection = {
  label: string;
  heading: string;
  lead: string;
  notice?: string;
  method: string;
  centre: { lat: number; lng: number };
  home?: { lat: number; lng: number };
  places: PlaceView[];
  lang: "en" | "es";
  labels: AreaExplorerLabels;
};

const fill = (tpl: string, v: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");

/**
 * Builds the area section. With `home` (a real listing) places get a
 * straight-line distance from the home; without it (demo homes) the map shows
 * the town only and no distances.
 */
export function buildAreaSection(
  area: AreaProfile,
  approved: boolean,
  dict: Dictionary,
  locale: "en" | "es",
  home?: { lat: number; lng: number },
): AreaSection {
  const t = dict.properties.areaMap;
  const nf = new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-GB", { maximumFractionDigits: 1 });
  const dist = (m: number) => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${nf.format(m / 1000)} km`);
  const checked = area.places.map((p) => p.verifiedAt).sort().at(-1) ?? "";
  const date = checked
    ? new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(checked))
    : "";

  const places = area.places
    .map((p, i) => ({ p, i, d: home ? distanceM(home, p) : undefined }))
    .sort((a, b) => (a.d ?? 0) - (b.d ?? 0))
    .map(({ p, i, d }) => ({
      id: `${area.id}-${i}`,
      name: p.name,
      category: p.category,
      categoryLabel: t.categories[p.category],
      lat: p.lat,
      lng: p.lng,
      note: p.note[locale],
      distance: d === undefined ? undefined : dist(d),
      sourceUrl: p.sourceUrl,
      sourceLabel: new URL(p.sourceUrl).hostname.replace(/^www\./, ""),
    }));

  return {
    label: t.label,
    heading: home ? t.headingListing : fill(t.headingTown, { town: area.name }),
    lead: home ? t.leadListing : fill(t.leadTown, { town: area.name }),
    notice: approved ? undefined : t.awaiting,
    method: fill(home ? t.method : t.methodTown, { date }),
    centre: { lat: area.centre.lat, lng: area.centre.lng },
    home,
    places,
    lang: locale,
    labels: {
      all: t.all,
      groups: t.groups,
      home: t.home,
      mapLabel: fill(t.mapLabel, { town: area.name }),
      listTitle: t.listTitle,
      loading: t.loading,
      source: t.source,
      prev: t.prev,
      next: t.next,
      mapCaption: t.mapCaption,
      gestures: t.gestures,
    },
  };
}
