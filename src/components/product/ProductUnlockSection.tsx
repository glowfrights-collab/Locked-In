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

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-ink">Unlock this wallpaper</h2>
      {methods.map((m) => (
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
