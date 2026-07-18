import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { PRODUCT_TYPES, type ProductType } from "@/lib/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const typeParam = searchParams.get("type");
  const type = PRODUCT_TYPES.includes(typeParam as ProductType)
    ? (typeParam as ProductType)
    : undefined;
  const sortParam = searchParams.get("sort");
  const sort = sortParam === "trending" ? "trending" : "newest";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  const result = await getProducts({ q, category, type, sort, page });
  return NextResponse.json(result);
}
