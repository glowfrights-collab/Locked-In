import { cn } from "@/lib/utils";

function Pulse({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-surface-muted", className)} />;
}

export function Skeleton({
  variant = "card",
  count = 1,
}: {
  variant?: "card" | "text" | "grid" | "row";
  count?: number;
}) {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <Pulse key={i} className="aspect-square rounded-2xl" />
        ))}
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <Pulse key={i} className="h-48 w-32 shrink-0 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <Pulse key={i} className="h-4 w-full max-w-xs" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Pulse key={i} className="h-40 w-full rounded-2xl" />
      ))}
    </div>
  );
}
