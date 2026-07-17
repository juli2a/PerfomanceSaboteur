---
name: test-maker-skill
description: use this skill whenever writing or reviewing a test in this repo (unit, store, hook, component, or e2e) — governs how to derive expected behavior without encoding an existing implementation bug into the test.
---

# Test Maker — Spec-First Testing

This repo has no test coverage yet. The point of adding it is not 100% coverage
— it's covering the pieces with real, non-trivial logic, without the tests
themselves becoming a mirror of whatever the implementation currently
happens to do. See `docs/testing-plan.md` for the full coverage plan (what
to test, where, in what order); this skill is only the *process* to follow
while writing each individual test.

## The core risk

Writing `expect(fn(x)).toBe(<whatever fn(x) currently returns>)` after
reading the implementation produces a test that is always green and catches
nothing — it locks in bugs instead of catching them. This skill exists to
prevent that.

## Source of truth — read this before opening the implementation

This project has an unusually good independent spec, written before/separately
from the implementation detail:

- `docs/data.md` — exact formulas and rules (e.g. `LTV = id*1250 + age*300`,
  `avgCheck = revenue/orders`, `logisticStatus` thresholds, the
  `deriveRealProductId` inverse formula).
- `docs/case1.md` … `docs/case8.md`, plus the `problem` / `effect` / `badCode`
  / `goodCode` / `summary` fields on each item in `SIMULATOR_CASES`
  (`lib/simulator-cases.ts`) — the authored description of what the bad path
  and the good path of each anti-pattern case must do.

Read the relevant doc or `tip` fields first, and write down — in your own
words, before opening the implementation in depth — what behavior you expect.
Only then open the source file to compare.

## Procedure, per test

1. Find the doc/tip passage that describes this behavior.
2. State the expected behavior in your own words.
3. Write the assertion from that expectation, not from the code.
4. Open the implementation and compare.
   - Matches → keep the test as written.
   - Diverges → do **not** silently edit the assertion to match the code.
     Surface it explicitly as a "spec/code discrepancy" and raise it with
     the user — it might be a real bug, or the doc might be stale. Either
     way that's a decision for the user, not a silent edit.
5. Exception: purely structural facts — export names, function signatures,
   prop shapes — are read straight from the code. That's a contract check,
   not a behavioral guess, so there's nothing to derive from a doc.
6. When a piece of logic is genuinely subtle and undocumented anywhere (e.g.
   the `merge`/`partialize` interaction in `store/simulator-control.ts`),
   the source of truth is the "why" comments already in that code — they
   describe intent, not just current behavior. Test the invariant the
   comment describes (e.g. "cookie-backed cases always resolve from the
   cookie-seeded state, never from the persisted localStorage blob"), not a
   specific magic value the code happens to produce today.

## Test levels used in this repo

Canonical three: **Unit / Integration / E2E** — the split is not "which
folder," it's how many real (non-mocked) collaborators a test crosses.

| Level | Tool | Scope |
|---|---|---|
| Unit | Vitest | pure functions, no React, no browser API — **and the entire Zustand store layer**, including `merge`/`partialize`, called via `store.persist.getOptions().merge(...)` directly rather than through a real `persist`/localStorage round-trip |
| Integration — Hook | Vitest + `@testing-library/react` `renderHook` | `renderHook` mounts real React; hooks coordinate React + store + browser APIs (cookies, location) or network — a real cross-boundary interaction |
| Integration — Component | Vitest + RTL + `msw` | component ⇄ store ⇄ network, a thicker slice of the same layer |
| E2E | Playwright | real browser, real Next.js server — the only honest way to check SSR cases (cookie → reload → different HTML) |

A Zustand store is always Unit-level here, with no exception — it's an
isolated stateful object, and `getState()/setState()` (or `persist.getOptions()`
for `merge`/`partialize`) never touch React, the network, or a real
localStorage.

Match the test to the lowest level that can honestly exercise the behavior —
don't reach for RTL or Playwright when a plain Vitest unit test already
proves the point.

## Explicitly out of scope

- Presentational-only wrappers in `components/ui/`.
- `design/` mockups — not application code.
- Exact numeric Core Web Vitals thresholds in e2e — unstable in CI and don't
  exercise a logic branch anyway.
- Visual regression / screenshot diffing.

## Process discipline

- Work in scoped chunks (e.g. one test level or one feature area at a time),
  not one giant pass across the whole pyramid.
- After writing each chunk, actually run the suite (`pnpm test`) and report
  the real pass/fail result — never claim a test passes without running it.
- Briefly explain, per chunk: what got covered, why that behavior was picked,
  and any non-obvious trade-off in how it was tested (e.g. why `msw` instead
  of hitting real DummyJSON, why `renderHook` instead of mounting a full
  component tree).
- This repo's standing rule is plan-before-code — get a chunk's scope agreed
  before writing it, including follow-up fixes to an already-approved chunk.
