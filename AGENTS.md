# Qlepa — operational rules

This repository builds Qlepa, a local deterministic pipeline for Instagram or Telegram carousel PNGs.
Use these rules as the project-specific layer on top of the general Codex behavior.

Public project name: `Qlepa`.
Local checkout folder may remain `/Users/stanislav/Documents/Repos/images-codex`; do not rename the folder just because the product name changed.

## Source Of Truth

- `BRIEF.md` is the product brief until a newer approved spec explicitly replaces it.
- For non-trivial product or implementation work, use the local problem-first workflow in `docs/agentic-mode.md`.
- Keep the original user pain separate from derived specs. A passing implementation must solve the original problem, not only match a task list.

## Author Voice

- Before writing or editing any slide copy, read `brand/voice.md` for the generic rules.
- If `brand/voice.local.md` exists, read it second and treat it as the override for the author's tone, lexicon, marker phrases, and stop-list. The local profile beats the public guide.
- Before drafting or rewriting carousel copy, read the project-local human copy skill in `docs/skills/human-carousel-copy/SKILL.md` and apply its embedded product-marketing, Ogilvy, copywriting, copy-editing, and stop-slop passes. Do not assume the user's Codex has those skills installed globally.
- The "voice pass" phase in `docs/carousel-art-director.md` is mandatory before self-review: rewrite every headline and body in the author's voice, then verify no fact is repeated across headline / body / visual labels.

## Brand Chrome

- Carousel slides use the shared header/footer chrome from `brand/tokens.ts` through `BrandPath` and `BrandFooter`.
- Public starter values must stay generic. Put author-specific names, handles, promises, revenue claims, and voice rules into the local setup only.
- Do not let per-post frontmatter, temporary topic labels, or template defaults replace the shared header/footer chrome.
- Topic-specific labels belong inside slide content or visuals, not in the global header/footer.
- Do not run a cover mood chooser or custom cover brainstorm in public onboarding. Photo covers with the author use only the `outdoor-editorial-arrow` pattern: low-angle blue sky, person upper-right, orange arrow/geometry, renderer text on top. `cover` is only an alias for that preset.

## Slide Meaning

- Generated method numbers in editorial headlines are opt-in only. Use `headline-numbering: true` only when the source promise is explicitly numbered, such as "4 способа"; narrative/process carousels do not get automatic `01/02/...` in headlines.
- Before writing slide copy, identify the reader pain and the mechanism that resolves it. Do not ship a slide that is only a collection of plausible phrases, labels, or modules.
- A slide visual must make the mechanism clearer; if it could be replaced by a generic dashboard or mood image without losing meaning, revise the slide brief.

## Commands

These are target commands for the first MVP. Do not claim they work until implemented and freshly verified.

- `pnpm carousel build <post-path>` — full carousel build
- `pnpm carousel preview <post-path>` — browser preview
- `pnpm carousel gen-photo <preset> <scene>` — cover/background photo prompt flow
- `pnpm carousel onboard` — first-run open repo onboarding
- `pnpm carousel doctor` — local setup and private reference check
- `pnpm start` — onboarding plus setup check until READY TO RUN / NOT READY status
- `pnpm preview` — template dev server
- `pnpm test` — unit tests

## Image Generation

- Use Codex-owned image generation only; do not implement direct OpenAI image API calls for the MVP.
- Start with semi-automatic Mode A from `BRIEF.md`: assemble the final prompt, check cache, print/copy the prompt, and wait for the user-saved image.
- Before any live generation, check the cache by prompt/reference hash.
- All image prompts are in English. Slide text can be Russian.
- Do not hardcode model or billing assumptions into code until the local Codex image path is verified for this project.

## Code Style

- TypeScript strict mode, ESM imports, and `noUncheckedIndexedAccess: true`.
- Avoid `any`. If unavoidable, add a short comment explaining why.
- Templates are pure React components: no stateful hooks, no filesystem, no network.
- Side effects live in `src/lib/*` or command modules.
- All slide dimensions and repeated sizes come from `brand/tokens.ts`.
- Slide headings use Tektur through `tokens.fonts.display` or the matching CSS display-font variable; do not hardcode alternate heading fonts in templates or slide CSS.
- No external CDN fonts in production rendering. Playwright must use local assets.

## File Operations

- Do not edit files in `assets/face-refs/` unless the user explicitly asks.
- Do not overwrite files in `assets/generated/`; create new cache entries by hash.
- When adding a new slide template, also add a preview route.
- Keep generated outputs under `posts/**/out/` or `out/`; avoid mixing generated PNGs with source templates.

## Verification

- For frontend/template changes, verify rendered output with a browser or Playwright screenshots before calling the work complete.
- For pipeline changes, run the narrowest command that proves the behavior, then the broader build/test command when available.
- Completion for problem-first tasks requires intent verification against `.codex/session/<taskId>/00_ORIGINAL_PROBLEM.md`.
