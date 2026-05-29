import { access, stat } from "node:fs/promises";
import path from "node:path";

import {
  computeImageCacheKey,
  fingerprintFile,
  fingerprintMissing,
  getImageCachePaths,
  IMAGE_PATH_LABEL,
  IMAGE_SIZE,
  type ImageCachePaths,
} from "./image-cache.ts";

export type PromptVariables = {
  scene: string;
  wardrobe: string;
  styleDirectives: string;
  faceRef: string;
  bodyRef: string;
  styleRef?: string;
};

export type BuildImageGenerationPlanOptions = {
  projectRoot: string;
  preset: string;
  scene: string;
  wardrobe?: string;
  styleDirectives?: string;
  waitForFile: boolean;
};

export type ImageGenerationPlan = {
  status: "hit" | "miss";
  cacheKey: string;
  finalPrompt: string;
  paths: ImageCachePaths;
  presetPath: string;
  references: {
    facePath?: string;
    bodyPath?: string;
    stylePath?: string;
    faceFingerprint: string;
    bodyFingerprint: string;
    styleFingerprint?: string;
  };
  waitForFile: boolean;
};

export function renderPromptTemplate(template: string, variables: PromptVariables): string {
  return template
    .replaceAll("{scene}", variables.scene)
    .replaceAll("{wardrobe}", variables.wardrobe)
    .replaceAll("{style_directives}", variables.styleDirectives)
    .replaceAll("{face_ref}", variables.faceRef)
    .replaceAll("{body_ref}", variables.bodyRef)
    .replaceAll("{style_ref}", variables.styleRef ?? "no style reference");
}

export async function buildImageGenerationPlan(
  options: BuildImageGenerationPlanOptions,
): Promise<ImageGenerationPlan> {
  const presetPath = path.join(options.projectRoot, "brand/prompts", `${options.preset}.md`);
  const template = await BunlessReadFile(presetPath);
  const references = await resolveReferenceFingerprints(options.projectRoot);
  const wardrobe = options.wardrobe ?? "casual editorial outfit";
  const styleDirectives = options.styleDirectives ?? "photorealistic editorial lighting, natural texture";

  const finalPrompt = renderPromptTemplate(template, {
    scene: options.scene,
    wardrobe,
    styleDirectives,
    faceRef: references.facePath ?? "face reference missing",
    bodyRef: references.bodyPath ?? "body reference missing",
    styleRef: references.stylePath,
  });

  const cacheKey = computeImageCacheKey({
    fullPrompt: finalPrompt,
    faceRefFingerprint: references.faceFingerprint,
    bodyRefFingerprint: references.bodyFingerprint,
    styleRefFingerprint: references.styleFingerprint,
    size: IMAGE_SIZE,
    imagePathLabel: IMAGE_PATH_LABEL,
  });
  const paths = getImageCachePaths(path.join(options.projectRoot, "assets/generated"), cacheKey);

  return {
    status: (await fileExists(paths.pngPath)) ? "hit" : "miss",
    cacheKey,
    finalPrompt,
    paths,
    presetPath,
    references,
    waitForFile: options.waitForFile,
  };
}

async function resolveReferenceFingerprints(projectRoot: string): Promise<ImageGenerationPlan["references"]> {
  const facePath = await firstExisting([path.join(projectRoot, "assets/face-refs/face.jpg")]);
  const bodyPath = await firstExisting([path.join(projectRoot, "assets/face-refs/body.jpg")]);
  const stylePath = await firstExisting([path.join(projectRoot, "assets/face-refs/style.jpg")]);

  return {
    facePath,
    bodyPath,
    stylePath,
    faceFingerprint: facePath ? await fingerprintFile(facePath) : fingerprintMissing("face"),
    bodyFingerprint: bodyPath ? await fingerprintFile(bodyPath) : fingerprintMissing("body"),
    styleFingerprint: stylePath ? await fingerprintFile(stylePath) : undefined,
  };
}

async function firstExisting(paths: readonly string[]): Promise<string | undefined> {
  for (const candidate of paths) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const result = await stat(filePath);
    return result.isFile();
  } catch {
    return false;
  }
}

async function BunlessReadFile(filePath: string): Promise<string> {
  await access(filePath);
  const { readFile } = await import("node:fs/promises");
  return readFile(filePath, "utf8");
}
