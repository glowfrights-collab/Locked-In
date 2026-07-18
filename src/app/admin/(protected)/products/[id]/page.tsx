import { notFound } from "next/navigation";
import { getProductForAdmin } from "@/lib/admin-products";
import { getCategories } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    getProductForAdmin(params.id),
    getCategories(),
  ]);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">Edit product</h1>
      <ProductForm initialProduct={product} categories={categories} />
    </div>
  );
}
