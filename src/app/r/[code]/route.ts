import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/session";
import { computeFingerprint, isSelfReferral, isSuspiciousDevice } from "@/lib/referral/abuse";
import { incrementProgress } from "@/lib/unlock/progress";
import { logEvent } from "@/lib/analytics";

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const origin = new URL(request.url).origin;
  const referral = await prisma.referral.findUnique({
    where: { code: params.code },
    include: { product: true },
  });

  if (!referral || !referral.product.isActive) {
    return NextResponse.redirect(new URL("/", origin));
  }

  const visitor = await getOrCreateSessionUser();
  const productUrl = new URL(`/product/${referral.product.slug}`, origin);

  // Link already used (completed or rejected) — no-op, don't reprocess.
  if (referral.referredUserId) {
    return NextResponse.redirect(productUrl);
  }

  // Referrer opening their own link is ignored entirely — no state change,
  // so the link remains valid for an actual friend to use later.
  if (isSelfReferral(referral.referrerUserId, visitor.id)) {
    return NextResponse.redirect(productUrl);
  }

  const fingerprint = computeFingerprint(request);
  const suspicious = await isSuspiciousDevice(referral.referrerUserId, fingerprint);

  if (suspicious) {
    await prisma.referral.update({
      where: { id: referral.id },
      data: {
        referredUserId: visitor.id,
        referredSessionFingerprint: fingerprint,
        actionCompleted: true,
        status: "REJECTED",
        completedAt: new Date(),
      },
    });
    return NextResponse.redirect(productUrl);
  }

  const requirement = await prisma.unlockRequirement.findUnique({
    where: { productId_method: { productId: referral.productId, method: "REFERRAL" } },
  });

  await prisma.referral.update({
    where: { id: referral.id },
    data: {
      referredUserId: visitor.id,
      referredSessionFingerprint: fingerprint,
      actionCompleted: true,
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  const { productJustUnlocked } = await incrementProgress(
    referral.referrerUserId,
    referral.productId,
    "REFERRAL",
    1,
    requirement?.targetCount ?? 1
  );

  await prisma.referral.update({
    where: { id: referral.id },
    data: { referrerCredited: true },
  });

  logEvent("REFERRAL_COMPLETED", {
    userId: referral.referrerUserId,
    productId: referral.productId,
  });
  if (productJustUnlocked) {
    logEvent("PRODUCT_UNLOCKED", {
      userId: referral.referrerUserId,
      productId: referral.productId,
      metadata: { method: "REFERRAL" },
    });
  }

  productUrl.searchParams.set("ref", "welcome");
  return NextResponse.redirect(productUrl);
}
