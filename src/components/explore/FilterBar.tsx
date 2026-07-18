"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PRODUCT_TYPES, type ProductType } from "@/lib/types";

const TYPE_LABELS: Record<ProductType, string> = {
  WALLPAPER: "Wallpaper",
  PROMPT: "Prompt",
  BUNDLE: "Bundle",
};

export function FilterBar({
  categories,
}: {
  categories: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeType = searchParams.get("type");
  const activeSort = searchParams.get("sort") ?? "newest";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        <button
          onClick={() => updateParam("category", null)}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium",
            !activeCategory ? "bg-ink text-white" : "bg-surface-muted text-ink-soft"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => updateParam("category", activeCategory === cat.slug ? null : cat.slug)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium",
              activeCategory === cat.slug
                ? "bg-ink text-white"
                : "bg-surface-muted text-ink-soft"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {PRODUCT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => updateParam("type", activeType === type ? null : type)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium",
                activeType === type
                  ? "border-ink bg-ink text-white"
                  : "border-surface-border text-ink-soft"
              )}
            >
              {TYPE_LABELS[type]}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-full bg-surface-muted p-1">
          {(["newest", "trending"] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => updateParam("sort", sort === "newest" ? null : sort)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                activeSort === sort ? "bg-surface text-ink shadow-sm" : "text-ink-faint"
              )}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
