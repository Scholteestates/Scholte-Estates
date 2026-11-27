import { readFile } from "node:fs/promises";
import path from "node:path";
import { PRIVATE_LISTINGS_DIR } from "@/lib/listings/preview-source";

/**
 * Serves privately stored listing photos to the local preview.
 * The `.preview.ts` extension means this route only exists on the local dev
 * server (next.config.ts); it is never part of a production build.
 */
const TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  const file = path.resolve(PRIVATE_LISTINGS_DIR, ...parts);
  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type || !file.startsWith(PRIVATE_LISTINGS_DIR + path.sep) || !parts.includes("images")) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const body = await readFile(file);
    return new Response(new Uint8Array(body), { headers: { "content-type": type, "cache-control": "no-store", "x-robots-tag": "noindex" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
