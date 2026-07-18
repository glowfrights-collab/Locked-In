import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

type Row = {
  id: string;
  title: string;
  slug: string;
  type: string;
  isActive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
};

export function ProductTable({ products }: { products: Row[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-ink-soft">No products yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-muted text-xs uppercase text-ink-faint">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {products.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 font-medium text-ink">{p.title}</td>
              <td className="px-4 py-3 text-ink-soft">{p.type}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {!p.isActive && <Badge tone="neutral">Inactive</Badge>}
                  {p.isFeatured && <Badge tone="accent">Featured</Badge>}
                  {p.isTrending && <Badge tone="pending">Trending</Badge>}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/admin/products/${p.id}`} className="font-medium text-accent">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
