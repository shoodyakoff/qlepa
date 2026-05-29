import path from "node:path";
import { describe, expect, it } from "vitest";

import { getRenderTestRequest } from "../src/commands/render-test";
import { readPngDimensionsFromBuffer } from "../src/lib/png";

describe("render-test command planning", () => {
  it("targets the cover render route and expected output path", () => {
    const request = getRenderTestRequest({
      projectRoot: "/project",
    });

    expect(request.route).toBe("/render/cover");
    expect(request.outputPath).toBe(path.join("/project", "out/test/cover.png"));
    expect(request.viewport).toEqual({ width: 1080, height: 1350 });
  });

  it("treats render-test as independent from local root reference images", () => {
    const request = getRenderTestRequest({
      projectRoot: "/project",
    });

    expect(request.query.backgroundImage).toBeUndefined();
    expect(request.query.title).toContain("carousel");
  });
});

describe("PNG dimension reader", () => {
  it("reads width and height from a PNG header", () => {
    const png = Buffer.alloc(24);
    png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
    png.writeUInt32BE(1080, 16);
    png.writeUInt32BE(1350, 20);

    expect(readPngDimensionsFromBuffer(png)).toEqual({
      width: 1080,
      height: 1350,
    });
  });
});
