"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Map as MlMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { PlaceCategory } from "@/lib/areas/types";

/**
 * Interactive area map: a square, self-hosted basemap (OpenStreetMap data via
 * Protomaps tiles in /public/map, no third-party requests) with tappable
 * points for verified places. The text beside the map shows the place that is
 * selected; filters and previous/next buttons step through them, so every
 * place can also be reached without touching the map.
 */

export type PlaceGroup = "food" | "schools" | "daily" | "nature" | "activities";

export const GROUP_FOR: Record<PlaceCategory, PlaceGroup> = {
  cafe: "food",
  restaurant: "food",
  bar: "food",
  school: "schools",
  shop: "daily",
  market: "daily",
  health: "daily",
  transport: "daily",
  beach: "nature",
  nature: "nature",
  park: "nature",
  golf: "activities",
  sport: "activities",
  culture: "activities",
};

export type PlaceView = {
  id: string;
  name: string;
  category: PlaceCategory;
  categoryLabel: string;
  lat: number;
  lng: number;
  note: string;
  distance?: string;
  sourceUrl: string;
  sourceLabel: string;
};

export type AreaExplorerLabels = {
  all: string;
  groups: Record<PlaceGroup, string>;
  home: string;
  mapLabel: string;
  listTitle: string;
  loading: string;
  source: string;
  prev: string;
  next: string;
  mapCaption: string;
  viewOurs: string;
  viewGoogle: string;
  googleLoad: string;
  googleNotice: string;
  googleOpen: string;
  gestures: { windows: string; mac: string; mobile: string };
};

type Props = {
  places: PlaceView[];
  centre: { lat: number; lng: number };
  home?: { lat: number; lng: number };
  /** Label on the home pin (defaults to labels.home). */
  pinLabel?: string;
  /** Optional Google Maps view of the same spot, loaded only after a click. */
  google?: { embedUrl: string; openUrl: string };
  lang: "en" | "es";
  labels: AreaExplorerLabels;
  /** Chapter number, label, heading and lead (server-rendered). */
  intro: ReactNode;
  /** Method / verification note under the panel. */
  footer: ReactNode;
};

/* 24px stroke icons, one per category. */
const ICONS: Record<PlaceCategory | "home", string> = {
  cafe: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3c0 1.5 1.5 1.5 1.5 3M12 3c0 1.5 1.5 1.5 1.5 3"/>',
  restaurant:
    '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10"/><path d="M17 21V3c-2 1.5-3 4-3 7v3h3"/>',
  bar: '<path d="M6 4h12l-6 8-6-8Z"/><path d="M12 12v7M8.5 20h7"/>',
  school:
    '<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
  shop: '<path d="M3 4h2l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L20 8H6.2"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
  market:
    '<path d="M4 10h16l-1.5-5h-13L4 10Z"/><path d="M5 10v9h14v-9M10 19v-5h4v5"/>',
  health: '<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6V4Z"/>',
  beach:
    '<path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><circle cx="16" cy="7" r="3"/><path d="M2 14c2 0 2-1.5 4-1.5s2 1.5 4 1.5"/>',
  nature: '<path d="M12 3 6 13h4l-3 5h10l-3-5h4L12 3Z"/><path d="M12 18v3"/>',
  park: '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M8 21h8"/>',
  golf: '<path d="M9 21V3l8 3.5L9 10"/><path d="M5 21h10"/>',
  sport:
    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14.5 0 17M12 3.5c-2.5 2.5-2.5 14.5 0 17"/>',
  transport:
    '<rect x="5" y="3" width="14" height="14" rx="2"/><path d="M5 11h14M8 17v3M16 17v3"/><circle cx="8.5" cy="14" r=".6"/><circle cx="15.5" cy="14" r=".6"/>',
  culture: '<path d="m3 9 9-5 9 5H3ZM5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18"/>',
  home: '<path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/>',
};

