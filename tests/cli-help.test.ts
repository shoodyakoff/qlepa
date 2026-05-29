import { describe, expect, it } from "vitest";

import { buildHelpText } from "../src/cli-help";

describe("Qlepa CLI help", () => {
  it("lists the MVP commands users need for the carousel pipeline", () => {
    const help = buildHelpText();

    expect(help).toContain("Qlepa");
    expect(help).toContain("start");
    expect(help).toContain("build <post-path>");
    expect(help).toContain("build <post-path> --watch");
    expect(help).toContain("preview <post-path>");
    expect(help).toContain("gen-photo <preset> <scene>");
    expect(help).toContain("onboard");
    expect(help).toContain("doctor");
    expect(help).toContain("render-test");
  });

  it("shows npm-run commands for users who do not have pnpm on PATH", () => {
    const help = buildHelpText();

    expect(help).toContain("npm run carousel -- onboard");
    expect(help).toContain("npm run carousel -- doctor");
    expect(help).toContain("npm run start");
  });

  it("keeps image generation framed as semi-automatic for the MVP", () => {
    const help = buildHelpText();

    expect(help).toContain("полуавтоматически");
    expect(help).not.toContain("OpenAI image API");
  });
});
