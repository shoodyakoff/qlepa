import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";

import { tokens } from "../brand/tokens";
import { EditorialSlide, getArtifactBlueprint } from "../templates/EditorialSlide";

describe("editorial artifact visualization pattern", () => {
  it("maps every editorial artifact to an approved visual template", () => {
    const artifacts = [
      "lean-cycle",
      "landing",
      "visuals",
      "automation",
      "internal",
      "education",
      "results",
    ] as const;

    for (const artifact of artifacts) {
      const blueprint = getArtifactBlueprint(artifact);

      expect(blueprint.title).toMatch(/\S/u);
      expect([
        "product-mock",
        "experiment-launch-board",
        "browser-product-showcase",
        "agent-ops-board",
        "file-dashboard-mosaic",
        "learning-toolkit-board",
        "artifact-table",
        "timeline-strip",
        "system-map",
        "contrast-diptych",
        "asset-grid",
        "command-board",
        "field-note-board",
        "assembly-rig",
        "semantic-selector",
        "capture-console",
        "factory-floor",
        "generated-scene",
        "character-scene",
      ]).toContain(blueprint.visual);
      expect(blueprint.labels.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("infers artifact templates from the artifact visual library", () => {
    expect(getArtifactBlueprint("lean-cycle").visual).toBe("experiment-launch-board");
    expect(getArtifactBlueprint("visuals").visual).toBe("browser-product-showcase");
    expect(getArtifactBlueprint("automation").visual).toBe("agent-ops-board");
    expect(getArtifactBlueprint("internal").visual).toBe("file-dashboard-mosaic");
    expect(getArtifactBlueprint("education").visual).toBe("learning-toolkit-board");
  });

  it("renders the five artifact templates with reference-like work artifacts", () => {
    const cases = [
      {
        artifact: "lean-cycle",
        expectedClass: "experiment-launch-board",
        expectedText: ["mvp-check.md", "One idea to carousel", "Add your idea"],
      },
      {
        artifact: "visuals",
        expectedClass: "browser-product-showcase",
        expectedText: [
          "content-system.md",
          "draft-to-export system",
          "Content workflow",
          "Why this helps",
          "Reusable format",
          "Faster drafts",
          "Cleaner handoff",
        ],
      },
      {
        artifact: "automation",
        expectedClass: "agent-ops-board",
        expectedText: ["ops-checklist.md", "Local pipeline"],
      },
      {
        artifact: "internal",
        expectedClass: "file-dashboard-mosaic",
        expectedText: ["company-demo.md", "What changed in the post?", "The draft is ready"],
      },
      {
        artifact: "education",
        expectedClass: "learning-toolkit-board",
        expectedText: [
          "learning-notes.md",
          "Two onboarding paths",
          "local carousel setup",
          "Guided setup",
          "Self-serve docs",
          "start with the guided path, then make it yours",
        ],
      },
    ] as const;

    for (const item of cases) {
      const markup = renderToStaticMarkup(
        createElement(EditorialSlide, {
          artifact: item.artifact,
          body: "Body",
          headline: "Headline",
          nickname: "@your_handle",
          slideNumber: 2,
          stage: "PROBLEM",
          totalSlides: 6,
        }),
      );

      expect(markup).toContain(item.expectedClass);
      for (const expectedText of item.expectedText) {
        expect(markup).toContain(expectedText);
      }
      expect(markup).not.toContain("product-mock__screen");
      expect(markup).not.toContain("before-after__grid");
      expect(markup).not.toContain("learning-toolkit-board__note");
    }
  });

  it("does not expose internal board mechanics as visible carousel copy", () => {
    const artifacts = [
      "analytics",
      "landing",
      "visuals",
      "automation",
      "internal",
      "education",
      "results",
    ] as const;

    for (const artifact of artifacts) {
      const markup = renderToStaticMarkup(
        createElement(EditorialSlide, {
          artifact,
          body: "Body",
          headline: "Headline",
          nickname: "@your_handle",
          slideNumber: 2,
          stage: "PROBLEM",
          totalSlides: 8,
        }),
      ).toLowerCase();

      expect(markup).not.toMatch(
        /карта смысла|контекстный визуал|визуал показывает|визуализируется|0 магии|3 точки|маршрут до результата|>вход<|>действие<|artifact-board/u,
      );
    }
  });

  it("uses the shared brand signature in the editorial footer", () => {
    const markup = renderToStaticMarkup(
      createElement(EditorialSlide, {
        artifact: "visuals",
        body: "Body",
        headline: "Headline",
        nickname: "@per_post_handle",
        slideNumber: 2,
        stage: "PROCESS",
        totalSlides: 6,
      }),
    );

    expect(markup).toContain(`тгк ${tokens.brand.handle}`);
    expect(markup).not.toContain("тгк @per_post_handle");
  });

  it("adds a text-heavy layout class for long human carousel copy", () => {
    const markup = renderToStaticMarkup(
      createElement(EditorialSlide, {
        artifact: "visuals",
        body: "Long body",
        headline: "Headline",
        layout: "text-heavy",
        nickname: "@your_handle",
        slideNumber: 2,
        stage: "PROCESS",
        totalSlides: 6,
      }),
    );

    expect(markup).toContain("editorial-slide--text-heavy");
  });

  it("renders explicit art-director visual templates for topic-specific slides", () => {
    const cases = [
      {
        template: "artifact-table",
        expectedClass: "artifact-table-visual",
        expectedText: ["brief.md", "Slide brief", "Hook"],
      },
      {
        template: "timeline-strip",
        expectedClass: "timeline-strip-visual",
        expectedText: ["draft", "review", "revision"],
      },
      {
        template: "system-map",
        expectedClass: "system-map-visual",
        expectedText: ["draft-to-export system", "assets", "rules"],
      },
      {
        template: "contrast-diptych",
        expectedClass: "contrast-diptych-visual",
        expectedText: ["Vague request", "Prepared process"],
      },
      {
        template: "asset-grid",
        expectedClass: "asset-grid-visual",
        expectedText: ["Library", "clip", "audio"],
      },
      {
        template: "command-board",
        expectedClass: "command-board-visual",
        expectedText: ["Command center", "Shoot", "Export"],
      },
      {
        template: "field-note-board",
        expectedClass: "field-note-board-visual",
        expectedText: ["brief.md", "review", "Hook"],
      },
      {
        template: "assembly-rig",
        expectedClass: "assembly-rig-visual",
        expectedText: ["brief.md", "review", "dictionary"],
      },
      {
        template: "semantic-selector",
        expectedClass: "semantic-selector-visual",
        expectedText: ["brief.md", "review", "visual match"],
      },
      {
        template: "capture-console",
        expectedClass: "capture-console-visual",
        expectedText: ["brief.md", "review", "operator view"],
      },
      {
        template: "factory-floor",
        expectedClass: "factory-floor-visual",
        expectedText: ["brief.md", "review", "Hook", "Export"],
      },
      {
        template: "generated-scene",
        expectedClass: "generated-scene-visual",
        expectedText: ["brief.md", "review", "Library"],
      },
      {
        template: "character-scene",
        expectedClass: "character-scene-visual",
        expectedText: ["brief.md", "review", "Library"],
      },
      {
        template: "prompt-loop",
        expectedClass: "prompt-loop-visual",
        expectedText: ["один промпт", "ручная правка", "готовый процесс"],
      },
      {
        template: "script-rules-file",
        expectedClass: "script-rules-file-visual",
        expectedText: ["script.rules.md", "не начинать", "CTA"],
      },
      {
        template: "voice-caption-pipeline",
        expectedClass: "voice-caption-pipeline-visual",
        expectedText: ["voice.cutter.md", "0.4s", "3-5 слов"],
      },
    ] as const;

    for (const item of cases) {
      const pilotModules =
        item.template === "prompt-loop"
          ? ["один промпт", "ручная правка", "готовый процесс"]
          : item.template === "script-rules-file"
            ? ["не начинать", "CTA", "стоп-слова"]
            : item.template === "voice-caption-pipeline"
              ? ["текст", "0.4s", "субтитры"]
              : undefined;
      const pilotOutcomes = item.template === "voice-caption-pipeline" ? ["3-5 слов"] : undefined;
      const markup = renderToStaticMarkup(
        createElement(EditorialSlide, {
          artifact: "visuals",
          body: "Body",
          headline: "Headline",
          nickname: "@your_handle",
          slideNumber: 2,
          stage: "PROCESS",
          totalSlides: 6,
          visual: {
            template: item.template,
            file:
              item.template === "script-rules-file"
                ? "script.rules.md"
                : item.template === "voice-caption-pipeline"
                  ? "voice.cutter.md"
                  : "brief.md",
            primary: item.expectedText[1],
            modules: pilotModules ?? [
              "Hook",
              "draft",
              "review",
              "revision",
              "assets",
              "rules",
              "clip",
              "audio",
              "Shoot",
              "Export",
            ],
            metrics: ["1 source", "dictionary", "final"],
            outcomes: pilotOutcomes ?? ["Vague request", "Prepared process", "Library", "Command center"],
          },
        }),
      );

      expect(markup).toContain(item.expectedClass);
      for (const expectedText of item.expectedText) {
        expect(markup).toContain(expectedText);
      }
    }
  });

  it("keeps the generic generated scene route separate from the character fallback", () => {
    const markup = renderToStaticMarkup(
      createElement(EditorialSlide, {
        artifact: "visuals",
        body: "Body",
        headline: "Headline",
        nickname: "@your_handle",
        slideNumber: 2,
        stage: "PROCESS",
        totalSlides: 6,
        visual: {
          template: "generated-scene",
          file: "brief.md",
          primary: "Scene insert",
          modules: ["scene role", "meaning cue"],
          metrics: ["scene", "system", "choice"],
          outcomes: ["hidden work", "specific metaphor", "human decision"],
        },
      }),
    );

    expect(markup).toContain("generated-scene-fallback");
    expect(markup).not.toContain("character-scene-fallback");
  });

  it("keeps generated scene numbering only in the bottom sequence", () => {
    const markup = renderToStaticMarkup(
      createElement(EditorialSlide, {
        artifact: "visuals",
        body: "Body",
        headline: "Headline",
        nickname: "@your_handle",
        slideNumber: 2,
        stage: "PROCESS",
        totalSlides: 6,
        visual: {
          template: "generated-scene",
          file: "brief.md",
          primary: "Scene insert",
          modules: ["topic card", "production state"],
          metrics: ["step one", "step two", "step three"],
          outcomes: ["what it says", "what is ready", "next action"],
        },
      }),
    );

    expect(markup).toContain(
      '<article class="character-scene-visual__agent-card"><strong>topic card</strong>',
    );
    expect(markup).not.toContain(
      '<article class="character-scene-visual__agent-card"><span>01</span><strong>topic card</strong>',
    );
    expect(markup).toContain("<strong><span>01</span>step one</strong>");
  });

  it("uses the first generated scene outcome when there is no third sticky note", () => {
    const markup = renderToStaticMarkup(
      createElement(EditorialSlide, {
        artifact: "visuals",
        body: "Body",
        headline: "Headline",
        nickname: "@your_handle",
        slideNumber: 2,
        stage: "PROCESS",
        totalSlides: 6,
        visual: {
          template: "generated-scene",
          file: "brief.md",
          primary: "Scene insert",
          modules: ["scene role", "meaning cue"],
          outcomes: ["specific note", "second note"],
        },
      }),
    );

    expect(markup).toContain("specific note");
    expect(markup).not.toContain("what could go wrong?");
  });

  it("renders prompt loop with a character image and four pipeline steps", () => {
    const markup = renderToStaticMarkup(
      createElement(EditorialSlide, {
        artifact: "visuals",
        body: "Body",
        headline: "Headline",
        nickname: "@your_handle",
        slideNumber: 2,
        stage: "PROCESS",
        totalSlides: 6,
        visual: {
          template: "prompt-loop",
          file: "skill_carusel.md",
          copyImage: "/assets/generated/operator.png",
          primary: "ии додумывает",
          secondary: "Сборка по пайплайну",
          modules: ["ии додумывает", "каждый раз с нуля", "как выглядит процесс"],
          outcomes: ["результат менее предсказуем", "ии не помнит контекст правок"],
          metrics: [
            "написать сценарий",
            "снять cta и hook",
            "загрузить файлы в папку",
            "получить готовое видео",
          ],
        },
      }),
    );

    expect(markup).toContain("skill_carusel.md");
    expect(markup).toContain("editorial-slide__copy-visual");
    expect(markup).toContain('src="/assets/generated/operator.png"');
    expect(markup).toContain("Сборка по пайплайну");
    expect(markup).toContain("как выглядит процесс");
    expect(markup).toContain("получить готовое видео");
  });
});
