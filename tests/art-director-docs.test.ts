import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const requiredDocs = [
  "docs/carousel-art-director.md",
  "docs/reference-driven-visual-pipeline.md",
  "docs/carousel-quality-rubric.md",
  "docs/visual-pattern-library.md",
  "docs/post-mortems/generic-template-reuse.md",
] as const;

const workflowTerms = [
  "source analysis",
  "story strategy",
  "visual direction",
  "slide brief",
  "self-review",
  "revision loop",
  "novelty",
  "visual specificity",
  "reference pattern extraction",
  "semantic selector",
  "capture console",
  "generated scene",
  "scene cadence",
  "character scene",
  "final legibility check",
  "semi-transparent text surface",
  "footer/copy collisions",
  "generated-image text artifacts",
  "user-specified visual rhythm",
  "infographic / generated image alternation",
  "quality gate",
  "reader-pain",
  "mechanism",
  "visual-route",
  "visual-reason",
  "human copy strategy",
  "human-carousel-copy",
  "stop-slop",
] as const;

describe("carousel art director documentation", () => {
  it("documents the universal self-checking carousel workflow", async () => {
    const combined = await readDocs(requiredDocs);

    for (const term of workflowTerms) {
      expect(combined).toContain(term);
    }
  });

  it("wires the workflow into agent-facing docs", async () => {
    const combined = await readDocs(["README.md", "docs/agent-dialogue.md", "brand/voice.md"]);

    expect(combined).toContain("carousel art director");
    expect(combined).toContain("reference-driven visual pipeline");
    expect(combined).toContain("quality rubric");
    expect(combined).toContain("revision loop");
  });
});

async function readDocs(files: readonly string[]): Promise<string> {
  const contents = await Promise.all(files.map((file) => readFile(file, "utf8")));
  return contents.join("\n").toLowerCase();
}
