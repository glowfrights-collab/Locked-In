import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { recomputeProductStatus } from "@/lib/unlock/progress";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { unlockRequirements: { where: { enabled: true } } },
  });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await getSessionUser();
  const { status, methods } = await recomputeProductStatus(
    user?.id ?? null,
    productId,
    product.unlockRequirements
  );

  return NextResponse.json({ productStatus: status, methods });
}
