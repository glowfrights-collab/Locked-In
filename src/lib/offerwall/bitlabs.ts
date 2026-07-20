import "server-only";
import { createHmac } from "crypto";

/**
 * BitLabs signs each callback as HEX-encoded HMAC-SHA1 of the full callback
 * URL (minus the `hash` param itself) using the App Secret. `url` must be
 * the exact, unmodified URL string BitLabs called (no re-encoding/decoding —
 * that changes the result), with `hash` stripped before hashing.
 */
export function verifyBitlabsCallback(url: URL, hash: string): boolean {
  const secret = process.env.BITLABS_APP_SECRET;
  if (!secret) throw new Error("BITLABS_APP_SECRET is not set");

  const stripped = new URL(url.toString());
  stripped.searchParams.delete("hash");
  const expected = createHmac("sha1", secret).update(stripped.toString()).digest("hex");
  return expected === hash;
}

export function getBitlabsAppToken(): string {
  const token = process.env.BITLABS_APP_TOKEN;
  if (!token) throw new Error("BITLABS_APP_TOKEN is not set");
  return token;
}

/**
 * Builds the BitLabs offerwall URL for a given user + product. `product_id`
 * is a custom param — BitLabs echoes any custom param present on this URL
 * back on every callback for this session, so we don't need a macro for it
 * in the dashboard callback template.
 */
export function buildBitlabsOfferwallUrl(userId: string, productId: string): string {
  const token = getBitlabsAppToken();
  const params = new URLSearchParams({
    uid: userId,
    token,
    product_id: productId,
  });
  return `https://web.bitlabs.ai/?${params.toString()}`;
}
