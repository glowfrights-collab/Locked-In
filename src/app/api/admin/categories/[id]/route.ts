import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { renameCategory, deleteCategory } from "@/lib/admin-categories";

const schema = z.object({ name: z.string().min(1) });

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }
  try {
    const category = await renameCategory(params.id, parsed.data.name);
    return NextResponse.json({ category });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not rename category" },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await deleteCategory(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete category" },
      { status: 400 }
    );
  }
}
