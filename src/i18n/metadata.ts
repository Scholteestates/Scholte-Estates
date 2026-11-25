import type { Metadata } from "next";
import { site } from "@/config/site";
import { locales, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

export function pageMetadata(locale: Locale, dict: Dictionary, path: string, title?: string): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`]));
  return {
    title: title ? `${title} | ${site.name}` : dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ...languages, "x-default": `/en${path}` },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: locale === "es" ? "es_ES" : "en_GB",
      title: title ? `${title} | ${site.name}` : dict.meta.title,
      description: dict.meta.description,
      url: `/${locale}${path}`,
    },
  };
}
