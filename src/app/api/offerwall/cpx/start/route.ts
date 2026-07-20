import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/session";
import { buildCpxOfferwallUrl } from "@/lib/offerwall/cpx";
import { productIdSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = productIdSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { productId } = parsed.data;

  const requirement = await prisma.unlockRequirement.findUnique({
    where: { productId_method: { productId, method: "SURVEY" } },
  });
  if (!requirement || !requirement.enabled) {
    return NextResponse.json(
      { error: "This product does not offer the survey unlock method" },
      { status: 400 }
    );
  }

  const user = await getOrCreateSessionUser();
  const offerwallUrl = buildCpxOfferwallUrl(user.id, productId);
  return NextResponse.json({ offerwallUrl });
}
