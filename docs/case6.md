# Case 6: Hydration Mismatch

**Category:** Rendering / SSR architecture
**Toggle:** Rendering → Hydration mismatch
**Metric:** Hydration Status

## Summary
A mismatch between the server-rendered HTML and the initial client element tree during hydration.

---

## Good code (Toggle OFF)

**Implementation:** `hooks/useStableTimestamp.ts`
```ts
export function useStableTimestamp(): string {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  return mounted ? new Date().toLocaleTimeString("en-US") : "...";
}
```
> `useSyncExternalStore`'s `getServerSnapshot` returns `false` for both SSR and the client's very first pass — the server and the client's first render always agree (`"..."`); the real value is only swapped in after mount.

**UI behavior:**
- The developer console stays clean of warnings.
- The header's clock shows "..." until mount, then holds a stable, real time.

---

## Bad code (Toggle ON)

**Implementation:** `components/dashboard/UpdatedAt.tsx`
```tsx
const unstable =
  typeof window === "undefined"
    ? new Date().toLocaleTimeString("en-US", { timeZone: "UTC" })
    : new Date().toLocaleTimeString("en-US");
```
> `new Date().toLocaleTimeString()` called straight in the render body — server and client each compute it independently. The server branch deliberately forces UTC, standing in for what a real deployment gets for free (server in UTC, visitor in their own timezone) — without it, a dev machine running in the same timezone as the "server" might never reproduce the mismatch.

**UI behavior:**
- The header's clock first shows the server's (UTC) reading, then instantly jumps to the client's local time.
- The browser console shows a real React hydration error: `"Hydration failed because the server rendered..."` (dev) or a link to `react.dev/errors/418` (production, minified).
- The panel raises a **real** **"Hydration Mismatch"** alert: "Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client." The alert is caught not by simulation but by a live `window.addEventListener("error", ...)` that watches for this exact React error signature (`components/simulator/performance-panel/SimulatorEffects.tsx`).

---

## Analysis

**Demonstration success probability: 9/10** — a classic, reliable case.
Forcing UTC on the server branch guarantees the mismatch regardless of the developer's machine timezone — without it, the case could silently fail to reproduce locally. The console hydration error will always be visible, in any environment.

**UI/case fit:** ✅ Perfect. The header has an "Updated [Time]" field — exactly the element that carries the hydration error.

**API:** ✅ No API needed.

**Toggle mechanism:** `hydrationMismatch` is part of `SSR_COOKIE_CASES` — flipping the toggle writes a cookie and calls `window.location.reload()` (`hooks/useToggleCase.ts`), so the effect reproduces right after the click, with no manual reload needed from the user.
