"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PRODUCT_TYPES, UNLOCK_METHODS, type ProductType, type UnlockMethod } from "@/lib/types";

type UnlockReqState = Record<UnlockMethod, { enabled: boolean; targetCount: number }>;

type InitialProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  resolution: string;
  fileFormat: string;
  deviceType: string;
  previewImageSeed: string;
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  categories: { category: { slug: string } }[];
  tags: { tag: { name: string } }[];
  unlockRequirements: { method: string; enabled: boolean; targetCount: number }[];
  files: { kind: string; label: string | null; seed: string; sortOrder: number }[];
};

type DownloadFileSlot = { seed: string; label: string };

const DEFAULT_REQS: UnlockReqState = {
  AD: { enabled: true, targetCount: 1 },
  SURVEY: { enabled: false, targetCount: 1 },
  REFERRAL: { enabled: false, targetCount: 1 },
};

export function ProductForm({
  initialProduct,
  categories,
}: {
  initialProduct?: InitialProduct;
  categories: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);

  const [title, setTitle] = useState(initialProduct?.title ?? "");
  const [slug, setSlug] = useState(initialProduct?.slug ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [type, setType] = useState<ProductType>((initialProduct?.type as ProductType) ?? "WALLPAPER");
  const [resolution, setResolution] = useState(initialProduct?.resolution ?? "1080x1920");
  const [fileFormat, setFileFormat] = useState(initialProduct?.fileFormat ?? "JPG");
  const [deviceType, setDeviceType] = useState(initialProduct?.deviceType ?? "Universal");
  const [previewImageSeed, setPreviewImageSeed] = useState(
    initialProduct?.previewImageSeed ?? initialProduct?.slug ?? ""
  );
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? false);
  const [isTrending, setIsTrending] = useState(initialProduct?.isTrending ?? false);
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialProduct?.categories.map((c) => c.category.slug) ?? []
  );
  const [tags, setTags] = useState(
    initialProduct?.tags.map((t) => t.tag.name).join(", ") ?? ""
  );
  const [downloadFiles, setDownloadFiles] = useState<[DownloadFileSlot, DownloadFileSlot]>(() => {
    const existing = (initialProduct?.files ?? [])
      .filter((f) => f.kind === "download")
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const slot = (i: number): DownloadFileSlot => ({
      seed: existing[i]?.seed ?? "",
      label: existing[i]?.label ?? "",
    });
    return [slot(0), slot(1)];
  });
  const [reqs, setReqs] = useState<UnlockReqState>(() => {
    if (!initialProduct) return DEFAULT_REQS;
    const state = { ...DEFAULT_REQS };
    for (const r of initialProduct.unlockRequirements) {
      state[r.method as UnlockMethod] = { enabled: r.enabled, targetCount: r.targetCount };
    }
    return state;
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleCategory(catSlug: string) {
    setSelectedCategories((prev) =>
      prev.includes(catSlug) ? prev.filter((c) => c !== catSlug) : [...prev, catSlug]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const body = {
      slug,
      title,
      description,
      type,
      resolution,
      fileFormat,
      deviceType,
      previewImageSeed: previewImageSeed || slug,
      isFeatured,
      isTrending,
      isActive,
      categorySlugs: selectedCategories,
      tagNames: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      downloadFiles: downloadFiles
        .filter((f) => f.seed.trim().length > 0)
        .map((f) => ({ seed: f.seed.trim(), label: f.label.trim() || undefined })),
      unlockRequirements: UNLOCK_METHODS.map((method) => ({
        method,
        enabled: reqs[method].enabled,
        targetCount: reqs[method].targetCount,
      })),
    };

    const res = await fetch(
      isEdit ? `/api/admin/products/${initialProduct!.id}` : "/api/admin/products",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not save product");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  async function handleRemove() {
    if (!initialProduct) return;
    if (!confirm("Remove this product? It will be hidden from the site but history is kept.")) return;
    await fetch(`/api/admin/products/${initialProduct.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input
        label="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
        pattern="[a-z0-9-]+"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="rounded-xl border border-surface-border bg-surface px-4 py-3 text-base text-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Type</label>
        <div className="flex gap-2">
          {PRODUCT_TYPES.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                type === t ? "border-ink bg-ink text-white" : "border-surface-border text-ink-soft"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Resolution" value={resolution} onChange={(e) => setResolution(e.target.value)} />
        <Input label="File format" value={fileFormat} onChange={(e) => setFileFormat(e.target.value)} />
        <Input label="Device type" value={deviceType} onChange={(e) => setDeviceType(e.target.value)} />
        <Input
          label="Image"
          value={previewImageSeed}
          onChange={(e) => setPreviewImageSeed(e.target.value)}
          placeholder="/products/my-file.jpg, a full URL, or a picsum seed"
        />
      </div>
      <p className="-mt-3 text-xs text-ink-faint">
        Drop your own file in <code>public/products/</code> and enter its path (e.g.{" "}
        <code>/products/my-file.jpg</code>), paste a full image URL, or leave a plain word to use a
        picsum.photos placeholder. This is just the on-site preview/mockup image.
      </p>

      <div className="flex flex-col gap-2 rounded-xl border border-surface-border p-3">
        <label className="text-sm font-medium text-ink">Download files</label>
        <p className="text-xs text-ink-faint">
          The actual file(s) the customer receives after unlocking — separate from the preview
          image above. Leave both blank to just download the preview image. Fill in one for a
          single download, or both to bundle them into a .zip (e.g. a Desktop and a Phone version).
        </p>
        {([0, 1] as const).map((i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <Input
              placeholder={`Label ${i + 1} (e.g. Desktop)`}
              value={downloadFiles[i].label}
              onChange={(e) =>
                setDownloadFiles((prev) => {
                  const next = [...prev] as [DownloadFileSlot, DownloadFileSlot];
                  next[i] = { ...next[i], label: e.target.value };
                  return next;
                })
              }
            />
            <Input
              placeholder={`/products/my-file-${i + 1}.jpg or a URL`}
              value={downloadFiles[i].seed}
              onChange={(e) =>
                setDownloadFiles((prev) => {
                  const next = [...prev] as [DownloadFileSlot, DownloadFileSlot];
                  next[i] = { ...next[i], seed: e.target.value };
                  return next;
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.slug}
              onClick={() => toggleCategory(cat.slug)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                selectedCategories.includes(cat.slug)
                  ? "border-ink bg-ink text-white"
                  : "border-surface-border text-ink-soft"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="neon, 4k, retro"
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Unlock methods</label>
        {UNLOCK_METHODS.map((method) => (
          <div key={method} className="flex items-center gap-3 rounded-xl border border-surface-border p-3">
            <input
              type="checkbox"
              checked={reqs[method].enabled}
              onChange={(e) =>
                setReqs((prev) => ({ ...prev, [method]: { ...prev[method], enabled: e.target.checked } }))
              }
            />
            <span className="w-24 text-sm text-ink">{method}</span>
            <input
              type="number"
              min={1}
              value={reqs[method].targetCount}
              disabled={!reqs[method].enabled}
              onChange={(e) =>
                setReqs((prev) => ({
                  ...prev,
                  [method]: { ...prev[method], targetCount: Number(e.target.value) || 1 },
                }))
              }
              className="h-9 w-16 rounded-lg border border-surface-border px-2 text-sm disabled:opacity-40"
            />
            <span className="text-xs text-ink-faint">target count</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} />
          Trending
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </Button>
        {isEdit && (
          <Button type="button" variant="secondary" onClick={handleRemove}>
            Remove
          </Button>
        )}
      </div>
    </form>
  );
}
