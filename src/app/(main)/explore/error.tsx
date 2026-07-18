"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function ExploreError() {
  return (
    <div className="px-4 py-8">
      <ErrorState
        title="Couldn't load products"
        description="Something went wrong while loading the catalog."
        retryHref="/explore"
      />
    </div>
  );
}
