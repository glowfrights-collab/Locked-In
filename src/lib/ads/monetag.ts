const MONETAG_ZONE_ID = "11348807";
const SESSION_FLAG = "monetag_popunder_shown";

/**
 * Triggers Monetag's Onclick (Popunder) ad — fires on the next click after
 * this runs. Scoped to product pages only (not site-wide, unlike an earlier
 * attempt that hijacked every click across the whole site) and gated to
 * once per browser session via sessionStorage, so a visitor browsing
 * several products in one visit only ever sees it once.
 */
export function triggerMonetagPopunderOnce(): void {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(SESSION_FLAG)) return;
  sessionStorage.setItem(SESSION_FLAG, "1");

  if (document.querySelector(`script[data-zone="${MONETAG_ZONE_ID}"]`)) return;
  const script = document.createElement("script");
  script.dataset.zone = MONETAG_ZONE_ID;
  script.src = "https://al5sm.com/tag.min.js";
  document.body.appendChild(script);
}
