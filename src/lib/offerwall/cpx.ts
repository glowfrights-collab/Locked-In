import "server-only";
import { createHash } from "crypto";

/**
 * CPX Research signs each postback as md5(`${trans_id}-${secretKey}`). This
 * verifies that signature so we only credit surveys CPX Research actually
 * confirmed — never trust a postback's own "status=1" without this check.
 */
export function verifyCpxPostback(transId: string, hash: string): boolean {
  const secret = process.env.CPX_RESEARCH_SECRET_KEY;
  if (!secret) throw new Error("CPX_RESEARCH_SECRET_KEY is not set");
  const expected = createHash("md5").update(`${transId}-${secret}`).digest("hex");
  return expected === hash;
}

export function getCpxAppId(): string {
  const appId = process.env.CPX_RESEARCH_APP_ID;
  if (!appId) throw new Error("CPX_RESEARCH_APP_ID is not set");
  return appId;
}
