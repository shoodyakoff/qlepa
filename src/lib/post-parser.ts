import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export type PostFrontmatter = {
  slug?: string;
  created?: string;
  nickname?: string;
  brand?: string;
  chromeFrom?: string;
  chromeTo?: string;
  footerNote?: string;
  headlineNumbering?: string;
  signature?: string;
  visualRhythm?: string;
};

export type CoverPhoto = {
  preset?: string;
  scene?: string;
  src?: string;
  wardrobe?: string;
};

export type SlideImage = {
  preset?: string;
  scene?: string;
  src?: string;
};

export type ListSlideItem = {
  icon: string;
  title: string;
  desc: string;
};

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

export type CoverSlide = {
  kind: "cover";
  title: string;
  subtitle: string;
  textSurface?: string;
  photo?: CoverPhoto;
};

export type TextSlide = {
  kind: "text";
  heading: string;
  body: string;
  kicker?: string;
};

export type ParsedListSlide = {
  kind: "list";
  heading: string;
  items: readonly ListSlideItem[];
  kicker?: string;
};

export type ParsedImageSlide = {
  kind: "image";
  heading: string;
  caption: string;
  image?: SlideImage;
  kicker?: string;
};

export type ParsedQuoteSlide = {
  kind: "quote";
  quote: string;
  author: string;
  kicker?: string;
};

export type ParsedEditorialSlide = {
  kind: "editorial";
  stage: string;
  headline: string;
  body: string;
  artifact: string;
  layout?: string;
  readerPain?: string;
  mechanism?: string;
  visualRoute?: string;
  visualReason?: string;
  visualRepeatOk?: string;
  accentLines?: string;
  note?: string;
  items?: readonly ListSlideItem[];
  visual?: EditorialVisualConfig;
};

export type ParsedSlide =
  | CoverSlide
  | TextSlide
  | ParsedListSlide
  | ParsedImageSlide
  | ParsedQuoteSlide
  | ParsedEditorialSlide;

export type ParsedPost = {
  sourcePath?: string;
  postDir?: string;
  frontmatter: PostFrontmatter;
  slides: readonly ParsedSlide[];
};

export type ParsePostMarkdownOptions = {
  sourcePath?: string;
  postDir?: string;
};

type FieldRecord = Record<string, string | readonly string[]>;
type FieldValue = string | FieldRecord | ListSlideItem[];
type FieldMap = Record<string, FieldValue>;

export async function parsePostFile(inputPath: string): Promise<ParsedPost> {
  const location = await resolvePostFileLocation(inputPath);
  const markdown = await readFile(location.sourcePath, "utf8");
  return parsePostMarkdown(markdown, location);
}

export async function resolvePostFileLocation(
  inputPath: string,
): Promise<{ sourcePath: string; postDir: string }> {
  const resolvedPath = path.resolve(inputPath);

  let result;
  try {
    result = await stat(resolvedPath);
  } catch {
    throw new Error(`Post path does not exist: ${inputPath}`);
  }

  if (result.isDirectory()) {
    return {
      sourcePath: path.join(resolvedPath, "post.md"),
      postDir: resolvedPath,
    };
  }

  if (!result.isFile()) {
    throw new Error(`Post path must be a directory or markdown file: ${inputPath}`);
  }

  return {
    sourcePath: resolvedPath,
    postDir: path.dirname(resolvedPath),
  };
}

export function parsePostMarkdown(
  markdown: string,
  options: ParsePostMarkdownOptions = {},
): ParsedPost {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const { frontmatterLines, bodyLines } = splitFrontmatter(lines);
  const frontmatter = parseFrontmatter(frontmatterLines);
  const blocks = splitSlideBlocks(bodyLines);

  if (blocks.length === 0) {
    throw new Error("No slide blocks found in post.md");
  }

  return {
    sourcePath: options.sourcePath,
    postDir: options.postDir,
    frontmatter,
    slides: blocks.map(parseSlideBlock),
  };
}

