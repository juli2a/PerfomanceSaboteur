"use client";

// Desktop: search input + category dropdown + Bulk Actions button
// Mobile: full-width search + filter icon (collapsed) + Bulk Actions hidden
export default function Toolbar() {
  return (
    <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
      <input
        type="search"
        placeholder="Search products…"
        className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500"
      />
      {/* Category dropdown — desktop */}
      <select className="hidden rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 lg:block">
        <option>All categories</option>
      </select>
      {/* Bulk Actions — desktop */}
      <button className="hidden rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 lg:block">
        Bulk Actions
      </button>
    </div>
  );
}
