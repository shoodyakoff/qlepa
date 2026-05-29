import { mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { createPreviewUrls, parsePreviewArgs } from "../src/commands/preview";

describe("preview command", () => {
  it("parses the required post path", () => {
    expect(parsePreviewArgs(["posts/example"])).toEqual({ postPath: "posts/example" });
  });

  it("requires a post path", () => {
    expect(() => parsePreviewArgs([])).toThrow("Usage: pnpm carousel preview <post-path>");
  });

  it("creates preview URLs for every slide in a post directory", async () => {
    const dir = await makeTempPostDir();

    const urls = await createPreviewUrls({
      postPath: "post",
      projectRoot: dir.root,
      baseUrl: "http://127.0.0.1:4173",
    });

    expect(urls).toHaveLength(2);
    expect(urls[0]).toContain("/render/cover?");
    expect(urls[1]).toContain("/render/quote?");
    expect(urls[1]).toContain("quote=");

    await rm(dir.root, { recursive: true, force: true });
  });
});

async function makeTempPostDir(): Promise<{ root: string }> {
  const root = path.join(os.tmpdir(), `qlepa-preview-${crypto.randomUUID()}`);
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

## slide-quote
quote: "The repo is the factory."
author: "— Qlepa"
`,
  );
  return { root };
}
