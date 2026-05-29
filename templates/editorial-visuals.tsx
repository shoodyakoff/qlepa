import type { CSSProperties, ReactNode } from "react";
import {
  CheckSquare,
  Clock,
  ClockCountdown,
  CurrencyRub,
  Database,
  FileText,
  Globe,
  Kanban,
  Lightbulb,
  LockKey,
  Money,
  ShareNetwork,
  Square,
  SquaresFour,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";

import type { ListSlideItem } from "./ListSlide";

export type ArtifactVisualTemplate =
  | "experiment-launch-board"
  | "browser-product-showcase"
  | "agent-ops-board"
  | "file-dashboard-mosaic"
  | "learning-toolkit-board"
  | "artifact-table"
  | "timeline-strip"
  | "system-map"
  | "contrast-diptych"
  | "asset-grid"
  | "command-board"
  | "field-note-board"
  | "assembly-rig"
  | "prompt-loop"
  | "script-rules-file"
  | "voice-caption-pipeline"
  | "semantic-selector"
  | "capture-console"
  | "factory-floor"
  | "generated-scene"
  | "character-scene"
  | "product-mock";

export type EditorialVisualConfig = {
  template?: string;
  file?: string;
  image?: string;
  copyImage?: string;
  primary?: string;
  secondary?: string;
  badge?: string;
  composition?: string;
  metaphor?: string;
  mood?: string;
  note?: string;
  modules?: readonly string[];
  metrics?: readonly string[];
  outcomes?: readonly string[];
};

export type ArtifactBlueprint = {
  file?: string;
  image?: string;
  labels: readonly string[];
  metrics: readonly string[];
  outcomes: readonly string[];
  primary: string;
  secondary?: string;
  badge?: string;
  composition?: string;
  metaphor?: string;
  mood?: string;
  note?: string;
  title: string;
  visual: ArtifactVisualTemplate;
};

type MetricIconName =
  | "access"
  | "channels"
  | "crm"
  | "insights"
  | "link"
  | "paid"
  | "product"
  | "sales"
  | "sources"
  | "time"
  | "zero";

type TodoState = "todo" | "done" | "progress";

type TodoListEntry =
  | string
  | {
      label: string;
      state?: TodoState;
    };

export function getArtifactBlueprint(
  artifact: string,
  items?: readonly ListSlideItem[],
  visual?: EditorialVisualConfig,
): ArtifactBlueprint {
  const explicitTemplate = normalizeTemplate(visual?.template);

  if (artifact === "lean-cycle" || artifact === "analytics") {
    return {
      file: visual?.file ?? "mvp-check.md",
      ...visualExtras(visual),
      labels: visual?.modules ?? ["Define the pain", "Draft slides", "Preview", "Export"],
      metrics: visual?.metrics ?? ["5 slides", "0 uploads", "1 final set"],
      outcomes: visual?.outcomes ?? [
        "Clear audience",
        "Draft markdown",
        "Preview checked",
        "PNG files exported",
      ],
      primary: visual?.primary ?? "One idea to carousel",
      secondary: visual?.secondary ?? "starter workflow",
      title: visual?.primary ?? "One idea to carousel",
      visual: explicitTemplate ?? "experiment-launch-board",
    };
  }

  if (artifact === "visuals") {
    return {
      file: visual?.file ?? "content-system.md",
      ...visualExtras(visual),
      labels: visual?.modules ?? ["Raw idea", "Post draft", "Carousel"],
      metrics: visual?.metrics ?? ["Reusable format", "Faster drafts", "Cleaner handoff"],
      outcomes: visual?.outcomes ?? [
        "The offer is clear",
        "The story is structured",
        "The assets are export-ready",
      ],
      primary: visual?.primary ?? "Content workflow",
      secondary: visual?.secondary ?? "draft-to-export system",
      title: "Reusable content workflow",
      visual: explicitTemplate ?? "browser-product-showcase",
    };
  }

  if (artifact === "automation") {
    return {
      file: visual?.file ?? "ops-checklist.md",
      ...visualExtras(visual),
      labels: visual?.modules ?? ["idea", "notes", "copy", "preview", "review", "export"],
      metrics: visual?.metrics ?? ["1 source", "5 slides", "ready PNGs"],
      outcomes: visual?.outcomes ?? [
        "Inputs are collected",
        "Slides are reviewed",
        "Outputs are saved",
        "Next post is easier",
      ],
      primary: visual?.primary ?? "Local pipeline",
      secondary: visual?.secondary ?? "repeatable carousel production",
      title: "Repeatable carousel production",
      visual: explicitTemplate ?? "agent-ops-board",
    };
  }

  if (artifact === "internal") {
    return {
      file: visual?.file ?? "company-demo.md",
      ...visualExtras(visual),
      labels: visual?.modules ?? ["notes", "outline", "draft", "preview", "export", "archive"],
      metrics: visual?.metrics ?? ["3 inputs", "1 draft", "5 outputs"],
      outcomes: visual?.outcomes ?? [
        "Inputs are organized",
        "The draft is reusable",
        "The preview is visible",
        "The output folder is clean",
      ],
      primary: visual?.primary ?? "What changed in the post?",
      secondary: visual?.secondary ?? "source-to-output view",
      title: "Source-to-output dashboard",
      visual: explicitTemplate ?? "file-dashboard-mosaic",
    };
  }

  if (artifact === "education") {
    return {
      file: visual?.file ?? "learning-notes.md",
      ...visualExtras(visual),
      labels: visual?.modules ?? ["Guided setup", "Self-serve docs"],
      metrics: visual?.metrics ?? [],
      outcomes: visual?.outcomes ?? [
        "Add private references",
        "Customize brand tokens",
        "Create first post",
        "Export PNGs",
        "Read the README",
        "Use agent prompts",
        "Repeat the workflow",
      ],
      primary: visual?.primary ?? "Two onboarding paths",
      secondary: visual?.secondary ?? "local carousel setup",
      badge: visual?.badge ?? "start with the guided path, then make it yours",
      note:
        visual?.note ??
        "Use the repo as a local factory: keep private references local, edit markdown, preview in the browser, export PNGs.",
      title: "Two onboarding paths",
      visual: explicitTemplate ?? "learning-toolkit-board",
    };
  }

  return {
    file: visual?.file,
    ...visualExtras(visual),
    labels: visual?.modules ?? normalizeLabels(items, ["Pain", "Slide", "Export"]),
    metrics: visual?.metrics ?? ["fast", "clear", "ready"],
    outcomes: visual?.outcomes ?? [],
    primary: visual?.primary ?? "Small repeatable system",
    secondary: visual?.secondary,
    title: "One repeatable content scenario",
    visual: explicitTemplate ?? "product-mock",
  };
}

export function ArtifactVisual(props: { blueprint: ArtifactBlueprint }) {
  switch (props.blueprint.visual) {
    case "experiment-launch-board":
      return <ExperimentLaunchBoard blueprint={props.blueprint} />;
    case "browser-product-showcase":
      return <BrowserProductShowcase blueprint={props.blueprint} />;
    case "agent-ops-board":
      return <AgentOpsBoard blueprint={props.blueprint} />;
    case "file-dashboard-mosaic":
      return <FileDashboardMosaic blueprint={props.blueprint} />;
    case "learning-toolkit-board":
      return <LearningToolkitBoard blueprint={props.blueprint} />;
    case "artifact-table":
      return <ArtifactTableVisual blueprint={props.blueprint} />;
    case "timeline-strip":
      return <TimelineStripVisual blueprint={props.blueprint} />;
    case "system-map":
      return <SystemMapVisual blueprint={props.blueprint} />;
    case "contrast-diptych":
      return <ContrastDiptychVisual blueprint={props.blueprint} />;
    case "asset-grid":
      return <AssetGridVisual blueprint={props.blueprint} />;
    case "command-board":
      return <CommandBoardVisual blueprint={props.blueprint} />;
    case "field-note-board":
      return <FieldNoteBoardVisual blueprint={props.blueprint} />;
    case "assembly-rig":
      return <AssemblyRigVisual blueprint={props.blueprint} />;
    case "prompt-loop":
      return <PromptLoopVisual blueprint={props.blueprint} />;
    case "script-rules-file":
      return <ScriptRulesFileVisual blueprint={props.blueprint} />;
    case "voice-caption-pipeline":
      return <VoiceCaptionPipelineVisual blueprint={props.blueprint} />;
    case "semantic-selector":
      return <SemanticSelectorVisual blueprint={props.blueprint} />;
    case "capture-console":
      return <CaptureConsoleVisual blueprint={props.blueprint} />;
    case "factory-floor":
      return <FactoryFloorVisual blueprint={props.blueprint} />;
    case "generated-scene":
    case "character-scene":
      return <GeneratedSceneVisual blueprint={props.blueprint} />;
    default:
      return <ProductMockFallback blueprint={props.blueprint} />;
  }
}

function ExperimentLaunchBoard(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, [
    "Define the pain",
    "Draft slides",
    "Preview",
    "Export",
  ]);
  const mirroredLabels = completeLabels(props.blueprint.outcomes, [
    "Audience is clear",
    "Markdown is drafted",
    "Preview is checked",
    "PNG files are exported",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["5 slides", "0 uploads", "1 output folder"]);
  const todoItems = labels.slice(0, 4);

  return (
    <section className="artifact visual-template artifact-template experiment-launch-board">
      <FileCard file={props.blueprint.file ?? "mvp-check.md"}>
        <div className="artifact-file-card__headline">
          <strong>{props.blueprint.primary}</strong>
        </div>
        <TodoListCard items={todoItems} />
      </FileCard>
      <TodoListCard done items={mirroredLabels.slice(0, 4)} surface />
      <div className="artifact-metric-row">
        <MetricCard icon="sales" label="drafted locally" value={metrics[0] ?? "5 slides"} />
        <MetricCard icon="zero" label="external uploads" value={metrics[1] ?? "0 uploads"} />
        <MetricCard icon="insights" label="ready folder" value={metrics[2] ?? "1 output"} />
      </div>
      <TelegramBotMock />
    </section>
  );
}

function BrowserProductShowcase(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, ["Raw idea", "Post draft", "Carousel"]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "The offer is clear",
    "The story is structured",
    "The assets are export-ready",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["Reusable format", "Faster drafts", "Clean handoff"]);

  return (
    <section className="artifact visual-template artifact-template browser-product-showcase">
      <BrowserMock title={props.blueprint.secondary ?? "gamified creator product"} tilt="right">
        <div className="artifact-browser-hero">
          <h2>{props.blueprint.primary}</h2>
          <CourseCrmPreview />
        </div>
        <div className="artifact-browser-tabs">
          {labels.slice(0, 3).map((label) => (
            <strong key={label}>{label}</strong>
          ))}
        </div>
      </BrowserMock>
      <FileCard file={props.blueprint.file ?? "creator-course-crm.md"}>
        <div className="artifact-pipeline-row">
          <strong>{labels[0] ?? "Raw idea"}</strong>
          <span>→</span>
          <strong>{labels[1] ?? "Post draft"}</strong>
          <span>→</span>
          <strong>{labels[2] ?? "Carousel"}</strong>
        </div>
      </FileCard>
      <ReasonList items={outcomes.slice(0, 3)} />
      <div className="browser-product-showcase__metric-panel">
        <h3 className="browser-product-showcase__metric-heading">Why this helps</h3>
        <div className="artifact-metric-row browser-product-showcase__metrics">
          <MetricCard icon="sales" label="" value={metrics[0] ?? "Reusable format"} />
          <MetricCard icon="insights" label="" value={metrics[1] ?? "Faster drafts"} />
          <MetricCard icon="product" label="" value={metrics[2] ?? "Clean handoff"} />
        </div>
      </div>
    </section>
  );
}

