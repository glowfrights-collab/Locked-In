"use client";

import { useEffect } from "react";
import { triggerMonetagPopunderOnce } from "@/lib/ads/monetag";

/** Renders nothing — just triggers the once-per-session popunder ad on mount. */
export function ProductPagePopunder() {
  useEffect(() => {
    triggerMonetagPopunderOnce();
  }, []);
  return null;
}
