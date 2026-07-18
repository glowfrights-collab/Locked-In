"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ProductSummary } from "@/lib/types";

export function ExploreResults({
  initialProducts,
  initialHasMore,
}: {
  initialProducts: ProductSummary[];
  initialHasMore: boolean;
}) {
  const searchParams = useSearchParams();
  const filterKey = searchParams.toString();

  const [products, setProducts] = useState(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters changed (category/type/sort/search) — reset to the server-provided first page.
  useEffect(() => {
    setProducts(initialProducts);
    setHasMore(initialHasMore);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  async function loadMore() {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page + 1));
    const res = await fetch(`/api/products?${params.toString()}`);
    const data: { products: ProductSummary[]; hasMore: boolean } = await res.json();
    setProducts((prev) => [...prev, ...data.products]);
    setHasMore(data.hasMore);
    setPage((p) => p + 1);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <ProductGrid products={products} priorityCount={4} />
      {loading && <Skeleton variant="grid" count={2} />}
      {hasMore && !loading && (
        <Button variant="secondary" size="md" onClick={loadMore} className="self-center">
          Load more
        </Button>
      )}
    </div>
  );
}
