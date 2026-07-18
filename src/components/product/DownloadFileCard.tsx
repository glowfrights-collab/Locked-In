"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { DownloadIcon } from "@/components/ui/Icons";
import { DOWNLOAD_WIDTH, DOWNLOAD_HEIGHT } from "@/lib/images";

export function DownloadFileCard({
  productId,
  file,
  fallbackLabel,
}: {
  productId: string;
  file: { id: string; seed: string; label: string | null };
  fallbackLabel: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/download/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, fileId: file.id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Could not start download");
      }
      const { downloadUrl } = await res.json();
      window.location.href = downloadUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-muted">
        <ProductImage
          seed={file.seed}
          alt={file.label || fallbackLabel}
          sizes="(max-width: 640px) 100vw, 480px"
          sourceWidth={DOWNLOAD_WIDTH}
          sourceHeight={DOWNLOAD_HEIGHT}
          className="h-full w-full object-cover"
        />
      </div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white disabled:opacity-60"
      >
        <DownloadIcon className="h-5 w-5" />
        {loading ? "Preparing..." : `Download ${file.label || fallbackLabel}`}
      </button>
      {error && <p className="text-center text-xs text-red-500">{error}</p>}
    </div>
  );
}
