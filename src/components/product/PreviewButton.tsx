"use client";

import { useState } from "react";
import Image from "next/image";
import { resolveImageSource, DOWNLOAD_WIDTH, DOWNLOAD_HEIGHT } from "@/lib/images";

export function PreviewButton({ seed, title }: { seed: string; title: string }) {
  const [open, setOpen] = useState(false);
  const { src, unoptimized } = resolveImageSource(seed, DOWNLOAD_WIDTH, DOWNLOAD_HEIGHT);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-11 rounded-full border border-surface-border px-5 text-sm font-medium text-ink"
      >
        Preview
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          {/* object-contain + fill preserves the real aspect ratio of any custom image, not just the 9:16 default */}
          <div className="relative h-[85vh] w-full max-w-md">
            <Image
              src={src}
              alt={title}
              fill
              unoptimized={unoptimized}
              className="rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
