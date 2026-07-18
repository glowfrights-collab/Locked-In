import { prisma } from "@/lib/db";
import { verifyDownloadToken } from "@/lib/download/token";
import { fetchFileBytes, bufferToStream } from "@/lib/download/stream";
import { createZip } from "@/lib/download/zip";
import { recomputeProductStatus } from "@/lib/unlock/progress";
import { logEvent } from "@/lib/analytics";

async function streamSingleFile(
  product: { id: string; slug: string },
  file: { id: string; seed: string; width: number; height: number; label?: string | null },
  token: string,
  userId: string,
  alreadyLogged: boolean
) {
  const { buffer, contentType, extension } = await fetchFileBytes(file.seed, file.width, file.height);

  if (!alreadyLogged) {
    await prisma.download.create({
      data: { userId, productId: product.id, productFileId: file.id, token },
    });
    logEvent("PRODUCT_DOWNLOADED", { userId, productId: product.id });
  }

  const baseName = file.label?.trim() ? `${product.slug}-${file.label.trim()}` : product.slug;

  return new Response(bufferToStream(buffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${baseName}${extension}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(_request: Request, { params }: { params: { token: string } }) {
  const payload = verifyDownloadToken(params.token);
  if (!payload) {
    return new Response("Download link is invalid or has expired.", { status: 403 });
  }

  const product = await prisma.product.findUnique({
    where: { id: payload.productId },
    include: {
      unlockRequirements: { where: { enabled: true } },
      files: { where: { kind: "download" }, orderBy: { sortOrder: "asc" } },
    },
  });
  if (!product || !product.isActive || product.files.length === 0) {
    return new Response("File not found.", { status: 404 });
  }

  // Defense in depth: re-verify the unlock status server-side even though the
  // token itself was only minted after a prior check.
  const { status } = await recomputeProductStatus(
    payload.userId,
    payload.productId,
    product.unlockRequirements
  );
  if (status !== "Unlocked") {
    return new Response("Product is not unlocked.", { status: 403 });
  }

  const alreadyLogged = Boolean(
    await prisma.download.findFirst({ where: { token: params.token } })
  );

  // A specific file was requested (e.g. clicking "Download" on one image on
  // the product page) — serve just that file, never a zip.
  if (payload.fileId) {
    const file = product.files.find((f) => f.id === payload.fileId);
    if (!file) {
      return new Response("File not found.", { status: 404 });
    }
    return streamSingleFile(product, file, params.token, payload.userId, alreadyLogged);
  }

  if (product.files.length === 1) {
    return streamSingleFile(product, product.files[0], params.token, payload.userId, alreadyLogged);
  }

  // No specific file requested and there are multiple — bundle into a zip.
  const entries = await Promise.all(
    product.files.map(async (file, index) => {
      const { buffer, extension } = await fetchFileBytes(file.seed, file.width, file.height);
      const name = file.label?.trim() || `${product.slug}-${index + 1}`;
      return { file, name: `${name}${extension}`, buffer };
    })
  );

  if (!alreadyLogged) {
    for (const { file } of entries) {
      await prisma.download.create({
        data: { userId: payload.userId, productId: payload.productId, productFileId: file.id, token: params.token },
      });
    }
    logEvent("PRODUCT_DOWNLOADED", { userId: payload.userId, productId: payload.productId });
  }

  const zip = createZip(entries.map(({ name, buffer }) => ({ name, data: buffer })));

  return new Response(bufferToStream(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${product.slug}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
