"use client";

import { useState } from "react";
import { UnlockOptionCard } from "@/components/product/UnlockOptionCard";
import { DownloadFilesSection } from "@/components/product/DownloadFilesSection";
import type { UnlockMethodProgress } from "@/lib/types";

type DownloadFile = { id: string; seed: string; label: string | null };

export function ProductUnlockSection({
  productId,
  methods,
  initialUnlocked,
  downloadFiles,
}: {
  productId: string;
  methods: UnlockMethodProgress[];
  initialUnlocked: boolean;
  downloadFiles: DownloadFile[];
}) {
  const [unlocked, setUnlocked] = useState(initialUnlocked);

  if (unlocked) {
    return <DownloadFilesSection productId={productId} files={downloadFiles} />;
  }

  // "Watch ad" is temporarily hidden until a working ad network is in place.
  // Safe to filter unconditionally here — if AD were already completed for
  // this user, `unlocked` above would already be true and we'd never reach
  // this branch, so no in-progress/completed AD state is ever hidden.
  const visibleMethods = methods.filter((m) => m.method !== "AD");

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-ink">Unlock this wallpaper</h2>
      {visibleMethods.map((m) => (
        <UnlockOptionCard
          key={m.method}
          productId={productId}
          progress={m}
          onUnlocked={() => setUnlocked(true)}
        />
      ))}
    </div>
  );
}
