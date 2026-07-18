import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/session";
import { recordAdView, recomputeProductStatus } from "@/lib/unlock/progress";
import { logEvent } from "@/lib/analytics";
import { productIdSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = productIdSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { productId } = parsed.data;

  const requirement = await prisma.unlockRequirement.findUnique({
    where: { productId_method: { productId, method: "AD" } },
  });
  if (!requirement || !requirement.enabled) {
    return NextResponse.json(
      { error: "This product does not offer the ad unlock method" },
      { status: 400 }
    );
  }

  const user = await getOrCreateSessionUser();
  const { progress, methodJustCompleted, productJustUnlocked } = await recordAdView(
    user.id,
    productId,
    requirement.targetCount
  );

  if (methodJustCompleted) {
    logEvent("AD_COMPLETED", { userId: user.id, productId });
  }
  if (productJustUnlocked) {
    logEvent("PRODUCT_UNLOCKED", { userId: user.id, productId, metadata: { method: "AD" } });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { unlockRequirements: { where: { enabled: true } } },
  });
  const { status: productStatus, methods } = await recomputeProductStatus(
    user.id,
    productId,
    product?.unlockRequirements ?? [{ method: "AD", targetCount: requirement.targetCount }]
  );

  return NextResponse.json({ progress, productStatus, methods });
}
