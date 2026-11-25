import { demoListings } from "@/config/features";
import type { Property } from "./types";
import demoData from "@/data/demo-properties.json";

/**
 * Single entry point for property data. Today it serves the demo fixtures
 * (when enabled); later it will read from a CRM / property feed instead.
 */
const demoProperties = demoData.properties as unknown as Property[];

export const demoNotice = demoData.demoNotice;

export function getAllProperties(): Property[] {
  return demoListings.enabled ? demoProperties : [];
}

export const hasListings = () => getAllProperties().length > 0;

export function getFeaturedProperties(limit = 6): Property[] {
  return getAllProperties().filter((p) => p.featured).slice(0, limit);
}

export function getNewBuildProperties(): Property[] {
  return getAllProperties().filter((p) => p.condition === "new-build");
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return getAllProperties().find((p) => p.slug === slug);
}

export function getRelatedProperties(property: Property, limit = 3): Property[] {
  const others = getAllProperties().filter((p) => p.slug !== property.slug);
  const score = (p: Property) =>
    (p.condition === property.condition ? 2 : 0) +
    (p.type === property.type ? 1 : 0) -
    Math.abs(p.priceEur - property.priceEur) / 1_000_000;
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** Hero image: the first featured listing, or null (falls back to illustration). */
export function getHeroImage() {
  return getAllProperties()[0]?.images[0] ?? null;
}

/** A small set of bright images for the landing-page hero crossfade. */
export function getHeroImages(limit = 3) {
  const preferred = ["SE-DEMO-002", "SE-DEMO-009", "SE-DEMO-003"];
  const all = getAllProperties();
  const picked = preferred.map((ref) => all.find((p) => p.reference === ref)).filter((p): p is Property => Boolean(p));
  const rest = all.filter((p) => !picked.includes(p));
  return [...picked, ...rest].slice(0, limit).map((p) => p.images[0]).filter(Boolean);
}

/** Resolve a story chapter's image: one of the home's own views, or its illustrative setting. */
export function storyImage(p: Property, kind: string) {
  if (kind === "neighbourhood") return p.neighbourhood ?? null;
  return p.images.find((i) => i.kind === kind) ?? null;
}

/** The listing used for the landing-page property-story preview. */
export function getStoryProperty(): Property | undefined {
  return getAllProperties().find((p) => p.reference === "SE-DEMO-006") ?? getAllProperties().find((p) => p.story?.length);
}

export { filterProperties, getFilterOptions, priceSteps, bedroomSteps, formatPrice } from "./helpers";
export type { Property, PropertyFilters, PropertyImage, StoryChapter } from "./types";
