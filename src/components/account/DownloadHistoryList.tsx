import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

type DownloadEntry = {
  id: string;
  downloadedAt: Date;
  product: { slug: string; title: string };
};

export function DownloadHistoryList({ downloads }: { downloads: DownloadEntry[] }) {
  if (downloads.length === 0) {
    return (
      <EmptyState
        title="No downloads yet"
        description="Downloaded files will show up here."
      />
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-surface-border rounded-2xl border border-surface-border">
      {downloads.map((d) => (
        <li key={d.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href={`/product/${d.product.slug}`} className="text-sm font-medium text-ink">
            {d.product.title}
          </Link>
          <span className="text-xs text-ink-faint">{formatDate(d.downloadedAt)}</span>
        </li>
      ))}
    </ul>
  );
}
