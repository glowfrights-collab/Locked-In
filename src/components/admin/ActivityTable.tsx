import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

type Entry = {
  id: string;
  label: string;
  productTitle: string;
  date: Date;
  tone: "neutral" | "success" | "pending";
};

export function ActivityTable({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-ink-soft">No activity yet.</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-surface-border rounded-2xl border border-surface-border">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-ink">{entry.productTitle}</span>
            <span className="text-xs text-ink-faint">{formatDate(entry.date)}</span>
          </div>
          <Badge tone={entry.tone}>{entry.label}</Badge>
        </li>
      ))}
    </ul>
  );
}
