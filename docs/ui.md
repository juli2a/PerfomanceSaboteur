# UI Structure & Functionality

## Global Layout

### Header — Desktop

- Fixed top bar.
- **Left:** the system name — **PerfSaboteur**.
- **Center:** the toggle block (Control Panel), split into three zones:
  - **Network**
  - **Rendering**
  - **Computing**
- **Right:** a text block — "Updated [time]".

### Header & Drawer — Mobile

- The header holds two separate buttons:
  - A hamburger button — opens a left slide-out drawer with navigation (Dashboard / Inventory Control).
  - A **"Controls"** button (with a colored dot indicating an active anti-pattern) — opens the Bottom Sheet with the toggles.
- The Bottom Sheet is adapted for thumb-driven switching.

### Sidebar — Desktop

- Left vertical navigation menu.
- Two links:
  - **Dashboard**
  - **Inventory Control**

### Navigation — Mobile

- There's no separate bottom navigation bar: the same navigation (`Dashboard`/`Inventory Control`) as the desktop Sidebar opens via a left slide-out drawer, triggered by the hamburger button in the header.

### Floating Performance Panel

- A widget in the corner of the screen.
- **Mobile:** a compact bar with colored indicator dots; expands on tap.
- **Desktop:** the full widget.
- Shows:
  - **LCP / CLS / INP** — circular gauges, not a linear scale; the fill asymptotically approaches 100% but never reaches it, so movement is always visible even at very poor values. Fill formula, thresholds, and color coding — `lib/utils/gauge.ts` (`getGaugePercent`); ring rendering — `MetricGauge.tsx`.
  - **DOM Elements** — a plain counter (no gauge, since there's no official threshold). Needed for Case 3 (Heavy Mounting). Recomputed on (1) Case 3's toggle changing, (2) navigating to the Inventory page; other triggers as needed.
  - **Blocking Time** (formerly "CPU") — a plain counter in ms (via the Long Tasks API / `PerformanceObserver` type `"longtask"`), **not** a CPU percentage.
  - **Interaction Latency** — a plain counter in ms (rated against the official INP thresholds). Unlike the **INP** ring above, it holds only the latest sample, so it rises and falls in real time — see the comments in `useInteractionLatencyReporter.ts` for the data source details and why it duplicates INP.
- **Desktop:** the panel is `position: fixed` in a corner, doesn't overlap page content (content reserves padding for it).
- **Mobile:** the dock is forced open and won't collapse while the simulator controls panel is open (`dockOpen = vitalsExpanded || controlsOpen`).

### Simulator Alerts

- Case-specific warnings — separate cards that **overlay content** and stack above the Performance Panel (desktop) / above the dock (mobile). Real titles: **"Race Condition"** (Case 4), **"Hydration Mismatch"** (Case 6), **"Context Re-render Storm"** (Case 7), **"Memo Overhead"** (Case 8). Case 5 (Waterfall) deliberately has no alert — demonstrated through LCP alone.
- Close **only** via (1) an explicit user dismiss click, or (2) the case's underlying condition resolving on its own (e.g. `isStale` flipping back to `false`).
- **Per-instance dismiss:** each firing of a case's trigger has its own instance id. A manually dismissed alert doesn't reappear for that same instance, but **does reappear** the moment the trigger fires again (a new instance) — even if the earlier one was dismissed by hand.

---

## Page 1: Dashboard (Analytics)

### KPI Widgets Grid

- **Desktop:** four cards in a row.
- **Mobile:** a grid/stack, adapted via Tailwind breakpoints.
- Cards (all four — with an embedded line Sparkline chart):
  1. **Total Revenue**
  2. **Orders**
  3. **Active Clients**
  4. **Avg Check**

### Main sales chart

- A wide block with a line/canvas chart (`recharts`, client-only).
- A top switcher: **Day / Week / Month** tabs.

### Analytics row (two blocks side by side)

Below the main chart — two blocks in a row (desktop) or stacked (mobile).

#### Category Analytics

- A list of **8 category rows** (top 8 by stock value).
- A separate request: `GET /products/categories` + its own fetch of `/products?...&select=id,category,price,stock` for the aggregation.
- Each row:
  - Category name
  - A progress bar of the financial share (`sum(price × stock)` of the category / grand total)

#### Top Customers

- A compact card listing the 5 most active customers.
- Data from `GET /users?limit=N` (N — the daily user pool, 90-120).
- Each row:
  - Avatar (from the `image` field) or initials as a fallback
  - Full name (`firstName lastName`)
  - Lifetime Value: `Math.round(user.id * 1250 + user.age * 300)`

### KPI Micro-cards Grid

- Location: below the main sales chart, full width.
- Above the grid — a horizontal **"Min GM%"** slider (0-40). Changes `threshold` on every move → all 100 cards get the new value, but only the handful of cards whose threshold was just crossed actually recompute their look (the rest — depending on Case 8's toggle — either skip the re-render thanks to `React.memo`, or redo everything pointlessly too, see `docs/case8.md`).
- **Desktop:** a grid, 4-5 cards per row. **Mobile:** `grid-cols-1` — the same full set of cards, nothing hidden or truncated.
- **Micro-card anatomy** (`MicroCardView.tsx`):
  - **Top row:** the product title (truncated) + a `GM% {marginality}` badge
  - **Center:** the financial value (currentValue) + a star rating
  - **Sparkline** to the right of the value
  - **Clicking the card** opens a Popover with the full title, SKU, and a copy-SKU button
  - Wrapped in `FlashOnUpdate` — briefly flashes on re-render
- **Threshold visual effect:** cards with `marginality < threshold` → dimmed (`disabled` styling); the rest — with an accented border.

---

## Page 2: Inventory Control

### Toolbar

- **Desktop:**
  - Search input
  - Category filter dropdown
  - **"Bulk Actions"** button (picking the new status happens inside a Popover after the click)
- **Mobile:**
  - Full-width search input
  - Filter collapsed into a funnel icon
  - Bulk Actions hidden

### Data Table — Desktop

- A high-density table.
- Columns:
  1. Selection checkbox
  2. Thumbnail (product photo)
  3. Name + SKU
  4. Category
  5. Price
  6. Stock
  7. Status badge: `In Stock` / `To Order` / `Ordered` / `In Transit` / `Out of Stock`
- On row re-render — the **Flash on Update** effect (a brief outline highlight).

### Product Cards List — Mobile

- The table transforms into a vertical stack of cards (`ProductCardView.tsx`).
- Card structure:
  - **Top row:** a square product image on the left, name + SKU in the middle, price on the right
  - **Second row:** category + stock on hand
  - **Bottom row:** the logistic status badge + a "Change" button (opens the status-change drawer)
