import type {
  EditorialVisualConfig,
  ParsedEditorialSlide,
  ParsedPost,
} from "./post-parser.ts";

export type CarouselQualityIssueCode =
  | "missing-reader-pain"
  | "missing-mechanism"
  | "missing-visual-route"
  | "missing-visual-reason"
  | "missing-visual-template"
  | "missing-visual-primary"
  | "missing-visual-image"
  | "generic-visual-label"
  | "stop-list-phrase"
  | "duplicate-text-layer"
  | "repeated-visual-route";

export type CarouselQualityIssue = {
  code: CarouselQualityIssueCode;
  message: string;
  slideIndex: number;
};

const REQUIRED_MEANING_FIELDS: readonly {
  code: CarouselQualityIssueCode;
  key: keyof Pick<
    ParsedEditorialSlide,
    "readerPain" | "mechanism" | "visualRoute" | "visualReason"
  >;
  label: string;
}[] = [
  { code: "missing-reader-pain", key: "readerPain", label: "reader-pain" },
  { code: "missing-mechanism", key: "mechanism", label: "mechanism" },
  { code: "missing-visual-route", key: "visualRoute", label: "visual-route" },
  { code: "missing-visual-reason", key: "visualReason", label: "visual-reason" },
];

const GENERATED_IMAGE_ROUTES = new Set(["generated-scene", "character-scene", "photo-scene"]);

const GENERIC_VISUAL_LABELS = new Set(
  [
    "Pain",
    "Slide",
    "Export",
    "fast",
    "clear",
    "ready",
    "Raw idea",
    "Post draft",
    "Carousel",
    "Input",
    "Action",
    "Result",
  ].map(normalizeForComparison),
);

const STOP_LIST_PHRASES = [
  "масштабируемое решение",
  "бесшовно",
  "магия случается",
  "магия повторяется",
  "выстроил пайплайн",
  "собрал пайплайн с проверками",
  "система видит задачу",
  "модель получает критерии",
  "смысловой стрелочник",
  "получает координаты",
  "единый источник правды",
  "оператор видит пачку",
  "команда запускает подготовленный сетап",
  "подготовленный сетап",
  "финальная цель",
  "system sees the task",
  "scalable solution",
  "seamlessly",
  "effortlessly",
  "leverage",
  "unlock",
  "empower",
  "supercharge",
].map(normalizeForComparison);

export function validateCarouselQuality(post: ParsedPost): readonly CarouselQualityIssue[] {
  const issues: CarouselQualityIssue[] = [];
  let previousEditorial:
    | {
        route: string;
      }
    | undefined;

  post.slides.forEach((slide, index) => {
    if (slide.kind !== "editorial") {
      return;
    }

    issues.push(...validateMeaningFields(slide, index));
    issues.push(...validateVisualContract(slide, index));
    issues.push(...validateCopyLayers(slide, index));

    const route = normalizeRoute(slide.visualRoute);
    if (route) {
      if (previousEditorial?.route === route && !hasText(slide.visualRepeatOk)) {
        issues.push(issue(index, "repeated-visual-route", `visual-route repeats previous editorial slide (${route}); add visual-repeat-ok with a reason or choose a new route`));
      }

      previousEditorial = { route };
    }
  });

  return issues;
}

export function formatCarouselQualityIssues(issues: readonly CarouselQualityIssue[]): string {
  if (issues.length === 0) {
    return "";
  }

  return [
    "Carousel quality gate failed:",
    ...issues.map((item) => `- ${item.message}`),
  ].join("\n");
}

export function assertCarouselQuality(post: ParsedPost): void {
  const issues = validateCarouselQuality(post);
  if (issues.length > 0) {
    throw new Error(formatCarouselQualityIssues(issues));
  }
}

function validateMeaningFields(
  slide: ParsedEditorialSlide,
  slideIndex: number,
): readonly CarouselQualityIssue[] {
  return REQUIRED_MEANING_FIELDS
    .filter((field) => !hasText(slide[field.key]))
    .map((field) => issue(slideIndex, field.code, `missing ${field.label}`));
}

