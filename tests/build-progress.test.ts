import { access, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { parseBuildArgs, runBuildOnce } from "../src/commands/build";
import type { CarouselBuildPlan } from "../src/lib/build-plan";
import type { RenderRouteToPngOptions } from "../src/lib/renderer";

describe("build progress", () => {
  it("parses watch mode for the build command", () => {
    expect(parseBuildArgs(["posts/example", "--watch"])).toEqual({
      postPath: "posts/example",
      watch: true,
    });
  });

  it("logs parse, per-slide render, and final output messages", async () => {
    const root = path.join(os.tmpdir(), `qlepa-progress-${crypto.randomUUID()}`);
    const outDir = path.join(root, "posts/example/out");
    const messages: string[] = [];
    const rendered: string[] = [];
    const plan: CarouselBuildPlan = {
      outDir,
      requests: [
        {
          route: "/render/cover",
          outputPath: path.join(outDir, "01-cover.png"),
          viewport: { width: 1080, height: 1350 },
          query: { title: "Cover", subtitle: "Sub" },
        },
        {
          route: "/render/text",
          outputPath: path.join(outDir, "02-slide.png"),
          viewport: { width: 1080, height: 1350 },
          query: { heading: "Heading", body: "Body" },
        },
      ],
    };

    await runBuildOnce("posts/example", {
      projectRoot: root,
      logger: (message) => messages.push(message),
      createPlan: async () => plan,
      withServer: async (_projectRoot, callback) => callback("http://127.0.0.1:4173"),
      renderRoute: async (options: RenderRouteToPngOptions) => {
        rendered.push(path.basename(options.outputPath));
      },
    });

    expect(rendered).toEqual(["01-cover.png", "02-slide.png"]);
    expect(messages).toEqual([
      "Parsing posts/example",
      "Rendering 2 slide(s) to posts/example/out",
      "[1/2] Rendering 01-cover.png",
      "[2/2] Rendering 02-slide.png",
      "Rendered 2 slide(s):",
      "- posts/example/out/01-cover.png",
      "- posts/example/out/02-slide.png",
    ]);

    await rm(root, { recursive: true, force: true });
  });

  it("removes stale PNG outputs that are not in the current render plan", async () => {
    const root = path.join(os.tmpdir(), `qlepa-stale-${crypto.randomUUID()}`);
    const outDir = path.join(root, "posts/example/out");
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "03-slide.png"), "stale");
    await writeFile(path.join(outDir, "notes.txt"), "keep");

    const plan: CarouselBuildPlan = {
      outDir,
      requests: [
        {
          route: "/render/cover",
          outputPath: path.join(outDir, "01-cover.png"),
          viewport: { width: 1080, height: 1350 },
          query: { title: "Cover", subtitle: "Sub" },
        },
        {
          route: "/render/text",
          outputPath: path.join(outDir, "02-slide.png"),
          viewport: { width: 1080, height: 1350 },
          query: { heading: "Heading", body: "Body" },
        },
      ],
    };

    await runBuildOnce("posts/example", {
      projectRoot: root,
      logger: () => undefined,
      createPlan: async () => plan,
      withServer: async (_projectRoot, callback) => callback("http://127.0.0.1:4173"),
      renderRoute: async (options: RenderRouteToPngOptions) => {
        await writeFile(options.outputPath, "fresh");
      },
    });

    const outputs = await readdir(outDir);
    expect(outputs.sort()).toEqual(["01-cover.png", "02-slide.png", "notes.txt"]);
    await expect(access(path.join(outDir, "03-slide.png"))).rejects.toThrow();

    await rm(root, { recursive: true, force: true });
  });
});
