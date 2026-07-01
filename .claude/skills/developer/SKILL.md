---
name: developer-skill
description: use this skill to write code on javascript, typescript.
---

# Style Guide

## Naming

- No single-letter vars: `sum, order` not `s, o`; `ordersCount` not `N`; `daySlotIdx` not `ptr`
- Functions need a verb prefix: `get`, `build`, `derive`, `set` — never noun-only (`simParams`, `config`)
- Boolean vars should be prefixed with `is`, `has`, `should` (e.g., `isLoading`, `hasError`, `shouldRefetch`)

## Code Quality & Performance Rules (Best Practices)

- **Algorithmic Efficiency First:** Always implement solutions with the optimal time and space complexity (Big O). Avoid nested loops ($O(N^2)$) where hash maps or two-pointer approaches can achieve linear time ($O(N)$).
- **KISS & DRY Principles:** Keep It Simple, Stupid. Do not over-engineer solutions with excessive abstractions or premature optimization unless explicitly requested. Don't Repeat Yourself — extract reusable logic into atomic, pure functions.
- **Semantic and Accessible HTML:** Use best practices for semantic HTML and accessibility (ARIA roles, labels, keyboard navigation). Avoid non-semantic elements like `<div>` or `<span>` for interactive components.

---

## Style and Component Principles

- Design files `design/lumen.jsx`, `design/lumen-mobile.jsx` and `design/Lumen Signal.html` are the source of truth for visuals. If code intentionally diverges from the design, keep the code, not the design.
- A visually distinct element in the design is a separate component in code.
- Each component has a single responsibility: if a component mixes generic interaction/mechanics (e.g. scroll/carousel behavior, open/close state) with domain-specific content (e.g. product data, business copy), split them.
- Shared logic (navigation, tokens, utilities) lives in one place and is imported, never duplicated.
- **Avoid DOM Duplication:** Never duplicate HTML elements to show or hide them across different screen sizes if the layout changes can be controlled entirely via CSS. Don't render both variants and hide one with `hidden lg:flex` / `lg:hidden` — use `useIsMobile()` and render only the one that's needed (see `ProductTable.tsx`).
- No static inline styles (`style={{}}`). Inline styles are only justified when the value depends on state or props at runtime.
- **Pixel rounding:** Round non-integer design values **up** to whole px. Exception: keep fractions where the size is small and the difference is visually meaningful (e.g. `1.5px`, `2.5px`).
- **Style hygiene:** Remove no-op declarations. Prefer inheritance over duplication — move shared styles to the parent. Minimise parent→child overrides: fix the parent or remove the child override, not both.
- **Mobile-first approach**.
- **Integer `calc()`:** Every `calc()` must resolve to a whole px (unless the value is flexible). Use fixed values or exact multipliers; avoid coefficients like `× 1.33` or `× 1.67` that produce fractional results.
- **Component style placement:** Styles shared across all usages → component root. Variant-specific → variant block. Usage-site additions should be rare and truly context-specific.
- Complex CSS values (gradients, multi-layer shadows, backdrop-filter) go into a named CSS class, not written as a Tailwind arbitrary value.
- Use spacing-scale utilities (`p-4`, `gap-2`) for layout and composition. Use arbitrary pixel values (`h-[17px]`, `w-[30px]`, `px-[17px]`) for fixed UI component dimensions that must not drift with spacing config changes.
- **Border-radius:** always use the nearest radius-scale token — never arbitrary values, if equidistant, round up.
- **Before building any ui component:** read the design files, then tell the user where this component appears in the design and list all its visual variations. Wait for confirmation before writing any code.

## CSS Value Checklist

Run this mentally before writing **every** numeric CSS value:

- [ ] **Integer?** — if not, round up to whole px. Exception only for values under ~3px where the fraction is visually significant (e.g. `1.5px`).
- [ ] **Token exists?** — use the token, not a hardcoded value. If the value repeats and no token exists, request one.
- [ ] **`calc()` result (not a flexible value)** — resolves to a whole px? If not, use a fixed value or an exact multiplier.
- [ ] **Border-radius** — using the nearest scale token, not an arbitrary value?

## External Tool Suggestions

When a linter, TypeScript, or IDE diagnostic suggests a change, evaluate semantic correctness first — don't apply automatically. Technical equivalence (same px value, same type) is not sufficient justification. If unclear — ask instead of acting.

## CSS Design Tokens

`app/styles/tokens.css` has 4 layers. Components only consume layers 1–2 (shadcn semantic + Lumen extended) for product UI, and layer 3 (`brand-*`) for simulator shell. Never reference layer 0 primitives (`--_green`, `--_sim-accent`, etc.) in components. Use tokens if they exist; if not, if value is repeated often, request a new token instead of hardcoding a value.
