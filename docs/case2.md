# Case 2: Layout Shift From Client-Only Sidebar State

**Category:** Rendering / Visual stability
**Toggle:** Rendering → Layout Shift
**Metric:** CLS

## Summary

The left sidebar's collapsed/expanded state is a personal user preference that should "remember" itself across visits. If it's stored only in `localStorage`, the server has no way to know it and always renders the sidebar expanded; the client corrects it after mount — and thanks to a smooth CSS width transition it looks unnoticeable to the eye, but instrumentally it's still a layout shift after the page has loaded, i.e. CLS.

---

## Good code (Toggle OFF)

**Implementation:**
```ts
// app/(shell)/layout.tsx (Server Component)
const cookieStore = await cookies();
const initialCollapsed = cookieStore.get("sidebarCollapsed")?.value === "on";
// ...passed as a prop into <Header> and <Sidebar>

// store/sidebar.ts — the store itself, no side effects
export const useSidebarStore = create<SidebarState>()((set) => ({
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed }),
}));

// hooks/useSidebarCollapsed.ts — useSyncExternalStore with initialCollapsed
// as the server snapshot, so the first client render always matches SSR.
// The cookie write (and the parallel write into the bad store below) lives
// right here, in the setCollapsed wrapper the hook returns — not inside the
// store itself.
```
> The state is duplicated into a cookie visible to both the server (`next/headers`) and the client. Both independently compute the same value from the same source — there's no divergence, so there's nothing to correct after mount.

**UI behavior:**
- The sidebar (and the logo zone in Header) renders at the correct width immediately, from the first paint.
- Reloading the page with the sidebar collapsed produces no jump at all.
- CLS doesn't rise from this element.

---

## Bad code (Toggle ON)

**Implementation:**
```ts
// store/sidebar-unstable.ts
export const useSidebarStoreUnstable = create<SidebarState>()(
  persist(
    (set) => ({ collapsed: false, setCollapsed: (collapsed) => set({ collapsed }) }),
    { name: "sidebar-collapsed-unstable" },
  ),
);
```
> `localStorage` only exists in the browser. The server always renders `collapsed: false`. `zustand/persist` actually rehydrates from `localStorage` **synchronously, at store-creation time** (not via a later `setState` — see the "Prod/local divergence" section below for the full story). The visible "later" correction actually comes from `useSyncExternalStore` itself: the first client pass renders `getServerSnapshot()` (to match SSR), and only after mounting does it pick up the store's already-hydrated value — an ordinary re-render, no React warnings, which is why the `transition-[width]` animation plays smoothly.

**UI behavior:**
- If the sidebar was collapsed before, on a new visit it briefly shows expanded, then smoothly collapses.
- It looks like "just an animation" from the outside, but CLS still records the pixel shift that happened after the initial render.