function splitFrontmatter(lines: readonly string[]): {
  frontmatterLines: readonly string[];
  bodyLines: readonly string[];
} {
  if (lines[0]?.trim() !== "---") {
    return { frontmatterLines: [], bodyLines: lines };
  }

  const endIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");

  if (endIndex === -1) {
    throw new Error("Frontmatter starts with --- but never closes");
  }

  return {
    frontmatterLines: lines.slice(1, endIndex),
    bodyLines: lines.slice(endIndex + 1),
  };
}

function parseFrontmatter(lines: readonly string[]): PostFrontmatter {
  const fields = parseFields(lines);
  return {
    slug: optionalString(fields, "slug"),
    created: optionalString(fields, "created"),
    nickname: optionalString(fields, "nickname"),
    brand: optionalString(fields, "brand"),
    chromeFrom: optionalString(fields, "chrome-from"),
    chromeTo: optionalString(fields, "chrome-to"),
    footerNote: optionalString(fields, "footer-note"),
    headlineNumbering: optionalString(fields, "headline-numbering"),
    signature: optionalString(fields, "signature"),
    visualRhythm: optionalString(fields, "visual-rhythm"),
  };
}

type SlideBlock = {
  kind: string;
  lines: readonly string[];
};

function splitSlideBlocks(lines: readonly string[]): readonly SlideBlock[] {
  const blocks: SlideBlock[] = [];
  let current: { kind: string; lines: string[] } | undefined;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      if (current) {
        blocks.push(current);
      }
      current = { kind: heading[1] ?? "", lines: [] };
      continue;
    }

    current?.lines.push(line);
  }

  if (current) {
    blocks.push(current);
  }

  return blocks;
}

function parseSlideBlock(block: SlideBlock): ParsedSlide {
  const fields = parseFields(block.lines);

  if (block.kind === "cover") {
    return {
      kind: "cover",
      title: requiredString(fields, "title", block.kind),
      subtitle: requiredString(fields, "subtitle", block.kind),
      textSurface: optionalString(fields, "text-surface"),
      photo: optionalStringRecord(fields, "photo"),
    };
  }

  if (block.kind === "slide-text") {
    return {
      kind: "text",
      heading: requiredString(fields, "heading", block.kind),
      body: requiredString(fields, "body", block.kind),
      kicker: optionalString(fields, "kicker"),
    };
  }

  if (block.kind === "slide-list") {
    return {
      kind: "list",
      heading: requiredString(fields, "heading", block.kind),
      items: requiredItems(fields, block.kind),
      kicker: optionalString(fields, "kicker"),
    };
  }

  if (block.kind === "slide-image") {
    return {
      kind: "image",
      heading: requiredString(fields, "heading", block.kind),
      caption: requiredString(fields, "caption", block.kind),
      image: optionalStringRecord(fields, "image"),
      kicker: optionalString(fields, "kicker"),
    };
  }

  if (block.kind === "slide-quote") {
    return {
      kind: "quote",
      quote: requiredString(fields, "quote", block.kind),
      author: requiredString(fields, "author", block.kind),
      kicker: optionalString(fields, "kicker"),
    };
  }

  if (block.kind === "slide-editorial") {
    return {
      kind: "editorial",
      stage: requiredString(fields, "stage", block.kind),
      headline: requiredString(fields, "headline", block.kind),
      body: requiredString(fields, "body", block.kind),
      artifact: requiredString(fields, "artifact", block.kind),
      layout: optionalString(fields, "layout"),
      readerPain: optionalString(fields, "reader-pain"),
      mechanism: optionalString(fields, "mechanism"),
      visualRoute: optionalString(fields, "visual-route"),
      visualReason: optionalString(fields, "visual-reason"),
      visualRepeatOk: optionalString(fields, "visual-repeat-ok"),
      accentLines: optionalString(fields, "accent-lines"),
      note: optionalString(fields, "note"),
      items: optionalItems(fields),
      visual: optionalVisualConfig(fields),
    };
  }

  throw new Error(`Unknown slide block kind: ${block.kind}`);
}

