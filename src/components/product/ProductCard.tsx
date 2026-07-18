import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { UnlockRequirementLabel } from "@/components/product/UnlockRequirementLabel";
import type { ProductSummary } from "@/lib/types";

export function ProductCard({
  product,
  priority,
  className,
}: {
  product: ProductSummary;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group block ${className ?? ""}`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-muted">
        <ProductImage
          seed={product.previewImageSeed}
          alt={product.title}
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-200 group-active:scale-95"
        />
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <p className="truncate text-sm font-medium text-ink">{product.title}</p>
        <UnlockRequirementLabel methods={product.unlockMethods} />
      </div>
    </Link>
  );
}
