import "server-only";
import { createHash } from "crypto";
import { prisma } from "@/lib/db";

/**
 * Coarse, best-effort device signal — a hash of User-Agent + Accept-Language.
 * NOT a real device fingerprint: collides across many real distinct devices
 * that share common headers, and is trivially spoofable. Documented as a weak
 * heuristic in README.md, not a security boundary.
 */
export function computeFingerprint(request: Request): string {
  const ua = request.headers.get("user-agent") ?? "";
  const lang = request.headers.get("accept-language") ?? "";
  return createHash("sha256").update(`${ua}::${lang}`).digest("hex");
}

export function isSelfReferral(referrerUserId: string, visitorUserId: string): boolean {
  return referrerUserId === visitorUserId;
}

/**
 * Flags (does not perfectly block) a visitor whose device fingerprint already
 * shows up on another COMPLETED referral for the same referrer — i.e. the
 * same referrer appears to be "referring" the same device repeatedly.
 */
export async function isSuspiciousDevice(
  referrerUserId: string,
  fingerprint: string
): Promise<boolean> {
  const match = await prisma.referral.findFirst({
    where: {
      referrerUserId,
      referredSessionFingerprint: fingerprint,
      status: "COMPLETED",
    },
  });
  return match !== null;
}
