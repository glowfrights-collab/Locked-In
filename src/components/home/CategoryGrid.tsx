import { CategoryTile } from "@/components/home/CategoryTile";

export function CategoryGrid({
  categories,
}: {
  categories: { name: string; slug: string }[];
}) {
  return (
    <section className="flex flex-col gap-3 px-4 py-4">
      <h2 className="text-lg font-semibold text-ink">Categories</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {categories.map((category) => (
          <CategoryTile key={category.slug} name={category.name} slug={category.slug} />
        ))}
      </div>
    </section>
  );
}
