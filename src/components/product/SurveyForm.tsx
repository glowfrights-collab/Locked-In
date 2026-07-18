"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    id: "device",
    label: "What device will you use this on?",
    options: ["Phone", "Tablet", "Desktop"],
  },
  {
    id: "frequency",
    label: "How often do you change your wallpaper?",
    options: ["Weekly", "Monthly", "Rarely"],
  },
  {
    id: "discovery",
    label: "How did you find this site?",
    options: ["TikTok", "Instagram", "Friend", "Other"],
  },
];

export function SurveyForm({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (answers: Record<string, string>) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!open) return null;

  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 sm:items-center sm:p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-t-3xl bg-surface p-6 sm:rounded-3xl animate-slide-up">
        <p className="text-base font-medium text-ink">Quick survey</p>
        <p className="mt-1 text-sm text-ink-soft">
          Answer 3 short questions to unlock this product. This is a placeholder for a real survey provider.
        </p>

        <form
          className="mt-5 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(answers);
          }}
        >
          {QUESTIONS.map((q) => (
            <fieldset key={q.id}>
              <legend className="text-sm font-medium text-ink">{q.label}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      answers[q.id] === opt
                        ? "border-ink bg-ink text-white"
                        : "border-surface-border text-ink-soft"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-full border border-surface-border text-sm font-medium text-ink-soft"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!allAnswered}
              className="h-11 flex-1 rounded-full bg-ink text-sm font-medium text-white disabled:opacity-40"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
