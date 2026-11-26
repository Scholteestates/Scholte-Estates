import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";

/**
 * Genuine business pages only, in both languages with hreflang alternates.
 * Fictional demo property pages are deliberately excluded (they are noindex).
 * When real listings exist, add their detail pages here (never demo records).
 */
const PAGES = ["", "/properties", "/services", "/costa-blanca", "/how-we-help", "/contact", "/legal-notice", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/legal-notice" || path === "/privacy" ? 0.3 : 0.7,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [l, `${site.url}/${l}${path}`]),
          ["x-default", `${site.url}/en${path}`],
        ]),
      },
    })),
  );
}
