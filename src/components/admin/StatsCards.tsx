import { Card } from "@/components/ui/Card";

export function StatsCards({
  stats,
}: {
  stats: { totalProducts: number; unlocksToday: number; downloadsToday: number; activeReferrals: number };
}) {
  const items = [
    { label: "Products", value: stats.totalProducts },
    { label: "Unlocks today", value: stats.unlocksToday },
    { label: "Downloads today", value: stats.downloadsToday },
    { label: "Active referrals", value: stats.activeReferrals },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} padding="md">
          <p className="text-2xl font-semibold text-ink">{item.value}</p>
          <p className="text-xs text-ink-soft">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}
