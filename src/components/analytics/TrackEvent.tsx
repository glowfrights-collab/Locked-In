"use client";

import { useCallback } from "react";
import type { AnalyticsEventType } from "@/lib/types";

export function useTrackEvent() {
  return useCallback(
    (type: AnalyticsEventType, opts: { productId?: string; metadata?: Record<string, unknown> } = {}) => {
      const body = JSON.stringify({ type, ...opts });
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/event", new Blob([body], { type: "application/json" }));
      } else {
        void fetch("/api/analytics/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        });
      }
    },
    []
  );
}
