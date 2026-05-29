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

This skill is self-contained. Do not assume external Codex skills are installed. Use the embedded passes below even when `product-marketing`, `copywriting`, `copy-editing`, `stop-slop`, or `ogilvy` are unavailable locally.

## Embedded Passes

### Embedded Product-Marketing Pass

Before writing slide text, write a five-line strategy note:

```text
reader:
pain:
conflict:
single promise:
proof/details available:
```

- The reader is a real subscriber, not a demographic label.
- The pain must be felt in the reader's work: delay, doubt, wasted money, messy process, weak output, or lost control.
- The conflict names why the obvious solution fails.
- The single promise says what the carousel helps the reader understand or do.
- If there is no proof, example, tool, number, file, screen, decision, or personal detail, ask for source material before inventing.

### Embedded Ogilvy Pass

Make each slide earn attention with useful information:

- The headline should carry a benefit, concrete tension, or newsworthy fact.
- The body must add evidence: example, number, file, tool, sequence, mistake, decision, or consequence.
- Prefer specific claims over broad advice.
- One slide should make one promise and then pay it off.
- Never use invented proof, fake metrics, fake testimonials, or authority claims the source did not provide.

### Embedded Copywriting Pass

Turn the post into a sequence, not a pile of good lines:

- Pick one narrative path: problem -> failed shortcut -> mechanism -> proof -> takeaway.
- Give every slide a role: hook, tension, turn, mechanism, proof, implication, or takeaway.
- One slide advances one step. If two slides make the same point, merge or repurpose one.
- Use body copy to explain causality: because X happened, Y changed, so the reader should notice Z.
- End with a useful next action, not a motivational closer.

### Embedded Copy-Editing Pass

Edit in focused sweeps:

- Clarity: remove sentences that hide the point, unclear pronouns, and abstract nouns without examples.
- Voice: keep the author's normal words, roughness, jokes, and technical vocabulary when they carry meaning.
- Density: cut filler, duplicated facts, and body text that only paraphrases the headline.
- Flow: check that the last sentence of each slide leads naturally to the next slide.
- Truth: preserve the source meaning. Do not upgrade a weak claim into a bigger promise.

### Embedded Stop-Slop Pass

Strip patterns that make the carousel sound generated:

- Delete pseudo-wise fragments, generic drama, and "content about content".
- Avoid formulaic pivots like "not X, but Y" unless the source depends on that contrast.
- Avoid throat-clearing such as "here's the thing", "the real problem is", and "what matters is".
- Avoid three-item lists made only for rhythm when two concrete items are enough.
- Replace vague words like "system", "pipeline", "magic", "process", "quality", and "value" with the actual file, action, person, tool, or result.
- Use active sentences with a human actor when possible.

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
