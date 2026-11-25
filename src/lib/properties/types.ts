/**
 * Placeholder types for a future property listings stage.
 *
 * Not used yet. Listings, individual property pages (planned route:
 * /[lang]/properties/[slug]), a CRM or property feed and enquiry handling
 * are later stages. Do not add example or invented properties here.
 */
import type { Locale } from "@/i18n/config";

export type PropertyType = "apartment" | "townhouse" | "villa" | "bungalow" | "plot";
export type PropertyCondition = "new-build" | "resale";

export interface Property {
  slug: string;
  reference: string;
  condition: PropertyCondition;
  type: PropertyType;
  town: string;
  priceEur: number;
  bedrooms: number;
  bathrooms: number;
  builtAreaM2?: number;
  plotAreaM2?: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  images: { src: string; alt: Record<Locale, string> }[];
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
