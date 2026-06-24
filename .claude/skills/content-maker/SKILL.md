---
name: content-maker-skill
description: use this skill to write descriptions for cases.
---

# Content Maker — Case Descriptions

Writes the explanatory content for PerfSaboteur's anti-pattern "case" toggles:
the `tip` and `alert` fields in `SIMULATOR_CASES`
(`lib/simulator-toggles.ts`), keyed by `CaseKey` (`types/simulator.ts`).

## Audience

Junior frontend developers watching the demo. They should walk away having
learned a generalizable lesson about their own code, not just "what this
toggle does." Favor concise, plain-language sentences over technical prose —
this is UI copy, not documentation.

## Source of truth

Each case's technical details (problem, good code, bad code, UI behavior,
panel metrics) live in `docs/case1.md` through `docs/case8.md`. Read the
relevant case doc before writing its content — don't invent behavior that
isn't backed by the doc.

## What to produce, per case

### `label`

The toggle's display name. Must clearly name the _specific problem_ turning
the toggle on causes — not an abstract pattern name. If the current label in
`lib/simulator-toggles.ts` is already clear, keep it; propose a better one
only when it's vague.

### `tip`

An object with six string fields — `problem`, `reproduction`, `effect`,
`badCode`, `goodCode`, `summary` (see the `CaseTip` interface in
`lib/simulator-toggles.ts`). Each field is one short, concise sentence (two
at most) of natural prose — this is a UI tooltip a demo viewer reads, not an
engineering doc, so none of the six should read like a dry bullet list of
technical facts, and none should be padded out longer than it needs to be.

- **`problem`** — a short description of what's wrong.
- **`reproduction`** — the concrete action the user takes in the UI to
  trigger it (e.g. "type in the search box," "scroll to the chart,"
  "switch from Dashboard to Inventory Control").
- **`effect`** — what the user sees afterward, in the page content (what
  visibly breaks or looks wrong) and/or in the PerformancePanel (which
  specific metric changes, and how).
- **`badCode`** — _this specific example's_ anti-pattern: name concretely
  what the broken version does and why that causes the problem. Rendered in
  the UI under the label "Anti-pattern."
- **`goodCode`** — _this specific example's_ fix: name concretely what the
  working version does differently. Rendered in the UI under the label
  "Best practice."
- **`summary`** — a generalized takeaway distilled from the `badCode` /
  `goodCode` comparison above, written so it transfers to other projects —
  not just a restatement of "don't do this pattern." Rendered under the
  label "Takeaway."

### `alert`

A short string shown in the PerformancePanel alongside the numeric metrics
when the bad path is active (e.g. the panel's existing
`"Race Condition Alert: ..."` style). Keep it terse — one line, in the
panel's alert voice, not a restatement of the tip.

## Output language

English — this is the product's UI language.

## Output format

For each of the 8 cases, return `label` / `tip` (all six sub-fields) /
`alert` in a shape that drops directly into the `items` array in
`lib/simulator-toggles.ts` (one object per case, ready to paste).