function AgentOpsBoard(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, [
    "idea",
    "notes",
    "copy",
    "preview",
    "review",
    "export",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["1 source", "5 slides", "ready PNGs"]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "Inputs are collected",
    "Slides are reviewed",
    "Outputs are saved",
    "Next post is easier",
  ]);

  return (
    <section className="artifact visual-template artifact-template agent-ops-board">
      <FileCard file={props.blueprint.file ?? "ai-reception.md"}>
        <p>{props.blueprint.secondary}</p>
      </FileCard>
      <div className="agent-ops-board__flow">
        <div className="agent-ops-board__lane">
          {labels.slice(0, 3).map((label) => (
            <strong key={label}>{label}</strong>
          ))}
        </div>
        <AgentConversationNode title={props.blueprint.primary} />
        <div className="agent-ops-board__lane agent-ops-board__lane--out">
          {labels.slice(3, 6).map((label) => (
            <strong key={label}>{label}</strong>
          ))}
        </div>
      </div>
      <TodoListCard done items={outcomes.slice(0, 4)} surface />
      <div className="artifact-metric-row">
        <MetricCard icon="time" label="single source" value={metrics[0] ?? "1 source"} />
        <MetricCard icon="channels" label="structured story" value={metrics[1] ?? "5 slides"} />
        <MetricCard icon="crm" label="export result" value={metrics[2] ?? "ready PNGs"} />
      </div>
    </section>
  );
}

