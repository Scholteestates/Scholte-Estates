import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * Everything may be crawled, including the demo property pages: crawlers
 * must be able to read their `noindex` tag, so they are not disallowed here.
 * They are simply left out of the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
