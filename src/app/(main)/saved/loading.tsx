import { Skeleton } from "@/components/ui/Skeleton";

export default function SavedLoading() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="h-7 w-20 animate-pulse rounded-lg bg-surface-muted" />
      <Skeleton variant="grid" count={4} />
    </div>
  );
}
