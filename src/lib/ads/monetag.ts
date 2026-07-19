const MONETAG_ZONE_ID = "11348891";

/**
 * Injects Monetag's "In-Page Push (Banner)" tag, scoped to only run while
 * the ad-watching modal is open — NOT loaded site-wide. An earlier attempt
 * with a different Monetag format (Onclick/Popunder) was loaded globally
 * and ended up hijacking ordinary navigation clicks anywhere on the site,
 * redirecting real visitors to app-store ads. Keeping this scoped to the
 * modal avoids repeating that. Monetag's automated installation checker may
 * still report an "error" since it likely crawls the whole site for the
 * tag rather than this specific flow — that's an acceptable tradeoff.
 * Idempotent: safe to call every time the ad modal opens.
 */
export function triggerMonetagInPagePush(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector(`script[data-zone="${MONETAG_ZONE_ID}"]`)) return;

  const script = document.createElement("script");
  script.dataset.zone = MONETAG_ZONE_ID;
  script.src = "https://nap5k.com/tag.min.js";
  document.body.appendChild(script);
}
