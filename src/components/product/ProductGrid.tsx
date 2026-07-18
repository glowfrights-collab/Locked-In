import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ProductSummary } from "@/lib/types";

export function ProductGrid({
  products,
  emptyTitle = "No products found",
  emptyDescription = "Try a different search or filter.",
  priorityCount = 0,
}: {
  products: ProductSummary[];
  emptyTitle?: string;
  emptyDescription?: string;
  priorityCount?: number;
}) {
  if (products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < priorityCount} />
      ))}
    </div>
  );
}
