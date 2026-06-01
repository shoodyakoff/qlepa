import { describe, expect, it } from "vitest";

import { parsePostMarkdown } from "../src/lib/post-parser";

describe("post parser", () => {
  it("parses frontmatter and all Stage 5 slide block kinds", () => {
    const post = parsePostMarkdown(`---
slug: starter-carousel
created: 2026-05-21
nickname: "@your_handle"
brand: default
chrome-from: "идея"
chrome-to: "пост"
footer-note: "локальная сборка"
signature: "тгк @your_handle"
headline-numbering: true
visual-rhythm: "cover -> infographic -> generated-scene alternating"
---

## cover
title: "Turn one idea into a carousel"
subtitle: "Draft, preview, and export from one markdown file"
text-surface: true
photo:
  preset: editorial
  scene: "creator at a clean desk"
  wardrobe: "neutral outfit"

## slide-text
heading: "Start with one clear pain"
body: |
  First line.
  Second line.

## slide-list
heading: "What the app needs from you"
items:
  - { icon: 01, title: "Reference photos", desc: "face and body images stay local" }

## slide-image
heading: "Preview before export"
image:
  preset: studio
  scene: "minimalist desk setup"
caption: "Use preview first."

## slide-quote
quote: "The repo is the factory."
author: "— Qlepa"

## slide-editorial
stage: "PROBLEM"
headline: |
  HYPOTHESIS.
  FROM DATA.
body: |
  Short body.
artifact: analytics
reader-pain: "reader has a vague draft"
mechanism: "the slide turns the draft into one testable claim"
visual-route: "field-note"
visual-reason: "the note shows the rule that makes the claim usable"
visual-repeat-ok: "the next slide continues the same board intentionally"
accent-lines: "2"
layout: "text-heavy"
note: "One idea per slide."
items:
  - { icon: chart, title: "Preview", desc: "connected" }
`);

    expect(post.frontmatter).toEqual({
      slug: "starter-carousel",
      created: "2026-05-21",
      nickname: "@your_handle",
      brand: "default",
      chromeFrom: "идея",
      chromeTo: "пост",
      footerNote: "локальная сборка",
      signature: "тгк @your_handle",
      headlineNumbering: "true",
      visualRhythm: "cover -> infographic -> generated-scene alternating",
    });
    expect(post.slides).toHaveLength(6);
    expect(post.slides.map((slide) => slide.kind)).toEqual([
      "cover",
      "text",
      "list",
      "image",
      "quote",
      "editorial",
    ]);
    expect(post.slides[0]).toMatchObject({
      kind: "cover",
      textSurface: "true",
    });
    expect(post.slides[2]).toMatchObject({
      kind: "list",
      heading: "What the app needs from you",
      items: [{ icon: "01", title: "Reference photos", desc: "face and body images stay local" }],
    });
    expect(post.slides[1]).toMatchObject({
      kind: "text",
      body: "First line.\nSecond line.",
    });
    expect(post.slides[5]).toMatchObject({
      kind: "editorial",
      stage: "PROBLEM",
      headline: "HYPOTHESIS.\nFROM DATA.",
      body: "Short body.",
      artifact: "analytics",
      readerPain: "reader has a vague draft",
      mechanism: "the slide turns the draft into one testable claim",
      visualRoute: "field-note",
      visualReason: "the note shows the rule that makes the claim usable",
      visualRepeatOk: "the next slide continues the same board intentionally",
      accentLines: "2",
      layout: "text-heavy",
      note: "One idea per slide.",
      items: [{ icon: "chart", title: "Preview", desc: "connected" }],
    });
  });

  it("throws a friendly error when no slide blocks exist", () => {
    expect(() => parsePostMarkdown("---\nslug: empty\n---\n\nPlain text")).toThrow(
      "No slide blocks found in post.md",
    );
  });

  it("parses optional editorial visual config", () => {
    const post = parsePostMarkdown(`
## slide-editorial
stage: "EXAMPLE"
headline: |
  IDEA
  TO SLIDES
body: |
  Body
artifact: visuals
visual:
  template: browser-product-showcase
  file: "content-workflow.md"
  image: "assets/generated/scene.png"
  primary: "Pick your format"
  secondary: "local preview"
  badge: "make the workflow yours"
  composition: "field note"
  metaphor: "factory floor"
  mood: "editorial"
  note: "People need a clear first run"
  modules:
    - "Idea"
    - "Draft"
    - "Export"
  metrics:
    - "5 slides"
    - "1 output folder"
  outcomes:
    - "Clear story"
    - "Ready PNGs"
`);

    expect(post.slides[0]).toMatchObject({
      kind: "editorial",
      visual: {
        template: "browser-product-showcase",
        file: "content-workflow.md",
        image: "assets/generated/scene.png",
        primary: "Pick your format",
        secondary: "local preview",
        badge: "make the workflow yours",
        composition: "field note",
        metaphor: "factory floor",
        mood: "editorial",
        note: "People need a clear first run",
        modules: ["Idea", "Draft", "Export"],
        metrics: ["5 slides", "1 output folder"],
        outcomes: ["Clear story", "Ready PNGs"],
      },
    });
  });
});

