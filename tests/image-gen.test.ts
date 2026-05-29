import { mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { buildImageGenerationPlan, renderPromptTemplate } from "../src/lib/image-gen";

describe("image prompt builder", () => {
  it("substitutes prompt variables without invoking image generation", () => {
    const prompt = renderPromptTemplate(
      "Scene: {scene}\nWardrobe: {wardrobe}\nStyle: {style_directives}\nRefs: {face_ref}, {body_ref}, {style_ref}",
      {
        scene: "blue sky",
        wardrobe: "taupe overshirt",
        styleDirectives: "editorial daylight",
        faceRef: "face.jpg",
        bodyRef: "rost.png",
        styleRef: "cover.jpeg",
      },
    );

    expect(prompt).toContain("Scene: blue sky");
    expect(prompt).toContain("Wardrobe: taupe overshirt");
    expect(prompt).toContain("Refs: face.jpg, rost.png, cover.jpeg");
  });

  it("builds a cache miss plan with expected save paths", async () => {
    const dir = await makeTempDir();
    await mkdir(path.join(dir, "brand/prompts"), { recursive: true });
    await mkdir(path.join(dir, "assets/generated"), { recursive: true });
    await mkdir(path.join(dir, "assets/face-refs"), { recursive: true });
    await writeFile(
      path.join(dir, "brand/prompts/editorial.md"),
      "Generate for {scene} wearing {wardrobe}. Refs: {face_ref}, {body_ref}, {style_ref}. {style_directives}",
    );
    await writeFile(path.join(dir, "assets/face-refs/face.jpg"), "face");
    await writeFile(path.join(dir, "assets/face-refs/body.jpg"), "body");
    await writeFile(path.join(dir, "assets/face-refs/style.jpg"), "style");
    await writeFile(path.join(dir, "face.jpg"), "root face should not be used");
    await writeFile(path.join(dir, "rost.png"), "root body should not be used");
    await writeFile(path.join(dir, "cover.jpeg"), "root style should not be used");

    const plan = await buildImageGenerationPlan({
      projectRoot: dir,
      preset: "editorial",
      scene: "low-angle blue sky",
      wardrobe: "taupe overshirt",
      styleDirectives: "outdoor editorial",
      waitForFile: false,
    });

    expect(plan.status).toBe("miss");
    expect(plan.cacheKey).toMatch(/^[0-9a-f]{16}$/u);
    expect(plan.paths.pngPath).toBe(path.join(dir, "assets/generated", `${plan.cacheKey}.png`));
    expect(plan.finalPrompt).toContain("low-angle blue sky");
    expect(plan.finalPrompt).toContain(path.join(dir, "assets/face-refs/face.jpg"));
    expect(plan.finalPrompt).toContain(path.join(dir, "assets/face-refs/body.jpg"));
    expect(plan.finalPrompt).toContain(path.join(dir, "assets/face-refs/style.jpg"));
    expect(plan.finalPrompt).not.toContain(path.join(dir, "face.jpg"));
    expect(plan.finalPrompt).not.toContain(path.join(dir, "rost.png"));
    expect(plan.finalPrompt).not.toContain(path.join(dir, "cover.jpeg"));

    await rm(dir, { recursive: true, force: true });
  });

  it("keeps the outdoor arrow preset strict about preserving the original poster layout", async () => {
    const plan = await buildImageGenerationPlan({
      projectRoot: process.cwd(),
      preset: "cover",
      scene: "low-angle blue sky with orange arrow structure",
      wardrobe: "taupe overshirt, gray t-shirt, cap, glasses",
      waitForFile: false,
    });

    expect(plan.preset).toBe("outdoor-editorial-arrow");
    expect(plan.finalPrompt).toContain("STRICT LAYOUT, CAMERA, AND COMPOSITION");
    expect(plan.finalPrompt).toContain("left 55% of the image must remain mostly clean blue sky");
    expect(plan.finalPrompt).toContain("This is the only Qlepa photo-cover pattern for the MVP");
    expect(plan.finalPrompt).toContain("If no style reference is attached, ignore that line and follow this written layout");
    expect(plan.finalPrompt).toContain("Do not make the person fill the whole image");
    expect(plan.finalPrompt).not.toContain("standing confidently in the low-angle blue-sky scene");
  });
});

async function makeTempDir(): Promise<string> {
  const dir = path.join(os.tmpdir(), `qlepa-${crypto.randomUUID()}`);
  await mkdir(dir, { recursive: true });
  return dir;
}
