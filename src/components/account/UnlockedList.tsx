import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductSummary } from "@/lib/types";

export function UnlockedList({ products }: { products: ProductSummary[] }) {
  return (
    <ProductGrid
      products={products}
      emptyTitle="Nothing unlocked yet"
      emptyDescription="Unlock a wallpaper to see it here."
    />
  );
}
