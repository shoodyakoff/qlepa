import path from "node:path";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";

import { tokens } from "../brand/tokens";
import { createCarouselBuildPlan, createRenderUrl } from "../src/lib/build-plan";
import type { ParsedPost } from "../src/lib/post-parser";

describe("carousel build plan", () => {
  it("maps parsed slides to routes, params, and output filenames", () => {
    const post: ParsedPost = {
      sourcePath: "/tmp/post/post.md",
      postDir: "/tmp/post",
      frontmatter: {
        nickname: "@legacy_handle",
        chromeFrom: "контент",
        chromeTo: "ролики",
        footerNote: "мини-контент-заводик",
        signature: "тгк @legacy_handle",
      },
      slides: [
        {
          kind: "cover",
          title: "Cover",
          subtitle: "Sub",
          textSurface: "true",
          photo: { preset: "editorial", scene: "room", src: "assets/generated/cover.png" },
        },
        { kind: "text", heading: "Heading", body: "Body" },
        {
          kind: "list",
          heading: "List",
          items: [{ icon: "search", title: "KYC", desc: "checks clients" }],
        },
        {
          kind: "editorial",
          stage: "PROBLEM",
          headline: "HYPOTHESIS.\nFROM DATA.",
          body: "Body",
          artifact: "analytics",
          accentLines: "2",
          note: "Note",
          items: [{ icon: "chart", title: "Metric", desc: "+18%" }],
          visual: {
            template: "experiment-launch-board",
            file: "mvp-check.md",
            image: "assets/generated/visual.png",
            primary: "Demand check",
          },
        },
      ],
    };

    const plan = createCarouselBuildPlan({ post, projectRoot: "/repo" });

    expect(plan.outDir).toBe(path.join("/tmp/post", "out"));
    expect(plan.requests.map((request) => path.basename(request.outputPath))).toEqual([
      "01-cover.png",
      "02-slide.png",
      "03-slide.png",
      "04-slide.png",
    ]);
    expect(plan.requests[0]?.route).toBe("/render/cover");
    expect(plan.requests[0]?.query.backgroundImage).toBe("/@fs//tmp/post/assets/generated/cover.png");
    expect(plan.requests[0]?.query.textSurface).toBe("true");
    expect(plan.requests[1]?.query).toMatchObject({
      heading: "Heading",
      body: "Body",
      nickname: tokens.brand.handle,
      chromeFrom: tokens.brand.pathFrom,
      chromeTo: tokens.brand.pathTo,
      footerNote: tokens.brand.toplineSuffix,
      signature: `тгк ${tokens.brand.handle}`,
      slideNumber: "2",
      totalSlides: "4",
    });
    expect(plan.requests[2]?.query.items).toBe(
      JSON.stringify([{ icon: "search", title: "KYC", desc: "checks clients" }]),
    );
    expect(plan.requests[3]?.route).toBe("/render/editorial");
    expect(plan.requests[3]?.query).toMatchObject({
      stage: "PROBLEM",
      headline: "HYPOTHESIS.\nFROM DATA.",
      artifact: "analytics",
      accentLines: "2",
      note: "Note",
      visual: JSON.stringify({
        template: "experiment-launch-board",
        file: "mvp-check.md",
        image: "/@fs//tmp/post/assets/generated/visual.png",
        primary: "Demand check",
      }),
      nickname: tokens.brand.handle,
      chromeFrom: tokens.brand.pathFrom,
      chromeTo: tokens.brand.pathTo,
      footerNote: tokens.brand.toplineSuffix,
      signature: `тгк ${tokens.brand.handle}`,
    });
    expect(plan.requests[3]?.query.showMethodNumber).toBeUndefined();
  });

  it("passes method headline numbering only when a post opts in", () => {
    const post: ParsedPost = {
      sourcePath: "/tmp/post/post.md",
      postDir: "/tmp/post",
      frontmatter: { headlineNumbering: "true" } as unknown as ParsedPost["frontmatter"],
      slides: [
        {
          kind: "editorial",
          stage: "METHOD",
          headline: "MAKE\nA PRODUCT",
          body: "Body",
          artifact: "visuals",
        },
      ],
    };

    const plan = createCarouselBuildPlan({ post, projectRoot: "/repo" });

    expect(plan.requests[0]?.query.showMethodNumber).toBe("true");
  });

  it("creates encoded render URLs for preview and screenshots", () => {
    const url = createRenderUrl("http://127.0.0.1:4173", {
      route: "/render/text",
      outputPath: "/tmp/post/out/02-slide.png",
      viewport: { width: 1080, height: 1350 },
      query: {
        heading: "Русский заголовок",
        body: "Line 1\nLine 2",
      },
    });

    expect(url).toBe(
      "http://127.0.0.1:4173/render/text?heading=%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9+%D0%B7%D0%B0%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BE%D0%BA&body=Line+1%0ALine+2",
    );
  });

  it("routes digest slides, encodes a JSON data param, and resolves image paths", () => {
    const post: ParsedPost = {
      sourcePath: "/tmp/post/post.md",
      postDir: "/tmp/post",
      frontmatter: {},
      slides: [
        { kind: "digest-cover", title: "Cover", image: "../assets/generated/cover.png" },
        {
          kind: "digest-update",
          headline: "ОДИН ПРОМПТ\nНЕ ДЕЛАЕТ РОЛИК",
          intro: "Описательный абзац.",
          features: [{ icon: "lightning", title: "Быстрее", desc: "меньше переделок" }],
        },
      ],
    };

    const plan = createCarouselBuildPlan({ post, projectRoot: "/tmp" });

    expect(plan.requests[0]?.route).toBe("/render/digest-cover");
    expect(plan.requests[0]?.outputPath).toBe(path.join("/tmp/post/out", "01-cover.png"));
    expect(plan.requests[1]?.route).toBe("/render/digest-update");
    expect(plan.requests[1]?.outputPath).toBe(path.join("/tmp/post/out", "02-slide.png"));

    const coverData = JSON.parse(plan.requests[0]?.query.data ?? "{}");
    expect(coverData.image).toBe(`/@fs/${path.resolve("/tmp/post", "../assets/generated/cover.png")}`);

    const updateData = JSON.parse(plan.requests[1]?.query.data ?? "{}");
    expect(updateData).toMatchObject({
      kind: "digest-update",
      headline: "ОДИН ПРОМПТ\nНЕ ДЕЛАЕТ РОЛИК",
      features: [{ icon: "lightning", title: "Быстрее", desc: "меньше переделок" }],
    });
  });

  it("uses ignored local brand chrome overrides when present", () => {
    const projectRoot = mkdtempSync(path.join(tmpdir(), "qlepa-brand-"));
    mkdirSync(path.join(projectRoot, "private"));
    writeFileSync(
      path.join(projectRoot, "private/brand.json"),
      JSON.stringify({ handle: "@local_handle", toplineSuffix: "Local carousel workflow" }),
    );

    const post: ParsedPost = {
      sourcePath: path.join(projectRoot, "posts/demo/post.md"),
      postDir: path.join(projectRoot, "posts/demo"),
      frontmatter: {},
      slides: [{ kind: "digest-cover", title: "Cover" }],
    };

    const plan = createCarouselBuildPlan({ post, projectRoot });

    expect(plan.requests[0]?.query.nickname).toBe("@local_handle");
    expect(plan.requests[0]?.query.signature).toBe("тгк @local_handle");
  });
});
