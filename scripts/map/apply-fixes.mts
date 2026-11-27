/**
 * Applies source re-checks to src/data/areas: each decision either replaces a
 * place's source (and optionally its note) or drops the place.
 *
 *   node scripts/map/apply-fixes.mts <fixes.json> [...more.json]
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { AreaProfile } from "../../src/lib/areas/types.ts";

type Fix = {
  area: string;
  name: string;
  osm: string;
  action: "replace" | "drop";
  sourceUrl?: string;
  sourceType?: string;
  verifiedAt?: string;
  note?: { en: string; es: string };
  reason?: string;
};

const fixes = process.argv.slice(2).flatMap((f) => JSON.parse(readFileSync(f, "utf8")) as Fix[]);
const byArea = Map.groupBy(fixes, (f) => f.area);
for (const [id, list] of byArea) {
  const file = path.join(process.cwd(), "src", "data", "areas", `${id}.json`);
  const a = JSON.parse(readFileSync(file, "utf8")) as AreaProfile;
  for (const f of list) {
    const i = a.places.findIndex((p) => p.osm === f.osm);
    if (i < 0) {
      console.log(`! ${id}: ${f.name} (${f.osm}) not found`);
      continue;
    }
    if (f.action === "drop" || !f.sourceUrl?.startsWith("https://") || f.sourceUrl.includes("gastroranking")) {
      const [p] = a.places.splice(i, 1);
      a.rejected = [...(a.rejected ?? []), { name: p.name, reason: f.reason ?? "no own or official source on re-check (2026-11-27)" }];
      console.log(`- ${id}: dropped ${p.name}`);
    } else {
      const p = a.places[i];
      p.name = f.name || p.name;
      p.sourceUrl = f.sourceUrl;
      p.sourceType = f.sourceType ?? p.sourceType;
      p.verifiedAt = f.verifiedAt ?? "2026-11-27";
      if (f.note?.en && f.note?.es) p.note = f.note;
      console.log(`+ ${id}: ${p.name} → ${new URL(f.sourceUrl).hostname}`);
    }
  }
  writeFileSync(file, JSON.stringify(a, null, 2) + "\n");
}
