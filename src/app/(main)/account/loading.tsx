import { Skeleton } from "@/components/ui/Skeleton";

export default function AccountLoading() {
  return (
    <div className="flex flex-col gap-8 px-4 py-4">
      <div className="h-7 w-24 animate-pulse rounded-lg bg-surface-muted" />
      <Skeleton variant="grid" count={2} />
      <Skeleton variant="text" count={3} />
    </div>
  );
}
