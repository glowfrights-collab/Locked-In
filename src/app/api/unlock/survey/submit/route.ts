import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/session";
import { recordSurveyCompletion, recomputeProductStatus } from "@/lib/unlock/progress";
import { logEvent } from "@/lib/analytics";
import { surveySubmitSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = surveySubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { productId, answers } = parsed.data;

  const requirement = await prisma.unlockRequirement.findUnique({
    where: { productId_method: { productId, method: "SURVEY" } },
  });
  if (!requirement || !requirement.enabled) {
    return NextResponse.json(
      { error: "This product does not offer the survey unlock method" },
      { status: 400 }
    );
  }

  const user = await getOrCreateSessionUser();
  const { progress, methodJustCompleted, productJustUnlocked } = await recordSurveyCompletion(
    user.id,
    productId,
    answers
  );

  if (methodJustCompleted) {
    logEvent("SURVEY_COMPLETED", { userId: user.id, productId });
  }
  if (productJustUnlocked) {
    logEvent("PRODUCT_UNLOCKED", { userId: user.id, productId, metadata: { method: "SURVEY" } });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { unlockRequirements: { where: { enabled: true } } },
  });
  const { status: productStatus, methods } = await recomputeProductStatus(
    user.id,
    productId,
    product?.unlockRequirements ?? [{ method: "SURVEY", targetCount: 1 }]
  );

  return NextResponse.json({ progress, productStatus, methods });
}
