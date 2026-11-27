/**
 * Verified area profiles (docs/website-direction.md §4, "Places nearby").
 *
 * One profile per town or neighbourhood, reused by every property there.
 * Every place was checked against a current source (official website or
 * official listing) on `verifiedAt`; coordinates come from OpenStreetMap.
 * A profile appears on the public site only once the user has approved it
 * (`approval.approvedBy`); until then it shows on the local dev server only.
 */

export type PlaceCategory =
  | "cafe"
  | "restaurant"
  | "bar"
  | "school"
  | "shop"
  | "market"
  | "health"
  | "beach"
  | "nature"
  | "park"
  | "golf"
  | "sport"
  | "transport"
  | "culture";

export interface AreaPlace {
  name: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  /** OpenStreetMap element, e.g. "node/123". */
  osm: string;
  /** The page that confirmed the place exists and operates. */
  sourceUrl: string;
  sourceType: string;
  verifiedAt: string;
  note: { en: string; es: string };
}

export interface AreaProfile {
  id: string;
  name: string;
  centre: { lat: number; lng: number; source: string };
  radiusM: number;
  places: AreaPlace[];
  rejected?: { name: string; reason: string }[];
  /** Who checked the places (research method), and the user's approval. */
  research: { by: string; method: string };
  approval: { approvedBy: string | null; approvedAt: string | null };
}
