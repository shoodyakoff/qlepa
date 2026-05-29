# Postmortem: Generic Template Reuse

## Problem

An agent can produce a carousel that looks polished but still fails the user's real need. This happens when it selects familiar UI blocks from previous work before understanding the new post.

The visible symptoms:

- repeated dashboard-like layouts;
- old artifact names or visual metaphors leaking into a new topic;
- text that summarizes the source but does not create a story;
- visuals that could be swapped between slides without changing the meaning;
- first render presented as final output.

## Root Cause

The agent treated existing templates as the source of truth. The source post should have been the source of truth.

Templates are rendering tools. They are not the creative strategy.

## Corrective Action

Before writing `post.md`, create:

- source analysis;
- story strategy;
- visual direction;
- slide brief for each slide;
- self-review with scores;
- revision loop notes.

The agent must explicitly check novelty and visual specificity before final delivery.

## Future Rule

If a slide's visual concept can be described as "same UI block with new labels", it fails review unless the story specifically requires repetition.
