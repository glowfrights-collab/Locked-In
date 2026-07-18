import "server-only";
import { prisma } from "@/lib/db";
import { toProductSummary } from "@/lib/products";
import type { Prisma } from "@prisma/client";

const summaryInclude = {
  categories: { include: { category: true } },
  unlockRequirements: { where: { enabled: true } },
} satisfies Prisma.ProductInclude;

export async function getSavedProductSummaries(userId: string) {
  const saved = await prisma.savedProduct.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { product: { include: summaryInclude } },
  });
  return saved.map((s) => toProductSummary(s.product));
}

export async function getUnlockedProductSummaries(userId: string) {
  const completed = await prisma.unlockProgress.findMany({
    where: { userId, status: "COMPLETED" },
    distinct: ["productId"],
    orderBy: { completedAt: "desc" },
    include: { product: { include: summaryInclude } },
  });
  return completed.map((p) => toProductSummary(p.product));
}

export async function getDownloadHistory(userId: string) {
  return prisma.download.findMany({
    where: { userId },
    orderBy: { downloadedAt: "desc" },
    include: { product: true },
  });
}

export async function getReferralsForUser(userId: string) {
  return prisma.referral.findMany({
    where: { referrerUserId: userId },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });
}
