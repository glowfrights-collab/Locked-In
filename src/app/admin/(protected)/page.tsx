import Link from "next/link";
import { getAdminStats } from "@/lib/admin-stats";
import { StatsCards } from "@/components/admin/StatsCards";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="flex flex-col gap-6">
      <StatsCards stats={stats} />
      <div className="flex gap-3">
        <Link
          href="/admin/products/new"
          className="h-11 rounded-full bg-ink px-5 text-sm font-medium leading-[44px] text-white"
        >
          Add product
        </Link>
        <Link
          href="/admin/products"
          className="h-11 rounded-full border border-surface-border px-5 text-sm font-medium leading-[44px] text-ink"
        >
          Manage products
        </Link>
      </div>
    </div>
  );
}
