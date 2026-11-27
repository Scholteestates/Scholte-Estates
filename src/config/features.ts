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

/**
 * Amanda website chat (AIVENA's standard iframe embed, see the
 * `aivena-website-chat` notes in CLAUDE.md).
 *
 * On only where AIVENA has allowed the origin. Today that is the integration
 * pull request's Netlify deploy preview (Netlify sets CONTEXT at build time).
 * Production stays off until AIVENA's release plan allows
 * https://scholteestates.com; then set `production` to true in a release PR.
 */
export const amandaChat = {
  production: false,
  /** AIVENA chat host and the agency's slug (fixed when AIVENA staff create the agency). */
  host: "https://aivena-production.up.railway.app",
  slug: "scholte-estates",
  /** Brand colour passed to the widget (forest). */
  color: "#1c3729",
} as const;

export function amandaChatEnabled(): boolean {
  const context = process.env.CONTEXT; // Netlify: "production" | "deploy-preview" | "branch-deploy" | undefined locally
  if (context === "deploy-preview") return true;
  if (context === "production") return amandaChat.production;
  return process.env.AMANDA_CHAT === "1"; // local check only; localhost is not an allowed origin
}
