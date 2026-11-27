import "server-only";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { BuiltListing } from "./types";

/**
 * Private listing previews (local development only).
 *
 * Reads the stories built by scripts/listings/preview.mts from the git-ignored
 * /.private/listings/<dataset>/stories.json. The preview routes that use this
 * only exist on the local dev server (see next.config.ts), so provider sample
 * data can never reach a production build or the public site.
 */
export const PRIVATE_LISTINGS_DIR = path.join(process.cwd(), ".private", "listings");

export type PreviewListing = BuiltListing & { dataset: string };

export function getPreviewListings(): PreviewListing[] {
  if (!existsSync(PRIVATE_LISTINGS_DIR)) return [];
  return readdirSync(PRIVATE_LISTINGS_DIR).flatMap((dataset) => {
    const file = path.join(PRIVATE_LISTINGS_DIR, dataset, "stories.json");
    if (!existsSync(file)) return [];
    const built = JSON.parse(readFileSync(file, "utf8")) as BuiltListing[];
    return built.map((b) => ({ ...b, dataset }));
  });
}

export const getPreviewListing = (slug: string) => getPreviewListings().find((l) => l.slug === slug);

/** URL of a privately stored photo, served by the dev-only preview-media route. */
export const previewMediaUrl = (dataset: string, file: string) => `/preview-media/${dataset}/${file}`;
