"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { CheckIcon, PlayIcon, ClipboardIcon } from "@/components/ui/Icons";
import { AdModal } from "@/components/product/AdModal";
import { CpxOfferwall } from "@/components/product/CpxOfferwall";
import { ReferralPanel } from "@/components/product/ReferralPanel";
import { useTrackEvent } from "@/components/analytics/TrackEvent";
import type { UnlockMethod, UnlockMethodProgress } from "@/lib/types";

const METHOD_META: Record<UnlockMethod, { title: string; icon: typeof PlayIcon }> = {
  AD: { title: "Watch ads", icon: PlayIcon },
  SURVEY: { title: "Complete a survey", icon: ClipboardIcon },
  REFERRAL: { title: "Refer a friend", icon: ClipboardIcon },
};

export function UnlockOptionCard({
  productId,
  progress: initialProgress,
  onUnlocked,
}: {
  productId: string;
  progress: UnlockMethodProgress;
  onUnlocked: () => void;
}) {
  const track = useTrackEvent();
  const [progress, setProgress] = useState(initialProgress);
  const [adOpen, setAdOpen] = useState(false);

  const meta = METHOD_META[progress.method];
  const Icon = meta.icon;
  const completed = progress.status === "COMPLETED";

  function selectMethod() {
    track("UNLOCK_METHOD_SELECTED", { productId, metadata: { method: progress.method } });
  }

  async function handleAdComplete() {
    setAdOpen(false);
    const res = await fetch("/api/unlock/ad/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    setProgress(data.progress);
    if (data.productStatus === "Unlocked") onUnlocked();
  }

  return (
    <Card className="flex flex-col gap-3" padding="md">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-ink">
          {completed ? <CheckIcon className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-ink">{meta.title}</p>
          {progress.method === "AD" && (
            <p className="text-xs text-ink-soft">
              {progress.currentCount} of {progress.targetCount} ads completed
            </p>
          )}
          {progress.method === "SURVEY" && (
            <p className="text-xs text-ink-soft">
              {completed ? "Survey completed" : "Complete one short survey to unlock."}
            </p>
          )}
        </div>
      </div>

      {progress.method === "AD" && (
        <>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-ink transition-all"
              style={{ width: `${(progress.currentCount / progress.targetCount) * 100}%` }}
            />
          </div>
          <button
            onClick={() => {
              if (completed) return;
              selectMethod();
              setAdOpen(true);
            }}
            disabled={completed}
            className="h-11 w-full rounded-full bg-ink text-sm font-medium text-white disabled:opacity-50"
          >
            {completed ? "Completed" : "Watch ad"}
          </button>
          <AdModal open={adOpen} onClose={() => setAdOpen(false)} onComplete={handleAdComplete} />
        </>
      )}

      {progress.method === "SURVEY" &&
        (completed ? (
          <p className="text-xs font-medium text-success">Survey completed</p>
        ) : (
          <CpxOfferwall productId={productId} onUnlocked={onUnlocked} />
        ))}

      {progress.method === "REFERRAL" &&
        (completed ? (
          <p className="text-xs font-medium text-success">Referral completed</p>
        ) : (
          <ReferralPanel productId={productId} onUnlocked={onUnlocked} />
        ))}
    </Card>
  );
}
