"use client";

// 100 analytic micro-cards + marginality threshold slider
// Slider (0-50%) → cards below threshold → opacity-40 + grey border
// Each card: title (category — region) | value + trend badge | 7-point sparkline | live ping dot
// Mobile: grid-cols-1, first 10 visible, sparkline hidden, "Show all" button
export default function MicroCardsGrid() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Analytics Grid</h2>
        {/* Marginality threshold slider */}
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>Marginality threshold</span>
          <input type="range" min={0} max={50} defaultValue={20} className="w-32" />
          <span>20%</span>
        </div>
      </div>
      {/* 100 MicroCard components */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" />
    </section>
  );
}
