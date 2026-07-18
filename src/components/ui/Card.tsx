import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  padding = "md",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md";
}) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
  }[padding];

  return (
    <div
      className={cn(
        "rounded-2xl border border-surface-border bg-surface shadow-card",
        paddingClasses,
        className
      )}
    >
      {children}
    </div>
  );
}
