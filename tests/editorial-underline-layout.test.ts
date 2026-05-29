import { chromium } from "@playwright/test";
import { describe, expect, it } from "vitest";

import { withViteServer } from "../src/lib/renderer";

describe("editorial headline underline layout", () => {
  it("ends the accent underline at the highlighted text edge", async () => {
    await withViteServer(process.cwd(), async (baseUrl) => {
      const browser = await chromium.launch();

      try {
        const page = await browser.newPage({
          viewport: { width: 1080, height: 1350 },
          deviceScaleFactor: 1,
          colorScheme: "light",
        });
        const params = new URLSearchParams({
          headline: "B-ROLL\nПО СМЫСЛУ",
          accentLines: "2",
        });

        await page.goto(`${baseUrl}/render/editorial?${params.toString()}`, {
          waitUntil: "networkidle",
        });

        const underline = await page.evaluate(() => {
          const accent = document.querySelector<HTMLElement>(
            ".editorial-slide__headline-text.editorial-slide__headline-accent",
          );

          if (!accent) {
            return null;
          }

          const accentStyle = getComputedStyle(accent);
          const underlineStyle = getComputedStyle(accent, "::after");

          return {
            left: Number.parseFloat(underlineStyle.left),
            textWidth: Number.parseFloat(accentStyle.width),
            underlineWidth: Number.parseFloat(underlineStyle.width),
          };
        });

        expect(underline).not.toBeNull();
        expect(underline!.left + underline!.underlineWidth).toBeCloseTo(underline!.textWidth, 0);
      } finally {
        await browser.close();
      }
    });
  });
});
