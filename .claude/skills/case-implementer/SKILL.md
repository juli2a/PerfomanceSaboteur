---
name: case-implementer-skill
description: use this skill to implement a new simulator anti-pattern case, or rework an existing one (e.g. Case 2 v2).
---

# Case Implementer — Building a Simulator Case

Implements one entry of `SIMULATOR_CASES` (`lib/simulator-cases.ts`, `CaseKey`
in `types/simulator.ts`) — the actual bad/good code paths behind a toggle.
Engineering only; `tip`/`alert` copy is a separate, later step owned by the
`content-maker` skill.

## Flow

1. **Plan from the doc.** Source of truth is `docs/case<N>.md` (latest
   revision, e.g. prefer `case2-v2.md` over `case2.md` if both exist) — must
   exist before any code. Compose a plan (plan mode) that resolves: SSR-visible
   (needs `SSR_COOKIE_CASES` + `useToggleCase`, cookie+reload — LCP/CLS/TTFB
   style) vs client-only (`useSimulatorCase(key)`, no reload — INP/rerender/race
   style, see `store/simulator-control.ts`'s comment); which files hold the
   isolated bad/good code; what the `lib/case-code/<key>.{bad,good}.txt`
   excerpts will be. Get it approved before coding.
2. **Implement — code only.** Leave `tip`/`alert` empty. Verify with
   `pnpm lint`, `tsc --noEmit`, and `curl` (different `Cookie:` headers) for
   SSR-driven cases.
3. **Hand off for browser verification.** No browser tool available — ask the
   user to test live and fix whatever they report before moving on.
4. **Content, after verification.** Invoke `content-maker` (point it at a
   versioned doc explicitly — its own source-of-truth list won't know about
   `-v2` on its own). Decide first whether this case even needs an `alert`:
   only when the bug is a discrete flagged moment, not when a plain metric
   swing already says it all.

## Conventions

- **Naming:** `is<CaseKeyPascalCase>On` everywhere (`isLayoutShiftOn`,
  `isRaceConditionOn`) — never `isXBad`/`isXGood`/`isXUnstable`.
- **Isolation:** bad/good logic lives in separate, named, one-line-commented
  units, not inline branches — `runGoodPath`/`runBadPath` in
  `hooks/useInventorySearch.ts` (same-file functions),
  `useStableCollapsed`/`useUnstableCollapsed` in
  `hooks/useSidebarCollapsed.ts` (separate hooks + stores), and
  `DashboardContent`/`DashboardContentUnoptimized` in
  `components/dashboard/` (separate page-level components, Case 5) are the
  reference shapes. The outer function/page keeps exactly one
  `isXOn ? bad : good` point — one branch, and at that single point it must
  be obvious at a glance which side is bad and which is good (name them
  accordingly; don't make a reader diff the two to find out).
- **The deletion test:** at any point, could you delete the simulator —
  every toggle, every `isXOn` branch, every bad-path file — and be left with
  a clean, realistic admin app running the good code, no residue? If not,
  the split is wrong: bad-path logic leaked into a shared/production file,
  or the good path quietly depends on something toggle-specific. Use this to
  decide where new code goes, not just to check it after.
