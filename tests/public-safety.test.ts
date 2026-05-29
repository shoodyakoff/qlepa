import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

const forbiddenTrackedText = [
  "Hoo" + "dyakoff",
  "hoo" + "dyakoff",
  "Sta" + "s",
  "Ст" + "ас",
  "Худ" + "яков",
  "соло" + "-фаундер",
  "Соло" + "-фаундер",
  "1 " + "млн" + "/мес",
  "vibe" + "coding",
  "вайб" + "кодинг",
  "Путь к " + "1 " + "млн",
  "Claude делает " + "инструменты",
  "@st" + "as",
  "ре" + "зюме",
  "фар" + "ма",
  "фин" + "ансы",
  "PDF" + "-гайд",
  "мини" + "-ап",
] as const;

const mediaFilePattern = /\.(?:jpg|jpeg|png|webp|gif|mp4|mov|wav|mp3)$/iu;
const textFilePattern = /\.(?:md|ts|tsx|json|html|css|gitignore)$/iu;

describe("public repository safety", () => {
  it("does not track private media assets", async () => {
    const trackedFiles = await listTrackedFiles();
    expect(trackedFiles.filter((file) => mediaFilePattern.test(file))).toEqual([]);
  });

  it("does not track private brand or post markers", async () => {
    const trackedFiles = (await listTrackedFiles()).filter((file) => textFilePattern.test(file));
    const findings: string[] = [];

    for (const file of trackedFiles) {
      const content = await readFile(file, "utf8");
      for (const marker of forbiddenTrackedText) {
        if (content.includes(marker)) {
          findings.push(`${file}: ${marker}`);
        }
      }
    }

    expect(findings).toEqual([]);
  });

  it("ignores local-only onboarding files and generated media", async () => {
    const localOnlyPaths = [
      ".claude/settings.local.json",
      ".env",
      ".env.local",
      "CAROUSEL_PLAYBOOK.md",
      "outputs/report/preview.png",
      "private/notes.md",
      "brand/voice.local.md",
      "assets/face-refs/face.jpg",
      "assets/face-refs/body.PNG",
      "assets/generated/cache.PNG",
      "posts/2026-05-29-private/post.md",
      "posts/2026-05-29-private/out/01-cover.PNG",
      "examples/reference.PNG",
      "IMG_4648.PNG",
      "cover.JPEG",
    ] as const;
    const missed: string[] = [];

    for (const filePath of localOnlyPaths) {
      try {
        await execFileAsync("git", ["check-ignore", "-q", filePath]);
      } catch {
        missed.push(filePath);
      }
    }

    expect(missed).toEqual([]);
  });
});

async function listTrackedFiles(): Promise<readonly string[]> {
  const { stdout } = await execFileAsync("git", ["ls-files"]);
  return stdout.split("\n").filter(Boolean);
}
