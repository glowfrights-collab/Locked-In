import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

type ReferralEntry = {
  id: string;
  status: string;
  createdAt: Date;
  product: { slug: string; title: string };
};

export function ReferralList({ referrals }: { referrals: ReferralEntry[] }) {
  if (referrals.length === 0) {
    return (
      <EmptyState
        title="No referrals yet"
        description="Share a referral link from any product page to see it here."
      />
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-surface-border rounded-2xl border border-surface-border">
      {referrals.map((r) => (
        <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-col">
            <Link href={`/product/${r.product.slug}`} className="text-sm font-medium text-ink">
              {r.product.title}
            </Link>
            <span className="text-xs text-ink-faint">{formatDate(r.createdAt)}</span>
          </div>
          <Badge tone={r.status === "COMPLETED" ? "success" : r.status === "REJECTED" ? "neutral" : "pending"}>
            {r.status === "COMPLETED" ? "Completed" : r.status === "REJECTED" ? "Inactive" : "Pending"}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
