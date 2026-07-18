import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";
import { getSessionUser } from "@/lib/session";
import { recomputeProductStatus } from "@/lib/unlock/progress";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = await getSessionUser();
  const { status, methods } = await recomputeProductStatus(
    user?.id ?? null,
    product.id,
    product.unlockRequirements
  );

  return NextResponse.json({
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    type: product.type,
    resolution: product.resolution,
    fileFormat: product.fileFormat,
    deviceType: product.deviceType,
    previewImageSeed: product.previewImageSeed,
    tags: product.tags.map((t) => t.tag.name),
    categories: product.categories.map((c) => c.category.name),
    unlockStatus: status,
    unlockMethods: methods,
  });
}
