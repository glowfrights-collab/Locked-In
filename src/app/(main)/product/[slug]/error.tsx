"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function ProductError() {
  return (
    <div className="px-4 py-8">
      <ErrorState
        title="Couldn't load this product"
        description="Something went wrong. Please go back and try again."
        retryHref="/explore"
      />
    </div>
  );
}
