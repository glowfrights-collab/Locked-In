import "server-only";
import { prisma } from "@/lib/db";
import type { z } from "zod";
import type { adminProductSchema } from "@/lib/validation";

type ProductInput = z.infer<typeof adminProductSchema>;

const fullInclude = {
  categories: { include: { category: true } },
  tags: { include: { tag: true } },
  unlockRequirements: true,
  files: { orderBy: { sortOrder: "asc" as const } },
} as const;

export async function listProductsForAdmin() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: fullInclude,
  });
}

export async function getProductForAdmin(id: string) {
  return prisma.product.findUnique({ where: { id }, include: fullInclude });
}

async function syncCategoriesAndTags(productId: string, input: ProductInput) {
  await prisma.productCategory.deleteMany({ where: { productId } });
  await prisma.productTag.deleteMany({ where: { productId } });

  for (const slug of input.categorySlugs) {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) continue;
    await prisma.productCategory.create({ data: { productId, categoryId: category.id } });
  }

  for (const name of input.tagNames) {
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
    if (!slug) continue;
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name: name.trim(), slug },
    });
    await prisma.productTag.create({ data: { productId, tagId: tag.id } });
  }
}

async function syncUnlockRequirements(productId: string, input: ProductInput) {
  await prisma.unlockRequirement.deleteMany({ where: { productId } });
  for (const req of input.unlockRequirements) {
    if (!req.enabled) continue;
    await prisma.unlockRequirement.create({
      data: {
        productId,
        method: req.method,
        enabled: true,
        targetCount: req.targetCount,
      },
    });
  }
}

/**
 * Download files are what the customer actually receives — distinct from
 * `previewImageSeed`, which is just the on-site mockup/preview image. If no
 * download files are explicitly set, falls back to the preview image so
 * every product still has *something* downloadable.
 */
async function syncDownloadFiles(productId: string, input: ProductInput) {
  await prisma.productFile.deleteMany({ where: { productId, kind: "download" } });

  const files = input.downloadFiles.filter((f) => f.seed.trim().length > 0);
  const toCreate = files.length > 0 ? files : [{ seed: input.previewImageSeed, label: undefined }];

  for (const [index, file] of toCreate.entries()) {
    await prisma.productFile.create({
      data: {
        productId,
        kind: "download",
        label: file.label?.trim() || null,
        sortOrder: index,
        seed: file.seed,
        width: 1080,
        height: 1080,
      },
    });
  }
}

export async function createProduct(input: ProductInput) {
  const product = await prisma.product.create({
    data: {
      slug: input.slug,
      title: input.title,
      description: input.description,
      type: input.type,
      resolution: input.resolution,
      fileFormat: input.fileFormat,
      deviceType: input.deviceType,
      previewImageSeed: input.previewImageSeed,
      isFeatured: input.isFeatured,
      isTrending: input.isTrending,
      isActive: input.isActive,
    },
  });

  await syncCategoriesAndTags(product.id, input);
  await syncUnlockRequirements(product.id, input);
  await syncDownloadFiles(product.id, input);

  return product;
}

export async function updateProduct(id: string, input: ProductInput) {
  const product = await prisma.product.update({
    where: { id },
    data: {
      slug: input.slug,
      title: input.title,
      description: input.description,
      type: input.type,
      resolution: input.resolution,
      fileFormat: input.fileFormat,
      deviceType: input.deviceType,
      previewImageSeed: input.previewImageSeed,
      isFeatured: input.isFeatured,
      isTrending: input.isTrending,
      isActive: input.isActive,
    },
  });

  await syncCategoriesAndTags(product.id, input);
  await syncUnlockRequirements(product.id, input);
  await syncDownloadFiles(product.id, input);

  return product;
}

export async function setProductActive(id: string, isActive: boolean) {
  return prisma.product.update({ where: { id }, data: { isActive } });
}
