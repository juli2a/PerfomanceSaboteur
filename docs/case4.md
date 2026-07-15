# Case 4: Network Race Condition in Search

**Category:** Network / Async state management
**Toggle:** Network → Search race condition
**Metric:** Data Freshness

## Summary
Data going stale due to uncontrolled overlap between network responses with different resolution times.

---

## Good code (Toggle OFF)

**Implementation:** `hooks/useInventorySearch.ts`
```ts
function runGoodPath(execute: (signal: AbortSignal) => void): () => void {
  const controller = new AbortController();
  const timer = setTimeout(() => execute(controller.signal), DEBOUNCE_MS); // 300ms
  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}
```
A 300ms debounce on input, plus an `AbortController` that cancels any still-in-flight previous request before the next one starts.

**UI behavior:**
- The table narrows down to results matching the most recently typed word.
- No stale response ever lands — it's cancelled before it can resolve.

---

## Bad code (Toggle ON)

**Implementation:** `hooks/useInventorySearch.ts`
```ts
function runBadPath(execute: () => void): () => void {
  execute();
  return () => {};
}
```
A request fires on every keystroke, with no debounce and no cancellation — whichever response resolves last "wins," regardless of send order.

Server-side (`app/api/inventory-search/route.ts`), an artificial delay is applied, inversely proportional to query length:
```ts
Math.max(200, 1500 - (query.length - 1) * 260) // ms
```
So short queries (typed first) are artificially throttled up to 1500ms, while longer ones speed up toward 200ms.

**UI behavior:**
- The user quickly types "lipstick". The request for "l" or "li" takes longer and resolves last, overwriting the already-correct "lipstick" results.
- The input shows "lipstick", but the table shows results for "l"/"li".
- The panel raises a **"Race Condition"** alert: "Stale response overwrote a newer search result." — and clears it once the response for the actual current query finally arrives.

---

## Analysis

**Demonstration success probability: 9/10**
The artificial delays (up to 1500ms for short queries, down to 200ms for long ones) make the race condition reliably reproducible. The debounce + `AbortController` in the good code reliably fixes it.

**UI/case fit:** ✅ The search input in the Inventory Control Toolbar.

**API:** ✅ Its own Route Handler, `GET /api/inventory-search?q={query}` — it calls DummyJSON itself (`/products?limit=100&select=id,title,sku`) and filters by `q` locally against title/sku, rather than forwarding `q` to DummyJSON's own `/products/search` (which also exists, but additionally matches description/category/brand — unnecessary for this UI). The response is just an array of `ids`, which the client uses to narrow the already-loaded (amplified) table — not a separate result list.

**Nuance:** the search operates over the base 100 DummyJSON products, not the amplified 2000. Not critical for demonstrating the race condition, but search results won't match the table 1:1.
