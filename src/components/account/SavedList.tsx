import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductSummary } from "@/lib/types";

export function SavedList({ products }: { products: ProductSummary[] }) {
  return (
    <ProductGrid
      products={products}
      emptyTitle="No saved products yet"
      emptyDescription="Tap the bookmark icon on any product to save it here."
    />
  );
}
