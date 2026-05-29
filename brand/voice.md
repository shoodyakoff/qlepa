# Carousel Writing System

Public starter voice guide. Replace per project, or override with a private `brand/voice.local.md` that the agent reads first.

## Local Profile Overrides This File

If `brand/voice.local.md` exists, treat it as the source of truth for the author's tone, lexicon, marker phrases, and stop-list. This public file then plays the role of generic rules that apply to any author.

## One Slide = One Thought

```text
one slide = one thought
```

One thought can still need a real explanation. For process, educational, build-log, or artifact-rich slides, use `layout: "text-heavy"` and keep 3-6 natural sentences when that is what makes the mechanism understandable.

Split the slide only when it contains two different thoughts. Do not split only because the body is longer than a caption.

## Three Layers, Not Three Restatements

Every editorial slide has three text layers: `headline`, `body`, and the labels rendered inside the visual (`primary`, `secondary`, `badge`, `note`, `modules`, `metrics`, `outcomes`).

These are not three places to say the same thing. They are three different jobs:

- `headline` — the hook. Works on its own.
- `body` — the explanation: one concrete detail on compact slides, or a short human paragraph on text-heavy slides.
- visual labels — concrete artifacts (file name, status, step, count). Not a paraphrase of `body`.

If a reader can predict the body after reading the headline, the body is dead weight. If the body explains a mechanism the artifact cannot show alone, keep it. If the visual labels could be deleted and the slide still says the same thing, the labels are noise.

## Carousel Art Director

For non-trivial posts, use the carousel art director workflow in `docs/carousel-art-director.md`.

Do not start by filling a template. Start with source analysis, story strategy, visual direction, slide briefs, draft render, **voice pass**, self-review against the quality rubric in `docs/carousel-quality-rubric.md`, then revision loop. A first render is a draft, not a final.

When references are provided, use `docs/reference-driven-visual-pipeline.md` first. Learn rhythm and decision rules from the references; do not copy exact layouts or reusable elements from prior posts.

## Voice Antipatterns

These apply to every slide, regardless of who the author is. The local profile may add more.

### Do not soften

Do not rewrite the author's words into "literary" or "professional" prose. Keep rough edges. Keep slang. Keep profanity if the author uses it. Do not insert filler adverbs to make sentences flow.

### Do not chew

Do not add parenthetical explanations. Do not unpack jokes with em-dashes. Do not restate the previous sentence in different words. If a short phrase works, leave it short.

### Do not explain

If the headline is ironic, do not append a body that explains the irony. If a visual uses a metaphor, do not name the metaphor in the caption.

### Do not duplicate across layers

Headline, body, and visual labels must not paraphrase each other. Pick one layer for each fact.

### Do not pad visuals

`modules`, `metrics`, and `outcomes` are optional. Two pointed items beat five generic ones. If a label could fit any post on a similar topic, it is filler.

### Do not add emoji that were not there

Emoji belong to the author's natural voice or to the post's source material. Do not sprinkle for "energy".

## Stop-List Of Typical SaaS Clichés

These phrases are almost always a sign the writing slipped into agency / SaaS-copywriter tone. Replace them with concrete language, or delete the sentence.

```text
масштабируемое решение
бесшовно
по смыслу (в значении «семантически»)
магия случается / магия повторяется
выстроил пайплайн / собрал пайплайн с проверками
система видит задачу
модель получает критерии, а не настроение
смысловой стрелочник
получает координаты
единый источник правды
оператор видит пачку
команда запускает подготовленный сетап
финальная цель — экран с задачами
оптимизированный / прокачанный / системный (как прилагательные)
solution / approach / methodology (when used as filler nouns)
seamlessly, effortlessly, leverage, unlock, empower, supercharge
```

A local profile may extend this list with phrases specific to the author's anti-style.

## Slide Composition

1. `stage` names the role of the slide in the story.
   - Good: `PROBLEM`, `SHIFT`, `PROCESS`, `EXAMPLE`, `TAKEAWAY`.
   - Avoid internal labels like `STEP 01`, `CONTEXT`, or `MAP`.

2. `headline` should stand on its own.
   - A reader should understand the point even if they skip the body.
   - Two short lines, not a full sentence.
   - Do not add generated method numbers by default. Use `headline-numbering: true` only when the post promise is explicitly numbered.

3. `body` adds concrete detail or stays empty.
   - Compact slides: one sentence.
   - Text-heavy explanatory slides: 3-6 natural sentences or 2-3 short paragraphs.
   - Prefer a number, a name, a moment, an honest limitation.
   - Avoid meta-text about the slide or visual.

4. `visual` should show a concrete artifact.
   - Use files, checklists, dashboards, notes, browser screens, or workflow panels.
   - Avoid generic labels like `input`, `action`, `result` unless they are part of the story.
   - Require visual specificity: the visual should become weaker if moved to another slide.
   - Require novelty: do not reuse a prior visual pattern unless the story calls for it.

5. Every slide brief must name the pain and the mechanism that resolves it.
   - Bad: a board of related words.
   - Good: `reader pain -> rule/check/process -> concrete output`.

## What To Customize

During chat-first onboarding, the agent should update:

- `brand/tokens.ts` for identity, colors, and typography.
- `brand/voice.md` for tone and writing rules, or create `brand/voice.local.md` for a private author profile.
- `posts/<your-post>/post.md` for content.
- `assets/face-refs/` for private reference photos.

Keep `brand/fonts/` and `brand/prompts/*.md` unchanged during first setup unless the person explicitly asks for a typography or image-style change.
