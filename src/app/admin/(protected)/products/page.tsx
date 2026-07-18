import Link from "next/link";
import { listProductsForAdmin } from "@/lib/admin-products";
import { ProductTable } from "@/components/admin/ProductTable";

export default async function AdminProductsPage() {
  const products = await listProductsForAdmin();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="h-10 rounded-full bg-ink px-4 text-sm font-medium leading-[40px] text-white"
        >
          Add product
        </Link>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
