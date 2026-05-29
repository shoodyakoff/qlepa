# Qlepa — Brief

## Goal

Build a local deterministic pipeline for generating Instagram or Telegram carousel slides in 4:5 format (`1080x1350`) from a single markdown file.

The pipeline supports two slide families:

1. **Cover slide** — the first post slide. It can be rendered without the author photo, or as a photo composite of the author in the post scenario using the default face/body reference flow.
2. **Content slides** — text plus optional images/icons in a consistent visual system.

Each carousel is described by one `post.md`. The pipeline reads it and produces PNG files ready to upload to Instagram or Telegram.

## Acceptance Criteria

```bash
# Create one post file
posts/2026-05-21-claude-niches/post.md

# Run one command
pnpm carousel build posts/2026-05-21-claude-niches

# Get ready-to-upload PNGs
posts/2026-05-21-claude-niches/out/
  01-cover.png
  02-slide.png
  03-slide.png
```

Additional criteria:

- Re-running without changes to `post.md` does not regenerate cached source images.
- Changing slide text without changing the photo prompt re-renders slides and reuses the cached photo.
- Template previews open in a browser on a dev server for live layout work.
- Output PNGs are `1080x1350`, sRGB, and have no alpha channel.

## Stack

| Layer | Technology | Reason |
|---|---|---|
| Slide templates | React + Vite | Dev server and component structure |
| PNG rendering | Playwright screenshots | CSS, fonts, filters, browser-accurate output |
| Image generation | Codex image generation | Covered by the user's Codex workflow; no direct image API for MVP |
| Orchestration | TypeScript CLI on Node | Simple entry point and easy extension |
| Post config | Markdown with YAML frontmatter | Human-readable and versionable |
| Package manager | pnpm | Fast and disk-efficient |

## Target Structure

```text
images-codex/
├── BRIEF.md
├── AGENTS.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── brand/
│   ├── tokens.ts
│   ├── fonts/
│   └── prompts/
│       ├── editorial.md
│       ├── lifestyle.md
│       └── studio.md
├── assets/
│   ├── face-refs/
│   │   ├── face.jpg
│   │   └── body.jpg
│   └── generated/
│       ├── <hash>.png
│       └── <hash>.json
├── templates/
│   ├── Cover.tsx
│   ├── TextSlide.tsx
│   ├── ListSlide.tsx
│   ├── ImageSlide.tsx
│   ├── QuoteSlide.tsx
│   └── _shared/
│       ├── SlideFrame.tsx
│       ├── SlideNumber.tsx
│       └── Handle.tsx
├── src/
│   ├── cli.ts
│   ├── lib/
│   │   ├── post-parser.ts
│   │   ├── image-cache.ts
│   │   ├── image-gen.ts
│   │   └── renderer.ts
│   └── commands/
│       ├── build.ts
│       ├── gen-photo.ts
│       └── preview.ts
└── posts/
    └── 2026-05-21-example/
        ├── post.md
        └── out/
```

## `post.md` Format

```markdown
---
slug: starter-carousel
created: 2026-05-21
nickname: "@your_handle"
brand: default
---

## cover
title: "Turn one idea into a carousel"
subtitle: "Draft, preview, and export from one markdown file"
photo:
  preset: editorial
  scene: "creator at a clean desk reviewing carousel thumbnails, warm daylight, editorial portrait lighting"
  wardrobe: "minimal casual outfit, neutral colors"

## slide-text
heading: "Start with one clear pain"
body: |
  Write the original problem in plain language.
  Then turn it into a few slides with one idea per slide.

## slide-list
heading: "What the app needs from you"
items:
  - { icon: 01, title: "Reference photos", desc: "face and body images stay local" }
  - { icon: 02, title: "Post idea", desc: "topic, promise, and audience" }
  - { icon: 03, title: "Brand basics", desc: "handle, colors, fonts, tone" }

## slide-image
heading: "Preview before export"
image:
  preset: studio
  scene: "laptop showing a simple carousel preview UI on a bright desk"
caption: "Use preview first, then build final PNG files."

## slide-quote
quote: "The repo is the factory. Your references and posts are the local workspace."
author: "— Qlepa"
```

Each `##` block maps to one slide template.

## Image Generation Workflow

### MVP Mode A

1. `gen-photo` builds the final English prompt from `brand/prompts/<preset>.md`.
2. It computes the cache hash from:

   ```text
   <full_prompt> | <face_ref_md5> | <body_ref_md5> | <size> | <model-or-codex-image-path>
   ```

