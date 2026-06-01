import { mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { collectDoctorChecks, formatDoctorReport } from "../src/commands/doctor";

describe("doctor command", () => {
  it("passes core setup while warning about missing private references", async () => {
    const dir = await makeTempProject();

    const checks = await collectDoctorChecks(dir, { nodeVersion: "24.14.1" });
    const report = formatDoctorReport(checks);

    expect(report).toContain("Qlepa doctor");
    expect(report).toContain("PASS Node");
    expect(report).toContain("PASS brand prompts");
    expect(report).toContain("PASS starter digest");
    expect(report).toContain("WARN face reference");
    expect(report).toContain("WARN body reference");
    expect(checks.some((check) => check.status === "FAIL")).toBe(false);

    await rm(dir, { recursive: true, force: true });
  });
});

async function makeTempProject(): Promise<string> {
  const dir = path.join(os.tmpdir(), `qlepa-doctor-${crypto.randomUUID()}`);
  await mkdir(path.join(dir, "brand/prompts"), { recursive: true });
  await mkdir(path.join(dir, "brand/fonts"), { recursive: true });
  await mkdir(path.join(dir, "assets/face-refs"), { recursive: true });
  await mkdir(path.join(dir, "assets/generated"), { recursive: true });
  await mkdir(path.join(dir, "posts/starter-post"), { recursive: true });
  await mkdir(path.join(dir, "posts/starter-digest"), { recursive: true });
  await writeFile(path.join(dir, "brand/prompts/editorial.md"), "Generate {scene}");
  await writeFile(path.join(dir, "brand/fonts/tektur-900.ttf"), "font");
  await writeFile(path.join(dir, "posts/starter-post/post.md"), "---\nslug: starter\n---\n");
  await writeFile(path.join(dir, "posts/starter-digest/post.md"), "---\nslug: starter-digest\n---\n");
  await writeFile(path.join(dir, "package.json"), "{}");
  return dir;
}
