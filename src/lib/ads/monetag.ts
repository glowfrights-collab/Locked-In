const MONETAG_ZONE_ID = "11348807";

/**
 * Injects Monetag's Onclick (Popunder) tag, which listens for the next click
 * anywhere on the page and opens a monetized ad tab when it happens. There's
 * no completion callback for this format (unlike CPX Research's postback for
 * surveys) — this just makes real ad impressions happen when the user
 * interacts with the ad modal, it doesn't verify anything back to us.
 * Idempotent: safe to call every time the ad modal opens.
 */
export function triggerMonetagAd(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector(`script[data-zone="${MONETAG_ZONE_ID}"]`)) return;

  const script = document.createElement("script");
  script.dataset.zone = MONETAG_ZONE_ID;
  script.src = "https://al5sm.com/tag.min.js";
  document.body.appendChild(script);
}
