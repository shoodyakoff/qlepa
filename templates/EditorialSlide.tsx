import type { ListSlideItem } from "./ListSlide";
import {
  ArtifactVisual,
  getArtifactBlueprint,
  type EditorialVisualConfig,
} from "./editorial-visuals";
import { BrandFooter, BrandPath } from "./_shared/BrandChrome";
import { SlideFrame } from "./_shared/SlideFrame";

export { getArtifactBlueprint } from "./editorial-visuals";

export type EditorialSlideProps = {
  accentLines?: string;
  artifact: string;
  body: string;
  chromeFrom?: string;
  chromeTo?: string;
  footerNote?: string;
  headline: string;
  items?: readonly ListSlideItem[];
  layout?: string;
  nickname: string;
  note?: string;
  showMethodNumber?: boolean;
  signature?: string;
  slideNumber: number;
  stage: string;
  totalSlides: number;
  visual?: EditorialVisualConfig;
};

export function EditorialSlide(props: EditorialSlideProps) {
  const layoutClass = props.layout === "text-heavy" ? " editorial-slide--text-heavy" : "";
  const copyVisualImage = getCopyVisualImage(props.visual);

  return (
    <SlideFrame className={`editorial-slide editorial-slide--${props.artifact}${layoutClass}`} variant="content">
      <header className="editorial-slide__topline">
        <BrandPath />
        <span className="editorial-slide__counter">
          {props.slideNumber} / {props.totalSlides}
        </span>
      </header>
      <main className="editorial-slide__main editorial-slide__main--stacked">
        <section className="editorial-slide__copy editorial-slide__copy--vertical">
          <div className="editorial-slide__headline-block">
            <Headline
              accentLines={props.accentLines}
              headline={props.headline}
              methodNumber={formatMethodNumber(props.slideNumber)}
              showMethodNumber={props.showMethodNumber ?? false}
            />
          </div>
          {copyVisualImage ? (
            <figure className="editorial-slide__copy-visual">
              <img src={copyVisualImage} alt="" aria-hidden="true" />
            </figure>
          ) : null}
          <span className="editorial-slide__copy-rule" aria-hidden="true" />
          <p className="editorial-slide__body">
            <BodyText text={props.body} />
          </p>
        </section>
        <ArtifactScene artifact={props.artifact} items={props.items} visual={props.visual} />
      </main>
      <BrandFooter className="editorial-slide__footer" />
    </SlideFrame>
  );
}

function getCopyVisualImage(visual: EditorialVisualConfig | undefined): string | undefined {
  if (visual?.copyImage) {
    return visual.copyImage;
  }

  if (visual?.template === "prompt-loop") {
    return visual.image;
  }

  return undefined;
}

function formatMethodNumber(slideNumber: number): string {
  return String(Math.max(1, slideNumber - 1)).padStart(2, "0");
}

function Headline(props: {
  accentLines?: string;
  headline: string;
  methodNumber: string;
  showMethodNumber: boolean;
}) {
  const accentLines = parseAccentLines(props.accentLines);
  const lines = formatHeadlineLines(props.headline);

  return (
    <h1 className="editorial-slide__headline editorial-slide__headline--poster">
      {lines.map((line, index) => (
        <span
          className={[
            "editorial-slide__headline-line",
            index === 0 ? "editorial-slide__headline-line--first" : "",
          ].filter(Boolean).join(" ")}
          key={`${index}-${line}`}
        >
          {index === 0 && props.showMethodNumber ? (
            <span className="editorial-slide__method-number">{props.methodNumber}</span>
          ) : null}
          <span
            className={[
              "editorial-slide__headline-text",
              accentLines.has(index + 1) ? "editorial-slide__headline-accent" : "",
            ].filter(Boolean).join(" ")}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}

export function formatHeadlineLines(headline: string): readonly string[] {
  const explicitLines = headline
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (explicitLines.length === 2) {
    return explicitLines;
  }

  const words = explicitLines.join(" ").split(/\s+/u).filter(Boolean);
  if (words.length <= 1) {
    return words;
  }

  const lineCount = words.length > 4 ? 3 : 2;
  return splitBalancedLines(words, Math.min(lineCount, words.length));
}

function splitBalancedLines(words: readonly string[], lineCount: number): readonly string[] {
  let best: readonly string[] = [];
  let bestScore = Number.POSITIVE_INFINITY;

  function walk(start: number, lines: readonly string[]): void {
    const remainingWords = words.length - start;
    const remainingLines = lineCount - lines.length;

    if (remainingLines === 1) {
      const candidate = [...lines, words.slice(start).join(" ")];
      const score = headlineLineScore(candidate);
      if (score < bestScore) {
        best = candidate;
        bestScore = score;
      }
      return;
    }

    const maxEnd = words.length - remainingLines + 1;
    for (let end = start + 1; end <= maxEnd; end += 1) {
      if (remainingWords <= remainingLines) {
        break;
      }
      walk(end, [...lines, words.slice(start, end).join(" ")]);
    }
  }

  walk(0, []);
  return best.length > 0 ? best : [words.join(" ")];
}

function headlineLineScore(lines: readonly string[]): number {
  const lengths = lines.map((line) => line.length);
  const max = Math.max(...lengths);
  const min = Math.min(...lengths);
  return max * 10 + (max - min);
}

function BodyText(props: { text: string }) {
  return (
    <>
      {props.text.split("->").map((part, index) => (
        <FragmentWithArrow index={index} key={`${index}-${part}`} text={part} />
      ))}
    </>
  );
}

function FragmentWithArrow(props: { index: number; text: string }) {
  return (
    <>
      {props.index > 0 ? <span className="editorial-inline-arrow">→</span> : null}
      {props.text}
    </>
  );
}

function parseAccentLines(value: string | undefined): Set<number> {
  if (!value) {
    return new Set([2]);
  }

  return new Set(
    value
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isInteger(item) && item > 0),
  );
}

function ArtifactScene(props: {
  artifact: string;
  items?: readonly ListSlideItem[];
  visual?: EditorialVisualConfig;
}) {
  const blueprint = getArtifactBlueprint(props.artifact, props.items, props.visual);
  return <ArtifactVisual blueprint={blueprint} />;
}
