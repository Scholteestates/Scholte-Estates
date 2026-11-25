/**
 * Demo listings switch.
 *
 * `true`  — show the ten fictional, clearly labelled demo properties
 *           (authorised for the local preview only).
 * `false` — remove every demo fixture from the site: hero image, featured
 *           and new-build carousels, the property browser and detail pages.
 *
 * Set this to false (or replace the data source) before any public launch.
 */
export const demoListings = {
  enabled: true,
} as const;