function validateVisualContract(
  slide: ParsedEditorialSlide,
  slideIndex: number,
): readonly CarouselQualityIssue[] {
  const issues: CarouselQualityIssue[] = [];

  if (!hasText(slide.visual?.template)) {
    issues.push(issue(slideIndex, "missing-visual-template", "missing visual.template"));
  }

  if (!hasText(slide.visual?.primary)) {
    issues.push(issue(slideIndex, "missing-visual-primary", "missing visual.primary"));
  }

  const route = normalizeRoute(slide.visualRoute);
  if (route && GENERATED_IMAGE_ROUTES.has(route) && !hasText(slide.visual?.image)) {
    issues.push(issue(slideIndex, "missing-visual-image", `${route} requires visual.image before final render`));
  }

  for (const label of visualTextValues(slide.visual)) {
    if (GENERIC_VISUAL_LABELS.has(normalizeForComparison(label))) {
      issues.push(issue(slideIndex, "generic-visual-label", `generic visual label "${label}"`));
    }
  }

  return issues;
}

function validateCopyLayers(
  slide: ParsedEditorialSlide,
  slideIndex: number,
): readonly CarouselQualityIssue[] {
  const issues: CarouselQualityIssue[] = [];
  const layers = [
    { label: "headline", value: slide.headline },
    { label: "body", value: slide.body },
    ...visualTextValues(slide.visual).map((value) => ({ label: "visual", value })),
  ];

  for (const layer of layers) {
    if (containsStopListPhrase(layer.value)) {
      issues.push(issue(slideIndex, "stop-list-phrase", `${layer.label} contains a stop-list phrase`));
    }
  }

  if (hasDuplicateTextLayer(slide)) {
    issues.push(issue(slideIndex, "duplicate-text-layer", "headline, body, or visual labels repeat the same fact"));
  }

  return issues;
}

function hasDuplicateTextLayer(slide: ParsedEditorialSlide): boolean {
  const headline = normalizeForComparison(slide.headline);
  const body = normalizeForComparison(slide.body);
  const visualLabels = visualTextValues(slide.visual).map(normalizeForComparison);

  if (textsOverlap(headline, body)) {
    return true;
  }

  return visualLabels.some((label) => textsOverlap(label, headline) || textsOverlap(label, body));
}

function textsOverlap(first: string, second: string): boolean {
  if (!first || !second) {
    return false;
  }

  if (first.length >= 14 && second.length >= 14 && (first.includes(second) || second.includes(first))) {
    return true;
  }

  const firstTokens = new Set(first.split(" ").filter((token) => token.length >= 4));
  const secondTokens = second.split(" ").filter((token) => token.length >= 4);
  if (firstTokens.size === 0 || secondTokens.length === 0) {
    return false;
  }

  const sharedCount = secondTokens.filter((token) => firstTokens.has(token)).length;
  const smallerSize = Math.min(firstTokens.size, new Set(secondTokens).size);
  return sharedCount >= 3 && sharedCount / smallerSize >= 0.8;
}

function containsStopListPhrase(value: string): boolean {
  const normalized = normalizeForComparison(value);
  return STOP_LIST_PHRASES.some((phrase) => normalized.includes(phrase));
}

function visualTextValues(visual: EditorialVisualConfig | undefined): readonly string[] {
  if (!visual) {
    return [];
  }

  return [
    visual.file,
    visual.primary,
    visual.secondary,
    visual.badge,
    visual.composition,
    visual.metaphor,
    visual.mood,
    visual.note,
    ...(visual.modules ?? []),
    ...(visual.metrics ?? []),
    ...(visual.outcomes ?? []),
  ].filter((value): value is string => hasText(value));
}

function issue(
  slideIndex: number,
  code: CarouselQualityIssueCode,
  message: string,
): CarouselQualityIssue {
  return {
    slideIndex,
    code,
    message: `slide ${slideIndex + 1}: ${message}`,
  };
}

function normalizeRoute(value: string | undefined): string | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : undefined;
}

function normalizeForComparison(value: string): string {
  return value
    .toLowerCase()
    .replaceAll("ё", "е")
    .replace(/[^a-zа-я0-9]+/giu, " ")
    .trim()
    .replace(/\s+/gu, " ");
}

function hasText(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
