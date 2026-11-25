/**
 * Property data model.
 *
 * DEMO FIXTURES: the user has explicitly authorised clearly labelled,
 * fictional demo properties for the local preview (see CLAUDE.md). They
 * live only in src/data/demo-properties.json + public/images/demo and are
 * loaded through src/lib/properties/index.ts. Every demo record has
 * isDemo=true and available=false and must always be shown with a Demo
 * badge / notice. Turn them all off with `demoListings.enabled` in
 * src/config/features.ts.
 *
 * Real listings (CRM / property feed) will later implement this same shape.
 * Never present invented properties as real.
 */
import type { Locale } from "@/i18n/config";

export type PropertyType = "apartment" | "townhouse" | "villa" | "bungalow" | "plot";
export type PropertyCondition = "new-build" | "resale";
export type PoolType = "private" | "communal" | "none";
export type Localized<T = string> = Record<Locale, T>;

export type ImageKind = "original" | "kitchen" | "bedroom" | "bathroom" | "outdoor" | "neighbourhood";

export interface PropertyImage {
  src: string;
  alt: Localized;
  isAiGenerated?: boolean;
  kind?: ImageKind;
  /** Short, specific title for this view. */
  title?: Localized;
  /** Specific caption: what this view shows and why it matters. */
  caption?: Localized;
  /** Atmosphere only: not a real, named or verified nearby place. */
  isIllustrative?: boolean;
}

/**
 * One chapter of a property story (see docs/website-direction.md §4).
 * `image` is the `kind` of one of the property's own images, or
 * "neighbourhood" for its separately labelled illustrative setting.
 */
export interface StoryChapter {
  id: string;
  kind: ImageKind;
  heading: Localized;
  body: Localized;
  image: ImageKind;
}

/** What still needs checking before a real neighbourhood chapter is published. */
export interface AreaVerification {
  status: string;
  namedVenues: string[];
  verifiedNearbyAmenities: string[];
  toVerify: string[];
}

export interface Property {
  slug: string;
  reference: string;
  name: string;
  condition: PropertyCondition;
  type: PropertyType;
  town: string;
  area?: string;
  priceEur: number;
  currency: "EUR";
  bedrooms: number;
  bathrooms: number;
  builtAreaM2?: number;
  plotAreaM2?: number;
  terraceAreaM2?: number;
  pool: PoolType;
  seaView: boolean;
  title: Localized;
  description: Localized;
  features: Localized<string[]>;
  images: PropertyImage[];
  featured: boolean;
  /** Optional ordered story chapters (guided tour). */
  story?: StoryChapter[];
  /** Illustrative neighbourhood scene (atmosphere only, always labelled). */
  neighbourhood?: PropertyImage;
  areaVerification?: AreaVerification;
  /** True for fictional example records. Always label these in the UI. */
  isDemo: boolean;
  /** False for demo records: they are not for sale. */
  available: boolean;
  status: "demo" | "available" | "reserved" | "sold";
}

/** Future enquiry payload; to be handled server-side once a provider is chosen. */
export interface PropertyEnquiry {
  propertyReference?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale: Locale;
}

export interface PropertyFilters {
  town?: string;
  type?: PropertyType;
  maxPrice?: number;
  minBeds?: number;
  sort?: "price-asc" | "price-desc";
}
