# Case 7: Giant Context VS Zustand Selector

**Category:** Rendering / State Management
**Toggle:** Rendering → Context Overhead
**Metric:** Rerendered Nodes, FPS

## Summary
Forced re-render of hundreds of unmodified components caused by a monolithic Context instead of subscriptions to atomic selectors.

---

## Good code (Toggle OFF)

**Implementation:** `components/inventory/ProductTableRow.tsx`
```ts
const isSelected = useInventorySelectionStore((state) =>
  state.selected.has(product.id),
);
```
> Selection is stored as a `Map<number, SelectedProduct>` in a Zustand store (`store/inventory-selection.ts`); the row subscribes only to whether its own id is present.

**UI behavior:**
- Clicking a checkbox — instant response.
- Flash on Update highlights **only one row**.
- FPS holds at 60.

---

## Bad code (Toggle ON)

**Implementation:** `context/TableSelectionContext.tsx` + `components/inventory/ProductTableRowUnoptimized.tsx`
```ts
// TableSelectionContext.tsx — every mutation builds a new Map
const toggleRow = (product) =>
  setSelected((selected) => {
    const next = new Map(selected);
    next.has(product.id) ? next.delete(product.id) : next.set(product.id, product);
    return next;
  });

// ProductTableRowUnoptimized.tsx — every row reads the same context
const { selected, toggleRow } = useContext(TableSelectionContext)!;
```
> The Provider hands out a new value object on every change → every context consumer re-renders, not just the row whose checkbox changed.

**UI behavior:**
- Clicking one checkbox → the entire table (200+ rows) fully re-renders.
- Every row flashes red at once (Flash on Update).
- Scroll micro-lag, visual instability.
- The panel raises a **"Context Re-render Storm"** alert: "Rerendered Nodes on Action: {N}" — where N is a live re-render count for this specific click (from the `FlashOnUpdate` counter), not a fixed number.

---

## Analysis

**Demonstration success probability: 9/10** — Flash on Update makes the effect vividly visible.

**UI/case fit:** ✅ The checkboxes in the Inventory Control table and Flash on Update are both covered.

**API:** ✅ No API needed. Selection state is purely client-side.

**Important interaction with Case 3:** If Case 3's toggle is in its "good" state (virtualization ON), only ~15-20 rows exist in the DOM. Context only re-renders those — the effect becomes barely noticeable.

**Agreed solution:** automatic switching, with no extra dataset and no manual toggle coordination required from the user.
- When `contextOverhead = ON` — `ProductTable` renders a fixed window of the first 200 products **without virtualization**, regardless of `heavyMounting`'s state. When the toggle is OFF, the table's behavior returns to normal (governed by Case 3).
- With `contextOverhead = ON`, `ProductTableRow` subscribes to the monolithic context instead of the `useInventorySelectionStore` selector — that's the anti-pattern being reproduced.
- This toggle's guide text (`tip.reproduction`/`tip.effect`) honestly explains that during the demo the table temporarily shows a fixed 200 rows without virtualization, so the contrast is visible.

**Rerendered Nodes:** counted via `FlashOnUpdate` (already wraps every row) — the counter resets before the `toggleRow` action, each re-render (not the initial mount) increments it inside a `useEffect`, and the total is published after a ~100ms settle delay. Shown in the Performance Panel as a conditional alert line (the same pattern as Case 4's `raceConditionAlert`), not as a permanent number.

---

## Mobile version

Inventory Control's mobile layout has no checkboxes or bulk selection (a deliberate decision — bulk actions fit touch interfaces poorly), so there's nothing to demonstrate "row selection" on for mobile. Instead of reconstructing checkboxes, Case 7 on mobile reuses an already-existing single action — changing one product's status via `StatusChangeDrawer` (the "Change" button on a product card) — and uses `logisticStatus`, not `selected`, as the shared state.

**Agreed solution (mobile part):**
- A new, isolated Context (`RowStatusContext`, `context/RowStatusContext.tsx`) mirrors the `useInventoryStatusStore` API 1:1 (`statuses` / `setStatuses`) — isolated from the Zustand store the same way `TableSelectionContext` is isolated from `useInventorySelectionStore`: its own state, reset on every toggle flip (the same "adjust state during render" pattern, no `useEffect`).
- `ProductCard` (the mobile product card) is split into shared markup (`ProductCardView`) and a good/bad pair (`ProductCard` — Zustand selector, `ProductCardUnoptimized` — Context), following the same template as `ProductTableRow`/`ProductTableRowUnoptimized`.
- `StatusChangeDrawer` remains the single UI/PATCH flow for both paths — the write destination is now passed in as a prop (`onChangeStatus`) instead of hardcoding a call to the store.
- When `contextOverhead = ON` on mobile — changing one product's status writes to `RowStatusContext` instead of `useInventoryStatusStore`, and every mounted card (all of them visible, since Case 7 already forces a flat, unvirtualized list) re-renders/flashes — the same bug as on desktop, but triggered by a real single mobile action instead of a reconstructed checkbox.
- `useInventoryStatusStore` remains the single source of truth for the status badge on desktop (both `ProductTableRow`/`ProductTableRowUnoptimized` paths keep reading it) — Case 7 doesn't touch that store at all.

---

## Guide text: why desktop and mobile are described separately

Desktop and mobile have a different, honest reason for why the state is shared at all — and the guide (`lib/simulator-cases.ts`, `tip`/`mobileTip`) says so directly, rather than staying silent about the store's role:

- **Desktop (`tip`):** the state genuinely needs to be shared — the row's checkbox and the Toolbar's Bulk Actions panel read/write the same selection at the same time. That's the real product reason a team would reach for Context/Zustand at all, instead of local `useState` in the row.
- **Mobile (`mobileTip`):** shared state here did **not** arise from a product need to share across multiple UI surfaces (each card only cares about its own status) — but from the fake backend (DummyJSON doesn't persist PATCH, so a client-side overlay is needed). The guide text says plainly that this is the same bug on a narrower trigger, without a made-up claim about a mobile cross-component need.

Technically, the split is implemented like this: `ToggleItem.mobileTip?: CaseTip` — an optional override, populated only for `contextOverhead`. `lib/server/case-info.tsx`'s `getCaseTipContent(device)` picks `mobileTip`/`tip` and the matching code example (`lib/case-code/contextOverhead.mobile.{bad,good}.txt` instead of the shared `contextOverhead.{bad,good}.txt`) once, server-side; `app/(shell)/layout.tsx` calls this twice and hands each set to its own, already platform-specific consumer (`CaseDetailPanel` — desktop-only, `MobileControlDrawer` — mobile-only) — with no client-side `isMobile` check inside `CaseTipContent` itself.
