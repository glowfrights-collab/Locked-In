const MONETAG_ZONE_ID = "11351560";

/**
 * Loads Monetag's In-Page Push ad fresh on every call — removes any
 * previous instance of the script tag first, so navigating to a new
 * product page (or back to the same one) triggers a new ad each time,
 * rather than only once per browser session.
 */
export function triggerMonetagInPagePush(): void {
  if (typeof document === "undefined") return;

  const existing = document.querySelector(`script[data-zone="${MONETAG_ZONE_ID}"]`);
  existing?.remove();

  const script = document.createElement("script");
  script.dataset.zone = MONETAG_ZONE_ID;
  script.src = "https://nap5k.com/tag.min.js";
  document.body.appendChild(script);
}