**Reproduction scenario (atypical for the simulator's cases — the order of actions matters):**

Clicking the collapse button always writes the value into both channels at once (the cookie and the bad store's `localStorage` key, `hooks/useSidebarCollapsed.ts`) — regardless of which mode is currently active. This is deliberate: the toggle demonstrates only a difference in the reading MECHANISM (cookie vs localStorage-only), not a loss of the user's actual choice when switching.

1. Collapse the sidebar with the arrow above the nav icons (toggle still off — the sidebar persists correctly, no jump).
2. Turn on the "Layout Shift" toggle — the click itself reloads the page.
3. On that same reload you see a brief jump: the sidebar shows expanded for a moment, then smoothly collapses back.
4. For control: turn the toggle off and reload the page (F5) — no more jump, the sidebar is collapsed immediately.

The reverse order (toggle first, then collapsing) technically demonstrates the bug too, but requires an extra manual F5 after collapsing, which isn't obvious — so the UI/tip describes the order above.

---

## Analysis

**Demonstration success probability: 8/10** — the effect is real and always reproducible, but needs one extra user step (collapse the sidebar first), unlike other cases where just flipping the toggle is enough.

**Implementation:** a purely client-side difference in where persistence comes from (cookie vs `localStorage`); no artificial delays or fetches needed — the hydration mechanism itself produces the effect naturally.

**UI/case fit:** ✅ the sidebar is a permanent header element, present on every page.

**Side effect:** since the toggle no longer controls the revenue chart, `SalesChart` becomes a permanently "good" implementation (fixed height), and the Dashboard returns to its natural order — banner on top, chart below it.

---

## Mobile version

The same CLS, but for a different element: instead of the sidebar's width — the expanded state of the bottom metrics panel (`PerformancePanelMobile`). The mechanism is identical to the desktop half of the case above (cookie vs `localStorage`-only hydration mismatch) — just applied to `expanded` instead of `collapsed`.

### Done and permanent (independent of the toggle)

Investigation found that the app shell (`body: h-full overflow-hidden`, `main: overflow-auto`) never let the document actually scroll on mobile — the inner `<main>` caught all the scrolling. Mobile browsers only hide the address bar in response to scrolling the **document**, so without a fix the case physically couldn't reproduce on a device. This turned out to also be a real bug on the side — pull-to-refresh didn't work.

- `app/layout.tsx`: `body` — `overflow-hidden` → `overflow-auto lg:overflow-hidden`.
- `app/(shell)/layout.tsx`: `main` lost `overflow-auto` on mobile; the outer wrapper (the `Header` container) — `h-full` → `min-h-dvh ... lg:h-full` (otherwise the `sticky` header stopped holding after one screen's worth of scroll — its "ceiling" was bounded by the container's height, not the scroll length).
- `app/(shell)/inventory/page.tsx`: the page now holds its own `h-[calc(100dvh-60px)] lg:h-full` instead of inheriting `h-full` from `main` — Inventory (`react-virtual`) needs a defined ancestor height, which `main` no longer guarantees on mobile. Verified this doesn't break either the normal render or the "flat" no-virtualization mode (Case 3 `heavyMounting`, Case 7 `contextOverhead`) — both render inside the same self-contained `scrollRef` (`components/inventory/ProductTable.tsx:208-214`).
- `PerformancePanelMobile` is now genuinely `position: fixed` (previously it just sat at the bottom because the shell never scrolled) — `fixed inset-x-0 bottom-0` remains correct anchoring regardless of which persistence source currently drives the `expanded` state (see below).

### Rejected: `vh`/`dvh` as the case's mechanism

The first attempt anchored the panel via `h-screen` (a static `100vh`) instead of `bottom: 0`. **Confirmed on a real device: CLS doesn't rise from this at all.** Reason: browsers deliberately made `vh` **static** (equal to the largest, "collapsed" height) specifically so it no longer recalculates during scroll — that was itself the fix for an old "jumping" bug. If a rendered element's box doesn't change between frames, the Layout Instability API simply sees nothing, and there's nothing for CLS to count. The bug is real (the panel hides under the browser chrome while the address bar is showing), but it's occlusion, not layout shift.

A second idea — `dvh` in normal document flow (the banner + KPI row stretched to full screen height, "cleverly" sized with a mix of `dvh`/`vh`/`svh` units) — was rejected at the analysis stage, without reaching code: the Layout Instability API spec explicitly defines "excluding input" as "any event that directly changes the viewport size" — i.e. exactly the address bar hiding/appearing. Whatever shift `dvh` produces in response to that event falls into the exclusion window and never counts toward CLS, no matter how it's arranged. Same conclusion as `vh` above — just a different reason (input exclusion rather than unit staticness): if the problem only reproduces through scrolling, it won't affect CLS.

Both variants were removed from the code entirely, with no dead branches left behind (`PanelAnchorUnstable` was deleted along with the `PanelAnchor.tsx` file, anchoring styles moved directly into `PerformancePanelMobile.tsx`) — the repo's code convention doesn't leave "residue" from rejected variants; the history lives only here, in the doc.

### A nuance the desktop half doesn't have: `PerformancePanel` never renders server-side

`PerformancePanel` determines mobile/desktop via `isMobile` from `MediaContext` (`useMediaQuery` — a pure client-side `matchMedia`, no server-side UA detection) and returns `null` while `isMobile === undefined` (`components/simulator/performance-panel/PerformancePanel.tsx`). This means: unlike `Header`/`Sidebar`, which are always present in the real SSR HTML (and just get hidden by CSS classes at the right breakpoints), **the entire `PerformancePanel` — both variants — is absent from the raw SSR HTML and mounts purely client-side**, only after `MediaContext` resolves. Confirmed via `curl`: `sim-panel-mobile` never appears in any server response, with any cookie combination.

Consequence for the mechanism: the sidebar's `useSyncExternalStore` + `getServerSnapshot` trick only works during real hydration of existing SSR DOM. Since no such DOM ever exists for this subtree, React mounts it as an ordinary client mount — and immediately reads the store's current value (`false` by default), not `initialExpanded`. A first attempt to fix this locally (seeding the store synchronously during the first render, without SSR) removed the jump for the "good" path — but also for the "bad" one: on a live device the panel appeared immediately in the correct position, with no jump at all. Reason: `PerformancePanelMobile` doesn't mount right away (it waits on `isMobile`), and `store/panel-expanded-unstable.ts`'s rehydration from `localStorage` finishes before that point, so the first render already sees the correct value. A dead end of the same class as `vh`/`dvh` above — just a different cause.

**Final solution:** one more cookie, `isMobile`, mirroring `MediaContext`'s value (written in `context/MediaContext.tsx`, in the same place `isMobile` is computed — one effect for the whole app). `app/(shell)/layout.tsx` reads it server-side and passes it as a prop (`initialIsMobile`) into `PerformancePanel`, where it acts as a fallback:
```ts
const isMobile = useContext(MediaContext) ?? initialIsMobile;
```
This isn't a change to `MediaContext`/`useMediaQuery` — they stay unchanged, and every other consumer of `isMobile` (`ProductTable.tsx` — Case 3 `heavyMounting`, Case 7 `contextOverhead`; `CategoryFilter.tsx`) still waits on `matchMedia` as before. The change is only in `PerformancePanel`: once the `isMobile` cookie already exists (any repeat visit), the component renders the correct branch immediately on the server — and **genuinely takes part in hydration**, instead of mounting "from scratch" client-side. This restores exact parity with the sidebar's mechanism: `useStableExpanded` was reverted to `useSyncExternalStore` + an effect-based reseed (like `hooks/useSidebarCollapsed.ts`), instead of a synchronous seed during render — now that `PerformancePanelMobile` genuinely renders server-side, such a synchronous write would mutate the shared module-level Zustand store across concurrent requests.

### Good code (Toggle OFF)

**Implementation:**
```ts
// app/(shell)/layout.tsx (Server Component)
const initialExpanded = isLayoutShiftOn
  ? false
  : cookieStore.get("panelExpanded")?.value === "on";
// ...passed as a prop into <PerformancePanel> → <PerformancePanelMobile>

// store/panel-expanded.ts
export const usePanelExpandedStore = create<PanelExpandedState>()((set) => ({
  expanded: false,
  setExpanded: (expanded) => set({ expanded }),
}));

// hooks/usePanelExpanded.ts — useSyncExternalStore with initialExpanded
// as the server snapshot, so the first client render always matches SSR
// (only works thanks to the isMobile cookie above — see the subsection
// above this one).
function useStableExpanded(initialExpanded: boolean) {
  const expanded = useSyncExternalStore(
    usePanelExpandedStore.subscribe,
    () => usePanelExpandedStore.getState().expanded,
    () => initialExpanded,
  );
  useEffect(() => {
    usePanelExpandedStore.setState({ expanded: initialExpanded });
  }, [initialExpanded]);
  return expanded;
}
```
> The same principle as the sidebar above: the state is duplicated into a cookie visible to both the server and the client — there's no divergence, so there's nothing to correct after mount.

**UI behavior:**
- The panel renders at the correct height (50px collapsed / 174px expanded) immediately, from the first paint.
- Reloading the page with the panel expanded produces no jump at all.
- CLS doesn't rise from this element.

### Bad code (Toggle ON)

**Implementation:**
```ts
// store/panel-expanded-unstable.ts
export const usePanelExpandedStoreUnstable = create<PanelExpandedState>()(
  persist(
    (set) => ({ expanded: false, setExpanded: (expanded) => set({ expanded }) }),
    { name: "panel-expanded-unstable" },
  ),
);
```
> `localStorage` only exists in the browser. The server always renders `expanded: false`. `zustand/persist` actually rehydrates from `localStorage` **synchronously, at store-creation time** (not via a later `setState` — see the "Prod/local divergence" section below for the full story); the visible "later" correction actually comes from `useSyncExternalStore` itself (the first client pass renders `getServerSnapshot()`, and only after mounting does it pick up the already-hydrated value) — an ordinary re-render, no React warnings. The panel is fixed to the bottom (`fixed; bottom: 0`), so the height growing (50px → 174px) physically shifts its top edge upward between two frames — a direct, unconditional rect shift of a real element, unrelated to scroll or viewport resize (unlike the rejected `dvh` variant above), so none of CLS's exclusions apply here.

**UI behavior:**
- If the panel was expanded before, on a new visit it briefly shows collapsed (50px), then expands (174px).
- Confirmed on a live device: a stable CLS increase of **+0.07** on every such reload — consistent with the calculated range (≈0.03-0.06 on a typical mobile viewport). It doesn't push CLS into the yellow zone ("Needs improvement", >0.1) on its own, but the increase is visible and reliably reproducible — enough for the demo.

**Reproduction scenario (same order of actions as the sidebar):**

Clicking the expand button always writes the value into both channels at once (the cookie and the bad store's `localStorage` key) — regardless of which mode is currently active.

1. Expand the panel with the button (toggle still off — the state persists correctly, no jump).
2. Turn on the "Layout Shift" toggle — the click itself reloads the page.
3. On that same reload you see a brief jump: the panel shows collapsed for a moment, then expands back.
4. For control: turn the toggle off and reload the page (F5) — no more jump, the panel is in the correct state immediately.

The reverse order (toggle first, then expanding) technically demonstrates the bug too, but requires an extra manual F5 after expanding — so the UI/tip describes the order above.

---

## Analysis (mobile version)

The same conclusion as the desktop half of the case: the mechanism is identical, the effect is real and reproducible, the same one extra user step (expand the panel first). The only difference is which element moves — the sidebar's width there, the bottom panel's height here.

**Confirmed on a real device** (2026-07-10): a stable CLS increase of +0.07 on every reproduction. Left as-is — it doesn't cross the "Needs improvement" threshold, but that's enough to demonstrate the effect.

### Prod/local divergence (2026-07-15) and fix

On Vercel production, the same repro yielded CLS ≈0 on most attempts (the panel's movement was still visible to the naked eye), while locally (`next dev`, and even a production build via `next start`) the shift registered reliably every time. With Case 5 (Waterfall) also turned on, CLS on prod rose **every time** — this coincidence is what pointed to the real cause.

`zustand`'s `persist` rehydrates from `localStorage` synchronously, at store-creation time (before the first client render) — not via a later `setState` after mounting, as a comment in `store/panel-expanded-unstable.ts` previously claimed. The visible "later" correction was actually provided by `useSyncExternalStore` itself: the first client pass renders `getServerSnapshot()` to match SSR, and only after mounting does it pick up the store's already-live value — through an internal layout effect, i.e. before paint. The only thing that determined whether the user (and the Layout Instability API) would see the "wrong" frame was whether the browser managed to paint the raw SSR HTML before the hydration JS bundle finished loading and running. On Vercel (CDN, cached static chunks), that bundle usually arrived first — there was no separate "before" frame. With Waterfall turned on, the banner/KPI and panel are guaranteed to arrive in one blocked SSR response after several seconds — so the "before" frame reliably got painted, without exception.

**Fix** (`hooks/usePanelExpanded.ts`): `useUnstableExpanded` now displays `initialExpanded` itself, and only switches to the real `localStorage` value via `setTimeout(..., 150)`. In the case's history, this wasn't a deliberate "hack for the demo" — the same developer who wrote the "bad" path noticed the state-restore animation wasn't playing (the corrected value arrived before the browser had even painted the initial state, so the transition had nothing to start from), and silenced it with a guessed delay instead of tracking down the cause. 150ms has a wide margin over any real hydration-speed difference, which is exactly why this bit of carelessness makes the shift reliably reproducible regardless of platform.
