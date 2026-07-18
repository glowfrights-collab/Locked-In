import "server-only";
import { prisma } from "@/lib/db";

export async function getAdminStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalProducts, unlocksToday, downloadsToday, activeReferrals] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.unlockProgress.count({
      where: { status: "COMPLETED", completedAt: { gte: startOfToday } },
    }),
    prisma.download.count({ where: { downloadedAt: { gte: startOfToday } } }),
    prisma.referral.count({ where: { status: "PENDING" } }),
  ]);

  return { totalProducts, unlocksToday, downloadsToday, activeReferrals };
}

export async function getRecentActivity(limit = 20) {
  const [downloads, referrals, unlocks] = await Promise.all([
    prisma.download.findMany({
      orderBy: { downloadedAt: "desc" },
      take: limit,
      include: { product: true },
    }),
    prisma.referral.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { product: true },
    }),
    prisma.unlockProgress.findMany({
      where: { status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      take: limit,
      include: { product: true },
    }),
  ]);
  return { downloads, referrals, unlocks };
}
