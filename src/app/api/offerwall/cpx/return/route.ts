import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * CPX Research's "Redirect URL" (configured in their dashboard under
 * Redirect Settings) sends the user's browser here after they finish with
 * the offerwall — with our own subid_1 (the product id) echoed back so we
 * know which product page to return them to. That page re-checks unlock
 * status fresh from the database on load, so if CPX's postback already
 * landed, it shows the unlocked download files immediately.
 */
export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get("subid_1");
  const origin = new URL(request.url).origin;

  if (!productId) {
    return NextResponse.redirect(new URL("/", origin));
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.redirect(new URL("/", origin));
  }

  return NextResponse.redirect(new URL(`/product/${product.slug}?survey=done`, origin));
}
