import "server-only";
import { prisma } from "@/lib/db";
import type { AnalyticsEventType } from "@/lib/types";

/** Fire-and-forget server-side analytics write. Never throws into the caller. */
export function logEvent(
  type: AnalyticsEventType,
  opts: { userId?: string | null; productId?: string | null; metadata?: Record<string, unknown> } = {}
): void {
  void prisma.analyticsEvent
    .create({
      data: {
        type,
        userId: opts.userId ?? null,
        productId: opts.productId ?? null,
        metadata: opts.metadata ? JSON.stringify(opts.metadata) : null,
      },
    })
    .catch((err) => {
      console.error("Failed to log analytics event", type, err);
    });
}
