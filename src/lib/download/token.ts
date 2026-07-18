import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_SECONDS = 5 * 60;

type TokenPayload = {
  userId: string;
  productId: string;
  /** If set, only this single file is served; otherwise all download files for the product (bundled as a zip if there are multiple). */
  fileId?: string;
  exp: number; // unix seconds
};

function getSecret(): string {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!secret) throw new Error("DOWNLOAD_TOKEN_SECRET is not set");
  return secret;
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function mintDownloadToken(payload: Omit<TokenPayload, "exp">): string {
  const full: TokenPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS };
  const encoded = Buffer.from(JSON.stringify(full)).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyDownloadToken(token: string): TokenPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expectedSignature = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as TokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
