"use client";

import { useEffect, useRef, useState } from "react";
import { useTrackEvent } from "@/components/analytics/TrackEvent";

/**
 * Real survey offerwall (BitLabs), replacing CPX Research — BitLabs pools
 * surveys from multiple demand sources, so match/qualification rates tend to
 * be better than a single vendor.
 *
 * Unlike CPX, BitLabs has no dashboard "redirect back to my site" setting,
 * so instead of navigating the tab away we open the offerwall in a new tab
 * and poll our own unlock status while it's open — the product page never
 * leaves, and unlocks live the moment BitLabs' server-to-server callback
 * lands (see app/api/webhooks/bitlabs). Falls back to same-tab navigation if
 * the new tab is popup-blocked, since polling can't run once we navigate away
 * anyway — the page just re-checks status fresh on return via the back button.
 */
export function BitlabsOfferwall({
  productId,
  onUnlocked,
}: {
  productId: string;
  onUnlocked: () => void;
}) {
  const track = useTrackEvent();
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!waiting) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/unlock/status?productId=${productId}`);
      if (!res.ok) return;
      const data = await res.json();
      const survey = data.methods?.find((m: { method: string }) => m.method === "SURVEY");
      if (survey?.status === "COMPLETED" && !notifiedRef.current) {
        notifiedRef.current = true;
        setWaiting(false);
        onUnlocked();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [waiting, productId, onUnlocked]);

  async function start() {
    setLoading(true);
    track("UNLOCK_METHOD_SELECTED", { productId, metadata: { method: "SURVEY" } });
    const res = await fetch("/api/offerwall/bitlabs/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return;

    const opened = window.open(data.offerwallUrl, "_blank", "noopener,noreferrer");
    if (opened) {
      setWaiting(true);
    } else {
      window.location.href = data.offerwallUrl;
    }
  }

  if (waiting) {
    return (
      <p className="text-xs text-ink-soft">
        Complete the survey in the new tab — this page will unlock automatically when you&apos;re done.
      </p>
    );
  }

  return (
    <button
      onClick={start}
      disabled={loading}
      className="h-11 w-full rounded-full bg-ink text-sm font-medium text-white disabled:opacity-50"
    >
      {loading ? "Opening survey..." : "Start survey"}
    </button>
  );
}
