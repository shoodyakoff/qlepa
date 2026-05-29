# Visual Pattern Library

This is not a list of layouts to reuse blindly. It is a decision guide for choosing visual forms from the source meaning.

## Pattern Selection

Start with the slide's job:

- show a person or moment;
- show a system;
- show a before/after;
- show a decision;
- show a hidden mechanism;
- show a timeline;
- show proof;
- show a final state.

Then choose a visual form.

## Pattern Types

### Text-Heavy Proof Object

Use when the slide needs a real explanation plus a strong artifact, as in process, educational, build-log, or workflow posts.

Good for:

- explaining how a system actually works;
- showing files, rules, folders, timings, statuses, or generated scenes;
- keeping the author's human explanation instead of compressing it into a slogan.

Requires:

- `layout: "text-heavy"`;
- 3-6 natural sentences when the mechanism needs it;
- one proof object that would become weaker if moved to another slide;
- different facts in headline, body, and visual labels.

See `docs/artifact-rich-carousel-pipeline.md`.

### Cinematic Moment

Use when the slide needs emotion, stakes, or a human scene.

Good for:

- cover slides;
- personal turning points;
- tension between manual work and a future state.

Requires:

- English image prompt;
- clear subject, location, mood, and object signals;
- no text inside the generated image.

### Generated Scene Insert

Use when the slide needs a fully generated internal image rather than another React/CSS board.

Good for:

- a role-based or emotional turn;
- a human operator, hands, or back-view scene;
- a physical metaphor for an invisible process;
- a workbench, control room, miniature set, object still life, or natural metaphor;
- breaking a dense deck rhythm when the meaning supports it.

Requires:

- generated image prompt in English;
- no readable text inside the generated image;
- React-rendered cards/notes for all slide text;
- a private slide brief that explains why this slide earns a generated scene.

Avoid:

- adding a generated image only for decoration;
- fixed cadence like every second or third slide;
- repeating the same character or prop language across posts.

### Character Scene

Use when the generated scene needs a personified role, tension, opponent, assistant, critic, guide, or process persona.

Good for:

- showing two internal agents with different jobs;
- making an abstract AI process feel concrete;
- showing a critic, reviewer, assistant, or operator;
- adding a memorable visual anchor to a concept-heavy section.

Requires:

- `generated-scene` decision first, then this subtype only if a persona is the clearest metaphor;
- a clear reason the character belongs to this slide.

Avoid:

- using a character scene just because the slide needs decoration;
- repeating the same robot/persona across many slides;
- embedding important copy inside the generated bitmap.

### Copy Image

Use `visual.copyImage` when a text-heavy editorial slide needs a recurring actor, operator, or scene near the copy area. This fixes the common empty-zone problem under the headline without turning the lower artifact into a decorative image.

Good for:

- a recurring operator/persona across a process deck;
- a small generated image that clarifies who or what is acting;
- balancing dense text-heavy layouts.

Requires:

- a generated source PNG in `assets/generated/`;
- a role in the slide brief;
- no readable text inside the bitmap.

Avoid:

- using the same image when it has no relationship to the slide;
- treating `copyImage` as a replacement for `visual.image` on `generated-scene` slides.

### Prompt Loop

Use `prompt-loop` when the slide contrasts a vague one-prompt loop with a prepared process.

Good for:

- "AI guesses / I explain again / every run starts over";
- showing why a pipeline is more predictable than a chat prompt.

### Script Rules File

Use `script-rules-file` when the slide explains rules before production: hooks, CTA, stop words, accents, or author constraints.

Good for:

- real-looking `.md` rules;
- line rows, statuses, and concrete constraints;
- showing how author taste becomes an input.

### Voice Caption Pipeline

Use `voice-caption-pipeline` when the slide explains audio becoming timed words and subtitle groups.

Good for:

- waveform -> timestamps -> captions;
- pronunciation rules;
- showing that "audio is ready" is not the same as "video is ready".

### Artifact Table

Use when the post is about saved work, rules, checklists, scripts, notes, or decisions.

Good for:

- showing how messy thinking becomes reusable structure;
- comparing draft, rule, and output;
- making invisible preparation feel concrete.

Avoid:

- generic file cards with labels that could fit any post.

### Field Note Board

Use when a slide needs to show rules, constraints, decision criteria, or a compact list that feels like a working note rather than a generic table.

Good for:

- scenario rules;
- script checklists;
- database card fields;
- "what changed" records;
- criteria used by the agent before creating output.

Requires:

- concrete row labels from the source;
- a bottom note or status that changes the meaning;
- no placeholder rows like input/action/result unless those are the actual terms.

### Timeline Strip

Use when the slide explains order, transformation, or assembly.

Good for:

- process steps;
- edit plans;
- handoffs between human work and system work.

Make each step visually different if the meaning changes.

### Assembly Rig

Use when the slide explains how one media or state becomes another.

Good for:

- text to voice;
- voice to timings;
- timings to captions;
- raw files to final exports.

The rig should show the transformation materials: waveform, caption chunks, sequence cards, or timeline lanes.

### System Map

Use when the post explains moving parts and dependencies.

Good for:

- folders, queues, databases, assets, and build steps;
- showing why one prompt is not enough.

The map must have a central metaphor, not just boxes connected with arrows.

### Evidence Board

Use when the slide needs to prove a claim.

Good for:

- examples, metrics, snippets, screenshots, comments, or logs.

Avoid:

- fake dashboards with numbers that do not support the text.

### Asset Grid

Use when the slide is about a library, bank, inventory, or reusable set of fragments.

Good for:

- b-roll libraries;
- icon, audio, or template banks;
- tagged source material that is chosen by meaning.

Each tile should represent a real category from the post, not decorative filler.

### Semantic Selector

Use when the point is that the system chooses an asset by meaning.

Good for:

- matching phrases to b-roll;
- choosing examples for a claim;
- mapping a product mention to a required screenshot;
- pairing copy fragments with visuals.

The visual must show both sides of the match: source phrase and selected asset/category.

### Contrast Diptych

Use when the point is a shift from one mode to another.

Good for:

- manual vs systematic;
- first attempt vs revised approach;
- vague request vs prepared process.

### Command Board

Use when the slide needs to show an operating screen or future control surface.

Good for:

- weekly production plans;
- "what to do next" views;
- state, missing inputs, and ready outputs.

This is different from a system map: a system map explains dependencies, while a command board tells the operator what action to take.

### Capture Console

Use when the human needs to know what to shoot, record, upload, approve, or export next.

Good for:

- weekly production plans;
- missing hook/CTA recordings;
- ready/missing source files;
- batch capture workflows.

The console should include statuses. Without statuses it is just another list.

## Reuse Rule

A prior pattern can be reused only if:

1. the new slide has the same visual problem;
2. the details are rewritten for the new topic;
3. the self-review explains why reuse is justified.

Otherwise, create a new visual brief.
