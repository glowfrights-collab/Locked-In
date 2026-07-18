import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { code: string } }) {
  const referral = await prisma.referral.findUnique({ where: { code: params.code } });
  if (!referral) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    status: referral.status,
    actionCompleted: referral.actionCompleted,
    referrerCredited: referral.referrerCredited,
  });
}
