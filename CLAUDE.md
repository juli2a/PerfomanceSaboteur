@AGENTS.md

# PerfSaboteur — B2B Merchant Analytics

## Project goal

An interactive educational demo that makes the consequences of frontend anti-patterns **visible and measurable in real time**. Built as a realistic-looking B2B analytics dashboard (2 pages), it exposes a control panel of toggles — each one injects a specific, well-known anti-pattern into the live UI. The viewer instantly sees the degradation: Core Web Vitals drop, re-render indicators flash, the interface lags or freezes.

The purpose is not to build a product — it is to make a convincing argument: _"this is exactly what happens in production when you skip the best practice."_

---

## Stack

| Layer          | Choice                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router, TypeScript)                                                          |
| Styles / UI    | Tailwind CSS v4 + shadcn/ui (dark theme by default)                                          |
| Charts         | recharts / shadcn/charts                                                                     |
| State          | Zustand (primary) + React Context (for comparison demos)                                     |
| Metrics        | `web-vitals` — official Google package, LCP / CLS / INP                                      |
| Data           | DummyJSON (real HTTP calls, no local mocks)                                                  |
| Icons          | `lucide-react` — system icon set                                                             |
| Class utils    | `clsx` + `tailwind-merge` — dynamic Tailwind class management (required for Flash on Update) |
| Virtualisation | `@tanstack/react-virtual` — list virtualisation for the 2000+ row inventory table            |

---

## Pages

1. **Dashboard** — key KPIs, revenue chart, top-products table, order stats.
2. **Products / Catalogue** — filterable product grid with details.

---

## The simulator shell

The floating header contains **anti-pattern toggles**. Each toggle injects a specific perf problem into the live app:

- Examples: unnecessary global re-renders, unoptimized images, blocking scripts, layout-shift triggers, memory leaks, over-fetching without caching, Context thrashing vs Zustand.
- Toggles can be combined freely — users see the compounded effect.
- A **floating metrics panel** (bottom corner) shows real-time web-vitals readings.
- A **Flash-on-Update** overlay highlights component boundaries when they re-render.

---

## Dev commands

```
pnpm dev      # start dev server
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # ESLint
```

---

## Key conventions

- App Router only — no `pages/` directory.
- All new shadcn components go in `components/ui/`.
- Simulator toggle state lives in a Zustand store (`store/simulator.ts`) with `persist` middleware → localStorage. This ensures toggle state survives page refreshes (critical for Case 5).
- Case 5 (Waterfall) toggle additionally writes a cookie `waterfall=on|off` and calls `router.refresh()` so the Server Component can read it server-side.
- Web-vitals reporting wired in a client component mounted in the root layout.
- Data fetching uses Next.js `fetch` with explicit cache/revalidate options.
- Dark theme is the only theme — no light-mode toggle needed.
