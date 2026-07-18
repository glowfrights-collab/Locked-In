"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="w-full max-w-sm">
          <ErrorState
            title="Something went wrong"
            description="Please try again."
          />
          <button
            onClick={reset}
            className="mx-auto mt-4 block text-sm font-medium text-ink underline"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
