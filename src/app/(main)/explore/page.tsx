import { getProducts, getCategories } from "@/lib/products";
import { PRODUCT_TYPES, type ProductType } from "@/lib/types";
import { FilterBar } from "@/components/explore/FilterBar";
import { SearchInput } from "@/components/explore/SearchInput";
import { ExploreResults } from "@/components/explore/ExploreResults";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const typeParam = typeof searchParams.type === "string" ? searchParams.type : undefined;
  const type = PRODUCT_TYPES.includes(typeParam as ProductType)
    ? (typeParam as ProductType)
    : undefined;
  const sort = searchParams.sort === "trending" ? "trending" : "newest";
  const focusSearch = searchParams.focus === "search";

  const [{ products, hasMore }, categories] = await Promise.all([
    getProducts({ q, category, type, sort, page: 1 }),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <SearchInput autoFocus={focusSearch} />
      <FilterBar categories={categories} />
      <ExploreResults initialProducts={products} initialHasMore={hasMore} />
    </div>
  );
}
