import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      <div className="aspect-square w-full animate-pulse rounded-3xl bg-surface-muted" />
      <Skeleton variant="text" count={3} />
      <Skeleton variant="card" count={3} />
    </div>
  );
}
