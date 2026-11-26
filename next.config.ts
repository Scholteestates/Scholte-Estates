import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (phase: string): NextConfig => ({
  // Private listing previews (`page.preview.tsx`, `route.preview.ts`) exist only
  // on the local dev server; production builds never contain them.
  pageExtensions: phase === PHASE_DEVELOPMENT_SERVER ? ["tsx", "ts", "preview.tsx", "preview.ts"] : ["tsx", "ts"],
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // A single branded 404 for every unmatched URL (root layout is under [lang]).
    globalNotFound: true,
  },
  images: {
    // 90 is used for the logo so its fine lettering stays crisp.
    qualities: [75, 90],
    // A short list of widths keeps the number of image variants (and the
    // hosting image-transformation allowance) small; the source files are
    // 1672 px wide, so nothing larger is ever needed.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [96, 256, 384],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
});

export default nextConfig;
