import { describe, expect, it } from "vitest";

import { formatCliError } from "../src/lib/cli-errors";

describe("CLI error formatting", () => {
  it("keeps usage errors concise", () => {
    expect(formatCliError(new Error("Usage: pnpm carousel build <post-path> [--watch]"))).toBe(
      "Usage: pnpm carousel build <post-path> [--watch]",
    );
  });

  it("adds a post path hint for missing input paths", () => {
    expect(formatCliError(new Error("Post path does not exist: posts/missing"))).toBe(
      [
        "Post path does not exist: posts/missing",
        "Hint: pass a post directory containing post.md, or pass the markdown file directly.",
      ].join("\n"),
    );
  });

  it("adds a README hint for malformed post markdown", () => {
    expect(formatCliError(new Error("Unknown slide block kind: slide-table"))).toBe(
      [
        "Unknown slide block kind: slide-table",
        "Hint: compare the post.md structure with the examples in README.md.",
      ].join("\n"),
    );
  });

  it("formats unknown thrown values without a stack trace", () => {
    expect(formatCliError("boom")).toBe("boom");
  });
});
