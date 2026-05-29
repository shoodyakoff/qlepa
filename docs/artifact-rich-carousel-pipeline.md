# Artifact-Rich Carousel Pipeline

Use this layer for process, educational, build-log, tool, workflow, or case-study carousels. The goal is to make every slide a small proof object: the artifact should explain or prove the point, not decorate a short slogan.

This is the public version of the pattern used by the local `2026-05-25-mini-content-factory` work: long human copy, dynamic artifact templates, generated scene inserts, and a recurring generated actor when the deck needs one.

## 1. Long-Copy Default

For artifact-rich carousels, default editorial slides to:

```text
layout: "text-heavy"
```

Use 3-6 natural sentences in `body` when the slide explains a mechanism. Do not compress the post into aphorisms, sticker lines, or one-sentence summaries just because the template can render short copy.

Good body copy names:

- what the author actually did;
- what went wrong before the process existed;
- what file, folder, rule, card, timing, scene, or status changed the outcome;
- what the reader should understand after seeing the artifact.

## 2. Proof Object Before Template

Before choosing `visual.template`, write the artifact's job:

```text
reader-pain:
mechanism:
proof object:
visual-route:
visual-reason:
```

The proof object must be recognizable: a file, rule doc, database record, folder hub, waveform, caption groups, clip shelf, progress gauge, console, timeline, selector, or generated scene.

If the visual would still work after replacing all labels with `input / action / result`, it is too generic.

## 3. Dynamic Template Catalogue

Use these templates when their mechanism fits the slide:

- `prompt-loop` — a loop of AI guessing / manual correction versus a straight pipeline.
- `script-rules-file` — a real-looking rules document with line rows, statuses, and concrete constraints.
- `voice-caption-pipeline` — waveform -> timed words -> short caption groups.
- `artifact-table` — a database/card record with real fields and statuses.
- `system-map` — a central project or agent hub connected to concrete folders/rules/assets.
- `asset-grid` — a clip, image, icon, audio, or b-roll library with tags.
- `command-board` — progress, status, owner split, or what is automated versus manual.
- `field-note-board` — working rules, case notes, criteria, or after-action notes.
- `assembly-rig` — transformation from one state/media type to another.
- `semantic-selector` — matching meaning to assets, examples, clips, or categories.
- `capture-console` — operator view, generated output, checks, or next action.
- `generated-scene` — a generated bitmap scene when React/CSS cannot make the moment specific enough.
- `character-scene` — a generated persona/operator/critic/guide when a recurring actor makes the mechanism clearer.

Do not choose templates by variety alone. The route must come from `reader-pain` and `mechanism`.

## 4. Image Generation Pass

Artifact-rich decks often need images in two places:

1. `visual.image` — the main generated scene for `generated-scene`, `character-scene`, or `photo-scene` routes.
2. `visual.copyImage` — a supporting generated actor/scene rendered near the copy area, useful when the top zone under the headline would otherwise be empty.

Before rendering:

- check `assets/generated/` for a prompt/reference match;
- reuse a cached image only if it fits the current slide's role;
- otherwise run Mode A and save the generated PNG to the printed path;
- wire the saved source image into `post.md` as `visual.image` or `visual.copyImage`;
- keep all text out of the generated bitmap, because Qlepa renders text separately.

Example commands:

```bash
npm run carousel -- gen-photo generated-scene "operator at a desk sorting video cards, folders, waveform strips, and caption groups, no text" --no-wait
npm run carousel -- gen-photo character-scene "small AI pipeline operator beside folders and caption cards, no readable text" --no-wait
```

If the image is not ready, say that the post is not ready for final render. Do not silently remove the image requirement.

## 5. Post.md Shape

Use this shape for process slides:

```text
## slide-editorial
stage: "ПРОБЛЕМА"
headline: |
  ОДИН ПРОМПТ
  НЕ ДЕЛАЕТ РОЛИК.
body: |
  Запрос «ИИ, сделай красиво» почти всегда заканчивается одинаково. ИИ что-то додумывает, я смотрю на результат и начинаю руками объяснять, что именно он понял не так.

  Чем сложнее задача, тем хуже надежда на один удачный промпт. Поэтому я собираю процесс, где у ИИ меньше места для фантазии.
artifact: visuals
reader-pain: "читатель пробовал один сильный промпт и всё равно получал ручную переделку"
mechanism: "процесс ограничивает фантазию ИИ конкретными входами, папками и правилами"
visual-route: "prompt-loop"
visual-reason: "петля показывает, почему один промпт возвращает автора к ручной правке, а процесс ведёт по прямой"
layout: "text-heavy"
visual:
  template: prompt-loop
  file: "skill_carusel.md"
  copyImage: "../../assets/generated/<operator-hash>.png"
  primary: "ии додумывает"
  secondary: "Сборка по пайплайну"
  modules:
    - "ии додумывает"
    - "каждый раз с нуля"
    - "как выглядит процесс"
  outcomes:
    - "результат менее предсказуем"
    - "ии не помнит контекст правок"
  metrics:
    - "написать сценарий"
    - "снять cta и hook"
    - "загрузить файлы в папку"
    - "получить готовое видео"
```

## 6. Self-Review

Before calling a deck ready, inspect every slide and answer:

- Does the body explain the mechanism in human language?
- Does the visual contain a real proof object, not labels around an empty shape?
- Did the image pass create or wire every needed `visual.image` / `visual.copyImage`?
- Would this slide become weaker if moved to another carousel?
- Are headline, body, and visual labels carrying different facts?

If two or more slides look like generic boards, revise the visual direction before exporting final PNGs.
