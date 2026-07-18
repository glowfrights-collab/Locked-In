import { listCategoriesForAdmin } from "@/lib/admin-categories";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await listCategoriesForAdmin();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">Categories</h1>
      <p className="text-sm text-ink-soft">
        Renaming keeps a category's products attached. Deleting a category just removes it from
        any products that had it — nothing else is affected.
      </p>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
