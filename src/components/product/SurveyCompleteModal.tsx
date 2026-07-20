"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/Icons";

/** Shown once the moment a real BitLabs survey completion is detected. */
export function SurveyCompleteModal() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-surface p-6 text-center animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckIcon className="h-7 w-7" />
        </div>
        <p className="mt-4 text-base font-semibold text-ink">Survey completed!</p>
        <p className="mt-1 text-sm text-ink-soft">
          You can now download your product below.
        </p>
        <button
          onClick={() => setOpen(false)}
          className="mt-5 h-11 w-full rounded-full bg-ink text-sm font-medium text-white"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