function FileDashboardMosaic(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, ["notes", "outline", "draft", "preview", "export", "archive"]);
  const metrics = completeLabels(props.blueprint.metrics, ["3 inputs", "1 draft", "5 outputs"]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "Inputs are organized",
    "The draft is reusable",
    "The preview is visible",
    "The output folder is clean",
  ]);
  const demoCards = ["topic chosen", "copy reviewed", "export ready"];

  return (
    <section className="artifact visual-template artifact-template file-dashboard-mosaic">
      <ConnectionList file={props.blueprint.file ?? "company-demo.md"} sources={labels.slice(0, 3)} />
      <BrowserMock title="company-demo.live">
        <div className="artifact-dashboard-query">
          <span>Query</span>
          <strong>{props.blueprint.primary}</strong>
        </div>
        <div className="artifact-dashboard-answer">
          <strong>The draft is ready to review</strong>
          <span>notes, outline, and preview are visible in one place</span>
        </div>
        <div className="artifact-dashboard-grid">
          {demoCards.map((card) => (
            <span key={card}>{card}</span>
          ))}
        </div>
      </BrowserMock>
      <TodoListCard done items={outcomes.slice(0, 4)} surface />
      <div className="artifact-metric-row">
        <MetricCard icon="sources" label="inputs" value={metrics[0] ?? "3 inputs"} />
        <MetricCard icon="product" label="drafts" value={metrics[1] ?? "1 draft"} />
        <MetricCard icon="insights" label="outputs" value={metrics[2] ?? "5 outputs"} />
      </div>
    </section>
  );
}

function LearningToolkitBoard(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, ["Guided setup", "Self-serve docs"]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "Add private references",
    "Customize brand tokens",
    "Create first post",
    "Export PNGs",
    "Read the README",
    "Use agent prompts",
    "Repeat the workflow",
  ]);
  const mentorTrack = outcomes.slice(0, 4);
  const productTrack = outcomes.slice(4);

  return (
    <section className="artifact visual-template artifact-template learning-toolkit-board">
      <FileCard file={props.blueprint.file ?? "learning-notes.md"}>
        <p>{props.blueprint.primary}</p>
      </FileCard>
      <div className="learning-toolkit-board__tracks">
        <LearningTrackCard
          eyebrow="path 01"
          items={mentorTrack}
          title={labels[0] ?? "Guided setup"}
        />
        <LearningTrackCard
          eyebrow="path 02"
          items={productTrack}
          title={labels[1] ?? "Self-serve docs"}
        />
      </div>
      <article className="learning-toolkit-board__result">
        <div>
          <span>{props.blueprint.secondary}</span>
        </div>
        <b>{props.blueprint.badge}</b>
        <i aria-hidden="true" />
      </article>
    </section>
  );
}

function ArtifactTableVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, ["Hook", "Main idea", "CTA", "Status"]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "Source is explicit",
    "Slide role is clear",
    "Final review is visible",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["1 source", "4 fields", "reviewed"]);
  const rows = labels.slice(0, 4).map((label, index) => ({
    label,
    note: outcomes[index] ?? metrics[index] ?? "ready",
    value: index === 0 ? props.blueprint.primary : metrics[index - 1] ?? label,
  }));

  return (
    <section className="artifact visual-template artifact-template artifact-table-visual">
      <FileCard file={props.blueprint.file ?? "brief.md"}>
        <div className="artifact-file-card__headline">
          <strong>{props.blueprint.primary}</strong>
          {props.blueprint.secondary ? <span>{props.blueprint.secondary}</span> : null}
        </div>
      </FileCard>
      <article className="artifact-table-visual__panel">
        <header>
          <span>field</span>
          <span>value</span>
          <span>check</span>
        </header>
        {rows.map((row) => (
          <p key={row.label}>
            <strong>{row.label}</strong>
            <b>{row.value}</b>
            <span>{row.note}</span>
          </p>
        ))}
      </article>
      <div className="artifact-metric-row">
        <MetricCard icon="sources" label="source" value={metrics[0] ?? "1 source"} />
        <MetricCard icon="product" label="fields" value={metrics[1] ?? "4 fields"} />
        <MetricCard icon="insights" label="state" value={metrics[2] ?? "reviewed"} />
      </div>
    </section>
  );
}

function TimelineStripVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, ["draft", "review", "revision", "export"]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "first shape",
    "scored against rubric",
    "weak slide rewritten",
    "ready output",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["1 source", "2 passes", "final"]);

  return (
    <section className="artifact visual-template artifact-template timeline-strip-visual">
      <header className="timeline-strip-visual__header">
        <span>{props.blueprint.file ?? "timeline.md"}</span>
        <strong>{props.blueprint.primary}</strong>
      </header>
      <div className="timeline-strip-visual__steps">
        {labels.slice(0, 4).map((label, index) => (
          <article className="timeline-strip-visual__step" key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            <p>{outcomes[index] ?? "checked"}</p>
          </article>
        ))}
      </div>
      <article className="timeline-strip-visual__review">
        <strong>{metrics[1] ?? "2 passes"}</strong>
        <span>{props.blueprint.secondary ?? metrics[2] ?? "final"}</span>
      </article>
    </section>
  );
}

function SystemMapVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, ["assets", "rules", "draft", "review", "export"]);
  const outcomes = completeLabels(props.blueprint.outcomes, ["inputs", "logic", "render", "checks"]);
  const metrics = completeLabels(props.blueprint.metrics, ["local", "repeatable", "audited"]);

  return (
    <section className="artifact visual-template artifact-template system-map-visual">
      <article className="system-map-visual__center">
        <span>{props.blueprint.secondary ?? "проект"}</span>
        <strong>{props.blueprint.primary}</strong>
      </article>
      <div className="system-map-visual__nodes">
        {labels.slice(0, 6).map((label, index) => (
          <article className="system-map-visual__node" key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            <p>{outcomes[index % outcomes.length] ?? "linked"}</p>
          </article>
        ))}
      </div>
      <div className="system-map-visual__chips">
        {metrics.slice(0, 3).map((metric) => (
          <strong key={metric}>{metric}</strong>
        ))}
      </div>
    </section>
  );
}

function ContrastDiptychVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, ["Before", "After"]);
  const outcomes = completeLabels(props.blueprint.outcomes, ["Vague request", "Prepared process"]);
  const leftTitle = props.blueprint.primary ?? labels[0] ?? "Before";
  const rightTitle = props.blueprint.secondary ?? labels[1] ?? "After";

  const half = Math.ceil(labels.length / 2);
  const leftPros = labels.slice(0, half);
  const rightPros = labels.slice(half);
  const consHalf = Math.ceil(outcomes.length / 2);
  const leftCons = outcomes.slice(0, consHalf);
  const rightCons = outcomes.slice(consHalf);

  const hasProsCons = leftPros.length > 0 && rightPros.length > 0;

  if (!hasProsCons) {
    return (
      <section className="artifact visual-template artifact-template contrast-diptych-visual">
        <article className="contrast-diptych-visual__panel contrast-diptych-visual__panel--before">
          <span>{labels[0] ?? "Before"}</span>
          <strong>{outcomes[0] ?? leftTitle}</strong>
          <p>{props.blueprint.secondary ?? "one prompt, weak context"}</p>
        </article>
        <div className="contrast-diptych-visual__bridge" aria-hidden="true">→</div>
        <article className="contrast-diptych-visual__panel contrast-diptych-visual__panel--after">
          <span>{labels[1] ?? "After"}</span>
          <strong>{outcomes[1] ?? rightTitle}</strong>
          <p>{props.blueprint.primary}</p>
        </article>
      </section>
    );
  }

  return (
    <section className="artifact visual-template artifact-template contrast-diptych-visual contrast-diptych-visual--pros-cons">
      <DiptychPanel variant="before" title={leftTitle} pros={leftPros} cons={leftCons} />
      <DiptychPanel variant="after" title={rightTitle} pros={rightPros} cons={rightCons} />
    </section>
  );
}

function DiptychPanel(props: {
  variant: "before" | "after";
  title: string;
  pros: readonly string[];
  cons: readonly string[];
}) {
  return (
    <article className={`contrast-diptych-visual__panel contrast-diptych-visual__panel--${props.variant}`}>
      <strong className="contrast-diptych-visual__title">{props.title}</strong>
      <ul className="contrast-diptych-visual__list contrast-diptych-visual__list--pros">
        {props.pros.map((item) => (
          <li key={`pro-${item}`}>
            <span className="contrast-diptych-visual__mark contrast-diptych-visual__mark--plus" aria-hidden="true">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <ul className="contrast-diptych-visual__list contrast-diptych-visual__list--cons">
        {props.cons.map((item) => (
          <li key={`con-${item}`}>
            <span className="contrast-diptych-visual__mark contrast-diptych-visual__mark--minus" aria-hidden="true">✗</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function AssetGridVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, ["clip", "icon", "audio", "caption", "cover", "export"]);
  const metrics = completeLabels(props.blueprint.metrics, ["80 clips", "3-5 sec", "tagged"]);
  const outcomes = completeLabels(props.blueprint.outcomes, ["Library", "matched by meaning", "ready set"]);
  const libraryLabel = outcomes.find((outcome) => outcome.toLowerCase().includes("library")) ?? outcomes[0] ?? "Library";
  const tiles = labels.length > 6 ? labels.slice(labels.length - 6) : labels.slice(0, 6);

  return (
    <section className="artifact visual-template artifact-template asset-grid-visual">
      <header className="asset-grid-visual__header">
        <span>{libraryLabel}</span>
        <strong>{props.blueprint.primary}</strong>
      </header>
      <div className="asset-grid-visual__grid">
        {tiles.map((label, index) => (
          <article className="asset-grid-visual__tile" key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            <p>{outcomes[(index + 1) % outcomes.length] ?? "tagged"}</p>
          </article>
        ))}
      </div>
      <div className="asset-grid-visual__metrics">
        {metrics.slice(0, 3).map((metric) => (
          <strong key={metric}>{metric}</strong>
        ))}
      </div>
    </section>
  );
}

function CommandBoardVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, ["Plan", "Shoot", "Review", "Export"]);
  const metrics = completeLabels(props.blueprint.metrics, ["this week", "inputs", "outputs"]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "Command center",
    "what to capture",
    "what is missing",
    "what is ready",
  ]);
  const commandLabel =
    outcomes.find((outcome) => outcome.toLowerCase().includes("command center")) ?? outcomes[0] ?? "Command center";
  const tasks = labels.length > 4 ? labels.slice(labels.length - 4) : labels.slice(0, 4);

  return (
    <section className="artifact visual-template artifact-template command-board-visual">
      <header className="command-board-visual__header">
        <span>{commandLabel}</span>
        <strong>{props.blueprint.primary}</strong>
        {props.blueprint.secondary ? <p>{props.blueprint.secondary}</p> : null}
      </header>
      <div className="command-board-visual__tasks">
        {tasks.map((task, index) => (
          <article className="command-board-visual__task" key={task}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{task}</strong>
            <p>{outcomes[(index + 1) % outcomes.length] ?? "ready"}</p>
          </article>
        ))}
      </div>
      <div className="command-board-visual__metrics">
        {metrics.slice(0, 3).map((metric) => (
          <strong key={metric}>{metric}</strong>
        ))}
      </div>
    </section>
  );
}

function FieldNoteBoardVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, ["Hook", "Main idea", "CTA", "Rules"]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "reader stops",
    "point stays focused",
    "final action is clear",
    "weak words are removed",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["format", "accent", "iteration"]);
  const rows = labels.slice(0, 5);
  const isRecord = props.blueprint.composition === "record";

  return (
    <section
      className={[
        "artifact visual-template artifact-template field-note-board-visual",
        isRecord ? "field-note-board-visual--record" : "",
      ].filter(Boolean).join(" ")}
    >
      <header className="field-note-board-visual__header">
        <span>{props.blueprint.file ?? "rules.md"}</span>
        <strong>{props.blueprint.primary}</strong>
        {props.blueprint.secondary ? <p>{props.blueprint.secondary}</p> : null}
      </header>
      <div className="field-note-board-visual__rows">
        {rows.map((label, index) => (
          <article className="field-note-board-visual__row" key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            <p>{outcomes[index] ?? "checked"}</p>
          </article>
        ))}
      </div>
      <footer className="field-note-board-visual__footer">
        <p>{props.blueprint.note ?? props.blueprint.badge ?? "A reusable artifact beats a rewritten prompt."}</p>
        <div>
          {metrics.slice(0, 3).map((metric) => (
            <strong key={metric}>{metric}</strong>
          ))}
        </div>
      </footer>
    </section>
  );
}

function AssemblyRigVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, [
    "prepared text",
    "voice model",
    "audio file",
    "word timings",
    "caption groups",
  ]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "pronunciation fixed",
    "voice generated",
    "words are timed",
    "subtitles follow rhythm",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["pauses", "dictionary", "rhythm"]);

  return (
    <section className="artifact visual-template artifact-template assembly-rig-visual">
      <header className="assembly-rig-visual__header">
        <span>{props.blueprint.file ?? "assembly-plan.md"}</span>
        <strong>{props.blueprint.primary}</strong>
        {props.blueprint.secondary ? <p>{props.blueprint.secondary}</p> : null}
      </header>
      <div className="assembly-rig-visual__line" aria-hidden="true">
        {Array.from({ length: 26 }, (_, index) => (
          <span key={index} style={{ height: `${22 + ((index * 17) % 54)}px` }} />
        ))}
      </div>
      <div className="assembly-rig-visual__steps">
        {labels.slice(0, 5).map((label, index) => (
          <article className="assembly-rig-visual__step" key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            <p>{outcomes[index % outcomes.length] ?? "ready"}</p>
          </article>
        ))}
      </div>
      <footer className="assembly-rig-visual__metrics">
        {metrics.slice(0, 3).map((metric) => (
          <strong key={metric}>{metric}</strong>
        ))}
      </footer>
    </section>
  );
}

function PromptLoopVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, [
    "ии додумывает",
    "каждый раз с нуля",
    "как выглядит процесс",
  ]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "результат менее предсказуем",
    "ии не помнит контекст правок",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, [
    "написать сценарий",
    "снять cta и hook",
    "загрузить файлы в папку",
    "получить готовое видео",
  ]);

  return (
    <section className="artifact visual-template artifact-template prompt-loop-visual">
      <article className="prompt-loop-visual__loop">
        <header>
          <span>{props.blueprint.file ?? "prompt.loop.md"}</span>
          <strong>{labels[0] ?? props.blueprint.primary}</strong>
        </header>
        <div className="prompt-loop-visual__spiral" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="prompt-loop-visual__loop-cards">
          {labels.slice(0, 2).map((label, index) => (
            <p key={label}>
              <strong>{label}</strong>
              <span>{outcomes[index] ?? "снова руками"}</span>
            </p>
          ))}
        </div>
      </article>
      <article className="prompt-loop-visual__process">
        <span>{props.blueprint.secondary ?? "линия процесса"}</span>
        <strong>{labels[2] ?? props.blueprint.primary}</strong>
        <div>
          {metrics.slice(0, 4).map((metric, index) => (
            <p key={metric}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>{metric}</span>
            </p>
          ))}
        </div>
      </article>
    </section>
  );
}

function ScriptRulesFileVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, [
    "hook",
    "CTA",
    "стоп-слова",
    "акцент",
  ]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "не начинать с «в этом видео»",
    "финал записать лицом",
    "убрать «нейросеть» и «уникальный»",
    "куда давить голосом",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["формат", "правки", "версии"]);

  return (
    <section className="artifact visual-template artifact-template script-rules-file-visual">
      <article className="script-rules-file-visual__editor">
        <header>
          <span>{props.blueprint.file ?? "script.rules.md"}</span>
          <b>•••</b>
        </header>
        <div className="script-rules-file-visual__rows">
          {labels.slice(0, 5).map((label, index) => (
            <p key={label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
              <em>{outcomes[index] ?? "правило автора"}</em>
              <b aria-label="checked">✓</b>
            </p>
          ))}
        </div>
      </article>
      <footer className="script-rules-file-visual__footer">
        <strong>{props.blueprint.primary}</strong>
        <span>{props.blueprint.note ?? props.blueprint.secondary ?? "правлю по тому, что реально залетает"}</span>
        <div>
          {metrics.slice(0, 3).map((metric) => (
            <b key={metric}>{metric}</b>
          ))}
        </div>
      </footer>
    </section>
  );
}

function VoiceCaptionPipelineVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, [
    "текст",
    "0.4s",
    "субтитры",
  ]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "словарь применён",
    "слово со временем",
    "3-5 слов",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["0.0s", "0.4s", "0.9s"]);
  const words = labels.slice(0, 3);

  return (
    <section className="artifact visual-template artifact-template voice-caption-pipeline-visual">
      <header className="voice-caption-pipeline-visual__header">
        <span>{props.blueprint.file ?? "voice.cutter.md"}</span>
        <strong>{props.blueprint.primary}</strong>
      </header>
      <div className="voice-caption-pipeline-visual__wave" aria-hidden="true">
        {Array.from({ length: 32 }, (_, index) => (
          <span key={index} style={{ height: `${18 + ((index * 19) % 68)}px` }} />
        ))}
      </div>
      <div className="voice-caption-pipeline-visual__timings">
        {words.map((word, index) => (
          <p key={`${word}-${index}`}>
            <b>{metrics[index] ?? `${index * 0.4}s`}</b>
            <strong>{word}</strong>
            <span>{outcomes[index] ?? "размечено"}</span>
          </p>
        ))}
      </div>
      <footer className="voice-caption-pipeline-visual__captions">
        {outcomes.slice(0, 3).map((outcome) => (
          <strong key={outcome}>{outcome}</strong>
        ))}
      </footer>
    </section>
  );
}

function SemanticSelectorVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, [
    "source phrase",
    "meaning tag",
    "clip type",
    "product moment",
  ]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "screen recording",
    "hands on keyboard",
    "talking head",
    "product fragment",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["80 clips", "3-5 sec", "tagged"]);
  const pairs = labels.slice(0, 4).map((label, index) => ({
    label,
    outcome: outcomes[index % outcomes.length] ?? "matched",
  }));

  return (
    <section className="artifact visual-template artifact-template semantic-selector-visual">
      <header className="semantic-selector-visual__header">
        <span>{props.blueprint.file ?? "asset-library.md"}</span>
        <strong>{props.blueprint.primary}</strong>
        {props.blueprint.secondary ? <p>{props.blueprint.secondary}</p> : null}
      </header>
      <div className="semantic-selector-visual__matrix">
        {pairs.map((pair, index) => (
          <article className="semantic-selector-visual__pair" key={pair.label}>
            <div>
              <span>text {String(index + 1).padStart(2, "0")}</span>
              <strong>{pair.label}</strong>
            </div>
            <i aria-hidden="true" />
            <div>
              <span>visual match</span>
              <strong>{pair.outcome}</strong>
            </div>
          </article>
        ))}
      </div>
      <footer className="semantic-selector-visual__metrics">
        {metrics.slice(0, 3).map((metric) => (
          <strong key={metric}>{metric}</strong>
        ))}
      </footer>
    </section>
  );
}

function CaptureConsoleVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, ["Plan", "Shoot hook", "Shoot CTA", "Export"]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "what to capture",
    "missing inputs",
    "ready files",
    "final outputs",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["this week", "inputs", "outputs"]);
  const tasks = labels.slice(0, 4);
  const isWeekly = props.blueprint.composition === "weekly";

  return (
    <section
      className={[
        "artifact visual-template artifact-template capture-console-visual",
        isWeekly ? "capture-console-visual--weekly" : "",
      ].filter(Boolean).join(" ")}
    >
      <aside className="capture-console-visual__side">
        <span>{props.blueprint.file ?? "capture-plan.md"}</span>
        <strong>{props.blueprint.primary}</strong>
        {props.blueprint.secondary ? <p>{props.blueprint.secondary}</p> : null}
        <div>
          {metrics.slice(0, 3).map((metric) => (
            <b key={metric}>{metric}</b>
          ))}
        </div>
      </aside>
      <div className="capture-console-visual__tasks">
        {tasks.map((task, index) => (
          <article className="capture-console-visual__task" key={task}>
            <span>{index === 0 ? "ready" : index === 1 ? "shoot" : index === 2 ? "missing" : "export"}</span>
            <strong>{task}</strong>
            <p>{outcomes[index % outcomes.length] ?? "ready"}</p>
          </article>
        ))}
      </div>
      <footer className="capture-console-visual__footer">
        <strong>{props.blueprint.badge ?? "operator view"}</strong>
        <p>{props.blueprint.note ?? "The screen tells the human what to do next."}</p>
      </footer>
    </section>
  );
}

function FactoryFloorVisual(props: { blueprint: ArtifactBlueprint }) {
  const labels = completeLabels(props.blueprint.labels, [
    "script card",
    "voice bench",
    "caption cutter",
    "render bay",
  ]);
  const metrics = completeLabels(props.blueprint.metrics, ["1 card", "4 stations", "1 MP4"]);
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "loose parts stop rolling around",
    "the card moves through stations",
    "a checked file leaves the line",
  ]);
  const stations = factoryStations(labels);
  const parts = outcomes.slice(0, 3);
  const composition = factoryComposition(props.blueprint.composition);
  const className = [
    "artifact visual-template artifact-template factory-floor-visual",
    `factory-floor-visual--${composition}`,
  ].join(" ");

  return (
    <section className={className}>
      <header className="factory-floor-visual__header">
        <span>{props.blueprint.file ?? "factory.floor.md"}</span>
        <strong>{props.blueprint.primary}</strong>
        {props.blueprint.secondary ? <p>{props.blueprint.secondary}</p> : null}
      </header>
      <div className="factory-floor-visual__floor">
        <div className="factory-floor-visual__rail" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <article className="factory-floor-visual__passport">
          <span>{props.blueprint.badge ?? "card"}</span>
          <strong>{props.blueprint.note ?? parts[0] ?? "ready for line"}</strong>
        </article>
        <div className="factory-floor-visual__parts">
          {parts.map((part, index) => (
            <strong key={part} style={{ "--part-index": index } as CSSProperties}>
              {part}
            </strong>
          ))}
        </div>
        <div className="factory-floor-visual__stations">
          {stations.map((station, index) => (
            <article className="factory-floor-visual__station" key={station}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{station}</strong>
            </article>
          ))}
        </div>
      </div>
      <footer className="factory-floor-visual__output">
        <strong>{metrics[0] ?? "line ready"}</strong>
        <div>
          {metrics.slice(1, 3).map((metric) => (
            <span key={metric}>{metric}</span>
          ))}
        </div>
        <p>{props.blueprint.metaphor ?? props.blueprint.mood ?? "local content line"}</p>
      </footer>
    </section>
  );
}

function GeneratedSceneVisual(props: { blueprint: ArtifactBlueprint }) {
  const hasLabels = props.blueprint.labels.length > 0;
  const labels = hasLabels
    ? props.blueprint.labels
    : ["scene role", "meaning cue", "decision anchor"];
  const outcomes = completeLabels(props.blueprint.outcomes, [
    "makes hidden work visible",
    "turns the abstract step into a scene",
    "keeps the final decision human",
  ]);
  const leftStickyText = hasLabels ? outcomes[2] ?? outcomes[0] : outcomes[0];
  const metrics = completeLabels(props.blueprint.metrics, ["scene", "system", "choice"]);
  const image = props.blueprint.image;
  const isGeneratedScene = props.blueprint.visual === "generated-scene";
  const imageMode =
    image && (isGeneratedScene || props.blueprint.composition?.includes("portrait"))
      ? "character-scene-visual--image-inset"
      : "";
  const className = [
    isGeneratedScene
      ? "artifact visual-template artifact-template generated-scene-visual character-scene-visual"
      : "artifact visual-template artifact-template character-scene-visual",
    imageMode,
  ].filter(Boolean).join(" ");
  const defaultFile =
    isGeneratedScene ? "generated-scene.md" : "character-scene.md";

  return (
    <section className={className}>
      <article className="character-scene-visual__brief">
        <span>{props.blueprint.file ?? defaultFile}</span>
        <strong>{props.blueprint.primary}</strong>
        <p>
          {props.blueprint.secondary ??
            props.blueprint.note ??
            "A generated scene makes the slide's hidden mechanism visible."}
        </p>
      </article>
      {hasLabels ? (
        <div className="character-scene-visual__agent-cards">
          {labels.slice(0, 2).map((label, index) => (
            <article className="character-scene-visual__agent-card" key={label}>
              <strong>{label}</strong>
              <p>{outcomes[index] ?? "checked"}</p>
            </article>
          ))}
        </div>
      ) : null}
      <div className="character-scene-visual__stage">
        {image ? (
          <>
            <img className="character-scene-visual__image-bg" src={image} alt="" aria-hidden="true" />
            <img className="character-scene-visual__image-main" src={image} alt="" aria-hidden="true" />
          </>
        ) : isGeneratedScene ? (
          <GeneratedSceneFallback />
        ) : (
          <CharacterSceneFallback mood={props.blueprint.mood} />
        )}
        <article className="character-scene-visual__sticky character-scene-visual__sticky--left">
          {leftStickyText ?? "what could go wrong?"}
        </article>
        <article className="character-scene-visual__sticky character-scene-visual__sticky--right">
          {props.blueprint.badge ?? "facts > opinions"}
        </article>
      </div>
      <footer className="character-scene-visual__roles">
        {metrics.slice(0, 3).map((metric, index) => (
          <strong key={metric}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {metric}
          </strong>
        ))}
      </footer>
    </section>
  );
}

