import { getRecentActivity } from "@/lib/admin-stats";
import { ActivityTable } from "@/components/admin/ActivityTable";

export default async function AdminActivityPage() {
  const { downloads, referrals, unlocks } = await getRecentActivity();

  const entries = [
    ...downloads.map((d) => ({
      id: `download-${d.id}`,
      label: "Downloaded",
      productTitle: d.product.title,
      date: d.downloadedAt,
      tone: "neutral" as const,
    })),
    ...referrals.map((r) => ({
      id: `referral-${r.id}`,
      label: r.status === "COMPLETED" ? "Referral completed" : r.status === "REJECTED" ? "Referral rejected" : "Referral pending",
      productTitle: r.product.title,
      date: r.createdAt,
      tone: r.status === "COMPLETED" ? ("success" as const) : ("pending" as const),
    })),
    ...unlocks.map((u) => ({
      id: `unlock-${u.id}`,
      label: `Unlocked via ${u.method}`,
      productTitle: u.product.title,
      date: u.completedAt ?? u.updatedAt,
      tone: "success" as const,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">Activity</h1>
      <ActivityTable entries={entries} />
    </div>
  );
}
