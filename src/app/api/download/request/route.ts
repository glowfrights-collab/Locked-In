import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/session";
import { recomputeProductStatus } from "@/lib/unlock/progress";
import { mintDownloadToken } from "@/lib/download/token";
import { downloadRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = downloadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { productId, fileId } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      unlockRequirements: { where: { enabled: true } },
      files: { where: { kind: "download" } },
    },
  });
  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await getOrCreateSessionUser();
  const { status } = await recomputeProductStatus(user.id, productId, product.unlockRequirements);
  if (status !== "Unlocked") {
    return NextResponse.json({ error: "Product is not unlocked" }, { status: 403 });
  }

  if (product.files.length === 0) {
    return NextResponse.json({ error: "No downloadable file for this product" }, { status: 404 });
  }

  if (fileId && !product.files.some((f) => f.id === fileId)) {
    return NextResponse.json({ error: "File does not belong to this product" }, { status: 400 });
  }

  // The token only pins (userId, productId[, fileId]) — the actual file
  // bytes are looked up fresh at streaming time, so an admin can update
  // download files without invalidating already-issued tokens.
  const token = mintDownloadToken({ userId: user.id, productId, fileId });
  return NextResponse.json({ downloadUrl: `/api/download/${token}` });
}
