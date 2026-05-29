---
name: human-carousel-copy
description: Use for this repository whenever writing, rewriting, reviewing, or rendering Instagram or Telegram carousel copy. Forces human explanatory slide text instead of AI-ish slogans, and requires product-marketing, copywriting, copy-editing, stop-slop, and Ogilvy-style checks before final carousel copy.
---

# Human Carousel Copy

## Purpose

Use this project-local skill before any carousel text is written or edited. The goal is to compress a real author post into slides without killing the human explanation.

The failure mode this prevents: short pseudo-smart sticker lines such as "I build rails for AI", motivational aphorisms, or punchy fragments that sound like a content template instead of a person explaining what they built.

## Required Stack

Apply these lenses in this order:

1. **Product-marketing**: name the reader, their pain, the conflict, and the single promise of the post.
2. **Ogilvy**: every slide needs a fact, example, number, tool, action, or useful explanation. No claim floats without evidence.
3. **Copywriting**: make the slide sequence a story. One slide advances one step.
4. **Copy-editing**: preserve the author's meaning and voice. Improve clarity without smoothing the text into corporate expert tone.
5. **Stop-slop**: remove AI tells, slogan fragments, fake drama, and generic metaphors.

## Writing Rules

- Write like a person who actually did the work and explains it to a smart subscriber.
- Use normal sentences and paragraphs. Do not force every line to become a quotable.
- A text-heavy carousel slide may contain 3-6 natural sentences if they read cleanly.
- Prefer concrete details: tools, files, folders, cards, states, counts, actions, decisions.
- Keep technical words when the author uses them naturally: `hook`, `CTA`, `b-roll`, `prompt`, `Codex`, API, timings.
- Keep roughness when it is honest. Do not replace direct language with polite marketing prose.
- A slide headline can be short, but body copy must explain the mechanism in human language.
- Default text/visual balance for reference-style educational slides: about 60% text and 40% visual.

## Banned Output Patterns

Do not ship carousel copy that relies on:

- short pseudo-wise fragments;
- "not X, but Y" pivots unless the contrast is genuinely needed;
- railway/road/engine metaphors that were not in the source;
- generic "AI process" claims without concrete tools or actions;
- "magic", "system sees", "pipeline with checks", "single source of truth", or similar SaaS phrases;
- three-layer repetition where headline, body, and visual labels all say the same fact;
- body text that only paraphrases the headline;
- visual labels that repeat the body instead of adding a new concrete artifact.

## Slide Draft Shape

For each slide, write:

```text
role:
reader pain:
mechanism:
headline:
body:
visual job:
```

Body copy should usually be one compact paragraph or several short paragraphs separated by blank lines. If a sentence exists only to sound sharp, cut it.

## Final Check

Before rendering or presenting final text, answer:

- Does this sound like the author's original post, only tighter?
- Does the slide explain a process, decision, or consequence?
- Could a real person have written this after doing the work?
- Is there concrete evidence on the slide?
- Did I remove aphorisms, generic AI-blogger phrasing, and fake punchlines?

If the text sounds like "content about content", rewrite it. If it sounds like a person explaining how something works, keep it.
