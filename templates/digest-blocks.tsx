import {
  Brain,
  ChartBar,
  CheckSquare,
  FilmSlate,
  FolderOpen,
  Lightning,
  MagnifyingGlass,
  Microphone,
  PencilSimple,
  Robot,
  Rocket,
  ShieldCheck,
  Sparkle,
  Stack,
  Star,
  Target,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";

import { tokens } from "../brand/tokens";
import { brandSignature } from "./_shared/BrandChrome";
import { formatHeadlineLines } from "./EditorialSlide";

export type DigestFeature = {
  icon: string;
  title: string;
  desc: string;
};

export type DigestFlowStep = {
  step: string;
  desc: string;
};

export type DigestCompare = {
  oldTitle?: string;
  newTitle?: string;
  old: readonly string[];
  new: readonly string[];
};

export type DigestCtaLink = {
  label: string;
  url?: string;
};

export type DigestCoverData = {
  kind: "digest-cover";
  title: string;
  subline?: string;
  scrollCue?: string;
  image?: string;
};

export type DigestUpdateData = {
  kind: "digest-update";
  badge?: string;
  headline: string;
  intro: string;
  accentLines?: string;
  image?: string;
  bubble?: string;
  features?: readonly DigestFeature[];
  checklist?: readonly string[];
  flow?: readonly DigestFlowStep[];
  compare?: DigestCompare;
};

export type DigestCtaData = {
  kind: "digest-cta";
  headline: string;
  accentLines?: string;
  intro?: string;
  benefits?: readonly DigestFeature[];
  cta?: DigestCtaLink;
  note?: string;
  image?: string;
};

const ICONS: Record<string, Icon> = {
  lightning: Lightning,
  speed: Lightning,
  fast: Lightning,
  target: Target,
  focus: Target,
  users: UsersThree,
  team: UsersThree,
  people: UsersThree,
  star: Star,
  quality: Star,
  rocket: Rocket,
  launch: Rocket,
  brain: Brain,
  understanding: Brain,
  robot: Robot,
  agent: Robot,
  ai: Robot,
  chart: ChartBar,
  analytics: ChartBar,
  growth: ChartBar,
  search: MagnifyingGlass,
  research: MagnifyingGlass,
  check: CheckSquare,
  pm: CheckSquare,
  done: CheckSquare,
  pencil: PencilSimple,
  design: PencilSimple,
  edit: PencilSimple,
  shield: ShieldCheck,
  honest: ShieldCheck,
  trust: ShieldCheck,
  stack: Stack,
  context: Stack,
  library: Stack,
  film: FilmSlate,
  video: FilmSlate,
  broll: FilmSlate,
  mic: Microphone,
  voice: Microphone,
  audio: Microphone,
  folder: FolderOpen,
  files: FolderOpen,
  sparkle: Sparkle,
  magic: Sparkle,
};

export function DigestIcon(props: { name: string }) {
  const Glyph = ICONS[props.name.trim().toLowerCase()] ?? Sparkle;
  return <Glyph weight="duotone" className="digest-icon" aria-hidden="true" />;
}

export function DigestTopline(props: { slideNumber: number; totalSlides: number; nickname?: string }) {
  return (
    <header className="digest-topline">
      <span className="digest-topline__pill">{props.nickname ?? tokens.brand.handle}</span>
      <span className="digest-topline__counter">
        {props.slideNumber}/{props.totalSlides}
      </span>
    </header>
  );
}

export function DigestFooter(props: { note?: string; signature?: string }) {
  return (
    <footer className="digest-footer">
      <span className="digest-footer__note">{props.note ?? tokens.brand.toplineSuffix}</span>
      <span className="digest-footer__signature">{props.signature ?? brandSignature()}</span>
    </footer>
  );
}

export function DigestHeadline(props: { headline: string; accentLines?: string }) {
  const accents = parseAccentLines(props.accentLines);
  const lines = formatHeadlineLines(props.headline);

  return (
    <h1 className="digest-headline">
      {lines.map((line, index) => (
        <span
          className={[
            "digest-headline__line",
            accents.has(index + 1) ? "digest-headline__line--accent" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          key={`${index}-${line}`}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}

export function FeatureList(props: { items: readonly DigestFeature[] }) {
  return (
    <ul className="digest-features">
      {props.items.map((feature, index) => (
        <li className="digest-features__item" key={`${index}-${feature.title}`}>
          <span className="digest-features__icon">
            <DigestIcon name={feature.icon} />
          </span>
          <div className="digest-features__text">
            <h3>{feature.title}</h3>
            {feature.desc ? <p>{feature.desc}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function BenefitRow(props: { items: readonly DigestFeature[]; title?: string }) {
  return (
    <section className="digest-benefits">
      {props.title ? <h2 className="digest-benefits__title">{props.title}</h2> : null}
      <div className="digest-benefits__row">
        {props.items.map((benefit, index) => (
          <div className="digest-benefits__cell" key={`${index}-${benefit.title}`}>
            <span className="digest-benefits__icon">
              <DigestIcon name={benefit.icon} />
            </span>
            <h3>{benefit.title}</h3>
            {benefit.desc ? <p>{benefit.desc}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function FlowSteps(props: { steps: readonly DigestFlowStep[]; title?: string }) {
  return (
    <section className="digest-flow">
      {props.title ? <h2 className="digest-flow__title">{props.title}</h2> : null}
      <ol className="digest-flow__row">
        {props.steps.map((step, index) => (
          <li className="digest-flow__step" key={`${index}-${step.step}`}>
            <div className="digest-flow__card">
              <span className="digest-flow__num">{index + 1}</span>
              <div className="digest-flow__text">
                <h3>{step.step}</h3>
                {step.desc ? <p>{step.desc}</p> : null}
              </div>
            </div>
            {index < props.steps.length - 1 ? (
              <span className="digest-flow__arrow" aria-hidden="true">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Asterisk(props: { className?: string }) {
  return (
    <svg
      className={["digest-asterisk", props.className].filter(Boolean).join(" ")}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <g fill="currentColor">
        {[0, 60, 120].map((angle) => (
          <rect key={angle} x="10.7" y="1.5" width="2.6" height="21" rx="1.3" transform={`rotate(${angle} 12 12)`} />
        ))}
      </g>
    </svg>
  );
}

export function CompareCards(props: { compare: DigestCompare }) {
  return (
    <section className="digest-compare">
      <article className="digest-compare__card digest-compare__card--old">
        <h3>{props.compare.oldTitle ?? "Было"}</h3>
        <ul>
          {props.compare.old.map((line, index) => (
            <li key={`old-${index}`}>
              <span className="digest-compare__mark digest-compare__mark--no" aria-hidden="true">
                ✕
              </span>
              {line}
            </li>
          ))}
        </ul>
      </article>
      <span className="digest-compare__arrow" aria-hidden="true">
        →
      </span>
      <article className="digest-compare__card digest-compare__card--new">
        <h3>{props.compare.newTitle ?? "Стало"}</h3>
        <ul>
          {props.compare.new.map((line, index) => (
            <li key={`new-${index}`}>
              <span className="digest-compare__mark digest-compare__mark--yes" aria-hidden="true">
                ✓
              </span>
              {line}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

export function Checklist(props: { items: readonly string[]; title?: string }) {
  return (
    <section className="digest-checklist">
      {props.title ? <h2 className="digest-checklist__title">{props.title}</h2> : null}
      <ul>
        {props.items.map((line, index) => (
          <li key={index}>
            <span className="digest-checklist__mark" aria-hidden="true">
              ✓
            </span>
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SpeechBubble(props: { text: string }) {
  return (
    <div className="digest-bubble">
      <span>{props.text}</span>
    </div>
  );
}

export function MascotScene(props: { image?: string; className?: string }) {
  return (
    <figure className={["digest-mascot", props.className].filter(Boolean).join(" ")}>
      {props.image ? (
        <img src={props.image} alt="" aria-hidden="true" />
      ) : (
        <div className="digest-mascot__placeholder" aria-hidden="true" />
      )}
    </figure>
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

export function isDigestCoverData(value: unknown): value is DigestCoverData {
  const record = asRecord(value);
  return record?.kind === "digest-cover" && typeof record.title === "string";
}

export function isDigestUpdateData(value: unknown): value is DigestUpdateData {
  const record = asRecord(value);
  return (
    record?.kind === "digest-update" &&
    typeof record.headline === "string" &&
    typeof record.intro === "string"
  );
}

export function isDigestCtaData(value: unknown): value is DigestCtaData {
  const record = asRecord(value);
  return record?.kind === "digest-cta" && typeof record.headline === "string";
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}
