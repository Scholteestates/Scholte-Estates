/**
 * Imports researched place files into src/data/areas/<id>.json after checking
 * them, and records every area in scripts/map/regions.json so the basemap
 * covers all places (re-run extract-tiles.mts afterwards).
 *
 *   node scripts/map/import-places.mts <dir-with-area-json-files>
 *
 * New areas start unapproved (approval.approvedBy = null): they show only on
 * the local dev server until the user approves them.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import type { AreaProfile, PlaceCategory } from "../../src/lib/areas/types.ts";

const CATEGORIES: PlaceCategory[] = ["cafe", "restaurant", "bar", "school", "shop", "market", "health", "beach", "nature", "park", "golf", "sport", "transport", "culture"];
const dir = process.argv[2];
if (!dir) throw new Error("usage: import-places.mts <dir>");
const OUT = path.join(process.cwd(), "src", "data", "areas");
mkdirSync(OUT, { recursive: true });

const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const r = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

const problems: string[] = [];
const imported: AreaProfile[] = [];
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  const a = JSON.parse(readFileSync(path.join(dir, f), "utf8")) as AreaProfile;
  const where = `${f}`;
  if (!/^[a-z0-9-]+$/.test(a.id)) problems.push(`${where}: bad id`);
  const seen = new Set<string>();
  a.places = (a.places ?? []).filter((p) => {
    const bad: string[] = [];
    if (!CATEGORIES.includes(p.category)) bad.push(`category ${p.category}`);
    if (!(Math.abs(p.lat) > 30 && Math.abs(p.lat) < 45 && p.lng > -2 && p.lng < 1)) bad.push("coordinates outside Costa Blanca");
    if (!/^https:\/\//.test(p.sourceUrl ?? "")) bad.push("source not https");
    if (!p.note?.en || !p.note?.es) bad.push("missing note");
    if ((p.note?.en?.length ?? 0) > 220 || (p.note?.es?.length ?? 0) > 240) bad.push("note too long");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.verifiedAt ?? "")) bad.push("verifiedAt");
    const d = km(a.centre, p);
    if (d > a.radiusM / 1000 + 1.5) bad.push(`${d.toFixed(1)} km from centre`);
    if (seen.has(p.osm)) bad.push("duplicate");
    seen.add(p.osm);
    if (bad.length) problems.push(`${where}: dropped "${p.name}" (${bad.join(", ")})`);
    return bad.length === 0;
  });
  const prev = existsSync(path.join(OUT, `${a.id}.json`)) ? (JSON.parse(readFileSync(path.join(OUT, `${a.id}.json`), "utf8")) as AreaProfile) : undefined;
  const profile: AreaProfile = {
    id: a.id,
    name: a.name,
    centre: a.centre,
    radiusM: a.radiusM,
    places: a.places,
    rejected: a.rejected ?? [],
    research: {
      by: "Claude (AI research assistant) for Scholte Estates",
      method: "Candidates from OpenStreetMap; each place checked against a current official website or official listing on the date shown. Notes written from those sources only.",
    },
    // Re-importing changed places resets approval: the user approves again.
    approval: prev && JSON.stringify(prev.places) === JSON.stringify(a.places) ? prev.approval : { approvedBy: null, approvedAt: null },
  };
  writeFileSync(path.join(OUT, `${a.id}.json`), JSON.stringify(profile, null, 2) + "\n");
  imported.push(profile);
}

// Basemap coverage: one detail centre per area, sized to reach every place.
const regionsFile = path.join(process.cwd(), "scripts", "map", "regions.json");
const regions = JSON.parse(readFileSync(regionsFile, "utf8"));
for (const a of imported) {
  const reach = Math.max(0, ...a.places.map((p) => km(a.centre, p)));
  const entry = { id: a.id, lat: +a.centre.lat.toFixed(5), lng: +a.centre.lng.toFixed(5), radiusKm: +Math.max(4, reach + 3).toFixed(1) };
  regions.detail.centres = regions.detail.centres.filter((c: { id: string }) => c.id !== a.id).concat(entry);
}
writeFileSync(regionsFile, JSON.stringify(regions, null, 2) + "\n");

console.log(`imported ${imported.map((a) => `${a.id} (${a.places.length})`).join(", ")}`);
if (problems.length) console.log(`\nproblems:\n- ${problems.join("\n- ")}`);
