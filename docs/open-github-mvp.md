# Open GitHub MVP Guide

Qlepa is meant to be shared as a local repo, not as a hosted app.

The public repo contains:

- the CLI and rendering pipeline;
- React slide templates;
- local fonts and prompt presets;
- starter examples;
- onboarding docs for Codex/Claude-assisted work.

The public repo must not contain:

- real face/body reference photos for the author's photo-cover;
- generated photo cache entries;
- final carousel PNG outputs;
- private draft posts unless the author chooses to publish them.

## First Run

```bash
npm exec -- pnpm install
npm run start
```

If `pnpm` is installed globally, these are equivalent:

```bash
pnpm install
pnpm start
```

`start` prints the onboarding flow, runs `doctor`, and ends with `READY TO RUN` when the core setup has no FAIL lines. The preferred onboarding path is chat-first: the person opens the repo in Codex or Claude, sends brand answers and image attachments in chat, and the agent saves files and updates config. See `docs/chat-onboarding.md`.

After a successful install-only request, the final agent response should not start a dev server by default. It should hand control back to the person:

```text
Готово. Если хотите начать работу, напишите в чат: старт.
```

For chat UX, `/start`, `start`, and `старт` are the same onboarding intent. The agent should answer in Russian, avoid exposing internal skill/workflow/tool names, and after `READY TO RUN` explain that this is only repository technical readiness. It must collect the brand name, public handle, Telegram/publication channel, audience, tone of voice, face photo, waist/full-body photo for the single `outdoor-editorial-arrow` photo-cover pattern or an explicit `без моего фото` answer before asking for a post idea.

## Private Inputs

The person sends private references in chat. The agent saves them here:

```text
assets/face-refs/face.jpg
assets/face-refs/body.jpg
assets/face-refs/style.jpg
```

`style.jpg` is optional. The folder is ignored by git except for its README.

If the person sends DNG, HEIC, or another raw format, the agent should export working JPG copies into the paths above. Do not commit the raw originals or the JPG copies.

Brand data lives in:

```text
brand/tokens.ts
brand/voice.md
brand/fonts/
brand/prompts/
```

Use local font files only. Do not add external CDN fonts for production rendering.
For the first setup, keep the bundled default fonts unless the person explicitly asks for different typography.

## Starter Post

Start from:

```text
posts/starter-post/post.md
```

Copy it to a private `posts/<date-slug>/post.md` folder or edit the example directly while testing.

## Mode A Image Flow

Image preparation is semi-automatic. Generated files in `assets/generated/` are source images for a cover or slide, not the final rendered cover:

```bash
npm run carousel -- gen-photo cover "low-angle outdoor poster, clean blue sky, person in the upper-right, large matte orange arrow structure" --no-wait
```

`cover` is an alias for `outdoor-editorial-arrow`, the only supported photo-cover pattern for the MVP. Do not add a mood picker, custom cover brainstorm, or alternate photo-cover styles for public onboarding. Other prompt presets are for internal slide scenes, not cover mood options.

The command prints:

- the final English prompt;
- the cache key;
- the exact `assets/generated/<hash>.png` save path.

Generate the image through Codex-owned image generation, save it to the printed path, then run preview/build.

## Preview And Build

```bash
npm run carousel -- preview posts/starter-post
npm run carousel -- build posts/starter-post
```

`preview` starts a local Vite server because the carousel is rendered by React in a browser. `build` starts the same renderer temporarily so Playwright can capture `1080x1350` PNG screenshots. `npm run start` is only onboarding plus setup diagnostics and does not need a dev server.

Outputs are written to:

```text
posts/starter-post/out/
```

For real posts, use:

```text
posts/<date-slug>/out/
```

## Release Shape

For early testers, publish the repo with:

- clean docs;
- no private photos;
- no generated PNGs;
- a passing `npm run build`;
- a passing `npm run test`;
- `npm run start` showing `READY TO RUN` in a fresh clone.

Do not publish the existing local branch history if it contains private posts, `.codex/session` notes, generated outputs, or author-specific data from earlier commits. Publish a clean one-commit branch or a fresh repository state instead.

Native app packaging is intentionally later. First prove the repo-based workflow with real users.
