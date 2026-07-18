"use client";

import { useState } from "react";
import { SavedIcon } from "@/components/ui/Icons";

export function SaveButton({
  productId,
  initialSaved,
}: {
  productId: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    setSaved(data.saved);
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Remove from saved" : "Save"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-surface-border text-ink disabled:opacity-60"
    >
      <SavedIcon filled={saved} className="h-5 w-5" />
    </button>
  );
}