describe("digest slide kinds", () => {
  it("parses digest-cover, digest-update, and digest-cta with nested blocks", () => {
    const post = parsePostMarkdown(`
## digest-cover
title: |
  10 РОЛИКОВ
  ЗА ВЕЧЕР
subline: "Контент-заводик, а не один промпт."
scroll-cue: "Листай →"
image: "../../assets/generated/cover.png"

## digest-update
badge: "СЪЁМКА"
headline: |
  СНИМАЮ ТОЛЬКО
  ЖИВЫЕ КУСКИ
intro: "Лицом записываю только начало и финал."
bubble: "Это заводик, не магия"
image: "../../assets/generated/mascot.png"
features:
  - { icon: lightning, title: "Быстрее", desc: "меньше переделок" }
  - { icon: target, title: "Точнее", desc: "шаги заданы" }
flow:
  - { step: "Карточка", desc: "в базе" }
  - { step: "Сборка", desc: "по правилам" }
checklist:
  - "Меньше переделок"
compare:
  old-title: "Всё лицом"
  old:
    - "Долго"
  new-title: "Только hook и CTA"
  new:
    - "Пачка за подход"

## digest-cta
headline: |
  10 РОЛИКОВ —
  10 МИНУТ
intro: "Процесс на 60% автоматический."
benefits:
  - { icon: rocket, title: "Скорость", desc: "за вечер" }
cta:
  label: "→ как собрать"
  url: "https://example.com"
note: "Разборы — в канале."
`);

    expect(post.slides).toMatchObject([
      {
        kind: "digest-cover",
        title: "10 РОЛИКОВ\nЗА ВЕЧЕР",
        subline: "Контент-заводик, а не один промпт.",
        scrollCue: "Листай →",
        image: "../../assets/generated/cover.png",
      },
      {
        kind: "digest-update",
        badge: "СЪЁМКА",
        headline: "СНИМАЮ ТОЛЬКО\nЖИВЫЕ КУСКИ",
        intro: "Лицом записываю только начало и финал.",
        bubble: "Это заводик, не магия",
        image: "../../assets/generated/mascot.png",
        features: [
          { icon: "lightning", title: "Быстрее", desc: "меньше переделок" },
          { icon: "target", title: "Точнее", desc: "шаги заданы" },
        ],
        flow: [
          { step: "Карточка", desc: "в базе" },
          { step: "Сборка", desc: "по правилам" },
        ],
        checklist: ["Меньше переделок"],
        compare: {
          oldTitle: "Всё лицом",
          old: ["Долго"],
          newTitle: "Только hook и CTA",
          new: ["Пачка за подход"],
        },
      },
      {
        kind: "digest-cta",
        headline: "10 РОЛИКОВ —\n10 МИНУТ",
        intro: "Процесс на 60% автоматический.",
        benefits: [{ icon: "rocket", title: "Скорость", desc: "за вечер" }],
        cta: { label: "→ как собрать", url: "https://example.com" },
        note: "Разборы — в канале.",
      },
    ]);
  });
});