function GeneratedSceneFallback() {
  return (
    <div className="generated-scene-fallback" aria-hidden="true">
      <div className="generated-scene-fallback__frame">
        <i />
        <span />
        <span />
      </div>
      <div className="generated-scene-fallback__prop generated-scene-fallback__prop--left" />
      <div className="generated-scene-fallback__prop generated-scene-fallback__prop--right" />
      <div className="generated-scene-fallback__track" />
      <div className="generated-scene-fallback__desk" />
    </div>
  );
}

function CharacterSceneFallback(props: { mood?: string }) {
  return (
    <div className={`character-scene-fallback${props.mood === "critic" ? " character-scene-fallback--critic" : ""}`} aria-hidden="true">
      <div className="character-scene-fallback__board character-scene-fallback__board--left" />
      <div className="character-scene-fallback__board character-scene-fallback__board--right" />
      <div className="character-scene-fallback__bot">
        <span className="character-scene-fallback__horn character-scene-fallback__horn--left" />
        <span className="character-scene-fallback__horn character-scene-fallback__horn--right" />
        <div className="character-scene-fallback__face">
          <span />
          <span />
        </div>
        <div className="character-scene-fallback__body">
          <i />
        </div>
      </div>
      <div className="character-scene-fallback__desk" />
      <div className="character-scene-fallback__cup" />
    </div>
  );
}

function CourseCrmPreview() {
  return (
    <div className="artifact-course-crm-preview">
      <strong>goal: publish carousel</strong>
      <span>draft slide 03</span>
      <span>preview checked</span>
      <b>assets ready</b>
    </div>
  );
}

function ReasonList(props: { items: readonly string[] }) {
  return (
    <div className="artifact-reason-list">
      {props.items.map((item) => (
        <p key={item}>
          <strong>{item}</strong>
        </p>
      ))}
    </div>
  );
}

function LearningTrackCard(props: { eyebrow: string; items: readonly string[]; title: string }) {
  return (
    <article className="learning-track-card">
      <header>
        <span>{props.eyebrow}</span>
        <strong>{props.title}</strong>
      </header>
      <TodoListCard done items={props.items} />
    </article>
  );
}

function ProductMockFallback(props: { blueprint: ArtifactBlueprint }) {
  return (
    <section className="artifact visual-template artifact-template product-mock-fallback">
      <BrowserMock title={props.blueprint.file ?? "prototype.html"}>
        <div className="artifact-browser-hero">
          <h2>{props.blueprint.primary}</h2>
        </div>
        <div className="artifact-browser-tabs">
          {props.blueprint.labels.slice(0, 3).map((label) => (
            <strong key={label}>{label}</strong>
          ))}
        </div>
      </BrowserMock>
    </section>
  );
}

function FileCard(props: { children?: ReactNode; file: string }) {
  return (
    <article className="artifact-file-card">
      <header>
        <span className="artifact-file-card__icon" aria-hidden="true">
          <FileText size={22} weight="duotone" />
        </span>
        <strong>{props.file}</strong>
        <span className="artifact-file-card__dots">•••</span>
      </header>
      <div className="artifact-file-card__body">{props.children}</div>
    </article>
  );
}

function ChecklistCard(props: { items: readonly string[] }) {
  return (
    <article className="artifact-checklist-card">
      {props.items.map((item) => (
        <p key={item}>
          <span>✓</span>
          {item}
        </p>
      ))}
    </article>
  );
}

function TodoListCard(props: { done?: boolean; items: readonly TodoListEntry[]; surface?: boolean }) {
  return (
    <div className={`artifact-todo-list${props.surface ? " artifact-todo-list--surface" : ""}`}>
      {props.items.map((item) => {
        const entry = normalizeTodoEntry(item, props.done ? "done" : undefined);

        return (
          <p key={entry.label}>
            <span className={`artifact-todo-list__box artifact-todo-list__box--${entry.state}`} aria-hidden="true">
              <TodoStateIcon state={entry.state} />
            </span>
            <strong>{entry.label}</strong>
          </p>
        );
      })}
    </div>
  );
}

function MetricCard(props: {
  icon?: MetricIconName;
  label: string;
  value: string;
}) {
  const icon = props.icon ?? "sales";
  const hasLabel = props.label.trim().length > 0;
  const longValueClass = props.value.length > 12 ? " artifact-metric-card--long-value" : "";

  return (
    <article className={`artifact-metric-card${hasLabel ? "" : " artifact-metric-card--no-label"}${longValueClass}`}>
      <strong>{props.value}</strong>
      {hasLabel ? <span>{props.label}</span> : null}
      <MetricIcon icon={icon} />
    </article>
  );
}

function normalizeTodoEntry(item: TodoListEntry, fallbackState: TodoState | undefined) {
  if (typeof item === "string") {
    return {
      label: item,
      state: fallbackState ?? "todo",
    };
  }

  return {
    label: item.label,
    state: fallbackState ?? item.state ?? "todo",
  };
}

function TodoStateIcon(props: { state: TodoState }) {
  if (props.state === "done") {
    return (
      <CheckSquare
        className="artifact-todo-list__icon artifact-todo-list__icon--done"
        size={28}
        weight="bold"
      />
    );
  }

  if (props.state === "progress") {
    return (
      <ClockCountdown
        className="artifact-todo-list__icon artifact-todo-list__icon--progress"
        size={28}
        weight="duotone"
      />
    );
  }

  return (
    <Square
      className="artifact-todo-list__icon artifact-todo-list__icon--todo"
      size={28}
      weight="regular"
    />
  );
}

function MetricIcon(props: { icon: MetricIconName }) {
  const IconComponent = getMetricIcon(props.icon);

  return (
    <IconComponent
      className={`artifact-metric-icon artifact-metric-icon--${props.icon}`}
      size={58}
      weight="duotone"
      aria-hidden="true"
    />
  );
}

