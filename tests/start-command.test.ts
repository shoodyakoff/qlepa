import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { buildStartText } from "../src/commands/start";

describe("start command", () => {
  it("combines onboarding with doctor and an explicit ready state", async () => {
    const dir = await makeTempProject();

    const text = await buildStartText(dir, { nodeVersion: "24.14.1" });

    expect(text).toContain("Онбординг Qlepa");
    expect(text).toContain("Qlepa doctor");
    expect(text).toContain("WARN face reference");
    expect(text).toContain("READY TO RUN");
    expect(text).toContain("Пришлите идею поста или черновик текста");
    expect(text).toContain("Если хотите начать работу, напишите в чат: старт");
    expect(text).not.toContain("NOT READY");

    await rm(dir, { recursive: true, force: true });
  });

  it("reports not ready when core setup has failures", async () => {
    const dir = path.join(os.tmpdir(), `qlepa-start-broken-${crypto.randomUUID()}`);
    await mkdir(dir, { recursive: true });

    const text = await buildStartText(dir, { nodeVersion: "24.14.1" });

    expect(text).toContain("Qlepa doctor");
    expect(text).toContain("FAIL package.json");
    expect(text).toContain("NOT READY");
    expect(text).toContain("Исправьте строки с FAIL");
    expect(text).toContain("После исправления снова запустите npm run start, затем напишите в чат: старт");
    expect(text).not.toContain("READY TO RUN");

    await rm(dir, { recursive: true, force: true });
  });

  it("exposes pnpm start through package scripts", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.start).toBe("node --experimental-strip-types src/cli.ts start");
  });
});

async function makeTempProject(): Promise<string> {
  const dir = path.join(os.tmpdir(), `qlepa-start-${crypto.randomUUID()}`);
  await mkdir(path.join(dir, "brand/prompts"), { recursive: true });
  await mkdir(path.join(dir, "brand/fonts"), { recursive: true });
  await mkdir(path.join(dir, "assets/face-refs"), { recursive: true });
  await mkdir(path.join(dir, "assets/generated"), { recursive: true });
  await mkdir(path.join(dir, "posts/starter-post"), { recursive: true });
  await writeFile(path.join(dir, "brand/prompts/editorial.md"), "Generate {scene}");
  await writeFile(path.join(dir, "brand/fonts/tektur-900.ttf"), "font");
  await writeFile(path.join(dir, "posts/starter-post/post.md"), "---\nslug: starter\n---\n");
  await writeFile(path.join(dir, "package.json"), "{}");
  return dir;
}
