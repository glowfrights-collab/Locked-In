"use client";

import { useState } from "react";
import { useTrackEvent } from "@/components/analytics/TrackEvent";

/**
 * Real survey offerwall (CPX Research), replacing the earlier mock
 * SurveyForm. This navigates the whole tab to CPX rather than embedding an
 * iframe — individual surveys inside the wall commonly break out of frames
 * anyway (a fraud-prevention measure most survey vendors use), so fighting
 * that produces a worse experience than just embracing it. CPX's own
 * "Redirect URL" setting (configured in their dashboard) sends the user
 * back to /api/offerwall/cpx/return, which forwards them to this exact
 * product page — already unlocked, since CPX's postback (see
 * app/api/webhooks/cpx-research) has normally already landed by then.
 */
export function CpxOfferwall({ productId }: { productId: string }) {
  const track = useTrackEvent();
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    track("UNLOCK_METHOD_SELECTED", { productId, metadata: { method: "SURVEY" } });
    const res = await fetch("/api/offerwall/cpx/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      return;
    }
    window.location.href = data.offerwallUrl;
  }

  return (
    <button
      onClick={start}
      disabled={loading}
      className="h-11 w-full rounded-full bg-ink text-sm font-medium text-white disabled:opacity-50"
    >
      {loading ? "Redirecting..." : "Start survey"}
    </button>
  );
}
