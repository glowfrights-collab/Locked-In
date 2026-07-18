import "server-only";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function listCategoriesForAdmin() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return categories.map((c) => ({ ...c, productCount: c._count.products }));
}

async function uniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "category";
  let slug = base;
  let attempt = 1;
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    attempt += 1;
    slug = `${base}-${attempt}`;
  }
}

export async function createCategory(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required");
  const slug = await uniqueSlug(trimmed);
  return prisma.category.create({ data: { name: trimmed, slug } });
}

export async function renameCategory(id: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required");
  const slug = await uniqueSlug(trimmed, id);
  return prisma.category.update({ where: { id }, data: { name: trimmed, slug } });
}

export async function deleteCategory(id: string) {
  // ProductCategory rows cascade-delete, so this just unlinks it from any products.
  return prisma.category.delete({ where: { id } });
}
