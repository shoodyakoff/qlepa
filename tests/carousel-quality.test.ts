import { describe, expect, it } from "vitest";

import {
  formatCarouselQualityIssues,
  validateCarouselQuality,
} from "../src/lib/carousel-quality";
import { parsePostMarkdown } from "../src/lib/post-parser";

describe("carousel quality gate", () => {
  it("passes an editorial slide with explicit meaning and a specific visual route", () => {
    const issues = validateCarouselQuality(parsePostMarkdown(strongEditorialPost()));

    expect(issues).toEqual([]);
  });

  it("requires editorial slides to name pain, mechanism, route, reason, template, and primary visual fact", () => {
    const issues = validateCarouselQuality(parsePostMarkdown(`
## slide-editorial
stage: "PROBLEM"
headline: |
  СЛАЙД
  ПРО ЧТО-ТО
body: |
  Короткий текст.
artifact: visuals
`));

    expect(issues.map((issue) => issue.code)).toEqual([
      "missing-reader-pain",
      "missing-mechanism",
      "missing-visual-route",
      "missing-visual-reason",
      "missing-visual-template",
      "missing-visual-primary",
    ]);
  });

  it("rejects generic fallback labels that make a slide look filled without meaning", () => {
    const issues = validateCarouselQuality(parsePostMarkdown(`
## slide-editorial
stage: "MECHANISM"
headline: |
  ОДИН СЛАЙД
  ОДНА МЫСЛЬ
body: |
  Проверяем, что визуал не заполнен дефолтами.
artifact: custom
reader-pain: "читатель видит красивый блок и не понимает вывод"
mechanism: "лейблы должны назвать конкретный артефакт поста"
visual-route: "field-note"
visual-reason: "показывает правило, которое удерживает смысл"
visual:
  template: field-note-board
  primary: "Pain"
  secondary: "Raw idea"
  modules:
    - "Slide"
    - "Export"
  metrics:
    - "fast"
    - "ready"
`));

    expect(issues.map((issue) => issue.code)).toEqual([
      "generic-visual-label",
      "generic-visual-label",
      "generic-visual-label",
      "generic-visual-label",
      "generic-visual-label",
      "generic-visual-label",
    ]);
  });

  it("rejects stop-list phrases and facts repeated across headline, body, and visual labels", () => {
    const issues = validateCarouselQuality(parsePostMarkdown(`
## slide-editorial
stage: "VOICE"
headline: |
  СИСТЕМА ВИДИТ ЗАДАЧУ
  БЕЗ ПАНИКИ
body: |
  Система видит задачу без паники.
artifact: visuals
reader-pain: "читатель получает одинаковую мысль в трех местах"
mechanism: "каждый слой получает отдельный факт"
visual-route: "artifact-table"
visual-reason: "таблица разделяет тезис, пример и проверку"
visual:
  template: artifact-table
  primary: "Система видит задачу"
  secondary: "отдельный факт"
`));

    expect(issues.map((issue) => issue.code)).toContain("stop-list-phrase");
    expect(issues.map((issue) => issue.code)).toContain("duplicate-text-layer");
  });

  it("rejects adjacent repeated visual routes unless the repeat is justified", () => {
    const repeated = validateCarouselQuality(parsePostMarkdown(`
${strongEditorialSlide("FIRST", "field-note")}

${strongEditorialSlide("SECOND", "field-note")}
`));

    expect(repeated.map((issue) => issue.code)).toEqual(["repeated-visual-route"]);

    const justified = validateCarouselQuality(parsePostMarkdown(`
${strongEditorialSlide("FIRST", "field-note")}

${strongEditorialSlide("SECOND", "field-note", 'visual-repeat-ok: "same board evolves from rule to checklist"')}
`));

    expect(justified).toEqual([]);
  });

  it("requires a generated scene image before final render planning", () => {
    const issues = validateCarouselQuality(parsePostMarkdown(`
## slide-editorial
stage: "RESET"
headline: |
  КАРТИНКА НУЖНА
  НЕ ДЛЯ КРАСОТЫ
body: |
  Сцена показывает момент, который карточками не собрать.
artifact: visuals
reader-pain: "инфографика стала стеной одинаковых блоков"
mechanism: "сцена делает скрытый конфликт физическим"
visual-route: "generated-scene"
visual-reason: "внутренний перелом лучше виден через сцену"
visual:
  template: generated-scene
  primary: "дверь в процессе"
`));

    expect(issues.map((issue) => issue.code)).toEqual(["missing-visual-image"]);
  });

  it("formats quality failures as actionable build errors", () => {
    const issues = validateCarouselQuality(parsePostMarkdown(`
## slide-editorial
stage: "PROBLEM"
headline: |
  СЛАЙД
  ПУСТОЙ
body: |
  Пусто.
artifact: visuals
`));

    expect(formatCarouselQualityIssues(issues)).toContain("Carousel quality gate failed:");
    expect(formatCarouselQualityIssues(issues)).toContain("slide 1: missing reader-pain");
  });
});

function strongEditorialPost(): string {
  return strongEditorialSlide("PROBLEM", "field-note");
}

function strongEditorialSlide(
  stage: string,
  route: string,
  repeatOk = "",
): string {
  const template = route === "generated-scene" ? "generated-scene" : "field-note-board";
  const image = route === "generated-scene" ? '  image: "assets/generated/scene.png"\n' : "";

  return `## slide-editorial
stage: "${stage}"
headline: |
  СЛАЙД ДЕРЖИТ
  ОДНУ БОЛЬ
body: |
  На втором экране читатель понимает, что его время не украдут.
artifact: visuals
reader-pain: "человек свайпнул и боится потерять время"
mechanism: "слайд обещает один точный вывод и показывает рабочий артефакт"
visual-route: "${route}"
visual-reason: "визуал показывает правило отбора, а не украшает пустоту"
${repeatOk ? `${repeatOk}\n` : ""}visual:
  template: ${template}
${image}  primary: "правило отбора"
  secondary: "одна мысль"
  modules:
    - "боль читателя"
    - "рабочий артефакт"`;
}

describe("digest quality gate", () => {
  it("passes a clean digest update slide with three distinct copy layers", () => {
    const issues = validateCarouselQuality(parsePostMarkdown(`
## digest-update
badge: "СЪЁМКА"
headline: |
  СНИМАЮ ТОЛЬКО
  ЖИВЫЕ КУСКИ
intro: "Лицом записываю только начало и финал, остальное берётся из карточки текстом."
features:
  - { icon: lightning, title: "Пачка за подход", desc: "десять заходов подряд" }
`));

    expect(issues).toEqual([]);
  });

  it("flags a stop-list phrase inside a digest intro", () => {
    const issues = validateCarouselQuality(parsePostMarkdown(`
## digest-update
headline: |
  НОВЫЙ
  ПОДХОД
intro: "Это масштабируемое решение для любой команды."
`));

    expect(issues.map((issue) => issue.code)).toContain("stop-list-phrase");
  });

  it("flags a digest intro that just repeats the headline", () => {
    const issues = validateCarouselQuality(parsePostMarkdown(`
## digest-update
headline: |
  КАРТОЧКА
  ВМЕСТО ЧАТА
intro: "Карточка вместо чата хранит части ролика."
`));

    expect(issues.map((issue) => issue.code)).toContain("duplicate-text-layer");
  });
});
