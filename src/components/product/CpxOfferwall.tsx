"use client";

import { useEffect, useRef, useState } from "react";
import { useTrackEvent } from "@/components/analytics/TrackEvent";

/**
 * Real survey offerwall (CPX Research), replacing the earlier mock
 * SurveyForm. Completion is confirmed asynchronously via CPX's server-to-
 * server postback (see app/api/webhooks/cpx-research), not by anything the
 * browser submits — so this polls unlock status while the wall is open to
 * notice when it's done.
 */
export function CpxOfferwall({
  productId,
  onUnlocked,
}: {
  productId: string;
  onUnlocked: () => void;
}) {
  const track = useTrackEvent();
  const [offerwallUrl, setOfferwallUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const notifiedRef = useRef(false);

  async function start() {
    setLoading(true);
    track("UNLOCK_METHOD_SELECTED", { productId, metadata: { method: "SURVEY" } });
    const res = await fetch("/api/offerwall/cpx/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return;
    setOfferwallUrl(data.offerwallUrl);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/unlock/status?productId=${productId}`);
      if (!res.ok) return;
      const data = await res.json();
      const survey = data.methods?.find((m: { method: string }) => m.method === "SURVEY");
      if (survey?.status === "COMPLETED" && !notifiedRef.current) {
        notifiedRef.current = true;
        setOpen(false);
        onUnlocked();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [open, productId, onUnlocked]);

  return (
    <>
      <button
        onClick={start}
        disabled={loading}
        className="h-11 w-full rounded-full bg-ink text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Loading..." : "Start survey"}
      </button>

      {open && offerwallUrl && (
        <div className="fixed inset-0 z-50 flex flex-col bg-surface animate-fade-in">
          <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
            <p className="text-sm font-medium text-ink">Complete a survey</p>
            <button
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink-soft"
            >
              Close
            </button>
          </div>
          <iframe src={offerwallUrl} className="w-full flex-1" style={{ border: 0 }} />
        </div>
      )}
    </>
  );
}
