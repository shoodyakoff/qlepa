import { mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { createBuildPlanForPostPath, parseBuildArgs } from "../src/commands/build";

describe("build command", () => {
  it("parses the required post path", () => {
    expect(parseBuildArgs(["posts/example"])).toEqual({ postPath: "posts/example", watch: false });
  });

  it("requires a post path", () => {
    expect(() => parseBuildArgs([])).toThrow("Usage: pnpm carousel build <post-path> [--watch]");
  });

  it("creates a render plan from a post directory", async () => {
    const dir = await makeTempPostDir();

    const plan = await createBuildPlanForPostPath("post", dir.root);

    expect(plan.requests.map((request) => path.basename(request.outputPath))).toEqual([
      "01-cover.png",
      "02-slide.png",
    ]);
    expect(plan.requests[0]?.route).toBe("/render/cover");
    expect(plan.requests[1]?.route).toBe("/render/text");

    await rm(dir.root, { recursive: true, force: true });
  });

  it("fails before render planning when editorial slides miss quality-gate fields", async () => {
    const dir = await makeTempPostDir({
      slide: `## slide-editorial
stage: "PROBLEM"
headline: |
  СЛАЙД
  ПУСТОЙ
body: |
  Пусто.
artifact: visuals
`,
    });

    await expect(createBuildPlanForPostPath("post", dir.root)).rejects.toThrow(
      "Carousel quality gate failed",
    );

    await rm(dir.root, { recursive: true, force: true });
  });
});

async function makeTempPostDir(options: { slide?: string } = {}): Promise<{ root: string }> {
  const root = path.join(os.tmpdir(), `qlepa-build-${crypto.randomUUID()}`);
  const postDir = path.join(root, "post");
  await mkdir(postDir, { recursive: true });
  await writeFile(
    path.join(postDir, "post.md"),
    `---
nickname: "@your_handle"
---

## cover
title: "Cover"
subtitle: "Sub"

${options.slide ?? `\
## slide-text
heading: "Heading"
body: |
  Body
`}
`,
  );
  return { root };
}
