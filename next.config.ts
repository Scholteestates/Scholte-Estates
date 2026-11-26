import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
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
};

export default nextConfig;
