# Два пайплайна Qlepa

В репозитории живут **два независимых пайплайна** для каруселей. Оба собирают PNG 4:5 из одного `post.md`, используют общий рендерер, бренд-токены и шрифты, но решают разные задачи и имеют разные типы слайдов.

Выбирай пайплайн по жанру поста. Не смешивай их типы слайдов в одном посте.

## 1. Editorial / Artifact-Rich (старый, по умолчанию)

Процесс, разбор, build-log, обучающий или кейс-пост, где каждый слайд — маленький «пруф-объект» (файл, карточка, система-карта, дашборд, доска агентов).

- **Типы слайдов:** `cover`, `slide-editorial`, `slide-text`, `slide-list`, `slide-image`, `slide-quote`.
- **Копия:** длинная (`layout: "text-heavy"`, 3–6 предложений в `body`), обязательные `reader-pain` / `mechanism` / `visual-route` / `visual-reason`.
- **Визуал:** динамические шаблоны `prompt-loop`, `system-map`, `asset-grid`, `command-board`, `generated-scene` и др.
- **Документы:** [`CAROUSEL_PLAYBOOK.md`](../CAROUSEL_PLAYBOOK.md), [`docs/artifact-rich-carousel-pipeline.md`](artifact-rich-carousel-pipeline.md), [`docs/carousel-art-director.md`](carousel-art-director.md), [`docs/reference-driven-visual-pipeline.md`](reference-driven-visual-pipeline.md), [`docs/carousel-quality-rubric.md`](carousel-quality-rubric.md), [`docs/visual-pattern-library.md`](visual-pattern-library.md).
- **Пример:** `posts/starter-post/`.

## 2. Series Digest (новый, «что нового»)

Новостной дайджест / серия «что нового»: подборка апдейтов в едином стиле. Сквозной маскот на каждом слайде, тёмно-синий заголовок с одним оранжевым словом, описательный интро-абзац, ряды иконок-выгод, спич-баблы, флоу «как это работает», сравнение старое→новое (✕/✓) и финальный CTA. Референс — карусели в стиле janeodud / odud.pro.

- **Типы слайдов:** `digest-cover`, `digest-update`, `digest-cta`.
- **Копия:** описательный регистр, 2–3 спокойных предложения в `intro` (НЕ телеграм-рубка, без мата и маркеров). Заголовок — 2 строки с поворотом, акцентная строка оранжевая.
- **Визуал:** маскот-сцена + блоки `features`, `checklist`, `flow`, `compare`, `benefits`, `bubble`, `cta`.
- **Документ:** [`docs/series-digest-pipeline.md`](series-digest-pipeline.md).
- **Пример:** `posts/starter-digest/`.

## Что общее

- Рендер: `post.md` → парсер (`src/lib/post-parser.ts`) → план сборки (`src/lib/build-plan.ts`) → render routes (`src/render-routes.tsx`) → Playwright → PNG в `posts/<slug>/out/`.
- Бренд-хром, цвета и шрифты — из `brand/tokens.ts` и `src/styles.css`.
- Голос автора — `brand/voice.md` + приватный `brand/voice.local.md` (читать первым).
- Гейт качества — `src/lib/carousel-quality.ts` проверяет оба жанра перед сборкой.
- Картинки — semi-automatic Mode A: агент готовит англоязычный промпт через `gen-photo`, человек сохраняет PNG в `assets/generated/`.

## Команды (одинаковые для обоих)

```bash
npm run carousel -- preview posts/<slug>
npm run carousel -- build posts/<slug>
```
