import { spawn } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

import {
  IMAGE_PATH_LABEL,
  IMAGE_SIZE,
  writeImageCacheMetadata,
} from "../lib/image-cache.ts";
import { buildImageGenerationPlan } from "../lib/image-gen.ts";
import { normalizePromptPreset } from "../lib/photo-cover.ts";

export type GenPhotoArgs = {
  preset: string;
  scene: string;
  wardrobe: string;
  waitForFile: boolean;
};

export function parseGenPhotoArgs(args: readonly string[]): GenPhotoArgs {
  const [preset, scene, ...rest] = args;

  if (!preset || !scene) {
    throw new Error(
      "Usage: pnpm carousel gen-photo cover <scene> [--wardrobe <text>] [--no-wait] (or <preset> for internal scenes)",
    );
  }

  let wardrobe = "casual editorial outfit";
  let waitForFile = true;

  for (let index = 0; index < rest.length; index += 1) {
    const item = rest[index];

    if (item === "--no-wait") {
      waitForFile = false;
      continue;
    }

    if (item === "--wardrobe") {
      const value = rest[index + 1];
      if (!value) {
        throw new Error("--wardrobe requires a value");
      }
      wardrobe = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown gen-photo option: ${item}`);
  }

  return { preset: normalizePromptPreset(preset), scene, wardrobe, waitForFile };
}

export async function runGenPhotoCommand(
  args: readonly string[],
  projectRoot = process.cwd(),
): Promise<void> {
  const parsed = parseGenPhotoArgs(args);
  const plan = await buildImageGenerationPlan({ projectRoot, ...parsed });

  if (plan.status === "hit") {
    console.log(`CACHE HIT ${path.relative(projectRoot, plan.paths.pngPath)}`);
    console.log(`Cache key: ${plan.cacheKey}`);
    return;
  }

  await mkdir(path.dirname(plan.paths.pngPath), { recursive: true });
  await writeImageCacheMetadata(plan.paths.metadataPath, {
    cacheKey: plan.cacheKey,
    fullPrompt: plan.finalPrompt,
    preset: parsed.preset,
    scene: parsed.scene,
    wardrobe: parsed.wardrobe,
    size: IMAGE_SIZE,
    imagePathLabel: IMAGE_PATH_LABEL,
    referenceFingerprints: {
      face: plan.references.faceFingerprint,
      body: plan.references.bodyFingerprint,
      style: plan.references.styleFingerprint,
    },
    createdAt: new Date().toISOString(),
  });

  const copied = await copyToClipboard(plan.finalPrompt);

  console.log(`CACHE MISS ${path.relative(projectRoot, plan.paths.pngPath)}`);
  console.log(`Cache key: ${plan.cacheKey}`);
  console.log(`Metadata: ${path.relative(projectRoot, plan.paths.metadataPath)}`);
  console.log(copied ? "Prompt copied to clipboard." : "Clipboard copy skipped or unavailable.");
  console.log("");
  console.log("Save the generated image to:");
  console.log(path.relative(projectRoot, plan.paths.pngPath));
  console.log("");
  console.log("Final prompt:");
  console.log(plan.finalPrompt);

  if (parsed.waitForFile) {
    await waitForGeneratedFile(plan.paths.pngPath);
    console.log(`Generated image found: ${path.relative(projectRoot, plan.paths.pngPath)}`);
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (process.platform !== "darwin") {
    return false;
  }

  return new Promise((resolve) => {
    const child = spawn("pbcopy");
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
    child.stdin.on("error", () => resolve(false));
    child.stdin.end(text);
  });
}

async function waitForGeneratedFile(filePath: string): Promise<void> {
  const timeoutMs = 10 * 60 * 1000;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isFile(filePath)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for ${filePath}`);
}

async function isFile(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}
