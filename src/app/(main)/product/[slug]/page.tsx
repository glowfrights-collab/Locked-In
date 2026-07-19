import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getProductBySlug, getSimilarProducts } from "@/lib/products";
import { getSessionUser } from "@/lib/session";
import { recomputeProductStatus } from "@/lib/unlock/progress";
import { logEvent } from "@/lib/analytics";
import { ProductImage } from "@/components/product/ProductImage";
import { DOWNLOAD_WIDTH, DOWNLOAD_HEIGHT } from "@/lib/images";
import { PreviewButton } from "@/components/product/PreviewButton";
import { SaveButton } from "@/components/product/SaveButton";
import { ProductUnlockSection } from "@/components/product/ProductUnlockSection";
import { SurveyCompleteModal } from "@/components/product/SurveyCompleteModal";
import { EmailCaptureForm } from "@/components/product/EmailCaptureForm";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/Badge";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { ref?: string; survey?: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.isActive) {
    notFound();
  }

  const user = await getSessionUser();
  const { status, methods } = await recomputeProductStatus(
    user?.id ?? null,
    product.id,
    product.unlockRequirements
  );
  const unlocked = status === "Unlocked";

  logEvent("PRODUCT_VIEWED", { userId: user?.id ?? null, productId: product.id });

  const isSaved = user
    ? Boolean(
        await prisma.savedProduct.findUnique({
          where: { userId_productId: { userId: user.id, productId: product.id } },
        })
      )
    : false;

  const similar = unlocked
    ? await getSimilarProducts(
        product.id,
        product.categories.map((c) => c.category.name)
      )
    : [];

  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      {unlocked && searchParams.survey === "done" && <SurveyCompleteModal />}

      {searchParams.ref === "welcome" && (
        <div className="rounded-2xl bg-accent-soft px-4 py-3 text-sm font-medium text-accent">
          You were invited to unlock this wallpaper. Thanks for checking it out!
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-surface-muted">
        <ProductImage
          seed={product.previewImageSeed}
          alt={product.title}
          priority
          sizes="(max-width: 640px) 100vw, 480px"
          sourceWidth={DOWNLOAD_WIDTH}
          sourceHeight={DOWNLOAD_HEIGHT}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-semibold text-ink">{product.title}</h1>
          <div className="flex shrink-0 gap-2">
            <SaveButton productId={product.id} initialSaved={isSaved} />
            <PreviewButton seed={product.previewImageSeed} title={product.title} />
          </div>
        </div>
        <p className="text-sm text-ink-soft">{product.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-surface-muted p-3">
          <p className="text-[11px] uppercase tracking-wide text-ink-faint">Resolution</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{product.resolution}</p>
        </div>
        <div className="rounded-2xl bg-surface-muted p-3">
          <p className="text-[11px] uppercase tracking-wide text-ink-faint">Format</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{product.fileFormat}</p>
        </div>
        <div className="rounded-2xl bg-surface-muted p-3">
          <p className="text-[11px] uppercase tracking-wide text-ink-faint">Device</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{product.deviceType}</p>
        </div>
      </div>

      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((t) => (
            <Badge key={t.tag.id} tone="neutral">
              {t.tag.name}
            </Badge>
          ))}
        </div>
      )}

      <ProductUnlockSection
        productId={product.id}
        methods={methods}
        initialUnlocked={unlocked}
        downloadFiles={product.files.map((f) => ({ id: f.id, seed: f.seed, label: f.label }))}
      />

      {unlocked && (
        <>
          <p className="text-center text-xs text-ink-faint">
            On iPhone, tap and hold the downloaded image to save it to Photos. On Android, check
            your Downloads folder or notification tray.
          </p>

          <EmailCaptureForm />

          {similar.length > 0 && (
            <div className="flex flex-col gap-3 pt-2">
              <h2 className="text-lg font-semibold text-ink">You might also like</h2>
              <ProductGrid products={similar} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
