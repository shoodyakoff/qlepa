import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium, type Page } from "@playwright/test";
import { createServer, type ViteDevServer } from "vite";

export type Viewport = {
  width: number;
  height: number;
};

export type RenderRouteToPngOptions = {
  url: string;
  outputPath: string;
  viewport: Viewport;
};

export async function renderRouteToPng(options: RenderRouteToPngOptions): Promise<void> {
  await mkdir(path.dirname(options.outputPath), { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: options.viewport,
      deviceScaleFactor: 1,
      colorScheme: "light",
    });

    await page.goto(options.url, { waitUntil: "networkidle" });
    await waitForImagesToPaint(page);
    await page.screenshot({
      path: options.outputPath,
      fullPage: false,
      omitBackground: false,
      animations: "disabled",
    });
  } finally {
    await browser.close();
  }
}

async function waitForImagesToPaint(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const images = Array.from(document.images);

    await Promise.all(
      images.map(async (image) => {
        if (!image.complete) {
          await new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          });
        }

        await image.decode().catch(() => undefined);
      }),
    );

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
  });
}

export async function withViteServer<T>(
  projectRoot: string,
  callback: (baseUrl: string) => Promise<T>,
): Promise<T> {
  const server = await createServer({
    root: projectRoot,
    logLevel: "silent",
    server: {
      host: "127.0.0.1",
      port: 0,
      strictPort: false,
    },
  });

  await server.listen();

  try {
    return await callback(resolveBaseUrl(server));
  } finally {
    await server.close();
  }
}

function resolveBaseUrl(server: ViteDevServer): string {
  const localUrl = server.resolvedUrls?.local[0];
  if (!localUrl) {
    throw new Error("Vite server did not expose a local URL");
  }

  return localUrl.endsWith("/") ? localUrl.slice(0, -1) : localUrl;
}
