import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/lib/types";

export function SectionRow({
  title,
  products,
  viewAllHref,
}: {
  title: string;
  products: ProductSummary[];
  viewAllHref?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-3 py-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm font-medium text-ink-soft">
            View all
          </Link>
        )}
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} className="w-32 shrink-0" />
        ))}
      </div>
    </section>
  );
}
