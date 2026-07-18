import { Skeleton } from "@/components/ui/Skeleton";

export default function ExploreLoading() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="h-12 animate-pulse rounded-full bg-surface-muted" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-surface-muted" />
        ))}
      </div>
      <Skeleton variant="grid" count={6} />
    </div>
  );
}
