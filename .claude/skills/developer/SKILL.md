---
name: developer-skill
description: use this skill to write code on javascript, typescript.
---

# Style Guide

## Naming

- No single-letter vars: `sum, order` not `s, o`; `ordersCount` not `N`; `daySlotIdx` not `ptr`
- Exception: `(_, i)` in `Array.from` is fine
- Functions need a verb prefix: `get`, `build`, `derive`, `set` — never noun-only (`simParams`, `config`)
- Boolean vars should be prefixed with `is`, `has`, `should` (e.g., `isLoading`, `hasError`, `shouldRefetch`)

## Code Quality & Performance Rules (Best Practices)

- **Algorithmic Efficiency First:** Always implement solutions with the optimal time and space complexity (Big O). Avoid nested loops ($O(N^2)$) where hash maps or two-pointer approaches can achieve linear time ($O(N)$).
- **KISS & DRY Principles:** Keep It Simple, Stupid. Do not over-engineer solutions with excessive abstractions or premature optimization unless explicitly requested. Don't Repeat Yourself — extract reusable logic into atomic, pure functions.
