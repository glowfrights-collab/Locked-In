import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/session";
import { generateReferralCode } from "@/lib/referral/code";
import { productIdSchema } from "@/lib/validation";

function buildShareUrl(code: string): string {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${origin}/r/${code}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = productIdSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { productId } = parsed.data;

  const requirement = await prisma.unlockRequirement.findUnique({
    where: { productId_method: { productId, method: "REFERRAL" } },
  });
  if (!requirement || !requirement.enabled) {
    return NextResponse.json(
      { error: "This product does not offer the referral unlock method" },
      { status: 400 }
    );
  }

  const user = await getOrCreateSessionUser();

  const existing = await prisma.referral.findUnique({
    where: { referrerUserId_productId: { referrerUserId: user.id, productId } },
  });
  if (existing) {
    return NextResponse.json({
      code: existing.code,
      shareUrl: buildShareUrl(existing.code),
      referralStatus: existing.status,
    });
  }

  const code = await generateReferralCode();
  const referral = await prisma.referral.create({
    data: { code, productId, referrerUserId: user.id },
  });

  return NextResponse.json({
    code: referral.code,
    shareUrl: buildShareUrl(referral.code),
    referralStatus: referral.status,
  });
}
