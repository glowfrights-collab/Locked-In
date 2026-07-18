import "server-only";
import { prisma } from "@/lib/db";
import type { ProductSummary, ProductType, UnlockMethod } from "@/lib/types";
import type { Prisma } from "@prisma/client";

const summaryInclude = {
  categories: { include: { category: true } },
  unlockRequirements: { where: { enabled: true } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof summaryInclude }>;

export function toProductSummary(product: ProductWithRelations): ProductSummary {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    type: product.type as ProductType,
    previewImageSeed: product.previewImageSeed,
    isFeatured: product.isFeatured,
    isTrending: product.isTrending,
    categories: product.categories.map((c) => c.category.name),
    unlockMethods: product.unlockRequirements.map((r) => ({
      method: r.method as UnlockMethod,
      targetCount: r.targetCount,
    })),
  };
}

export async function getFeaturedProducts(limit = 8): Promise<ProductSummary[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: summaryInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toProductSummary);
}

export async function getTrendingProducts(limit = 8): Promise<ProductSummary[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, isTrending: true },
    include: summaryInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toProductSummary);
}

export async function getBundleProducts(limit = 8): Promise<ProductSummary[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, type: "BUNDLE" },
    include: summaryInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toProductSummary);
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export type ProductFilters = {
  q?: string;
  category?: string; // category slug
  type?: ProductType;
  sort?: "trending" | "newest";
  page?: number;
  pageSize?: number;
};

export async function getProducts(filters: ProductFilters): Promise<{
  products: ProductSummary[];
  hasMore: boolean;
  total: number;
}> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 12;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q } },
            { description: { contains: filters.q } },
          ],
        }
      : {}),
    ...(filters.category
      ? { categories: { some: { category: { slug: filters.category } } } }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "trending" ? { isTrending: "desc" } : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: summaryInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(toProductSummary),
    hasMore: page * pageSize < total,
    total,
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      unlockRequirements: { where: { enabled: true } },
      files: { where: { kind: "download" }, orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getSimilarProducts(
  productId: string,
  categoryNames: string[],
  limit = 6
): Promise<ProductSummary[]> {
  if (categoryNames.length === 0) return [];
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      categories: { some: { category: { name: { in: categoryNames } } } },
    },
    include: summaryInclude,
    take: limit,
  });
  return products.map(toProductSummary);
}
