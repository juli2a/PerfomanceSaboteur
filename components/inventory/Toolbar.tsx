"use client";

// Desktop: search input + category dropdown + Bulk Actions button
// Mobile: full-width search + filter icon (collapsed) + Bulk Actions hidden
export default function Toolbar() {
  return (
    <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
      <input
        type="search"
        placeholder="Search products…"
        className="flex-1 rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
      {/* Category dropdown — desktop */}
      <select className="hidden rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-sm text-text-2 lg:block">
        <option>All categories</option>
      </select>
      {/* Bulk Actions — desktop */}
      <button className="hidden rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 lg:block">
        Bulk Actions
      </button>
    </div>
  );
}
