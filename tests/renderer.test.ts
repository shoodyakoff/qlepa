import os from "node:os";
import path from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

const mockState = vi.hoisted(() => {
  const calls: string[] = [];
  const page = {
    goto: vi.fn(async () => {
      calls.push("goto");
    }),
    evaluate: vi.fn(async () => {
      calls.push("evaluate");
    }),
    screenshot: vi.fn(async () => {
      calls.push("screenshot");
    }),
  };
  const browser = {
    newPage: vi.fn(async () => {
      calls.push("newPage");
      return page;
    }),
    close: vi.fn(async () => {
      calls.push("close");
    }),
  };
  const launch = vi.fn(async () => {
    calls.push("launch");
    return browser;
  });

  return { browser, calls, launch, page };
});

vi.mock("@playwright/test", () => ({
  chromium: {
    launch: mockState.launch,
  },
}));

import { renderRouteToPng } from "../src/lib/renderer";

describe("renderRouteToPng", () => {
  beforeEach(() => {
    mockState.calls.length = 0;
    vi.clearAllMocks();
  });

  it("waits for page images to decode before taking the screenshot", async () => {
    await renderRouteToPng({
      url: "http://127.0.0.1/render/cover",
      outputPath: path.join(os.tmpdir(), "carousel-renderer-test", "cover.png"),
      viewport: { width: 1080, height: 1350 },
    });

    expect(mockState.calls).toEqual([
      "launch",
      "newPage",
      "goto",
      "evaluate",
      "screenshot",
      "close",
    ]);
    expect(mockState.page.evaluate).toHaveBeenCalledWith(expect.any(Function));
  });
});
