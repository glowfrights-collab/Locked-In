import { Button } from "@/components/ui/Button";

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  retryHref,
}: {
  title?: string;
  description?: string;
  retryHref?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-surface-border px-6 py-12 text-center">
      <p className="text-base font-medium text-ink">{title}</p>
      <p className="max-w-xs text-sm text-ink-soft">{description}</p>
      {retryHref && (
        <Button href={retryHref} size="md" variant="secondary" className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
