import { prisma } from "@/lib/db";
import { verifyCpxPostback } from "@/lib/offerwall/cpx";
import { recordSurveyCompletionExternal } from "@/lib/unlock/progress";
import { logEvent } from "@/lib/analytics";

/**
 * Server-to-server postback CPX Research calls when a user completes (or
 * reverses) a survey. Configure this exact URL in CPX Research's dashboard
 * under Postback Settings. No browser session is available here — the user
 * is identified purely by the `user_id` we embedded in the offerwall URL
 * when it was opened (see components/product/CpxOfferwall.tsx).
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const transId = params.get("trans_id");
  const userId = params.get("user_id");
  const productId = params.get("subid_1");
  const status = params.get("status");
  const hash = params.get("hash");

  if (!transId || !userId || !productId || !status || !hash) {
    return new Response("0", { status: 400 });
  }

  if (!verifyCpxPostback(transId, hash)) {
    return new Response("0", { status: 403 });
  }

  // status "1" = completed, "2" = reversed/chargeback. We don't re-lock
  // content on a reversal for this MVP — once unlocked, it stays unlocked;
  // just acknowledge without crediting.
  if (status !== "1") {
    return new Response("1");
  }

  const requirement = await prisma.unlockRequirement.findUnique({
    where: { productId_method: { productId, method: "SURVEY" } },
  });
  if (!requirement || !requirement.enabled) {
    return new Response("0", { status: 400 });
  }

  const result = await recordSurveyCompletionExternal(userId, productId, transId, {
    offerId: params.get("offer_id"),
    amountUsd: params.get("amount_usd"),
    amountLocal: params.get("amount_local"),
  });

  // result is null if this trans_id was already processed (retry) — still ack with "1".
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
