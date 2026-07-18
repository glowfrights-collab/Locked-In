import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "pending" | "accent";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-muted text-ink-soft",
  success: "bg-success-soft text-success",
  pending: "bg-accent-soft text-accent",
  accent: "bg-ink text-white",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
