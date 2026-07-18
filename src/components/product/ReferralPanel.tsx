"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ClipboardIcon, ShareIcon, CheckIcon } from "@/components/ui/Icons";
import { useTrackEvent } from "@/components/analytics/TrackEvent";

type ReferralStatus = "PENDING" | "COMPLETED" | "REJECTED";

export function ReferralPanel({
  productId,
  onUnlocked,
}: {
  productId: string;
  onUnlocked: () => void;
}) {
  const track = useTrackEvent();
  const [code, setCode] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ReferralStatus>("PENDING");
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const notifiedRef = useRef(false);

  // Referral links (and the User row behind them) are only created once the
  // visitor explicitly asks for one — not just from viewing the product page.
  async function getLink() {
    setCreating(true);
    track("UNLOCK_METHOD_SELECTED", { productId, metadata: { method: "REFERRAL" } });
    const res = await fetch("/api/referrals/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    setCode(data.code);
    setShareUrl(data.shareUrl);
    setStatus(data.referralStatus);
    setCreating(false);
  }

  useEffect(() => {
    if (!code || status !== "PENDING") return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/referrals/${code}/status`);
      if (!res.ok) return;
      const data = await res.json();
      setStatus(data.status);
      if (data.status === "COMPLETED" && !notifiedRef.current) {
        notifiedRef.current = true;
        onUnlocked();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [code, status, onUnlocked]);

  function handleShare() {
    track("REFERRAL_SHARED", { productId });
    if (!shareUrl) return;
    if (navigator.share) {
      navigator.share({ url: shareUrl, title: "Unlock this wallpaper" }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  function handleCopy() {
    if (!shareUrl) return;
    track("REFERRAL_SHARED", { productId });
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink-soft">
        Invite one friend. This unlocks when your friend opens your link and visits the site.
      </p>

      {!code ? (
        <button
          onClick={getLink}
          disabled={creating}
          className="h-11 w-full rounded-full bg-ink text-sm font-medium text-white disabled:opacity-50"
        >
          {creating ? "Getting your link..." : "Get referral link"}
        </button>
      ) : (
        <>
          {status === "REJECTED" ? (
            <Badge tone="neutral">This link is no longer active</Badge>
          ) : (
            <Badge tone={status === "COMPLETED" ? "success" : "pending"}>
              {status === "COMPLETED" ? "Referral completed" : "Waiting for your friend"}
            </Badge>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-surface-border text-sm font-medium text-ink"
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
              {copied ? "Copied" : "Copy link"}
            </button>
            <button
              onClick={handleShare}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white"
            >
              <ShareIcon className="h-4 w-4" />
              Share
            </button>
          </div>
        </>
      )}
    </div>
  );
}
