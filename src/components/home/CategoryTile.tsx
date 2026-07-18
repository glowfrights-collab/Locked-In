import Link from "next/link";

export function CategoryTile({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/explore?category=${slug}`}
      className="flex h-16 items-center justify-center rounded-2xl bg-surface-muted px-3 text-center text-sm font-medium text-ink transition-colors active:bg-surface-border"
    >
      {name}
    </Link>
  );
}
