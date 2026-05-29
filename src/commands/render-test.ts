import path from "node:path";

import { tokens } from "../../brand/tokens.ts";
import { renderRouteToPng, type Viewport, withViteServer } from "../lib/renderer.ts";

export type RenderTestRequest = {
  route: "/render/cover";
  outputPath: string;
  viewport: Viewport;
  query: {
    title: string;
    subtitle: string;
    nickname: string;
    slideNumber: string;
    totalSlides: string;
    backgroundImage?: string;
  };
};

export type RenderTestRequestOptions = {
  projectRoot: string;
};

export function getRenderTestRequest(options: RenderTestRequestOptions): RenderTestRequest {
  return {
    route: "/render/cover",
    outputPath: path.join(options.projectRoot, "out/test/cover.png"),
    viewport: {
      width: tokens.sizes.slide.w,
      height: tokens.sizes.slide.h,
    },
    query: {
      title: "Turn one idea into a carousel",
      subtitle: "Draft, preview, and export a local social carousel.",
      nickname: tokens.brand.handle,
      slideNumber: "1",
      totalSlides: "6",
      backgroundImage: undefined,
    },
  };
}

export async function runRenderTestCommand(projectRoot = process.cwd()): Promise<void> {
  const request = getRenderTestRequest({ projectRoot });

  await withViteServer(projectRoot, async (baseUrl) => {
    const url = new URL(request.route, `${baseUrl}/`);

    for (const [key, value] of Object.entries(request.query)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }

    await renderRouteToPng({
      url: url.toString(),
      outputPath: request.outputPath,
      viewport: request.viewport,
    });
  });

  console.log(`Rendered ${path.relative(projectRoot, request.outputPath)}`);
}
