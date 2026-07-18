import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/session";
import { logEvent } from "@/lib/analytics";
import { ANALYTICS_EVENT_TYPES } from "@/lib/types";

const schema = z.object({
  type: z.enum(ANALYTICS_EVENT_TYPES),
  productId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const user = await getSessionUser();
  logEvent(parsed.data.type, {
    userId: user?.id ?? null,
    productId: parsed.data.productId ?? null,
    metadata: parsed.data.metadata,
  });

  return NextResponse.json({ ok: true });
}
