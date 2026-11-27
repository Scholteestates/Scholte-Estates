/**
 * Private listing preview pipeline (Phase 1, docs/real-listings-plan.md).
 *
 *   node scripts/listings/preview.ts import --feed <kyero.xml> --dir <private dir> --ref <ref> [--ref …]
 *   node scripts/listings/preview.ts build  --dir <private dir>
 *
 * `import` normalises the chosen listings from a Kyero v3 feed into
 * <dir>/supplied/<ref>.json and downloads their photos to <dir>/images/<ref>/.
 * `build` merges each supplied listing with our overlay (<dir>/overlays/<ref>.json:
 * photo classification, captions, chapter texts), keeps only supported
 * chapters, and writes <dir>/stories.json plus an internal <dir>/gap-report.md.
 *
 * <dir> must be inside the git-ignored /.private folder: provider sample data,
 * photos and anything derived from them never enter the repository.
 * Runs on Node ≥ 23 (native type stripping); only Node built-ins are used.
 */
import { mkdir, readFile, readdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type {
  BuiltListing,
  Gap,
  ListingOverlay,
  SuppliedDistance,
  SuppliedListing,
  Text,
} from "../../src/lib/listings/types.ts";

// ---------------------------------------------------------------- arguments

const [, , command, ...rest] = process.argv;
const args: Record<string, string[]> = {};
for (let i = 0; i < rest.length; i += 2) (args[rest[i].replace(/^--/, "")] ??= []).push(rest[i + 1]);
const one = (k: string) => args[k]?.[0];

const repoRoot = path.resolve(import.meta.dirname, "../..");
const dir = path.resolve(one("dir") ?? "");
if (!one("dir") || !dir.startsWith(path.join(repoRoot, ".private") + path.sep)) {
  console.error("--dir must be a folder inside the git-ignored .private/ directory");
  process.exit(1);
}

// ---------------------------------------------------------------- tiny XML reader (Kyero v3 is plain, attribute-light XML)

type Node = { tag: string; attrs: Record<string, string>; children: Node[]; text: string };

const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

function parseXml(xml: string): Node {
  const root: Node = { tag: "#root", attrs: {}, children: [], text: "" };
  const stack = [root];
  const re = /<!\[CDATA\[([\s\S]*?)\]\]>|<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<(\/?)([\w:.-]+)([^>]*?)(\/?)>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const top = stack[stack.length - 1];
    if (m[1] !== undefined) top.text += m[1];
    else if (m[6] !== undefined) top.text += decode(m[6]);
    else if (m[3]) {
      if (m[2] === "/") stack.pop();
      else {
        const attrs: Record<string, string> = {};
        for (const a of m[4].matchAll(/([\w:.-]+)="([^"]*)"/g)) attrs[a[1]] = decode(a[2]);
        const node: Node = { tag: m[3], attrs, children: [], text: "" };
        top.children.push(node);
        if (m[5] !== "/") stack.push(node);
      }
    }
  }
  return root;
}

const child = (n: Node | undefined, tag: string) => n?.children.find((c) => c.tag === tag);
const all = (n: Node | undefined, tag: string) => n?.children.filter((c) => c.tag === tag) ?? [];
const txt = (n: Node | undefined, tag: string) => child(n, tag)?.text.trim() ?? "";
const num = (n: Node | undefined, tag: string) => {
  const v = Number(txt(n, tag));
  return Number.isFinite(v) && v > 0 ? v : undefined;
};

// ---------------------------------------------------------------- normalising

const TYPES: Record<string, string> = {
  apartment: "apartment",
  bungalow: "bungalow",
  villa: "villa",
  "town house": "townhouse",
  townhouse: "townhouse",
  "quad house": "townhouse",
  plot: "plot",
};

