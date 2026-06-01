import path from "node:path";
import { existsSync, readFileSync } from "node:fs";

import { tokens } from "../../brand/tokens.ts";
import type { EditorialVisualConfig, ParsedPost, ParsedSlide, PostFrontmatter } from "./post-parser.ts";
import type { Viewport } from "./renderer.ts";

export type RenderRoutePath =
  | "/render/cover"
  | "/render/text"
  | "/render/list"
  | "/render/image"
  | "/render/quote"
  | "/render/editorial"
  | "/render/digest-cover"
  | "/render/digest-update"
  | "/render/digest-cta";

export type CarouselRenderRequest = {
  route: RenderRoutePath;
  outputPath: string;
  viewport: Viewport;
  query: Record<string, string>;
};

export type CarouselBuildPlan = {
  outDir: string;
  requests: readonly CarouselRenderRequest[];
};

export type CreateCarouselBuildPlanOptions = {
  post: ParsedPost;
  projectRoot: string;
};

export function createCarouselBuildPlan(options: CreateCarouselBuildPlanOptions): CarouselBuildPlan {
  const postDir = resolvePostDir(options.post, options.projectRoot);
  const outDir = path.join(postDir, "out");
  const totalSlides = String(options.post.slides.length);
  const chromeQuery = queryForChrome(options.post.frontmatter, options.projectRoot);

  return {
    outDir,
    requests: options.post.slides.map((slide, index) => {
      const slideNumber = String(index + 1);
      return {
        route: routeForSlide(slide),
        outputPath: path.join(outDir, outputFileName(slide, index)),
        viewport: {
          width: tokens.sizes.slide.w,
          height: tokens.sizes.slide.h,
        },
        query: {
          ...queryForSlide(slide, postDir),
          ...chromeQuery,
          slideNumber,
          totalSlides,
        },
      };
    }),
  };
}

