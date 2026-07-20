import { prisma } from "@/lib/db";
import { verifyBitlabsCallback } from "@/lib/offerwall/bitlabs";
import { recordSurveyCompletionExternal } from "@/lib/unlock/progress";
import { logEvent } from "@/lib/analytics";

/**
 * Server-to-server callback BitLabs calls when a survey reward event fires.
 * Configure this exact URL in the BitLabs dashboard under the placement's
 * callback settings as:
 *   https://<domain>/api/webhooks/bitlabs?uid=[%USER:UID%]&tx=[%TX%]&val_usd=[%VALUE:USD%]&type=[%SURVEY:REASON%]
 * BitLabs appends `hash` (HMAC signature) and echoes back any custom params
 * from the offerwall URL (here, `product_id`) automatically. No browser
 * session is available here — the user is identified purely by `uid`, which
 * we set to our own userId when building the offerwall URL.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const userId = params.get("uid");
  const productId = params.get("product_id");
  const txId = params.get("tx");
  const type = params.get("type");
  const hash = params.get("hash");

  if (!userId || !productId || !txId || !type || !hash) {
    return new Response("0", { status: 400 });
  }

  if (!verifyBitlabsCallback(url, hash)) {
    return new Response("0", { status: 403 });
  }

  // RECONCILIATION reverses a prior reward (fraud). We don't re-lock content
  // for this MVP — once unlocked, it stays unlocked; just acknowledge.
  // SCREENOUT/START_BONUS aren't the full-reward completion event.
  if (type !== "COMPLETE") {
    return new Response("1");
  }

  const requirement = await prisma.unlockRequirement.findUnique({
    where: { productId_method: { productId, method: "SURVEY" } },
  });
  if (!requirement || !requirement.enabled) {
    return new Response("0", { status: 400 });
  }

  const result = await recordSurveyCompletionExternal(userId, productId, txId, {
    valUsd: params.get("val_usd"),
    type,
  });

  // result is null if this tx was already processed (retry) — still ack with "1".
  if (result) {
    if (result.methodJustCompleted) {
      logEvent("SURVEY_COMPLETED", { userId, productId });
    }
    if (result.productJustUnlocked) {
      logEvent("PRODUCT_UNLOCKED", { userId, productId, metadata: { method: "SURVEY" } });
    }
  }

  return new Response("1");
}