/** Kyero feature strings we can label in both languages. */
const FEATURES: Record<string, Text> = {
  "Communal Pool": { en: "Communal pool", es: "Piscina comunitaria" },
  "Private Pool": { en: "Private pool", es: "Piscina privada" },
  Gated: { en: "Gated community", es: "Urbanización cerrada" },
  Garden: { en: "Garden", es: "Jardín" },
  BBQ: { en: "Barbecue", es: "Barbacoa" },
  Gym: { en: "Gym", es: "Gimnasio" },
  Jacuzzi: { en: "Jacuzzi", es: "Jacuzzi" },
  "Laundry Room": { en: "Laundry room", es: "Lavadero" },
  "Elevator/Lift": { en: "Lift", es: "Ascensor" },
  "Storage / Trastero": { en: "Storage room", es: "Trastero" },
  "Key Ready": { en: "Ready to move in", es: "Llave en mano" },
  "Parking - Space": { en: "Parking space", es: "Plaza de aparcamiento" },
  "Parking - Space - Garage - Double Garage": { en: "Double garage", es: "Garaje doble" },
  "Air Conditioning: Pre-Installed": { en: "Air conditioning pre-installed", es: "Preinstalación de aire acondicionado" },
  "Air Conditioning: Yes": { en: "Air conditioning", es: "Aire acondicionado" },
  "Heating: Yes": { en: "Heating", es: "Calefacción" },
  "Solarium: Yes": { en: "Solarium", es: "Solárium" },
  "Views: Sea": { en: "Sea views", es: "Vistas al mar" },
  "Near Schools": { en: "Near schools", es: "Cerca de colegios" },
  "Near Bus Route": { en: "Near a bus route", es: "Cerca de una línea de autobús" },
  "Near Childrens Parks": { en: "Near children's parks", es: "Cerca de parques infantiles" },
  "Near Commercial Center": { en: "Near a shopping centre", es: "Cerca de un centro comercial" },
  "Near Golf / Golf Resort Property": { en: "Near golf", es: "Cerca de golf" },
  "Near Train Station": { en: "Near a train station", es: "Cerca de una estación de tren" },
  "Near Tram Stop": { en: "Near a tram stop", es: "Cerca de una parada de tranvía" },
  "Near Trees": { en: "Near trees", es: "Cerca de zonas arboladas" },
  "Location: Rural, Urbanisation": { en: "Rural setting, residential development", es: "Entorno rural, urbanización" },
  "Location: Coastal, Urbanisation": { en: "Coastal setting, residential development", es: "Entorno costero, urbanización" },
};

const DISTANCE_LABELS: Record<string, Text> = {
  beach: { en: "Beach", es: "Playa" },
  shops: { en: "Shops", es: "Tiendas" },
  airport: { en: "Airport", es: "Aeropuerto" },
};

