# Carousel Quality Rubric

Use this quality rubric during self-review. Score every slide from `0` to `2` for each category.

```text
0 = failing
1 = acceptable but weak
2 = strong
```

## Slide Criteria

1. **One-thought clarity**
   - `2`: one idea is obvious from the headline and visual.
   - `1`: one idea exists, but the body has to rescue it.
   - `0`: the slide is a list of notes.

2. **Story role**
   - `2`: the slide clearly moves the carousel forward.
   - `1`: the slide is relevant but could move elsewhere.
   - `0`: the slide feels like filler.

3. **Visual specificity**
   - `2`: the visual could only belong to this slide or topic.
   - `1`: the visual is related but generic.
   - `0`: the visual is decorative or template-like.

4. **Novelty**
   - `2`: the slide avoids repeating prior carousel patterns unless there is a reason.
   - `1`: the layout is familiar but the visual details are meaningfully new.
   - `0`: it looks copied from earlier work.

5. **Text strength**
   - `2`: the headline works without reading the body.
   - `1`: the headline is understandable but flat.
   - `0`: the headline is a label, not a thought.

6. **Visual/text connection**
   - `2`: the visual sharpens the text.
   - `1`: the visual illustrates the text but adds little.
   - `0`: the visual and text could have been paired randomly.

7. **Brand fit**
   - `2`: the slide sounds and looks like the intended author. Specific lexicon, marker phrases, or honest limitations are visible. No stop-list phrases. No "literary smoothing" of rough edges.
   - `1`: mostly aligned, but with at least one generic phrase (`"system sees the task"`, `"scalable solution"`, `"by meaning"`, etc.) or with the body smoothed into agency tone.
   - `0`: reads like a generic SaaS deck or a content-agency rewrite. Could belong to any AI-workflow post on the internet.
   - Test: if you cover the brand chrome and the rendered image, can a stranger still guess which author wrote the slide? `2` = yes, `0` = no.

8. **Text non-redundancy**
   - `2`: headline, body, and visual labels (`primary`, `secondary`, `badge`, `note`, `modules`, `metrics`, `outcomes`) each carry a different fact. Deleting any one layer would lose information.
   - `1`: at most one pair of layers paraphrases each other; the rest add information.
   - `0`: the same idea is restated in two or three layers. Reader hits the same point in headline, in body, and again in the visual labels.
   - Test: read each layer aloud separately. If two layers compress to the same sentence, score is `0`.

## Threshold

Maximum score: `16`.

- `14-16`: final-ready.
- `11-13`: revise if time allows; final only if the weak point is explicit and acceptable.
- `<11`: must enter a revision loop.

## Executable Quality Gate

The rubric is the human/art-director review. The code gate catches the repeat failures before the first final render:

- every editorial slide needs `reader-pain`, `mechanism`, `visual-route`, and `visual-reason`;
- every editorial visual needs `visual.template` and `visual.primary`;
- generated scene routes need `visual.image`;
- generic filler labels such as `Pain`, `Slide`, `Export`, `fast`, `clear`, `ready`, `Raw idea`, `Post draft`, `Carousel`, `Input`, `Action`, and `Result` fail the gate;
- stop-list phrases and repeated facts across headline, body, and visual labels fail the gate;
- adjacent editorial slides cannot repeat the same `visual-route` unless the later slide includes `visual-repeat-ok` with a real reason.

If this gate fails, fix the slide brief and source. Do not treat the error as a rendering problem.

The carousel as a whole must also pass:

- no two adjacent slides use the same visual idea unless the repetition is intentional;
- every generated image prompt is in English;
- final PNGs are inspected visually, not only rendered;
- a final legibility check catches missing text surfaces, footer/copy collisions, clipped text, unreadable chrome, and generated-image text artifacts;
- output files stay in ignored `out/` folders.

## Anti-Inflation Rule

Self-review must justify every `2` in **brand fit** and **text non-redundancy** in writing, not just record the number. If the slide brief cannot point to a specific marker phrase (for brand fit) or to a specific fact split across layers (for non-redundancy), the score is at most `1`.

A clean `2/2` row in these two criteria, given without justification, is the most common signal that self-review skipped the voice pass.
