/**
 * Builds the self-hosted basemap: copies the vector tiles we need from a
 * Protomaps planet build (OpenStreetMap data, ODbL) into public/map/tiles as
 * static files, so the map loads only from our own domain.
 *
 *   node scripts/map/extract-tiles.mts [build-url]
 *
 * Coverage comes from scripts/map/regions.json: wide boxes at lower zooms and
 * full detail (z15) within `detailRadiusKm` of every area centre.
 */
import { PMTiles } from "pmtiles";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

type Box = { name: string; west: number; south: number; east: number; north: number; minZoom: number; maxZoom: number };
type Regions = { boxes: Box[]; detail: { maxZoom: number; detailRadiusKm: number; centres: { id: string; lat: number; lng: number; radiusKm?: number }[] } };

const BUILD = process.argv[2] ?? "https://build.protomaps.com/20261126.pmtiles";
const OUT = path.join(process.cwd(), "public", "map", "tiles");
const regions = JSON.parse(readFileSync(path.join(process.cwd(), "scripts", "map", "regions.json"), "utf8")) as Regions;

const lon2x = (lon: number, z: number) => Math.floor(((lon + 180) / 360) * 2 ** z);
const lat2y = (lat: number, z: number) => {
  const r = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z);
};

const wanted = new Set<string>();
const addBox = (w: number, s: number, e: number, n: number, z: number) => {
  for (let x = lon2x(w, z); x <= lon2x(e, z); x++) for (let y = lat2y(n, z); y <= lat2y(s, z); y++) wanted.add(`${z}/${x}/${y}`);
};
for (const b of regions.boxes) for (let z = b.minZoom; z <= b.maxZoom; z++) addBox(b.west, b.south, b.east, b.north, z);
const { maxZoom, detailRadiusKm, centres } = regions.detail;
for (const c of centres) {
  const r = c.radiusKm ?? detailRadiusKm;
  const dLat = r / 111.32;
  const dLng = r / (111.32 * Math.cos((c.lat * Math.PI) / 180));
  for (let z = 13; z <= maxZoom; z++) addBox(c.lng - dLng, c.lat - dLat, c.lng + dLng, c.lat + dLat, z);
}

const archive = new PMTiles(BUILD);
const header = await archive.getHeader();
const meta = (await archive.getMetadata()) as Record<string, string>;
rmSync(OUT, { recursive: true, force: true });

const list = [...wanted];
let written = 0;
let bytes = 0;
const queue = list.slice();
await Promise.all(
  Array.from({ length: 8 }, async () => {
    for (let key = queue.shift(); key; key = queue.shift()) {
      const [z, x, y] = key.split("/").map(Number);
      const tile = await archive.getZxy(z, x, y);
      if (!tile?.data?.byteLength) continue;
      const file = path.join(OUT, String(z), String(x), `${y}.pbf`);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, new Uint8Array(tile.data));
      written++;
      bytes += tile.data.byteLength;
    }
  }),
);

writeFileSync(
  path.join(OUT, "source.json"),
  JSON.stringify(
    {
      source: BUILD,
      basemapVersion: meta.version,
      osmReplicationTime: meta["planetiler:osm:osmosisreplicationtime"],
      attribution: "© OpenStreetMap contributors (ODbL) · Protomaps",
      minZoom: Math.min(...regions.boxes.map((b) => b.minZoom)),
      maxZoom: Math.min(maxZoom, header.maxZoom),
      extractedAt: new Date().toISOString(),
      tiles: written,
    },
    null,
    2,
  ),
);
console.log(`requested ${list.length}, wrote ${written} tiles, ${(bytes / 1e6).toFixed(1)} MB`);
