// Copies MapLibre's web worker next to the map assets so it is served from our
// own domain (bundlers do not pick it up automatically). Runs before dev/build.
import { copyFileSync, mkdirSync } from "node:fs";
mkdirSync("public/map", { recursive: true });
copyFileSync("node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", "public/map/maplibre-gl-worker.mjs");
