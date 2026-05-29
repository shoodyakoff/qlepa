import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("slide styles", () => {
  it("underlines the full highlighted headline word or line", async () => {
    const css = await readFile("src/styles.css", "utf8");

    expect(css).toContain(".editorial-slide__headline--poster .editorial-slide__headline-accent::after");
    expect(css).toContain("right: 0;");
  });
});