function paragraphs(raw: string): string[] {
  return decode(raw)
    .replace(/\r\n?/g, "\n")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function normalise(p: Node, feedName: string, readAt: string): SuppliedListing {
  const ref = txt(p, "ref");
  const features: Text[] = [];
  const untranslated: string[] = [];
  const distances: SuppliedDistance[] = [];
  let terraceM2: number | undefined;
  let usefulM2: number | undefined;
  let parkingSpaces: number | undefined;

  for (const f of all(child(p, "features"), "feature").map((n) => n.text.trim())) {
    let m: RegExpMatchArray | null;
    if ((m = f.match(/^(\w+): ([\d.]+) Meters$/))) {
      const key = m[1].toLowerCase();
      distances.push({ key, label: DISTANCE_LABELS[key] ?? { en: m[1], es: m[1] }, metres: Number(m[2]) });
    } else if ((m = f.match(/^Terrace: ([\d.]+) Msq\.$/))) terraceM2 = Number(m[1]);
    else if ((m = f.match(/^Useable Build Space: ([\d.]+) Msq\.$/))) usefulM2 = Number(m[1]);
    else if ((m = f.match(/^Number of Parking Spaces: (\d+)$/))) parkingSpaces = Number(m[1]);
    else if (/^(Double Bedrooms|Toilet): \d+$/.test(f)) continue; // already covered by beds/baths
    else if (FEATURES[f]) features.push(FEATURES[f]);
    else untranslated.push(f);
  }

  const description: SuppliedListing["description"] = {};
  for (const lang of ["en", "es"] as const) {
    const raw = txt(child(p, "desc"), lang);
    if (raw) description[lang] = paragraphs(raw);
  }

  const typeSupplied = txt(p, "type");
  const poolFlag = txt(p, "pool") === "1";
  const pool = features.some((f) => f.en === "Private pool")
    ? "private"
    : features.some((f) => f.en === "Communal pool")
      ? "communal"
      : poolFlag
        ? "communal"
        : "none";

  const lat = Number(txt(child(p, "location"), "latitude"));
  const lng = Number(txt(child(p, "location"), "longitude"));
  const consumption = txt(child(p, "energy_rating"), "consumption");
  const emissions = txt(child(p, "energy_rating"), "emissions");

  return {
    source: {
      provider: "redsp",
      providerRef: ref,
      providerId: txt(p, "id"),
      updatedAt: txt(p, "date"),
      feedReadAt: readAt,
      feedName,
      licence: null,
    },
    condition: txt(p, "new_build") === "1" ? "new-build" : "resale",
    type: TYPES[typeSupplied.toLowerCase()] ?? "other",
    typeSupplied,
    town: txt(p, "town"),
    province: txt(p, "province"),
    locationDetail: txt(p, "location_detail") || undefined,
    coordinates: Number.isFinite(lat) && Number.isFinite(lng) && lat && lng ? { lat, lng } : undefined,
    priceEur: Number(txt(p, "price")),
    bedrooms: Number(txt(p, "beds")),
    bathrooms: Number(txt(p, "baths")),
    builtM2: num(child(p, "surface_area"), "built"),
    plotM2: num(child(p, "surface_area"), "plot"),
    usefulM2,
    terraceM2,
    pool,
    parkingSpaces,
    energy: consumption || emissions ? { consumption, emissions } : undefined,
    description,
    features,
    untranslatedFeatures: untranslated,
    distances,
    images: all(child(p, "images"), "image").map((img, i) => ({
      id: Number(img.attrs.id ?? i + 1),
      url: txt(img, "url"),
      tags: txt(img, "tags") ? txt(img, "tags").split(/[,\s]+/).filter(Boolean) : [],
    })),
    // Kyero v3 has no fields for these; they must come from the provider.
    notSupplied: ["vatIncluded", "completionDate", "availability", "developmentName", "floorLevel"],
  };
}

// ---------------------------------------------------------------- import

async function runImport() {
  const feed = one("feed");
  const refs = args.ref ?? [];
  if (!feed || !refs.length) throw new Error("import needs --feed <file> and at least one --ref");
  const xml = await readFile(feed, "utf8");
  const root = parseXml(xml);
  const props = all(child(root, "root"), "property");
  const readAt = (await stat(feed)).mtime.toISOString();
  const feedName = one("feed-name") ?? "RedSP public trial feed (Kyero v3)";

  for (const ref of refs) {
    const node = props.find((p) => txt(p, "ref") === ref);
    if (!node) throw new Error(`reference ${ref} not in feed`);
    const listing = normalise(node, feedName, readAt);

    const imgDir = path.join(dir, "images", ref);
    await mkdir(imgDir, { recursive: true });
    for (const img of listing.images) {
      const file = `${String(img.id).padStart(2, "0")}${path.extname(new URL(img.url).pathname) || ".jpg"}`;
      const target = path.join(imgDir, file);
      if (!existsSync(target)) {
        const res = await fetch(img.url);
        if (!res.ok) throw new Error(`photo ${img.url}: HTTP ${res.status}`);
        await writeFile(target, Buffer.from(await res.arrayBuffer()));
      }
      img.file = `images/${ref}/${file}`;
    }

    await mkdir(path.join(dir, "supplied"), { recursive: true });
    await writeFile(path.join(dir, "supplied", `${ref}.json`), JSON.stringify(listing, null, 2));
    console.log(`imported ${ref}: ${listing.images.length} photos`);
  }
}

// ---------------------------------------------------------------- build (merge + gap report)

const ROOM_TO_CHAPTER: Record<string, string[]> = {
  living: ["living"],
  kitchen: ["kitchen", "living"],
  bedroom: ["bedroom"],
  bathroom: ["bathroom"],
  outdoor: ["terrace", "garden", "communal", "exterior", "view"],
};

function gapsFor(s: SuppliedListing, o: ListingOverlay): Gap[] {
  const gaps: Gap[] = [];
  const photos = new Map(o.classification.photos.map((c) => [c.id, c]));

  if (!s.source.licence) gaps.push({ area: "licence", message: "Publication rights not confirmed: provider terms not yet read and recorded. Do not publish." });

  const unclassified = s.images.filter((i) => !photos.has(i.id)).map((i) => i.id);
  if (unclassified.length) gaps.push({ area: "photos", message: `Photos not yet classified: ${unclassified.join(", ")}.` });
  if (!o.classification.reviewedBy) gaps.push({ area: "photos", message: `Photo classification by ${o.classification.by} has not been reviewed by a person yet.` });
  const unclear = o.classification.photos.filter((c) => c.origin === "unclear").map((c) => c.id);
  if (unclear.length) gaps.push({ area: "photos", message: `Photo or render unclear for images ${unclear.join(", ")}: ask the provider; labelled "may be a computer-generated image" meanwhile.` });
  const examples = o.classification.photos.filter((c) => c.example).map((c) => c.id);
  if (examples.length) gaps.push({ area: "consistency", message: `Drawing(s) ${examples.join(", ")} not linked to this unit by the feed: shown as an example; unit number, floor level and room sizes from it stay provisional until the provider confirms.` });
  const others = o.classification.photos.filter((c) => c.otherUnit).map((c) => c.id);
  if (others.length) gaps.push({ area: "photos", message: `Images ${others.join(", ")} appear to show other units or the wider development, not necessarily this home; labelled as such.` });

  for (const kind of ["living", "kitchen", "bedroom", "bathroom", "outdoor"] as const) {
    const chapter = o.chapters.find((c) => c.kind === kind);
    if (!chapter) {
      const candidates = o.classification.photos.filter((c) => ROOM_TO_CHAPTER[kind].includes(c.room));
      gaps.push({
        area: "chapters",
        message: candidates.length
          ? `${kind} chapter not written yet (candidate photos: ${candidates.map((c) => c.id).join(", ")}).`
          : `${kind} chapter omitted: no photo of this room in the feed.`,
      });
    } else {
      const img = photos.get(chapter.image);
      if (!img || !ROOM_TO_CHAPTER[kind].includes(img.room)) gaps.push({ area: "chapters", message: `${kind} chapter uses photo ${chapter.image}, which is not classified as that room.` });
      if (img?.origin === "render") gaps.push({ area: "chapters", message: `${kind} chapter is illustrated by a computer-generated image (labelled), not a photograph of the actual home.` });
    }
  }

  if (!o.area) gaps.push({ area: "area", message: "No verified area chapter yet: nearby places, distances and travel times still to be checked by Scholte Estates. Chapter omitted." });

  if (!s.description.en) gaps.push({ area: "text", message: "No English description supplied." });
  if (!s.description.es) gaps.push({ area: "text", message: "No Spanish description supplied." });
  if (s.untranslatedFeatures.length) gaps.push({ area: "text", message: `Features without a Spanish label (shown in English only): ${s.untranslatedFeatures.join("; ")}.` });

  const nice: Record<string, string> = {
    vatIncluded: "whether the price includes VAT (IVA) and other taxes",
    completionDate: "completion / delivery date",
    availability: "availability of this unit",
    developmentName: "development name",
    floorLevel: "floor level (ground floor or top floor)",
  };
  for (const k of s.notSupplied) gaps.push({ area: "facts", message: `Not in the feed: ${nice[k] ?? k}.` });
  if (!s.energy) gaps.push({ area: "facts", message: "No energy rating supplied (required in advertising, RD 390/2021). Do not publish without it." });
  if (!s.plotM2 && s.type !== "apartment") gaps.push({ area: "facts", message: "Plot size not supplied (feed value 0)." });

  for (const w of o.withheldDistances ?? []) gaps.push({ area: "consistency", message: `Supplied ${w.key} distance withheld: ${w.reason}` });
  for (const n of o.notes ?? []) gaps.push({ area: "consistency", message: n });
  return gaps;
}

async function runBuild() {
  const suppliedDir = path.join(dir, "supplied");
  const built: BuiltListing[] = [];
  for (const f of (await readdir(suppliedDir)).filter((f) => f.endsWith(".json"))) {
    const s: SuppliedListing = JSON.parse(await readFile(path.join(suppliedDir, f), "utf8"));
    const overlayFile = path.join(dir, "overlays", f);
    if (!existsSync(overlayFile)) {
      console.warn(`no overlay for ${s.source.providerRef}: skipped (classify its photos first)`);
      continue;
    }
    const o: ListingOverlay = JSON.parse(await readFile(overlayFile, "utf8"));
    built.push({
      slug: `${s.source.provider}-${s.source.providerRef.toLowerCase()}`,
      supplied: s,
      overlay: o,
      gaps: gapsFor(s, o),
      builtAt: new Date().toISOString(),
    });
  }
  await writeFile(path.join(dir, "stories.json"), JSON.stringify(built, null, 2));

  const lines = ["# Internal gap report (private preview — do not publish)", ""];
  for (const b of built) {
    lines.push(`## ${b.supplied.source.providerRef} · ${b.overlay.name.en}`, "");
    lines.push(`Source: ${b.supplied.source.feedName}, listing updated ${b.supplied.source.updatedAt}. Built ${b.builtAt}.`, "");
    const chapters = b.overlay.chapters.map((c) => c.kind).join(", ") || "none";
    lines.push(`Chapters shown: arrival, ${chapters}, facts, gallery (${b.supplied.images.length} images).`, "");
    for (const area of ["licence", "facts", "photos", "chapters", "area", "text", "consistency"] as const) {
      const items = b.gaps.filter((g) => g.area === area);
      if (!items.length) continue;
      lines.push(`**${area}**`, "", ...items.map((g) => `- ${g.message}`), "");
    }
  }
  await writeFile(path.join(dir, "gap-report.md"), lines.join("\n"));
  console.log(`built ${built.length} listing(s); gaps: ${built.map((b) => `${b.supplied.source.providerRef}=${b.gaps.length}`).join(", ")}`);
}

if (command === "import") await runImport();
else if (command === "build") await runBuild();
else {
  console.error("usage: preview.ts import|build --dir .private/… [--feed file --ref REF]");
  process.exit(1);
}
