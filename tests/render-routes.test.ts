import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { tokens } from "../brand/tokens";
import { getRenderRoute, renderRoutes } from "../src/render-routes";

describe("render routes", () => {
  it("registers preview routes for every Stage 4 slide template", () => {
    expect(renderRoutes.map((route) => route.path)).toEqual([
      "/render/cover",
      "/render/text",
      "/render/list",
      "/render/image",
      "/render/quote",
      "/render/editorial",
      "/render/digest-cover",
      "/render/digest-update",
      "/render/digest-cta",
      "/render/font-sampler",
    ]);
  });

  it("renders digest routes from a JSON data param", () => {
    const update = getRenderRoute("/render/digest-update");
    const data = {
      kind: "digest-update",
      headline: "ОДИН ПРОМПТ\nНЕ ДЕЛАЕТ РОЛИК",
      intro: "Описательный абзац про процесс.",
      features: [{ icon: "lightning", title: "Быстрее", desc: "меньше переделок" }],
    };

    const element = update?.render(new URLSearchParams({ data: JSON.stringify(data) }));

    expect(element).toMatchObject({ props: { data } });
    expect(getRenderRoute("/render/digest-cover")?.name).toBe("DigestCover");
    expect(getRenderRoute("/render/digest-cta")?.name).toBe("DigestCta");
  });

  it("falls back to a default digest sample when the data param is missing", () => {
    const element = getRenderRoute("/render/digest-update")?.render(new URLSearchParams());
    expect(element).toBeDefined();
    const markup = renderToStaticMarkup(element as ReactElement);

    expect(markup).toContain("digest-update");
    expect(markup).toContain("digest-headline");
  });

  it("passes local nickname chrome into digest routes", () => {
    const element = getRenderRoute("/render/digest-cover")?.render(
      new URLSearchParams({
        nickname: "@local_handle",
        data: JSON.stringify({ kind: "digest-cover", title: "10\nРОЛИКОВ" }),
      }),
    );

    const markup = renderToStaticMarkup(element as ReactElement);

    expect(markup).toContain("@local_handle");
    expect(markup).not.toContain(tokens.brand.handle);
  });

  it("passes local footer signature chrome into digest routes", () => {
    const data = {
      kind: "digest-update",
      headline: "ОДИН ПРОМПТ\nНЕ ДЕЛАЕТ РОЛИК",
      intro: "Описательный абзац про процесс.",
    };
    const element = getRenderRoute("/render/digest-update")?.render(
      new URLSearchParams({
        data: JSON.stringify(data),
        signature: "тгк @local_handle",
      }),
    );

    const markup = renderToStaticMarkup(element as ReactElement);

    expect(markup).toContain("тгк @local_handle");
    expect(markup).not.toContain(`тгк ${tokens.brand.handle}`);
  });

  it("looks up the text slide route by pathname", () => {
    const route = getRenderRoute("/render/text");

    expect(route?.name).toBe("TextSlide");
  });

  it("passes encoded list items from URL params into the list route", () => {
    const route = getRenderRoute("/render/list");
    const items = [{ icon: "search", title: "KYC", desc: "checks clients" }];

    const element = route?.render(
      new URLSearchParams({
        heading: "From post",
        items: JSON.stringify(items),
      }),
    );

    expect(element).toMatchObject({
      props: {
        heading: "From post",
        items,
      },
    });
  });

  it("passes the cover text surface decision into the cover route", () => {
    const route = getRenderRoute("/render/cover");

    const element = route?.render(
      new URLSearchParams({
        title: "Cover",
        subtitle: "Sub",
        textSurface: "true",
      }),
    );

    expect(element).toMatchObject({
      props: {
        textSurface: true,
      },
    });

    const markup = renderToStaticMarkup(element!);
    expect(markup).toContain("cover--text-surface");
  });

  it("passes editorial artifact params into the editorial route", () => {
    const route = getRenderRoute("/render/editorial");
    const items = [{ icon: "chart", title: "Amplitude", desc: "connected" }];

    const element = route?.render(
      new URLSearchParams({
        stage: "PROBLEM",
        headline: "HYPOTHESIS.\nFROM DATA.",
        body: "Body",
        chromeFrom: "контент",
        chromeTo: "ролики",
        artifact: "analytics",
        accentLines: "2",
        footerNote: "мини-контент-заводик",
        note: "Note",
        signature: "тгк @your_handle",
        items: JSON.stringify(items),
        visual: JSON.stringify({
          template: "browser-product-showcase",
          file: "content-workflow.md",
          image: "/@fs//tmp/post/assets/generated/visual.png",
          primary: "Pick your format",
          composition: "artifact pack",
          metaphor: "factory",
          mood: "editorial",
          outcomes: ["Clear story"],
        }),
      }),
    );

    expect(element).toMatchObject({
      props: {
        stage: "PROBLEM",
        headline: "HYPOTHESIS.\nFROM DATA.",
        chromeFrom: "контент",
        chromeTo: "ролики",
        artifact: "analytics",
        accentLines: "2",
        footerNote: "мини-контент-заводик",
        note: "Note",
        signature: "тгк @your_handle",
        items,
        visual: {
          template: "browser-product-showcase",
          file: "content-workflow.md",
          image: "/@fs//tmp/post/assets/generated/visual.png",
          primary: "Pick your format",
          composition: "artifact pack",
          metaphor: "factory",
          mood: "editorial",
          outcomes: ["Clear story"],
        },
      },
    });

    const markup = renderToStaticMarkup(element!);

    expect(markup).toContain("content-workflow.md");
    expect(markup).toContain("Pick your format");
    expect(markup).toContain(tokens.brand.author);
    expect(markup).toContain(tokens.brand.pathFrom);
    expect(markup).toContain(tokens.brand.pathTo);
    expect(markup).toContain(tokens.brand.toplineSuffix);
    expect(markup).toContain(`тгк ${tokens.brand.handle}`);
    expect(markup).not.toContain("контент");
    expect(markup).not.toContain("мини-контент-заводик");
  });

  it("does not render editorial method numbers unless explicitly requested", () => {
    const route = getRenderRoute("/render/editorial");

    const element = route?.render(
      new URLSearchParams({
        headline: "СНАЧАЛА\nПРАВИЛА СЦЕНАРИЯ",
        slideNumber: "3",
      }),
    );

    const markup = renderToStaticMarkup(element!);

    expect(markup).not.toContain("editorial-slide__method-number");
  });

  it("attaches the accent underline to the headline text, not the full stretched line", () => {
    const route = getRenderRoute("/render/editorial");

    const element = route?.render(
      new URLSearchParams({
        headline: "ЧЕТКИЙ ПАЙПЛАЙН\nВМЕСТО ПРОМПТА",
        accentLines: "2",
      }),
    );

    const markup = renderToStaticMarkup(element!);

    expect(markup).toContain(
      'class="editorial-slide__headline-text editorial-slide__headline-accent">ВМЕСТО ПРОМПТА</span>',
    );
    expect(markup).not.toContain(
      'editorial-slide__headline-line editorial-slide__headline-accent',
    );
  });

  it("renders editorial method numbers for explicitly numbered posts", () => {
    const route = getRenderRoute("/render/editorial");

    const element = route?.render(
      new URLSearchParams({
        headline: "СДЕЛАЙ\nСВОЙ ПРОДУКТ",
        slideNumber: "3",
        showMethodNumber: "true",
      }),
    );

    const markup = renderToStaticMarkup(element!);

    expect(markup).toContain("editorial-slide__method-number");
    expect(markup).toContain(">02<");
  });
});