3. If the hash exists in `assets/generated/`, return the cached image path.
4. If missing, print the final prompt, copy it to the clipboard when available, and tell the user where to save the generated image.
5. Poll until `assets/generated/<hash>.png` appears, then write `<hash>.json` metadata.

### Post-MVP Mode B

Call Codex image generation automatically from the CLI. This is explicitly out of scope for the first MVP.

## Cover Prompt Template

```text
Generate a 1080x1350 portrait photograph for a social carousel cover.

ROLE OF EACH ATTACHED IMAGE:
- {face_ref} -> identity of the subject: exact facial features, hair, skin tone, age, build. The person MUST be recognizable.
- {body_ref} -> body proportions, posture reference.

WHAT TO DO:
Place the subject into this scene:
{scene}

WARDROBE:
{wardrobe}

STYLE:
{style_directives}

CRITICAL CONSTRAINTS:
- Do NOT alter facial features from {face_ref}
- Do NOT change ethnicity, age, or build
- Photorealistic, sharp focus on face, shallow DOF
- Natural skin texture, no over-smoothing
- No text in the image

OUTPUT: 1080x1350, photorealistic, high quality
```

## Implementation Stages

### Stage 1 — Skeleton

- Initialize Vite + React + TypeScript.
- Configure Playwright with Chromium.
- Add placeholder `brand/tokens.ts`.
- Add local font directories.
- Configure path aliases.
- Keep this `AGENTS.md` current.
- Add `pnpm carousel --help`.

Deliverable: empty project builds, dev server starts, and `pnpm test` does not fail.

### Stage 2 — Cover Template + Render

- Implement `SlideFrame`.
- Implement `Cover`.
- Implement Playwright PNG renderer.
- Add `pnpm carousel render-test`.

Deliverable: one command renders `out/test/cover.png`.

### Stage 3 — Image Cache + Prompt Builder

- Implement hash-based cache.
- Implement Mode A prompt builder.
- Add `editorial`, `lifestyle`, and `studio` prompt presets.
- Add `pnpm carousel gen-photo <preset> <scene>`.

Deliverable: cache hit avoids regeneration; cache miss gives a usable prompt and waits for the saved image.

### Stage 4 — Remaining Templates

- Add text, list, image, and quote slide templates.
- Add shared handle and slide number components.
- Add preview routes for every template.

Deliverable: every template opens in browser preview with coherent styling.

### Stage 5 — Parser + Full Build

- Parse frontmatter and slide blocks from `post.md`.
- Implement `pnpm carousel build <post-path>`.
- Implement `pnpm carousel preview <post-path>`.

Deliverable: one `post.md` produces a complete `out/` carousel.

### Stage 6 — Polish

- Add progress logging.
- Add friendly error handling.
- Add watch mode.
- Add README usage docs.

Deliverable: pipeline is stable enough for daily use.

### Stage 7 — Open GitHub MVP Readiness

- Add first-run onboarding and setup diagnostics.
- Document where external testers put private reference photos.
- Provide Codex/Claude dialogue prompts for setup, brand customization, post creation, preview, and export.
- Keep personal references, generated caches, and final PNG outputs out of git.

Deliverable: a clean GitHub clone can be installed, checked with `pnpm carousel doctor`, and tested with a starter post.

## Branding Placeholder

```ts
export const tokens = {
  colors: {
    background: "#F5F1EA",
    foreground: "#1A1A1A",
    accent: "#FF6B35",
    muted: "#8B8680",
  },
  fonts: {
    display: '"Manrope", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    accent: '"Caveat", cursive',
  },
  sizes: {
    slide: { w: 1080, h: 1350 },
    titleDisplay: 96,
    titleLarge: 72,
    body: 36,
    caption: 24,
  },
  spacing: {
    margin: 80,
    gap: 32,
  },
  radius: {
    card: 24,
    pill: 999,
  },
} as const;
```

Final brand values will be decided after the first working pipeline exists.

## Out Of Scope For MVP

- Fully automatic image generation through `codex exec`.
- Multiple brands.
- Stories format.
- LLM-generated captions/headlines.
- Direct platform publishing.
- Build webhooks.
- Codex quota analytics.
- fal.ai or other fallback image providers.

## Needed From The Author Before Image Generation

- `assets/face-refs/face.jpg`: close-up neutral face reference.
- `assets/face-refs/body.jpg`: full-body reference.
- First 2-3 photo style presets.
- Candidate display/body fonts for final branding.
