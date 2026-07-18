import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listCategoriesForAdmin, createCategory } from "@/lib/admin-categories";

const schema = z.object({ name: z.string().min(1) });

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const categories = await listCategoriesForAdmin();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }
  try {
    const category = await createCategory(parsed.data.name);
    return NextResponse.json({ category });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create category" },
      { status: 400 }
    );
  }
}
