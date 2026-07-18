import { Badge } from "@/components/ui/Badge";
import type { UnlockMethod } from "@/lib/types";

function labelFor(method: UnlockMethod, targetCount: number): string {
  switch (method) {
    case "AD":
      return targetCount > 1 ? `Watch ${targetCount} ads` : "Watch 1 ad";
    case "SURVEY":
      return "Complete 1 survey";
    case "REFERRAL":
      return "Refer 1 friend";
  }
}

/** Renders the cheapest (easiest) unlock method as the primary label — e.g. on a ProductCard. */
export function UnlockRequirementLabel({
  methods,
}: {
  methods: { method: UnlockMethod; targetCount: number }[];
}) {
  if (methods.length === 0) return null;
  const primary = [...methods].sort((a, b) => a.targetCount - b.targetCount)[0];
  return <Badge tone="neutral">{labelFor(primary.method, primary.targetCount)}</Badge>;
}

export { labelFor as unlockMethodLabel };
