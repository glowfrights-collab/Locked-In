import { DownloadFileCard } from "@/components/product/DownloadFileCard";
import { CheckIcon } from "@/components/ui/Icons";

export function DownloadFilesSection({
  productId,
  files,
}: {
  productId: string;
  files: { id: string; seed: string; label: string | null }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckIcon className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold text-ink">
          Unlocked — {files.length > 1 ? "your files are ready" : "your file is ready"}
        </h2>
      </div>
      <div className={files.length > 1 ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}>
        {files.map((file, i) => (
          <DownloadFileCard
            key={file.id}
            productId={productId}
            file={file}
            fallbackLabel={files.length > 1 ? `File ${i + 1}` : "wallpaper"}
          />
        ))}
      </div>
    </div>
  );
}
