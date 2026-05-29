import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  computeImageCacheKey,
  fingerprintFile,
  getImageCachePaths,
  readImageCacheMetadata,
  writeImageCacheMetadata,
} from "../src/lib/image-cache";

describe("image cache", () => {
  it("computes stable 16 character keys from prompt inputs", () => {
    const first = computeImageCacheKey({
      fullPrompt: "prompt",
      faceRefFingerprint: "face-md5",
      bodyRefFingerprint: "body-md5",
      styleRefFingerprint: "style-md5",
      size: "1080x1350",
      imagePathLabel: "codex-image-mode-a",
    });
    const second = computeImageCacheKey({
      fullPrompt: "prompt",
      faceRefFingerprint: "face-md5",
      bodyRefFingerprint: "body-md5",
      styleRefFingerprint: "style-md5",
      size: "1080x1350",
      imagePathLabel: "codex-image-mode-a",
    });

    expect(first).toBe(second);
    expect(first).toMatch(/^[0-9a-f]{16}$/u);
  });

  it("fingerprints a local reference file with md5", async () => {
    const dir = await makeTempDir();
    const filePath = path.join(dir, "face.jpg");
    await writeFile(filePath, "reference");

    await expect(fingerprintFile(filePath)).resolves.toMatch(/^[0-9a-f]{32}$/u);

    await rm(dir, { recursive: true, force: true });
  });

  it("writes and reads cache metadata beside the generated PNG path", async () => {
    const dir = await makeTempDir();
    const paths = getImageCachePaths(dir, "abc123");

    await writeImageCacheMetadata(paths.metadataPath, {
      cacheKey: "abc123",
      fullPrompt: "prompt",
      preset: "editorial",
      scene: "scene",
      wardrobe: "wardrobe",
      size: "1080x1350",
      imagePathLabel: "codex-image-mode-a",
      referenceFingerprints: {
        face: "face",
        body: "body",
        style: "style",
      },
      createdAt: "2026-05-20T00:00:00.000Z",
    });

    const raw = await readFile(paths.metadataPath, "utf8");
    expect(raw).toContain("\"cacheKey\": \"abc123\"");

    await expect(readImageCacheMetadata(paths.metadataPath)).resolves.toMatchObject({
      cacheKey: "abc123",
      preset: "editorial",
    });

    await rm(dir, { recursive: true, force: true });
  });
});

async function makeTempDir(): Promise<string> {
  const dir = path.join(os.tmpdir(), `qlepa-${crypto.randomUUID()}`);
  await mkdir(dir, { recursive: true });
  return dir;
}
