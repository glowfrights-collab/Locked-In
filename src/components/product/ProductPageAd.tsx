"use client";

import { useEffect } from "react";
import { triggerMonetagInPagePush } from "@/lib/ads/monetag";

/** Renders nothing — just triggers a fresh In-Page Push ad every time a product page mounts. */
export function ProductPageAd() {
  useEffect(() => {
    triggerMonetagInPagePush();
  }, []);
  return null;
}
