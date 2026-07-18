import { Skeleton } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div className="flex flex-col items-center gap-3">
        <Skeleton variant="text" count={2} />
        <div className="h-11 w-40 animate-pulse rounded-full bg-surface-muted" />
      </div>
      <Skeleton variant="row" count={4} />
      <Skeleton variant="row" count={4} />
      <Skeleton variant="grid" count={4} />
    </div>
  );
}
