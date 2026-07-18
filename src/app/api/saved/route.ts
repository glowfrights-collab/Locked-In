import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSessionUser, getSessionUser } from "@/lib/session";
import { productIdSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = productIdSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { productId } = parsed.data;

  const user = await getOrCreateSessionUser();
  const existing = await prisma.savedProduct.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.savedProduct.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedProduct.create({ data: { userId: user.id, productId } });
  return NextResponse.json({ saved: true });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ productIds: [] });

  const saved = await prisma.savedProduct.findMany({ where: { userId: user.id } });
  return NextResponse.json({ productIds: saved.map((s) => s.productId) });
}