function getMetricIcon(icon: MetricIconName): Icon {
  switch (icon) {
    case "access":
      return LockKey;
    case "channels":
      return ShareNetwork;
    case "crm":
      return Kanban;
    case "insights":
      return Lightbulb;
    case "link":
      return Globe;
    case "paid":
      return Money;
    case "product":
      return SquaresFour;
    case "sources":
      return Database;
    case "time":
      return Clock;
    case "zero":
      return CurrencyRub;
    case "sales":
    default:
      return UsersThree;
  }
}

function BrowserMock(props: { children: ReactNode; tilt?: "right"; title: string }) {
  return (
    <article className={`artifact-browser-mock${props.tilt ? " artifact-browser-mock--tilt" : ""}`}>
      <header>
        <span />
        <span />
        <span />
        <strong>{props.title}</strong>
      </header>
      <div className="artifact-browser-mock__body">{props.children}</div>
    </article>
  );
}

function LiveDashboard(props: { title: string; variant: "demand" | "ops" }) {
  return (
    <article className={`artifact-live-dashboard artifact-live-dashboard--${props.variant}`}>
      <header>
        <strong>{props.title}</strong>
        <span>live</span>
      </header>
      <div className="artifact-live-dashboard__metrics">
        <b>24.6K</b>
        <b>4.21%</b>
        <b>45.8%</b>
      </div>
      <svg viewBox="0 0 520 150" aria-hidden="true">
        <polyline points="15,126 75,92 145,88 215,76 285,65 355,57 435,52 505,38" />
        <polyline className="muted" points="15,136 75,120 145,112 215,102 285,94 355,86 435,83 505,74" />
      </svg>
    </article>
  );
}

function TelegramBotMock() {
  const stages: readonly TodoListEntry[] = [
    { label: "collect inputs", state: "done" },
    { label: "draft structure", state: "done" },
    { label: "render preview", state: "progress" },
  ];

  return (
    <article className="telegram-bot-mock">
      <header>
        <strong>carousel-helper</strong>
        <span>local</span>
      </header>
      <div className="telegram-bot-mock__body">
        <div className="telegram-bot-mock__chat">
          <p className="telegram-bot-mock__bubble telegram-bot-mock__bubble--bot">
            <span>app</span>
            Add your idea, reference photos, and brand basics. I will prepare a post draft.
          </p>
          <p className="telegram-bot-mock__bubble telegram-bot-mock__bubble--user">
            <span>you</span>
            Here is the topic, audience, and rough slide outline.
          </p>
          <div className="telegram-bot-mock__files" aria-label="Attached files">
            <strong>face.jpg</strong>
            <strong>post.md</strong>
          </div>
          <p className="telegram-bot-mock__bubble telegram-bot-mock__bubble--bot">
            <span>app</span>
            Got it. Building preview routes and export paths.
          </p>
        </div>
        <div className="telegram-bot-mock__process">
          {stages.map((stage, index) => {
            const entry = normalizeTodoEntry(stage, undefined);

            return (
              <p className={`telegram-bot-mock__step telegram-bot-mock__step--${entry.state}`} key={entry.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{entry.label}</strong>
                <i aria-hidden="true" />
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function AgentConversationNode(props: { title: string }) {
  return (
    <article className="agent-ops-board__conversation">
      <span>{props.title}</span>
      <p className="agent-ops-board__bubble agent-ops-board__bubble--client">
        <b>клиент</b>
        Можно записаться сегодня?
      </p>
      <p className="agent-ops-board__bubble agent-ops-board__bubble--agent">
        <b>AI</b>
        Да, свободно в 18:30. Забронировал.
      </p>
      <div className="agent-ops-board__actions">
        <strong>ответ</strong>
        <strong>бронь</strong>
        <strong>CRM</strong>
      </div>
    </article>
  );
}

function ConnectionList(props: { file: string; sources: readonly string[] }) {
  return (
    <article className="artifact-connection-list">
      <header>
        <span>▤</span>
        <strong>{props.file}</strong>
        <i>•••</i>
      </header>
      {props.sources.map((source) => (
        <p key={source}>
          <b>{source.slice(0, 2)}</b>
          <strong>{source}</strong>
          <span>✓</span>
        </p>
      ))}
    </article>
  );
}

function MiniChart(props: { title: string }) {
  return (
    <article className="artifact-mini-card artifact-mini-chart">
      <strong>{props.title}</strong>
      <svg viewBox="0 0 180 90" aria-hidden="true">
        <polyline points="8,72 38,58 68,60 98,39 128,32 166,14" />
        <polyline className="muted" points="8,78 38,70 68,65 98,61 128,49 166,42" />
      </svg>
    </article>
  );
}

function FunnelCard(props: { title: string }) {
  return (
    <article className="artifact-mini-card artifact-funnel-card">
      <strong>{props.title}</strong>
      <span />
      <span />
      <span />
    </article>
  );
}

function HeatmapCard(props: { title: string }) {
  return (
    <article className="artifact-mini-card artifact-heatmap-card">
      <strong>{props.title}</strong>
      <div aria-hidden="true">
        {Array.from({ length: 20 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
    </article>
  );
}

function normalizeTemplate(value: string | undefined): ArtifactVisualTemplate | undefined {
  const allowed: readonly ArtifactVisualTemplate[] = [
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
    "prompt-loop",
    "script-rules-file",
    "voice-caption-pipeline",
    "semantic-selector",
    "capture-console",
    "factory-floor",
    "generated-scene",
    "character-scene",
    "product-mock",
  ];

  return allowed.find((template) => template === value);
}

function factoryComposition(value: string | undefined): string {
  const allowed = new Set([
    "mess",
    "note",
    "passport",
    "face-station",
    "voice-machine",
    "warehouse",
    "conveyor",
    "output",
  ]);
  return value && allowed.has(value) ? value : "conveyor";
}

function factoryStations(labels: readonly string[]): readonly string[] {
  if (labels.length <= 4) {
    return labels;
  }

  return [labels[0] ?? "start", labels[1] ?? "station", labels[2] ?? "check", labels[labels.length - 1] ?? "output"];
}

function visualExtras(visual: EditorialVisualConfig | undefined) {
  return {
    image: visual?.image,
    badge: visual?.badge,
    composition: visual?.composition,
    metaphor: visual?.metaphor,
    mood: visual?.mood,
    note: visual?.note,
  };
}

function normalizeLabels(items: readonly ListSlideItem[] | undefined, fallback: readonly string[]) {
  if (!items || items.length === 0) {
    return fallback;
  }

  return items.slice(0, 6).map((item) => item.title);
}

function completeLabels(labels: readonly string[], fallback: readonly string[]): readonly string[] {
  return labels.length > 0 ? labels : fallback;
}
