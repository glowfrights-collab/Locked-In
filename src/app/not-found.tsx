import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist."
        actionLabel="Go home"
        actionHref="/"
      />
    </div>
  );
}
