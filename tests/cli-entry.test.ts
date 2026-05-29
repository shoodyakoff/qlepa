import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("carousel CLI entrypoint", () => {
  it("prints help for --help", async () => {
    const { stdout } = await execFileAsync(process.execPath, [
      "--experimental-strip-types",
      "src/cli.ts",
      "--help",
    ]);

    expect(stdout).toContain("Qlepa");
    expect(stdout).toContain("build <post-path>");
  });

  it("prints onboarding instructions from the CLI entrypoint", async () => {
    const { stdout } = await execFileAsync(process.execPath, [
      "--experimental-strip-types",
      "src/cli.ts",
      "onboard",
    ]);

    expect(stdout).toContain("Онбординг Qlepa");
    expect(stdout).toContain("Пришлите в чат");
    expect(stdout).toContain("Локальные шрифты лучше не менять");
    expect(stdout).toContain("assets/face-refs/face.jpg");
    expect(stdout).toContain("npm run start");
  });

  it("prints onboarding and ready state from the start entrypoint", async () => {
    const { stdout } = await execFileAsync(process.execPath, [
      "--experimental-strip-types",
      "src/cli.ts",
      "start",
    ]);

    expect(stdout).toContain("Онбординг Qlepa");
    expect(stdout).toContain("Qlepa doctor");
    expect(stdout).toContain("READY TO RUN");
  });
});
