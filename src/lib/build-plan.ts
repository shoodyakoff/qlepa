import path from "node:path";

import { tokens } from "../../brand/tokens.ts";
import type { EditorialVisualConfig, ParsedPost, ParsedSlide, PostFrontmatter } from "./post-parser.ts";
import type { Viewport } from "./renderer.ts";

export type RenderRoutePath =
  | "/render/cover"
  | "/render/text"
  | "/render/list"
  | "/render/image"
  | "/render/quote"
  | "/render/editorial";

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
  const chromeQuery = queryForChrome(options.post.frontmatter);

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

function queryForChrome(frontmatter: PostFrontmatter): Record<string, string> {
  return withOptional({
    nickname: tokens.brand.handle,
    chromeFrom: tokens.brand.pathFrom,
    chromeTo: tokens.brand.pathTo,
    footerNote: tokens.brand.toplineSuffix,
    signature: `тгк ${tokens.brand.handle}`,
    showMethodNumber: isTruthy(frontmatter.headlineNumbering) ? "true" : undefined,
  });
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

  return "/render/quote";
}

function outputFileName(slide: ParsedSlide, index: number): string {
  const prefix = String(index + 1).padStart(2, "0");
  return slide.kind === "cover" ? `${prefix}-cover.png` : `${prefix}-slide.png`;
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