export function createRenderUrl(baseUrl: string, request: CarouselRenderRequest): string {
  const url = new URL(request.route, `${baseUrl.replace(/\/$/, "")}/`);

  for (const [key, value] of Object.entries(request.query)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

function resolvePostDir(post: ParsedPost, projectRoot: string): string {
  if (post.postDir) {
    return post.postDir;
  }

  if (post.sourcePath) {
    return path.dirname(post.sourcePath);
  }

  return projectRoot;
}

type BrandChrome = {
  handle: string;
  pathFrom: string;
  pathTo: string;
  toplineSuffix: string;
  signature: string;
};

function queryForChrome(frontmatter: PostFrontmatter, projectRoot: string): Record<string, string> {
  const chrome = resolveBrandChrome(projectRoot);

  return withOptional({
    nickname: chrome.handle,
    chromeFrom: chrome.pathFrom,
    chromeTo: chrome.pathTo,
    footerNote: chrome.toplineSuffix,
    signature: chrome.signature,
    showMethodNumber: isTruthy(frontmatter.headlineNumbering) ? "true" : undefined,
  });
}

function resolveBrandChrome(projectRoot: string): BrandChrome {
  const base: BrandChrome = {
    handle: tokens.brand.handle,
    pathFrom: tokens.brand.pathFrom,
    pathTo: tokens.brand.pathTo,
    toplineSuffix: tokens.brand.toplineSuffix,
    signature: `тгк ${tokens.brand.handle}`,
  };
  const local = readLocalBrandChrome(projectRoot);
  const handle = local.handle ?? base.handle;

  return {
    handle,
    pathFrom: local.pathFrom ?? base.pathFrom,
    pathTo: local.pathTo ?? base.pathTo,
    toplineSuffix: local.toplineSuffix ?? base.toplineSuffix,
    signature: local.signature ?? `тгк ${handle}`,
  };
}

function readLocalBrandChrome(projectRoot: string): Partial<BrandChrome> {
  const filePath = path.join(projectRoot, "private/brand.json");
  if (!existsSync(filePath)) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(readFileSync(filePath, "utf8"));
    if (!isRecord(parsed)) {
      return {};
    }

    return {
      handle: optionalRecordString(parsed, "handle"),
      pathFrom: optionalRecordString(parsed, "pathFrom"),
      pathTo: optionalRecordString(parsed, "pathTo"),
      toplineSuffix: optionalRecordString(parsed, "toplineSuffix"),
      signature: optionalRecordString(parsed, "signature"),
    };
  } catch {
    return {};
  }
}

function routeForSlide(slide: ParsedSlide): RenderRoutePath {
  if (slide.kind === "cover") {
    return "/render/cover";
  }

  if (slide.kind === "text") {
    return "/render/text";
  }

  if (slide.kind === "list") {
    return "/render/list";
  }

  if (slide.kind === "image") {
    return "/render/image";
  }

  if (slide.kind === "editorial") {
    return "/render/editorial";
  }

  if (slide.kind === "digest-cover") {
    return "/render/digest-cover";
  }

  if (slide.kind === "digest-update") {
    return "/render/digest-update";
  }

  if (slide.kind === "digest-cta") {
    return "/render/digest-cta";
  }

  return "/render/quote";
}

function outputFileName(slide: ParsedSlide, index: number): string {
  const prefix = String(index + 1).padStart(2, "0");
  const isCover = slide.kind === "cover" || slide.kind === "digest-cover";
  return isCover ? `${prefix}-cover.png` : `${prefix}-slide.png`;
}

function queryForSlide(slide: ParsedSlide, postDir: string): Record<string, string> {
  if (slide.kind === "cover") {
    return withOptional({
      title: slide.title,
      subtitle: slide.subtitle,
      backgroundImage: resolveAssetUrl(slide.photo?.src, postDir),
      textSurface: isTruthy(slide.textSurface) ? "true" : undefined,
    });
  }

  if (slide.kind === "text") {
    return withOptional({
      heading: slide.heading,
      body: slide.body,
      kicker: slide.kicker,
    });
  }

  if (slide.kind === "list") {
    return withOptional({
      heading: slide.heading,
      items: JSON.stringify(slide.items),
      kicker: slide.kicker,
    });
  }

  if (slide.kind === "image") {
    return withOptional({
      heading: slide.heading,
      caption: slide.caption,
      imageSrc: resolveAssetUrl(slide.image?.src, postDir),
      kicker: slide.kicker,
    });
  }

  if (slide.kind === "editorial") {
    return withOptional({
      stage: slide.stage,
      headline: slide.headline,
      body: slide.body,
      artifact: slide.artifact,
      layout: slide.layout,
      accentLines: slide.accentLines,
      note: slide.note,
      items: slide.items ? JSON.stringify(slide.items) : undefined,
      visual: slide.visual ? JSON.stringify(resolveVisualAssetUrls(slide.visual, postDir)) : undefined,
    });
  }

  if (
    slide.kind === "digest-cover" ||
    slide.kind === "digest-update" ||
    slide.kind === "digest-cta"
  ) {
    const resolved = { ...slide, image: resolveAssetUrl(slide.image, postDir) };
    return { data: JSON.stringify(resolved) };
  }

  return withOptional({
    quote: slide.quote,
    author: slide.author,
    kicker: slide.kicker,
  });
}

function resolveAssetUrl(src: string | undefined, postDir: string): string | undefined {
  if (!src) {
    return undefined;
  }

  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:") ||
    src.startsWith("/@fs/") ||
    src.startsWith("/")
  ) {
    return src;
  }

  return `/@fs/${path.resolve(postDir, src)}`;
}

function resolveVisualAssetUrls(
  visual: EditorialVisualConfig,
  postDir: string,
): EditorialVisualConfig {
  if (!visual.image && !visual.copyImage) {
    return visual;
  }

  return {
    ...visual,
    image: resolveAssetUrl(visual.image, postDir),
    copyImage: resolveAssetUrl(visual.copyImage, postDir),
  };
}

function withOptional(values: Record<string, string | undefined>): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(values)) {
    if (value) {
      result[key] = value;
    }
  }

  return result;
}

function isTruthy(value: string | undefined): boolean {
  return value === "true" || value === "1" || value === "yes";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalRecordString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}
