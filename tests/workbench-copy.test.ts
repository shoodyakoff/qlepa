import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("workbench landing copy", () => {
  it("frames the root dev page as a render workbench, not the full pipeline", async () => {
    const source = await readFile("src/main.tsx", "utf8");

    expect(source).toContain("Render workbench");
    expect(source).toContain("Dev-only template routes");
    expect(source).toContain("carousel preview <post-path>");
    expect(source).not.toContain("Stage 1 skeleton");
  });
});
