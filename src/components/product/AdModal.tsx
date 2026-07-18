"use client";

import { useEffect, useState } from "react";
import { PlayIcon } from "@/components/ui/Icons";

const AD_DURATION_SECONDS = 6;

export function AdModal({
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION_SECONDS);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(AD_DURATION_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  const done = secondsLeft === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-surface p-6 text-center animate-slide-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-ink">
          <PlayIcon className="h-8 w-8" />
        </div>
        <p className="mt-4 text-base font-medium text-ink">
          {done ? "Ad complete" : "Playing ad..."}
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          {done
            ? "Thanks for watching. Your progress has been saved."
            : `This mock ad simulates a real rewarded-ad network. ${secondsLeft}s remaining.`}
        </p>

        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-ink transition-all duration-1000 ease-linear"
            style={{
              width: `${((AD_DURATION_SECONDS - secondsLeft) / AD_DURATION_SECONDS) * 100}%`,
            }}
          />
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="h-11 flex-1 rounded-full border border-surface-border text-sm font-medium text-ink-soft"
          >
            Cancel
          </button>
          <button
            onClick={onComplete}
            disabled={!done}
            className="h-11 flex-1 rounded-full bg-ink text-sm font-medium text-white disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
