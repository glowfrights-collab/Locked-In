import "server-only";
import { prisma } from "@/lib/db";
import type {
  ProductUnlockStatus,
  UnlockMethod,
  UnlockMethodProgress,
} from "@/lib/types";

type Requirement = { method: string; targetCount: number };

/**
 * Derives the overall product unlock status for a user (or an anonymous
 * visitor with no User row yet) from the enabled UnlockRequirements and any
 * existing UnlockProgress rows. Never writes anything — safe to call from
 * read-only pages.
 */
export async function recomputeProductStatus(
  userId: string | null,
  productId: string,
  requirements: Requirement[]
): Promise<{ status: ProductUnlockStatus; methods: UnlockMethodProgress[] }> {
  const progressRows = userId
    ? await prisma.unlockProgress.findMany({ where: { userId, productId } })
    : [];

  const progressByMethod = new Map(progressRows.map((r) => [r.method, r]));

  const methods: UnlockMethodProgress[] = requirements.map((req) => {
    const existing = progressByMethod.get(req.method);
    return {
      method: req.method as UnlockMethod,
      enabled: true,
      currentCount: existing?.currentCount ?? 0,
      targetCount: existing?.targetCount ?? req.targetCount,
      status: (existing?.status as "PENDING" | "COMPLETED") ?? "PENDING",
    };
  });

  const status: ProductUnlockStatus = methods.some((m) => m.status === "COMPLETED")
    ? "Unlocked"
    : methods.some((m) => m.currentCount > 0)
      ? "InProgress"
      : "Locked";

  return { status, methods };
}

/**
 * Shared "advance progress toward a method's target" primitive used by the ad
 * route, the survey route, and referral completion. Upserts the
 * UnlockProgress row (snapshotting targetCount on first creation), increments
 * currentCount, and flips it to COMPLETED once the target is reached.
 * Returns whether this call is what completed the method, and whether it's
 * what completed the *whole product* (first method to reach COMPLETED).
 */
export async function incrementProgress(
  userId: string,
  productId: string,
  method: UnlockMethod,
  incrementBy: number,
  targetCountFallback: number
): Promise<{
  progress: UnlockMethodProgress;
  methodJustCompleted: boolean;
  productJustUnlocked: boolean;
}> {
  const priorRows = await prisma.unlockProgress.findMany({ where: { userId, productId } });
  const existing = priorRows.find((r) => r.method === method);

  // Was the product already unlocked via any method before this call?
  const wasUnlocked = priorRows.some((r) => r.status === "COMPLETED");

  const targetCount = existing?.targetCount ?? targetCountFallback;
  const newCount = Math.min((existing?.currentCount ?? 0) + incrementBy, targetCount);
  const willComplete = newCount >= targetCount;
  const wasAlreadyComplete = existing?.status === "COMPLETED";

  const row = await prisma.unlockProgress.upsert({
    where: { userId_productId_method: { userId, productId, method } },
    update: {
      currentCount: newCount,
      status: willComplete ? "COMPLETED" : "PENDING",
      completedAt: willComplete && !wasAlreadyComplete ? new Date() : existing?.completedAt,
    },
    create: {
      userId,
      productId,
      method,
      currentCount: newCount,
      targetCount,
      status: willComplete ? "COMPLETED" : "PENDING",
      completedAt: willComplete ? new Date() : null,
    },
  });

  const methodJustCompleted = willComplete && !wasAlreadyComplete;

  return {
    progress: {
      method,
      enabled: true,
      currentCount: row.currentCount,
      targetCount: row.targetCount,
      status: row.status as "PENDING" | "COMPLETED",
    },
    methodJustCompleted,
    productJustUnlocked: methodJustCompleted && !wasUnlocked,
  };
}

export async function recordAdView(userId: string, productId: string, targetCount: number) {
  const existing = await prisma.unlockProgress.findUnique({
    where: { userId_productId_method: { userId, productId, method: "AD" } },
  });
  const sequenceNumber = (existing?.currentCount ?? 0) + 1;

  await prisma.adCompletion.create({
    data: { userId, productId, sequenceNumber },
  });

  return incrementProgress(userId, productId, "AD", 1, targetCount);
}

export async function recordSurveyCompletion(
  userId: string,
  productId: string,
  answers: Record<string, string>
) {
  await prisma.surveyCompletion.create({
    data: { userId, productId, responsePayload: JSON.stringify(answers) },
  });

  // Survey targetCount is always 1 in the MVP.
  return incrementProgress(userId, productId, "SURVEY", 1, 1);
}
