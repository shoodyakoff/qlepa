import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const IMAGE_SIZE = "1080x1350";
export const IMAGE_PATH_LABEL = "codex-image-mode-a";

export type ImageCacheKeyInput = {
  fullPrompt: string;
  faceRefFingerprint: string;
  bodyRefFingerprint: string;
  styleRefFingerprint?: string;
  size: string;
  imagePathLabel: string;
};

export type ImageCachePaths = {
  cacheKey: string;
  pngPath: string;
  metadataPath: string;
};

export type ImageCacheMetadata = {
  cacheKey: string;
  fullPrompt: string;
  preset: string;
  scene: string;
  wardrobe: string;
  size: string;
  imagePathLabel: string;
  referenceFingerprints: {
    face: string;
    body: string;
    style?: string;
  };
  createdAt: string;
};

export function computeImageCacheKey(input: ImageCacheKeyInput): string {
  const source = [
    input.fullPrompt,
    input.faceRefFingerprint,
    input.bodyRefFingerprint,
    input.styleRefFingerprint ?? "no-style-ref",
    input.size,
    input.imagePathLabel,
  ].join(" | ");

  return createHash("sha256").update(source).digest("hex").slice(0, 16);
}

export async function fingerprintFile(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  return createHash("md5").update(buffer).digest("hex");
}

export function fingerprintMissing(label: string): string {
  return `missing:${label}`;
}

export function getImageCachePaths(cacheRoot: string, cacheKey: string): ImageCachePaths {
  return {
    cacheKey,
    pngPath: path.join(cacheRoot, `${cacheKey}.png`),
    metadataPath: path.join(cacheRoot, `${cacheKey}.json`),
  };
}

export async function writeImageCacheMetadata(
  metadataPath: string,
  metadata: ImageCacheMetadata,
): Promise<void> {
  await mkdir(path.dirname(metadataPath), { recursive: true });
  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
}

export async function readImageCacheMetadata(metadataPath: string): Promise<ImageCacheMetadata> {
  return JSON.parse(await readFile(metadataPath, "utf8")) as ImageCacheMetadata;
}
