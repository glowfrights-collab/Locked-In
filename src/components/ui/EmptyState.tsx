import { Button } from "@/components/ui/Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-border px-6 py-12 text-center">
      <p className="text-base font-medium text-ink">{title}</p>
      {description && <p className="max-w-xs text-sm text-ink-soft">{description}</p>}
      {actionLabel && actionHref && (
        <Button href={actionHref} size="md" variant="secondary" className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