function parseFields(lines: readonly string[]): FieldMap {
  const fields: FieldMap = {};
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    if (leadingSpaces(line) !== 0) {
      throw new Error(`Unexpected indentation in post.md line: ${line}`);
    }

    const match = line.match(/^([A-Za-z][\w-]*):(?:\s*(.*))?$/);
    if (!match) {
      throw new Error(`Cannot parse post.md line: ${line}`);
    }

    const key = match[1] ?? "";
    const rawValue = match[2] ?? "";

    if (rawValue === "|") {
      const { nestedLines, nextIndex } = collectIndentedLines(lines, index + 1, 0);
      fields[key] = normalizeBlockScalar(nestedLines, 2);
      index = nextIndex;
      continue;
    }

    if (rawValue === "") {
      const { nestedLines, nextIndex } = collectIndentedLines(lines, index + 1, 0);
      fields[key] =
        key === "items" ? parseItems(nestedLines) : parseNestedRecord(stripIndent(nestedLines, 2), key);
      index = nextIndex;
      continue;
    }

    fields[key] = unquote(rawValue);
    index += 1;
  }

  return fields;
}

function parseNestedRecord(lines: readonly string[], key: string): FieldRecord {
  const record: FieldRecord = {};
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (line.trim() === "") {
      index += 1;
      continue;
    }

    if (leadingSpaces(line) !== 0) {
      throw new Error(`Unexpected indentation in ${key} field line: ${line}`);
    }

    const match = line.match(/^([A-Za-z][\w-]*):(?:\s*(.*))?$/);
    if (!match) {
      throw new Error(`Cannot parse ${key} field line: ${line}`);
    }

    const recordKey = match[1] ?? "";
    const rawValue = match[2] ?? "";
    if (rawValue === "") {
      const { nestedLines, nextIndex } = collectIndentedLines(lines, index + 1, 0);
      record[recordKey] = parseStringList(stripIndent(nestedLines, 2), `${key}.${recordKey}`);
      index = nextIndex;
      continue;
    }

    record[recordKey] = unquote(rawValue);
    index += 1;
  }

  return record;
}

function parseStringList(lines: readonly string[], key: string): readonly string[] {
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (!line.startsWith("- ")) {
        throw new Error(`Cannot parse ${key} list line: ${line}`);
      }
      return unquote(line.slice(2));
    });
}

function parseItems(lines: readonly string[]): ListSlideItem[] {
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (!line.startsWith("- ")) {
        throw new Error(`Cannot parse list item line: ${line}`);
      }

      const record = parseInlineObject(line.slice(2));
      return {
        icon: requiredRecordString(record, "icon", "items"),
        title: requiredRecordString(record, "title", "items"),
        desc: requiredRecordString(record, "desc", "items"),
      };
    });
}

function parseInlineObject(rawValue: string): Record<string, string> {
  const trimmed = rawValue.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    throw new Error(`Expected inline object list item, received: ${rawValue}`);
  }

  const record: Record<string, string> = {};
  for (const part of splitInlineObjectParts(trimmed.slice(1, -1))) {
    const separator = part.indexOf(":");
    if (separator === -1) {
      throw new Error(`Cannot parse inline object part: ${part}`);
    }

    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    record[key] = unquote(value);
  }

  return record;
}

