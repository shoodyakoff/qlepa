import { watch } from "node:fs";
import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";

import { createCarouselBuildPlan, createRenderUrl, type CarouselBuildPlan } from "../lib/build-plan.ts";
import { assertCarouselQuality } from "../lib/carousel-quality.ts";
import { parsePostFile, resolvePostFileLocation } from "../lib/post-parser.ts";
import { consoleProgressLogger, type ProgressLogger } from "../lib/progress.ts";
import { renderRouteToPng, type RenderRouteToPngOptions, withViteServer } from "../lib/renderer.ts";
import { createSerializedRunner } from "../lib/watch.ts";

export type BuildArgs = {
  postPath: string;
  watch: boolean;
};

export type RunBuildOnceOptions = {
  projectRoot?: string;
  logger?: ProgressLogger;
  createPlan?: (postPath: string, projectRoot: string) => Promise<CarouselBuildPlan>;
  withServer?: (
    projectRoot: string,
    callback: (baseUrl: string) => Promise<void>,
  ) => Promise<void>;
  renderRoute?: (options: RenderRouteToPngOptions) => Promise<void>;
};

export function parseBuildArgs(args: readonly string[]): BuildArgs {
  const [postPath, ...rest] = args;

  if (!postPath) {
    throw new Error("Usage: pnpm carousel build <post-path> [--watch]");
  }

  let watch = false;

  for (const item of rest) {
    if (item === "--watch") {
      watch = true;
      continue;
    }

    throw new Error(`Unknown build option: ${item}`);
  }

  return { postPath, watch };
}

export async function createBuildPlanForPostPath(
  postPath: string,
  projectRoot = process.cwd(),
): Promise<CarouselBuildPlan> {
  const resolvedPostPath = path.isAbsolute(postPath) ? postPath : path.join(projectRoot, postPath);
  const post = await parsePostFile(resolvedPostPath);
  assertCarouselQuality(post);
  return createCarouselBuildPlan({ post, projectRoot });
}

export async function runBuildCommand(
  args: readonly string[],
  projectRoot = process.cwd(),
): Promise<void> {
  const parsed = parseBuildArgs(args);
  if (parsed.watch) {
    await runBuildWatch(parsed.postPath, { projectRoot });
    return;
  }

  await runBuildOnce(parsed.postPath, { projectRoot });
}

export async function runBuildOnce(
  postPath: string,
  options: RunBuildOnceOptions = {},
): Promise<void> {
  const projectRoot = options.projectRoot ?? process.cwd();
  const logger = options.logger ?? consoleProgressLogger;
  const createPlan = options.createPlan ?? createBuildPlanForPostPath;
  const startServer = options.withServer ?? withViteServer;
  const renderRoute = options.renderRoute ?? renderRouteToPng;

  logger(`Parsing ${postPath}`);
  const plan = await createPlan(postPath, projectRoot);
  logger(`Rendering ${plan.requests.length} slide(s) to ${path.relative(projectRoot, plan.outDir)}`);
  await removeStalePngOutputs(plan);

  await startServer(projectRoot, async (baseUrl) => {
    for (const [index, request] of plan.requests.entries()) {
      logger(`[${index + 1}/${plan.requests.length}] Rendering ${path.basename(request.outputPath)}`);
      await renderRoute({
        url: createRenderUrl(baseUrl, request),
        outputPath: request.outputPath,
        viewport: request.viewport,
      });
    }
  });

  logger(`Rendered ${plan.requests.length} slide(s):`);
  for (const request of plan.requests) {
    logger(`- ${path.relative(projectRoot, request.outputPath)}`);
  }
}

async function removeStalePngOutputs(plan: CarouselBuildPlan): Promise<void> {
  await mkdir(plan.outDir, { recursive: true });
  const plannedOutputs = new Set(
    plan.requests.map((request) => path.resolve(request.outputPath)),
  );
  const entries = await readdir(plan.outDir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isFile() || !entry.name.endsWith(".png")) {
        return;
      }

      const outputPath = path.resolve(plan.outDir, entry.name);
      if (plannedOutputs.has(outputPath)) {
        return;
      }

      await rm(outputPath);
    }),
  );
}

export async function runBuildWatch(
  postPath: string,
  options: RunBuildOnceOptions = {},
): Promise<never> {
  const projectRoot = options.projectRoot ?? process.cwd();
  const logger = options.logger ?? consoleProgressLogger;
  const resolvedPostPath = path.isAbsolute(postPath) ? postPath : path.join(projectRoot, postPath);

  await runBuildOnce(postPath, options);

  const location = await resolvePostFileLocation(resolvedPostPath);
  logger(`Watching ${path.relative(projectRoot, location.sourcePath)}`);

  const rebuild = createSerializedRunner(async () => {
    logger(`Change detected in ${path.relative(projectRoot, location.sourcePath)}. Rebuilding...`);
    await runBuildOnce(postPath, options);
  });

  const watcher = watch(location.sourcePath, { persistent: true }, () => {
    void rebuild();
  });

  process.once("SIGINT", () => {
    watcher.close();
    process.exitCode = 130;
  });

  return new Promise<never>(() => undefined);
}
