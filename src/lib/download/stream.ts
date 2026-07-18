import "server-only";
import { readFile } from "fs/promises";
import path from "path";
import { seededImageUrl } from "@/lib/images";

const EXT_CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function contentTypeToExtension(contentType: string): string {
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("gif")) return ".gif";
  return ".jpg";
}

/**
 * Resolves a single file's bytes, matching the same three seed forms as
 * resolveImageSource (see lib/images.ts):
 *  - "/products/foo.jpg"  -> read from disk under /public
 *  - "https://..."        -> fetch from that URL server-side
 *  - anything else        -> picsum.photos placeholder (the seed data default)
 *
 * In production, swap the local-file branch for a Supabase Storage signed-URL
 * fetch (see DEPLOYMENT.md).
 */
export async function fetchFileBytes(
  seed: string,
  width: number,
  height: number
): Promise<{ buffer: Buffer; contentType: string; extension: string }> {
  if (seed.startsWith("/")) {
    const filePath = path.join(process.cwd(), "public", seed);
    const buffer = await readFile(filePath);
    const ext = path.extname(seed).toLowerCase() || ".jpg";
    return {
      buffer,
      contentType: EXT_CONTENT_TYPES[ext] ?? "application/octet-stream",
      extension: ext,
    };
  }

  const url = /^https?:\/\//i.test(seed) ? seed : seededImageUrl(seed, width, height);
  const upstream = await fetch(url);
  if (!upstream.ok) {
    throw new Error(`Failed to fetch downloadable file for seed "${seed}"`);
  }
  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  return {
    buffer: Buffer.from(await upstream.arrayBuffer()),
    contentType,
    extension: contentTypeToExtension(contentType),
  };
}

/** Wraps a Buffer as a ReadableStream so it can be used as a Response body. */
export function bufferToStream(buffer: Buffer): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(buffer));
      controller.close();
    },
  });
}
