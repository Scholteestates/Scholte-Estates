import "server-only";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import type { AreaProfile } from "./types";

const AREAS_DIR = path.join(process.cwd(), "src", "data", "areas");

/** Town / neighbourhood names (as used in listings) → area profile id. */
const AREA_FOR_PLACE: Record<string, string> = {
  "San Fulgencio": "san-fulgencio",
  "Ciudad Quesada": "ciudad-quesada",
  Rojales: "rojales",
  "Benijófar": "benijofar",
  Guardamar: "guardamar",
  "Guardamar del Segura": "guardamar",
  "Los Balcones": "los-balcones",
  "La Mata": "la-mata",
  "Playa Flamenca": "playa-flamenca",
  Campoamor: "campoamor",
  Finestrat: "finestrat",
  Altea: "altea",
};

export function getArea(id: string): AreaProfile | undefined {
  const file = path.join(AREAS_DIR, `${id}.json`);
  if (!existsSync(file)) return undefined;
  return JSON.parse(readFileSync(file, "utf8")) as AreaProfile;
}

export const getAreas = (): AreaProfile[] =>
  existsSync(AREAS_DIR)
    ? readdirSync(AREAS_DIR)
        .filter((f) => f.endsWith(".json"))
        .map((f) => getArea(f.replace(/\.json$/, "")))
        .filter((a): a is AreaProfile => Boolean(a))
    : [];

/**
 * The profile for a listing: tries the neighbourhood first, then the town.
 * Unapproved profiles are returned only on the local dev server.
 */
export function areaForPlace(...names: (string | undefined)[]): { area: AreaProfile; approved: boolean } | undefined {
  for (const name of names) {
    const id = name ? AREA_FOR_PLACE[name] : undefined;
    const area = id ? getArea(id) : undefined;
    if (!area || area.places.length === 0) continue;
    const approved = Boolean(area.approval.approvedBy);
    if (!approved && process.env.NODE_ENV === "production") return undefined;
    return { area, approved };
  }
  return undefined;
}

/** Straight-line distance in metres (haversine). */
export function distanceM(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
