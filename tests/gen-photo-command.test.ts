import { execFile } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

import { parseGenPhotoArgs } from "../src/commands/gen-photo";

const execFileAsync = promisify(execFile);

describe("gen-photo command", () => {
  it("parses preset, scene, wardrobe, and no-wait flag", () => {
    expect(
      parseGenPhotoArgs([
        "editorial",
        "low angle blue sky",
        "--wardrobe",
        "taupe overshirt",
        "--no-wait",
      ]),
    ).toEqual({
      preset: "editorial",
      scene: "low angle blue sky",
      wardrobe: "taupe overshirt",
      waitForFile: false,
    });
  });

  it("prints cache miss instructions without waiting in no-wait mode", async () => {
    const dir = await makeTempDir();
    await mkdir(path.join(dir, "brand/prompts"), { recursive: true });
    await mkdir(path.join(dir, "assets/generated"), { recursive: true });
    await mkdir(path.join(dir, "assets/face-refs"), { recursive: true });
    await writeFile(
      path.join(dir, "brand/prompts/editorial.md"),
      "Generate {scene} with {wardrobe}. Refs: {face_ref}, {body_ref}",
    );
    await writeFile(path.join(dir, "assets/face-refs/face.jpg"), "face");
    await writeFile(path.join(dir, "assets/face-refs/body.jpg"), "body");

    const { stdout } = await execFileAsync(
      process.execPath,
      [
        "--experimental-strip-types",
        path.join(process.cwd(), "src/cli.ts"),
        "gen-photo",
        "editorial",
        "blue sky",
        "--wardrobe",
        "taupe overshirt",
        "--no-wait",
      ],
      { cwd: dir },
    );

    expect(stdout).toContain("CACHE MISS");
    expect(stdout).toContain("assets/generated/");
    expect(stdout).toContain("Generate blue sky with taupe overshirt");
    expect(stdout).toContain("assets/face-refs/face.jpg");

    await rm(dir, { recursive: true, force: true });
  });
});

async function makeTempDir(): Promise<string> {
  const dir = path.join(os.tmpdir(), `qlepa-${crypto.randomUUID()}`);
  await mkdir(dir, { recursive: true });
  return dir;
}
