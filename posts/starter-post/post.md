---
slug: starter-post
created: 2026-05-25
nickname: "@your_handle"
brand: default
visual-rhythm: "text-heavy artifact-rich example"
---

## cover
title: "How one idea becomes a carousel"
subtitle: "A local workflow for copy, artifacts, image planning, preview, and PNG export"
photo:
  preset: outdoor-editorial-arrow
  scene: "low-angle outdoor poster, clean blue sky, person in the upper-right, large matte orange arrow structure, generous negative space for typography"
  wardrobe: "neutral overshirt, light t-shirt, cap, dark glasses, casual editorial outfit"

## slide-editorial
stage: "PROBLEM"
headline: |
  ONE PROMPT
  IS NOT A POST.
body: |
  A vague request usually gives you a vague carousel. The model fills gaps with safe structure, short slogans, and labels that sound fine until you look at the slide.

  Qlepa works better when the agent first names the reader pain, the mechanism, and the proof object. The post becomes a sequence of decisions instead of a pile of template cards.
artifact: visuals
reader-pain: "the user gets a clean-looking deck that does not explain the idea"
mechanism: "the workflow replaces one vague prompt with slide briefs, proof objects, and visual routes"
visual-route: "prompt-loop"
visual-reason: "the loop shows why a vague prompt keeps returning to manual explanation, while a prepared process moves forward"
layout: "text-heavy"
visual:
  template: prompt-loop
  file: "starter.skill.md"
  primary: "gap filling"
  secondary: "Briefed carousel workflow"
  modules:
    - "loose request"
    - "manual explain"
    - "slide brief"
  outcomes:
    - "safe phrasing"
    - "lost context"
  metrics:
    - "name the pain"
    - "choose proof object"
    - "write visual route"
    - "render and review"

## slide-editorial
stage: "COPY"
headline: |
  START WITH
  HUMAN COPY.
body: |
  Before writing slides, read the local human-carousel-copy skill. It forces the agent to name the reader, the conflict, the promise, the concrete proof, and the words that should survive from the source.

  This keeps the carousel from turning into generic advice. The body can stay longer when it explains how the thing works.
artifact: education
reader-pain: "the source gets compressed into short AI-ish lines"
mechanism: "the copy pass keeps the author explanation and only cuts filler"
visual-route: "script-rules-file"
visual-reason: "a rules file makes the writing constraints visible before the slide is rendered"
layout: "text-heavy"
visual:
  template: script-rules-file
  file: "copy-rules.md"
  primary: "writing rules"
  secondary: "before post.md"
  note: "keep the mechanism, cut the filler"
  modules:
    - "subscriber"
    - "friction"
    - "promise"
    - "evidence"
    - "voice"
  outcomes:
    - "specific body"
    - "no slogan stack"
    - "author words kept"
  metrics:
    - "3-6 sentences"
    - "one thought"
    - "proof object"

## slide-editorial
stage: "ARTIFACT"
headline: |
  MAKE THE WORK
  VISIBLE.
body: |
  A strong visual is not a decorated rectangle. It is a file, folder, waveform, record card, clip shelf, console, generated scene, or other object that helps the reader understand the mechanism.

  Pick the proof object before picking the template. If the object could move to any other post unchanged, the slide is still too generic.
artifact: internal
reader-pain: "the deck looks polished but the artifacts do not carry meaning"
mechanism: "each visual template is chosen from the proof object the slide needs"
visual-route: "system-map"
visual-reason: "the map shows how copy, artifacts, image prompts, preview, and export depend on each other"
layout: "text-heavy"
visual:
  template: system-map
  file: "qlepa-project.md"
  primary: "source parts"
  secondary: "markdown -> cache -> PNG"
  modules:
    - "copy skill"
    - "slide brief"
    - "visual template"
    - "image cache"
    - "preview"
    - "build"
  outcomes:
    - "specific evidence"
    - "less filler"
    - "reviewable PNG"
  metrics:
    - "post.md"
    - "assets/generated"
    - "out/"

## slide-editorial
stage: "IMAGE PASS"
headline: |
  PLAN IMAGES
  BEFORE BUILD.
body: |
  Some slides need a generated scene or a recurring actor near the copy area. Qlepa does not call an image API by itself, so the agent must prepare the prompt, check the cache, and tell you where to save the PNG.

  Once the file exists, wire it into `visual.image` or `visual.copyImage`. If the image is missing, the final carousel is not ready yet.
artifact: visuals
reader-pain: "the top zone or generated-scene slot stays empty because no image was planned"
mechanism: "the image generation pass turns missing visuals into explicit Mode A prompts and file paths"
visual-route: "voice-caption-pipeline"
visual-reason: "the pipeline shape shows that image planning is a step between brief and final render"
layout: "text-heavy"
visual:
  template: voice-caption-pipeline
  file: "asset-pass.md"
  primary: "asset source"
  secondary: "cache check first"
  modules:
    - "brief"
    - "scene brief"
    - "png"
  outcomes:
    - "scene source path"
    - "copy-zone source path"
    - "ready render"
  metrics:
    - "gen-photo"
    - "assets/generated"
    - "build"

## slide-editorial
stage: "EXPORT"
headline: |
  RENDER,
  THEN REVIEW.
body: |
  The first build is not the final answer. Open the preview, inspect the slides, and check whether each artifact proves the point it was supposed to prove.

  Fix weak slides before exporting the final PNGs. Good Qlepa work is not just a successful command; it is a deck that survives visual review.
artifact: automation
reader-pain: "a passing build can still produce a weak carousel"
mechanism: "preview and self-review catch generic artifacts, repeated facts, empty image zones, and readability problems"
visual-route: "command-board"
visual-reason: "the board separates what the renderer did from what the human review still has to approve"
layout: "text-heavy"
visual:
  template: command-board
  file: "review-board.md"
  primary: "after first render"
  secondary: "not final yet"
  badge: "review"
  modules:
    - "legibility"
    - "proof object"
    - "image slots"
    - "layer repeats"
  metrics:
    - "preview"
    - "fix"
    - "build"
  outcomes:
    - "weak slide named"
    - "artifact revised"
    - "PNG exported"