function splitInlineObjectParts(source: string): readonly string[] {
  const parts: string[] = [];
  let current = "";
  let quote: '"' | "'" | undefined;

  for (const char of source) {
    if ((char === '"' || char === "'") && !quote) {
      quote = char;
      current += char;
      continue;
    }

    if (char === quote) {
      quote = undefined;
      current += char;
      continue;
    }

    if (char === "," && !quote) {
      parts.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

function collectIndentedLines(
  lines: readonly string[],
  startIndex: number,
  parentIndent: number,
): { nestedLines: readonly string[]; nextIndex: number } {
  const nestedLines: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (line.trim() !== "" && leadingSpaces(line) <= parentIndent) {
      break;
    }

    nestedLines.push(line);
    index += 1;
  }

  return { nestedLines, nextIndex: index };
}

function stripIndent(lines: readonly string[], indent: number): readonly string[] {
  const prefix = " ".repeat(indent);
  return lines.map((line) => (line.startsWith(prefix) ? line.slice(indent) : line.trimStart()));
}

function normalizeBlockScalar(lines: readonly string[], indent: number): string {
  const unindented = stripIndent(lines, indent);
  return trimTrailingBlankLines(unindented).join("\n");
}

function trimTrailingBlankLines(lines: readonly string[]): readonly string[] {
  let end = lines.length;
  while (end > 0 && lines[end - 1]?.trim() === "") {
    end -= 1;
  }
  return lines.slice(0, end);
}

function leadingSpaces(line: string): number {
  const match = line.match(/^ */);
  return match?.[0].length ?? 0;
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function optionalString(fields: FieldMap, key: string): string | undefined {
  const value = fields[key];
  return typeof value === "string" ? value : undefined;
}

function requiredString(fields: FieldMap, key: string, blockKind: string): string {
  const value = optionalString(fields, key);
  if (!value) {
    throw new Error(`Missing ${key} in ${blockKind} slide`);
  }
  return value;
}

function optionalStringRecord(fields: FieldMap, key: string): Record<string, string> | undefined {
  const value = fields[key];
  if (!value || typeof value === "string" || Array.isArray(value)) {
    return undefined;
  }

  const record: Record<string, string> = {};
  for (const [recordKey, recordValue] of Object.entries(value)) {
    if (typeof recordValue === "string") {
      record[recordKey] = recordValue;
    }
  }
  return record;
}

function requiredItems(fields: FieldMap, blockKind: string): readonly ListSlideItem[] {
  const value = fields.items;
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Missing items in ${blockKind} slide`);
  }
  return value;
}

function optionalItems(fields: FieldMap): readonly ListSlideItem[] | undefined {
  const value = fields.items;
  return Array.isArray(value) && value.length > 0 ? value : undefined;
}

function optionalVisualConfig(fields: FieldMap): EditorialVisualConfig | undefined {
  const value = fields.visual;
  if (!value || typeof value === "string" || Array.isArray(value)) {
    return undefined;
  }

  const visual: EditorialVisualConfig = {
    template: readOptionalRecordString(value, "template"),
    file: readOptionalRecordString(value, "file"),
    image: readOptionalRecordString(value, "image"),
    copyImage: readOptionalRecordString(value, "copyImage"),
    primary: readOptionalRecordString(value, "primary"),
    secondary: readOptionalRecordString(value, "secondary"),
    badge: readOptionalRecordString(value, "badge"),
    composition: readOptionalRecordString(value, "composition"),
    metaphor: readOptionalRecordString(value, "metaphor"),
    mood: readOptionalRecordString(value, "mood"),
    note: readOptionalRecordString(value, "note"),
    modules: readOptionalRecordStringArray(value, "modules"),
    metrics: readOptionalRecordStringArray(value, "metrics"),
    outcomes: readOptionalRecordStringArray(value, "outcomes"),
  };

  return Object.values(visual).some(Boolean) ? visual : undefined;
}

function readOptionalRecordString(record: FieldRecord, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function readOptionalRecordStringArray(
  record: FieldRecord,
  key: string,
): readonly string[] | undefined {
  const value = record[key];
  return Array.isArray(value) ? value : undefined;
}

function requiredRecordString(record: Record<string, string>, key: string, context: string): string {
  const value = record[key];
  if (!value) {
    throw new Error(`Missing ${key} in ${context}`);
  }
  return value;
}
