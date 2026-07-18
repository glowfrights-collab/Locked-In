import "server-only";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/db";

// Unambiguous alphabet (no 0/O/1/I/l) since codes get typed/shared as text.
const nanoid = customAlphabet("23456789ABCDEFGHJKMNPQRSTUVWXYZ", 8);

export async function generateReferralCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = nanoid();
    const existing = await prisma.referral.findUnique({ where: { code } });
    if (!existing) return code;
  }
  throw new Error("Could not generate a unique referral code");
}
