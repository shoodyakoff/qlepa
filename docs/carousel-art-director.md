# Carousel Art Director Workflow

Use this workflow before creating any non-trivial carousel from a post draft. The goal is to make the agent act like an analytical creative director, not a template filler.

The carousel art director must produce working notes before writing `post.md`.

If the task includes visual references, first use the reference-driven visual pipeline in `docs/reference-driven-visual-pipeline.md`. Extract transferable visual grammar before choosing templates.

For process, educational, build-log, or artifact-heavy carousels, also use `docs/artifact-rich-carousel-pipeline.md`. The default is not short sticker copy; the default is text-heavy explanatory slides with proof objects.

## Required Phases

1. **reference pattern extraction** when references exist
   - Identify deck rhythm, visual routes, headline hierarchy, artifact types, and cover-scene logic.
   - Convert references into rules; do not copy exact compositions, people, props, jokes, or UI details.
   - Name what the current post should learn and what it must avoid copying.

2. **human copy strategy**
   - Before writing slide copy, read `docs/skills/human-carousel-copy/SKILL.md`.
   - Apply its embedded stack: product-marketing, Ogilvy, copywriting, copy-editing, and stop-slop. Do not assume those skills exist outside this repository.
   - Treat the source draft as a human explanation first, not as raw material for slogans.
   - For reference-style educational slides, plan about 60% text and 40% visual unless the source demands another ratio.
   - For process/build-log carousels, default editorial slides to `layout: "text-heavy"` and write 3-6 natural sentences when the mechanism needs it.
   - Ban pseudo-wise sticker copy. The body must explain a process, decision, or consequence in normal sentences.

3. **source analysis**
   - Identify the central conflict, promise, audience, stakes, and details that must not be lost.
   - Separate what the draft says from what the carousel needs to make the reader feel or understand.

4. **story strategy**
   - Propose 2-3 possible narrative structures.
   - Pick one and explain why it fits the source.
   - Assign each slide a role: hook, tension, turn, mechanism, proof, implication, or takeaway.

5. **visual direction**
   - Define the visual metaphor for this post.
   - List forbidden reuse from prior work.
   - For the first slide with the author's photo, do not choose a mood or custom cover direction. Use only the `outdoor-editorial-arrow` photo-cover pattern.
   - Decide when a slide needs a real/generated image, a generated scene, a diagram, a product-like screen, an artifact, a field note, an assembly rig, a semantic selector, or a command surface.
   - If the slide layout leaves a repeated empty area under the headline, choose a meaningful recurring actor/scene and wire it through `visual.copyImage`; do not leave the zone blank by default.
   - Set scene cadence by semantic need and deck rhythm, not by a fixed every-N-slides rule.
   - If the source or user gives a user-specified visual rhythm, such as infographic / generated image alternation, record it in the post frontmatter and honor it unless it makes a slide less clear.
   - Check adjacent slides for repeated visual routes before rendering.

6. **slide brief**
   - For each slide, write the reader pain, mechanism that resolves the pain, one thought, headline, body intent, visual concept, and reason the visual belongs there.
   - If a visual could be swapped with a generic dashboard without losing meaning, revise the brief.
   - If the slide is only a cluster of related labels or phrases, revise it until it states a causal mechanism.

7. **quality gate fields**
   - Every `slide-editorial` block in `post.md` must carry the executable brief fields:
     - `reader-pain`
     - `mechanism`
     - `visual-route`
     - `visual-reason`
   - Use `visual-repeat-ok` only when two adjacent editorial slides intentionally use the same route and the second slide changes the role, state, or evidence.
   - The quality gate also requires `visual.template` and `visual.primary`; do not rely on renderer defaults to fill a slide.
   - `generated-scene`, `character-scene`, and `photo-scene` routes require `visual.image` before final render planning.
   - When using `visual.copyImage`, it must point to a generated source image in `assets/generated/` and add meaning to the slide, not decorate it.
   - If build or preview planning reports `Carousel quality gate failed`, revise the slide brief/source first. Do not bypass the error by swapping templates.

8. **image generation pass**
   - Before draft render, list every slide that needs `visual.image` or `visual.copyImage`.
   - Check `assets/generated/` cache first. Reuse a suitable cached image only when its prompt/reference fit the slide.
   - If an image is missing, run the appropriate Mode A command, such as `npm run carousel -- gen-photo generated-scene "<scene>" --no-wait` or `npm run carousel -- gen-photo character-scene "<scene>" --no-wait`, then tell the user where to save the generated PNG.
   - Do not silently downgrade an intended scene into a blank CSS artifact because the image is missing.

9. **draft render**
   - Create the post source and render PNGs.
   - Build a contact sheet or inspect the slides in a browser.

10. **voice pass** *(mandatory)*
   - Read `brand/voice.md` and `brand/voice.local.md` (if present) before opening any slide.
   - For every slide, rewrite the headline and body in the author's voice. Strip stop-list phrases, SaaS clichés, agency smoothing, and "objective explainer" tone.
   - For every slide, check the three text layers (`headline`, `body`, visual labels: `primary`, `secondary`, `badge`, `note`, `modules`, `metrics`, `outcomes`). Each fact lives in exactly one layer. If two layers carry the same fact, delete it from the weaker layer.
   - Compact slides may have a one-sentence `body`. Text-heavy explanatory slides should keep the human explanation if it carries the mechanism; cut only filler and duplicated facts.
   - Cut `modules`, `metrics`, `outcomes` to at most two items each, only items that add a fact not in the headline or body.
   - If a slide reads like it could belong to any AI-workflow post on the internet, rewrite it or delete it.
   - Re-render after the voice pass, before scoring.

11. **self-review**
   - Score each slide with `docs/carousel-quality-rubric.md`, including the brand fit and text non-redundancy criteria.
   - For every `2` in brand fit or text non-redundancy, write a one-line justification pointing to a specific marker phrase or to the specific fact split across layers. Unjustified `2`s collapse to `1`.
   - Name the weakest slide and the weakest visual.
   - Do not present a final carousel while any slide is below threshold.

12. **revision loop**
   - Revise the source or visual plan.
   - Render again.
   - Repeat until the score and visual inspection pass.

13. **final legibility check**
   - Inspect every rendered slide, not only the edited ones.
   - Add a `semi-transparent text surface` when cover or photo text depends on a busy background for contrast.
   - Flag footer/copy collisions, headline/body collisions, clipped text, and unreadable brand chrome.
   - Flag generated-image text artifacts when a generated bitmap contains fake UI text, labels, handwriting, or other text-like marks that look accidental.
   - Do not finish while any slide needs a readability surface, spacing revision, crop, blur, or regenerated image.

14. **intent verification**
   - Verify the final result against the original user pain, not only against the slide list.
   - Record what was compressed or deliberately omitted.

## Output Artifacts

For public examples, use generic docs and examples. For private client or creator posts, keep analysis in ignored local folders such as:

```text
private/art-director-cases/<case-slug>/
```

Suggested files:

```text
source-analysis.md
reference-patterns.md
story-strategy.md
visual-direction.md
slide-briefs.md
voice-pass.md
self-review.md
iterations.md
intent-verification.md
```

The `voice-pass.md` file records, per slide, the before/after of headline and body, the rationale for each rewrite, and the layer assignment of each fact (headline / body / visual labels).

These artifacts are part of the work. They let the next chat continue from the reasoning, not just from rendered images.

## Autonomy Rule

The agent should not stop after the first render. A first render is evidence for critique. The deliverable is the best revision the agent can justify after at least one scored review pass.