const svg = (inner: string, cls: string) =>
  `<svg viewBox="0 0 24 24" class="${cls}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export function CategoryIcon({
  category,
  className = "size-4",
}: {
  category: PlaceCategory | "home";
  className?: string;
}) {
  return (
    <span
      className="inline-flex"
      dangerouslySetInnerHTML={{ __html: svg(ICONS[category], className) }}
    />
  );
}

export function AreaExplorer({
  places,
  centre,
  home,
  lang,
  labels,
  intro,
  footer,
  pinLabel,
  google,
}: Props) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  /** Shows/hides and highlights the markers; set once the map exists. */
  const syncRef = useRef<(g: PlaceGroup | "all", sel: string | null) => void>(
    () => {},
  );
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<"ours" | "google">("ours");
  const [googleOn, setGoogleOn] = useState(false);
  const [group, setGroup] = useState<PlaceGroup | "all">("all");
  const [selected, setSelected] = useState<string | null>(
    places[0]?.id ?? null,
  );

  const groups = useMemo(() => {
    const present = new Set(places.map((p) => GROUP_FOR[p.category]));
    return (Object.keys(labels.groups) as PlaceGroup[]).filter((g) =>
      present.has(g),
    );
  }, [places, labels.groups]);
  const visible = places.filter(
    (p) => group === "all" || GROUP_FOR[p.category] === group,
  );
  const index = Math.max(
    0,
    visible.findIndex((p) => p.id === selected),
  );
  const current = visible[index];

  const choose = (g: PlaceGroup | "all") => {
    setGroup(g);
    const first = places.find(
      (p) => g === "all" || GROUP_FOR[p.category] === g,
    );
    setSelected(first?.id ?? null);
  };
  const step = (d: number) => {
    if (!visible.length) return;
    setSelected(visible[(index + d + visible.length) % visible.length].id);
  };

  /* Load the map library only when the section comes near the viewport. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const [maplibregl, basemaps] = await Promise.all([
          import("maplibre-gl"),
          import("@protomaps/basemaps"),
        ]);
        if (cancelled || !box.current) return;
        const origin = window.location.origin;
        maplibregl.setWorkerUrl(`${origin}/map/maplibre-gl-worker.mjs`);
        const flavor = {
          ...basemaps.namedFlavor("light"),
          background: "#f4efe4",
          earth: "#f4efe4",
          water: "#bcd3d1",
          park_a: "#dde5d2",
          park_b: "#d3dec7",
          wood_a: "#d8e1cc",
          wood_b: "#cfdac2",
          scrub_a: "#e4e6d3",
          scrub_b: "#dde1cb",
          sand: "#efe5cf",
          beach: "#efe2c6",
          school: "#ece4d3",
          hospital: "#efe1dc",
          buildings: "#e7dece",
          pedestrian: "#efe8da",
          city_label: "#1c3729",
          city_label_halo: "#fcfaf5",
          subplace_label: "#4b574f",
          subplace_label_halo: "#fcfaf5",
          roads_label_minor: "#6b746d",
          roads_label_major: "#4b574f",
          ocean_label: "#4f7c7a",
        };
        const layers = basemaps
          .layers("protomaps", flavor, { lang })
          .filter((l) => !l.id.includes("pois"));
        const pts = [
          ...places.map((p) => [p.lng, p.lat] as [number, number]),
          ...(home ? [[home.lng, home.lat] as [number, number]] : []),
        ];
        const lngs = pts.map((p) => p[0]);
        const lats = pts.map((p) => p[1]);
        /* Open on the places near the home (or town centre); far ones stay a pan away. */
        const ref = home ?? centre;
        const km = (p: [number, number]) =>
          Math.hypot(
            (p[0] - ref.lng) * 111.32 * Math.cos((ref.lat * Math.PI) / 180),
            (p[1] - ref.lat) * 111.32,
          );
        const nearPts = pts.filter((p) => km(p) <= 2.2);
        const view = nearPts.length >= 3 ? nearPts : pts;
        const pad = 0.025;
        const map = new maplibregl.Map({
          container: box.current,
          style: {
            version: 8,
            glyphs: `${origin}/map/fonts/{fontstack}/{range}.pbf`,
            sources: {
              protomaps: {
                type: "vector",
                tiles: [`${origin}/map/tiles/{z}/{x}/{y}.pbf`],
                minzoom: 5,
                maxzoom: 15,
                attribution:
                  '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a> · <a href="https://protomaps.com" target="_blank" rel="noopener">Protomaps</a>',
              },
            },
            layers,
          },
          bounds: [
            [
              Math.min(...view.map((p) => p[0])),
              Math.min(...view.map((p) => p[1])),
            ],
            [
              Math.max(...view.map((p) => p[0])),
              Math.max(...view.map((p) => p[1])),
            ],
          ],
          fitBoundsOptions: { padding: 48, maxZoom: 15 },
          maxBounds: [
            [
              Math.min(...lngs, centre.lng) - pad,
              Math.min(...lats, centre.lat) - pad,
            ],
            [
              Math.max(...lngs, centre.lng) + pad,
              Math.max(...lats, centre.lat) + pad,
            ],
          ],
          minZoom: 12,
          maxZoom: 17,
          cooperativeGestures: true,
          attributionControl: { compact: true },
          locale: {
            "CooperativeGesturesHandler.WindowsHelpText":
              labels.gestures.windows,
            "CooperativeGesturesHandler.MacHelpText": labels.gestures.mac,
            "CooperativeGesturesHandler.MobileHelpText": labels.gestures.mobile,
          },
        });
        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right",
        );
        mapRef.current = map;

        if (home) {
          const el = document.createElement("div");
          el.className = "area-home";
          el.innerHTML = `${svg(ICONS.home, "size-5")}<span>${pinLabel ?? labels.home}</span>`;
          new maplibregl.Marker({ element: el, anchor: "bottom" })
            .setLngLat([home.lng, home.lat])
            .addTo(map);
        }
        const pins = new Map<string, HTMLButtonElement>();
        for (const p of places) {
          const el = document.createElement("button");
          el.type = "button";
          el.className = "area-pin";
          el.dataset.group = GROUP_FOR[p.category];
          el.setAttribute("aria-label", `${p.name} (${p.categoryLabel})`);
          el.innerHTML = svg(ICONS[p.category], "size-4");
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelected(p.id);
          });
          new maplibregl.Marker({ element: el })
            .setLngLat([p.lng, p.lat])
            .addTo(map);
          pins.set(p.id, el);
        }
        syncRef.current = (g, sel) => {
          for (const [id, pin] of pins) {
            pin.style.display =
              g === "all" || pin.dataset.group === g ? "" : "none";
            pin.dataset.selected = String(id === sel);
            pin.setAttribute("aria-pressed", String(id === sel));
          }
        };
        map.once("load", () => {
          setReady(true);
          // Start with the map credit collapsed to its (i) button so it never hides a pin.
          box.current
            ?.querySelector(".maplibregl-ctrl-attrib")
            ?.classList.remove("maplibregl-compact-show");
        });
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // The map is built once per page; filters and selection update it below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Keep the markers and the view in step with the selected place. */
  useEffect(() => {
    syncRef.current(group, selected);
    const map = mapRef.current;
    const p = places.find((x) => x.id === selected);
    if (!map || !p || !ready) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!map.getBounds().contains([p.lng, p.lat]))
      map.easeTo({
        center: [p.lng, p.lat],
        duration: reduce ? 0 : 900,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
  }, [group, selected, places, ready]);

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8">
      <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end">
        {intro}
        <div className="mt-8">
          <div
            role="group"
            aria-label={labels.listTitle}
            className="flex flex-wrap gap-x-5 gap-y-2 border-b border-ivory-200 pb-3"
          >
            {(["all", ...groups] as const).map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={group === g}
                onClick={() => choose(g)}
                className="area-tab text-[0.68rem] font-semibold tracking-[0.18em] text-muted uppercase transition-colors hover:text-forest-900 aria-pressed:text-forest-900"
              >
                {g === "all" ? labels.all : labels.groups[g]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1">
        {google && (
          <div
            role="group"
            aria-label={labels.mapLabel}
            className="mb-3 flex gap-5"
          >
            {(["ours", "google"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className="area-tab text-[0.68rem] font-semibold tracking-[0.18em] text-muted uppercase transition-colors hover:text-forest-900 aria-pressed:text-forest-900"
              >
                {v === "ours" ? labels.viewOurs : labels.viewGoogle}
              </button>
            ))}
          </div>
        )}
        <div
          data-reveal="mask"
          className="relative aspect-square w-full overflow-hidden bg-ivory-200 lg:max-w-[min(42rem,calc(100svh-11rem))]"
        >
          {/* MapLibre sets position: relative on its container, so it fills a positioned wrapper. */}
          <div className="absolute inset-0">
            <div
              ref={box}
              className="h-full w-full"
              role="region"
              aria-label={labels.mapLabel}
            />
          </div>
          {!ready && (
            <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted">
              {labels.loading}
            </p>
          )}
          {google && view === "google" && (
            <div className="area-google absolute inset-0 bg-ivory-100">
              {googleOn ? (
                <iframe
                  src={google.embedUrl}
                  title={labels.viewGoogle}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
                  <p className="max-w-sm text-sm leading-relaxed text-muted">
                    {labels.googleNotice}
                  </p>
                  <button
                    type="button"
                    onClick={() => setGoogleOn(true)}
                    className="rounded-full bg-forest-800 px-6 py-3 text-[0.7rem] font-semibold tracking-[0.18em] text-ivory-50 uppercase transition-colors hover:bg-forest-700"
                  >
                    {labels.googleLoad}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="mt-2.5 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted">
          <span>{labels.mapCaption}</span>
          {google && (
            <a
              href={google.openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-ivory-300 underline-offset-4 hover:text-forest-900"
            >
              {labels.googleOpen} ↗
            </a>
          )}
        </p>
      </div>

      <div className="lg:col-span-5 lg:col-start-8 lg:row-start-2">
        {current && (
          <div aria-live="polite">
            <article key={current.id} className="area-detail">
              <div className="flex items-end justify-between gap-4">
                <p className="flex items-baseline gap-2 font-serif text-gold-500 tabular-nums">
                  <span className="text-5xl leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg text-muted">
                    / {String(visible.length).padStart(2, "0")}
                  </span>
                </p>
                <p className="flex items-center gap-2 pb-1 text-[0.66rem] font-semibold tracking-[0.18em] text-gold-600 uppercase">
                  <CategoryIcon
                    category={current.category}
                    className="size-4"
                  />
                  {[current.categoryLabel, current.distance]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <h3 className="mt-6 text-3xl leading-[1.05] text-forest-900 md:text-4xl">
                {current.name}
              </h3>
              <span
                aria-hidden="true"
                className="area-rule mt-5 block h-px w-12 bg-gold-400"
              />
              <p className="mt-5 text-[1.05rem] leading-relaxed text-ink/80">
                {current.note}
              </p>
              <a
                href={current.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-xs text-muted underline decoration-ivory-300 underline-offset-4 transition-colors hover:text-forest-900 hover:decoration-gold-500"
              >
                {labels.source}: {current.sourceLabel} ↗
              </a>
            </article>
            <div className="mt-8 flex items-center justify-between border-t border-ivory-200 pt-4">
              <button
                type="button"
                onClick={() => step(-1)}
                className="group inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.18em] text-forest-800 uppercase"
              >
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-x-1"
                >
                  ←
                </span>{" "}
                {labels.prev}
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="group inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.18em] text-forest-800 uppercase"
              >
                {labels.next}{" "}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </button>
            </div>
          </div>
        )}
        <div className="mt-8">{footer}</div>
      </div>
    </div>
  );
}
