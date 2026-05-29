import { createRenderUrl } from "../lib/build-plan.ts";
import { withViteServer } from "../lib/renderer.ts";
import { createBuildPlanForPostPath } from "./build.ts";

export type PreviewArgs = {
  postPath: string;
};

export type CreatePreviewUrlsOptions = {
  postPath: string;
  projectRoot: string;
  baseUrl: string;
};

export function parsePreviewArgs(args: readonly string[]): PreviewArgs {
  const [postPath, ...rest] = args;

  if (!postPath || rest.length > 0) {
    throw new Error("Usage: pnpm carousel preview <post-path>");
  }

  return { postPath };
}

export async function createPreviewUrls(options: CreatePreviewUrlsOptions): Promise<readonly string[]> {
  const plan = await createBuildPlanForPostPath(options.postPath, options.projectRoot);
  return plan.requests.map((request) => createRenderUrl(options.baseUrl, request));
}

export async function runPreviewCommand(
  args: readonly string[],
  projectRoot = process.cwd(),
): Promise<void> {
  const parsed = parsePreviewArgs(args);

  await withViteServer(projectRoot, async (baseUrl) => {
    const urls = await createPreviewUrls({
      postPath: parsed.postPath,
      projectRoot,
      baseUrl,
    });

    console.log(`Preview server: ${baseUrl}`);
    for (const [index, url] of urls.entries()) {
      console.log(`${index + 1}. ${url}`);
    }
    console.log("");
    console.log("Press Ctrl+C to stop preview.");

    await waitForever();
  });
}

async function waitForever(): Promise<never> {
  return new Promise(() => undefined);
}
