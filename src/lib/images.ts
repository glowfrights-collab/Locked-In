/** Deterministic placeholder image URL — same seed always returns the same image. */
export function seededImageUrl(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

// Used for small grid tiles (ProductCard) — square (1:1).
export const PREVIEW_WIDTH = 2250;
export const PREVIEW_HEIGHT = 2250;

// Used for large hero images (product page, unlocked page, full-screen
// preview modal) — square (1:1), sized well above typical retina display
// needs so the picsum placeholder isn't upscaled (blurry).
export const DOWNLOAD_WIDTH = 3240;
export const DOWNLOAD_HEIGHT = 3240;

/**
 * `previewImageSeed` (and a ProductFile's `seed`) can be one of three things:
 *  - a path under /public, e.g. "/products/my-wallpaper.jpg" — your own file
 *  - a full "http(s)://" URL — an image hosted anywhere else
 *  - a plain string — treated as a picsum.photos seed (the seed data default)
 *
 * `unoptimized: true` skips Next's image optimizer entirely, serving the
 * original file byte-for-byte instead of a viewport/DPR-sized derivative.
 * This is on for your own local files and other remote URLs so they always
 * render at full native resolution — the tradeoff is a bigger download than
 * a resized version would need, so keep uploaded files reasonably sized.
 */
export function resolveImageSource(
  seed: string,
  width: number,
  height: number
): { src: string; unoptimized: boolean } {
  if (/^https?:\/\//i.test(seed)) {
    return { src: seed, unoptimized: !seed.includes("picsum.photos") };
  }
  if (seed.startsWith("/")) {
    return { src: seed, unoptimized: true };
  }
  return { src: seededImageUrl(seed, width, height), unoptimized: false };
}
