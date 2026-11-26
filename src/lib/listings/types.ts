/**
 * Real-listing data model (Phase 1, docs/real-listings-plan.md §7).
 *
 * Three layers, kept apart so a feed update never overwrites our own work:
 *  1. SuppliedListing  — what the provider's feed says, normalised, never edited.
 *  2. ListingOverlay   — our photo classification, captions and chapter texts.
 *  3. BuiltListing     — the merge of both: supported chapters only, plus a gap
 *                        report for everything still missing (internal only).
 *
 * Provider data stays private until the provider's terms allow publication:
 * sample/trial feeds are only processed into the git-ignored /.private folder.
 * Type-only module (no runtime code) so plain Node scripts can import it.
 */

export type Lang = "en" | "es";
export type Text = Record<Lang, string>;

export type Provider = "redsp" | "mlscosta" | "own";

export interface ListingSource {
  provider: Provider;
  /** Provider's reference shown on its listing, e.g. "N8791". */
  providerRef: string;
  /** Provider's internal id. */
  providerId: string;
  /** Last-change date stated in the feed. */
  updatedAt: string;
  /** When we read the feed. */
  feedReadAt: string;
  /** Name of the feed, e.g. "RedSP public trial feed (Kyero v3)". */
  feedName: string;
  /** Licence check: null until the provider's terms are read and recorded. */
  licence: { clause: string; checkedAt: string; conditions: string[] } | null;
}

export interface SuppliedImage {
  /** Position in the feed (1-based). */
  id: number;
  url: string;
  /** Local file (private preview only), relative to the listing folder. */
  file?: string;
  tags: string[];
}

/** A provider "nearby" figure, e.g. "Beach: 7000 Meters". Never verified by us. */
export interface SuppliedDistance {
  key: string;
  label: Text;
  metres: number;
}

export interface SuppliedListing {
  source: ListingSource;
  condition: "new-build" | "resale";
  type: string;
  /** Provider's own type word, e.g. "Bungalow". */
  typeSupplied: string;
  town: string;
  province: string;
  locationDetail?: string;
  coordinates?: { lat: number; lng: number };
  priceEur: number;
  bedrooms: number;
  bathrooms: number;
  builtM2?: number;
  usefulM2?: number;
  plotM2?: number;
  terraceM2?: number;
  pool: "private" | "communal" | "none";
  parkingSpaces?: number;
  energy?: { consumption: string; emissions: string };
  /** Description per language, as supplied (paragraphs, entities decoded). */
  description: Partial<Record<Lang, string[]>>;
  /** Features we could translate, plus the raw strings we could not. */
  features: Text[];
  untranslatedFeatures: string[];
  distances: SuppliedDistance[];
  images: SuppliedImage[];
  /** Data the feed does not provide (VAT, completion date, availability…). */
  notSupplied: string[];
}

export type PhotoRoom =
  | "exterior"
  | "living"
  | "kitchen"
  | "bedroom"
  | "bathroom"
  | "terrace"
  | "garden"
  | "communal"
  | "view"
  | "floorplan"
  | "other";

/** What an image is: a photograph, a computer-generated render, a drawing (floor plan), or unclear. */
export type PhotoOrigin = "photo" | "render" | "drawing" | "unclear";

export interface PhotoClassification {
  id: number;
  room: PhotoRoom;
  origin: PhotoOrigin;
  /** True when the image shows a show home / another unit of the development. */
  otherUnit?: boolean;
  /** True for a drawing (e.g. floor plan) the feed does not link to this exact unit: shown as an example only. */
  example?: boolean;
  alt: Text;
  caption: Text;
}

export type ChapterKind = "living" | "kitchen" | "bedroom" | "bathroom" | "outdoor";

export interface OverlayChapter {
  kind: ChapterKind;
  /** Photo id from the classification. */
  image: number;
  heading: Text;
  body: Text;
}

export interface VerifiedPlace {
  name: string;
  category: string;
  sourceUrl: string;
  verifiedAt: string;
  verifiedBy: string;
  distanceKm?: number;
  method?: string;
}

export interface ListingOverlay {
  providerRef: string;
  /** Our name and one-line summary, written from the supplied facts. */
  name: Text;
  summary: Text;
  cover: number;
  classification: {
    by: string;
    at: string;
    /** Null until a person has checked every classification. */
    reviewedBy: string | null;
    photos: PhotoClassification[];
  };
  chapters: OverlayChapter[];
  /** Verified area chapter; omitted entirely until places are verified. */
  area?: { heading: Text; body: Text; places: VerifiedPlace[] };
  /** Supplied distances we hold back (e.g. contradicted elsewhere in the feed). */
  withheldDistances?: { key: string; reason: string }[];
  notes?: string[];
}

export interface Gap {
  area: "photos" | "chapters" | "facts" | "text" | "area" | "licence" | "consistency";
  message: string;
}

export interface BuiltListing {
  slug: string;
  supplied: SuppliedListing;
  overlay: ListingOverlay;
  gaps: Gap[];
  builtAt: string;
}
