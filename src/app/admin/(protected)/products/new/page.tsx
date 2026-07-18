import { getCategories } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">Add product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
