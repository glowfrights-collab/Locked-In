import Image from "next/image";
import { resolveImageSource, PREVIEW_WIDTH, PREVIEW_HEIGHT } from "@/lib/images";

/** Always render inside a `relative` container with a fixed aspect ratio — this uses `fill`. */
export function ProductImage({
  seed,
  alt,
  priority,
  sizes = "(max-width: 640px) 50vw, 320px",
  className,
  sourceWidth = PREVIEW_WIDTH,
  sourceHeight = PREVIEW_HEIGHT,
}: {
  seed: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Size requested from the picsum placeholder — bump this for large/hero displays. Has no effect on your own uploaded files or URLs (they use their real resolution). */
  sourceWidth?: number;
  sourceHeight?: number;
}) {
  const { src, unoptimized } = resolveImageSource(seed, sourceWidth, sourceHeight);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      quality={90}
      priority={priority}
      unoptimized={unoptimized}
      loading={priority ? undefined : "lazy"}
      className={className}
    />
  );
}
