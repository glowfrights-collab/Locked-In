import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/session";
import { emailSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = emailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const user = await getOrCreateSessionUser();
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing && existing.id !== user.id) {
    return NextResponse.json(
      { error: "This email is already associated with another session" },
      { status: 409 }
    );
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { email: parsed.data.email },
  });

  return NextResponse.json({ email: updated.email });
}
