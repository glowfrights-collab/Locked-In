const MONETAG_ZONE_ID = "11351560";
const SESSION_FLAG = "monetag_inpagepush_shown";

/**
 * Loads Monetag's In-Page Push ad — not the Onclick (Popunder) format we
 * removed earlier, which hijacked navigation clicks and redirected people
 * off the site. Scoped to product pages only, once per browser session via
 * sessionStorage, so it doesn't repeat every time someone browses a new
 * product in the same visit.
 */
export function triggerMonetagInPagePushOnce(): void {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(SESSION_FLAG)) return;
  sessionStorage.setItem(SESSION_FLAG, "1");

  if (document.querySelector(`script[data-zone="${MONETAG_ZONE_ID}"]`)) return;
  const script = document.createElement("script");
  script.dataset.zone = MONETAG_ZONE_ID;
  script.src = "https://nap5k.com/tag.min.js";
  document.body.appendChild(script);
}
