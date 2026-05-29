import type { ReactElement } from "react";

import { Cover } from "../templates/Cover";
import { EditorialSlide } from "../templates/EditorialSlide";
import { FontSamplerSlide } from "../templates/FontSamplerSlide";
import { ImageSlide } from "../templates/ImageSlide";
import { ListSlide, type ListSlideItem } from "../templates/ListSlide";
import { QuoteSlide } from "../templates/QuoteSlide";
import { TextSlide } from "../templates/TextSlide";
import type { EditorialVisualConfig } from "../templates/editorial-visuals";
import { tokens } from "../brand/tokens";

export type RenderRoute = {
  name:
    | "Cover"
    | "TextSlide"
    | "ListSlide"
    | "ImageSlide"
    | "QuoteSlide"
    | "EditorialSlide"
    | "FontSamplerSlide";
  path: `/render/${string}`;
  render: (params: URLSearchParams) => ReactElement;
};

export const renderRoutes: readonly RenderRoute[] = [
  {
    name: "Cover",
    path: "/render/cover",
    render: (params) => (
      <Cover
        title={params.get("title") ?? "Qlepa"}
        subtitle={params.get("subtitle") ?? "Render preview"}
        backgroundImage={params.get("backgroundImage") ?? undefined}
        textSurface={params.get("textSurface") === "true"}
        nickname={params.get("nickname") ?? tokens.brand.handle}
        slideNumber={readNumberParam(params, "slideNumber", 1)}
        totalSlides={readNumberParam(params, "totalSlides", 1)}
      />
    ),
  },
  {
    name: "TextSlide",
    path: "/render/text",
    render: (params) => (
      <TextSlide
        heading={params.get("heading") ?? "И ещё 5 — для операционки"}
        body={
          params.get("body") ??
          "Turn one raw idea into a short sequence: context, useful detail, proof, and a clear takeaway."
        }
        kicker={params.get("kicker") ?? "Context"}
        nickname={params.get("nickname") ?? tokens.brand.handle}
        slideNumber={readNumberParam(params, "slideNumber", 2)}
        totalSlides={readNumberParam(params, "totalSlides", 6)}
      />
    ),
  },
  {
    name: "ListSlide",
    path: "/render/list",
    render: (params) => (
      <ListSlide
        heading={params.get("heading") ?? "What the workflow needs"}
        items={readListItemsParam(params)}
        kicker={params.get("kicker") ?? "Inputs"}
        nickname={params.get("nickname") ?? tokens.brand.handle}
        slideNumber={readNumberParam(params, "slideNumber", 3)}
        totalSlides={readNumberParam(params, "totalSlides", 6)}
      />
    ),
  },
  {
    name: "ImageSlide",
    path: "/render/image",
    render: (params) => (
      <ImageSlide
        heading={params.get("heading") ?? "Preview before export"}
        caption={params.get("caption") ?? "Use the browser preview first, then export final PNG files."}
        imageSrc={params.get("imageSrc") ?? undefined}
        kicker={params.get("kicker") ?? "Preview"}
        nickname={params.get("nickname") ?? tokens.brand.handle}
        slideNumber={readNumberParam(params, "slideNumber", 4)}
        totalSlides={readNumberParam(params, "totalSlides", 6)}
      />
    ),
  },
  {
    name: "QuoteSlide",
    path: "/render/quote",
    render: (params) => (
      <QuoteSlide
        quote={params.get("quote") ?? "The repo is the factory. Your references and posts stay local."}
        author={params.get("author") ?? `— ${tokens.brand.name}`}
        kicker={params.get("kicker") ?? "Takeaway"}
        nickname={params.get("nickname") ?? tokens.brand.handle}
        slideNumber={readNumberParam(params, "slideNumber", 5)}
        totalSlides={readNumberParam(params, "totalSlides", 6)}
      />
    ),
  },
  {
    name: "EditorialSlide",
    path: "/render/editorial",
    render: (params) => (
      <EditorialSlide
        stage={params.get("stage") ?? "PROBLEM"}
        headline={params.get("headline") ?? "START WITH\nONE PAIN"}
        body={params.get("body") ?? "A carousel works better when each slide makes one concrete point."}
        chromeFrom={params.get("chromeFrom") ?? undefined}
        chromeTo={params.get("chromeTo") ?? undefined}
        artifact={params.get("artifact") ?? "analytics"}
        layout={params.get("layout") ?? undefined}
        accentLines={params.get("accentLines") ?? undefined}
        footerNote={params.get("footerNote") ?? undefined}
        note={params.get("note") ?? undefined}
        items={readListItemsParam(params)}
        visual={readVisualParam(params)}
        nickname={params.get("nickname") ?? tokens.brand.handle}
        signature={params.get("signature") ?? undefined}
        showMethodNumber={params.get("showMethodNumber") === "true"}
        slideNumber={readNumberParam(params, "slideNumber", 2)}
        totalSlides={readNumberParam(params, "totalSlides", 9)}
      />
    ),
  },
  {
    name: "FontSamplerSlide",
    path: "/render/font-sampler",
    render: () => <FontSamplerSlide />,
  },
];

export function getRenderRoute(pathname: string): RenderRoute | undefined {
  return renderRoutes.find((route) => route.path === pathname);
}

function readNumberParam(params: URLSearchParams, key: string, fallback: number): number {
  const raw = params.get(key);
  if (!raw) {
    return fallback;
  }

  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function readListItemsParam(params: URLSearchParams): readonly ListSlideItem[] {
  const raw = params.get("items");
  if (!raw) {
    return defaultListItems;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isListSlideItem)) {
      return parsed;
    }
  } catch {
    return defaultListItems;
  }

  return defaultListItems;
}

function readVisualParam(params: URLSearchParams): EditorialVisualConfig | undefined {
  const raw = params.get("visual");
  if (!raw) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isEditorialVisualConfig(parsed)) {
      return parsed;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function isListSlideItem(value: unknown): value is ListSlideItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.icon === "string" &&
    typeof item.title === "string" &&
    typeof item.desc === "string"
  );
}

function isEditorialVisualConfig(value: unknown): value is EditorialVisualConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    isOptionalString(record.template) &&
    isOptionalString(record.file) &&
    isOptionalString(record.image) &&
    isOptionalString(record.copyImage) &&
    isOptionalString(record.primary) &&
    isOptionalString(record.secondary) &&
    isOptionalString(record.badge) &&
    isOptionalString(record.composition) &&
    isOptionalString(record.metaphor) &&
    isOptionalString(record.mood) &&
    isOptionalString(record.note) &&
    isOptionalStringArray(record.modules) &&
    isOptionalStringArray(record.metrics) &&
    isOptionalStringArray(record.outcomes)
  );
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

function isOptionalStringArray(value: unknown): boolean {
  return value === undefined || (Array.isArray(value) && value.every((item) => typeof item === "string"));
}

const defaultListItems: readonly ListSlideItem[] = [
  { icon: "01", title: "Reference photos", desc: "identity and body references stay local" },
  { icon: "02", title: "Post idea", desc: "topic, promise, and target audience" },
  { icon: "03", title: "Brand basics", desc: "handle, colors, fonts, and tone" },
];
