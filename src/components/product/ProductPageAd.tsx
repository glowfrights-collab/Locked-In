"use client";

import { useEffect } from "react";
import { triggerMonetagInPagePushOnce } from "@/lib/ads/monetag";

/** Renders nothing — just triggers the once-per-session In-Page Push ad on mount. */
export function ProductPageAd() {
  useEffect(() => {
    triggerMonetagInPagePushOnce();
  }, []);
  return null;
}
