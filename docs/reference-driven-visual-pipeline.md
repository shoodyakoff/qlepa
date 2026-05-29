# Reference-Driven Visual Pipeline

Use this layer when a carousel must learn from reference decks without copying them. The goal is to extract visual grammar: rhythm, hierarchy, composition roles, and artifact types.

## 1. Reference Intake

Save references in an ignored local folder such as:

```text
private/reference-images/<source-name>/
```

Do not commit downloaded references, generated drafts, or contact sheets.

## 2. Pattern Extraction

Create an ignored analysis note before writing `post.md`. Extract:

- headline hierarchy and accent behavior;
- slide rhythm across the deck;
- cover scene logic;
- recurring artifact types;
- how dense slides avoid becoming walls of text;
- what makes each visual tied to its slide's idea.

Do not copy exact illustrations, characters, jokes, logos, or layouts. Convert references into reusable decision rules.

## 3. Source-To-Visual Routing

For every slide, choose a route before choosing a template:

- `photo scene`: emotion, conflict, human moment, or metaphor.
- `generated scene`: a fully generated in-slide image when the idea needs a scene, character, object, human moment, or metaphor that React/CSS cannot make specific enough.
- `character scene`: a generated-scene subtype for a personified agent, critic, guide, operator, or memorable process persona.
- `field note`: rules, lists, scripts, decisions, or constraints.
- `assembly rig`: transformation from one media/state to another.
- `semantic selector`: matching text meaning to assets, clips, examples, or categories.
- `capture console`: operator view, weekly plan, missing inputs, or ready outputs.
- `system map`: dependencies and prepared parts.
- `artifact pack`: files, folders, reusable assets, or product deliverables.
- `measurement diagram`: proof, scoring, progress, timing, or feedback loops.

The route should be named in the private slide brief. A repeated route is fine only when the role is intentionally repeated. If the user asks for a user-specified visual rhythm, such as infographic / generated image alternation after the cover, treat that cadence as a deck-level constraint and record it before writing slide copy.

The same route must also be written into each `slide-editorial` block as `visual-route`. Pair it with:

- `reader-pain`: what hurts for the reader on this slide;
- `mechanism`: what rule, artifact, process, or example resolves that pain;
- `visual-reason`: why the chosen route makes the mechanism clearer.

These fields feed the quality gate before preview/build planning. They are not captions and are not rendered.

## 4. Scene Cadence

Do not place generated scenes by a fixed every-N-slides rule. Choose them by semantic need and deck rhythm.

Use a generated scene when at least one is true:

- the slide has an emotional or role-based turn;
- the point is a hidden mechanism that needs a physical metaphor;
- the deck has become too UI/card-heavy and needs a visual reset;
- the slide introduces a memorable actor, operator, opponent, or environment;
- a real/generated scene would make the idea less generic than another board or dashboard.

Default rhythm for a 7-10 slide deck: one cover image plus one to three internal generated scenes. Avoid adjacent generated scenes unless the story intentionally becomes cinematic. Always write what the scene should show in the private slide brief before generating.

Possible generated-scene routes:

- persona or robot/operator;
- non-identifiable human from behind or hands-only;
- workbench, desk, studio, or control-room scene;
- physical process or miniature assembly line;
- object still life with source materials;
- natural or infrastructure metaphor.

## 5. Production Rules

- Use generated images when the slide needs a human scene, physical metaphor, impossible set, or memorable visual reset.
- Use `generated-scene` as the default in-slide generated image route. Start from `brand/prompts/generated-scene.md`, save the generated bitmap into ignored generated assets, then wire it through `visual.image`.
- Use `character-scene` only when the generated scene specifically needs a persona that carries the argument, such as an agent, critic, reviewer, operator, or guide. It remains a subtype, not the default.
- Use React/CSS sections when the slide needs readable structure, UI artifacts, tables, boards, or diagrams.
- Keep generated image prompts in English and without text inside the image.
- Keep slide text in the post language.
- Use `visual.modules`, `visual.metrics`, and `visual.outcomes` for concrete topic details, not placeholder labels.
- Do not rely on generic renderer defaults. `visual.template` and `visual.primary` are mandatory for editorial slides, and generated-scene routes need `visual.image` before final rendering.

## 6. Self-Review

After the first render:

1. Make a contact sheet or inspect the browser render.
2. Score every slide with `docs/carousel-quality-rubric.md`.
3. Flag repeated neighboring routes.
4. Flag any visual that could move to another post unchanged.
5. Revise at least the weakest slide and weakest visual before calling the deck final.

## 7. Durable Artifacts

Store private case work under:

```text
private/art-director-cases/<case-slug>/
```

Suggested files:

```text
reference-patterns.md
source-analysis.md
story-strategy.md
slide-briefs.md
self-review.md
iterations.md
intent-verification.md
```

The next chat should be able to continue from those notes instead of rediscovering the same pain.
