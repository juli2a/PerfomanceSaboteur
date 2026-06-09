"use client";

// Main sales chart with Day / Week / Month tab switcher
// Mobile: chart container captures touch events → blocks page scroll (intentional demo behaviour)
export default function SalesChart() {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Sales</h2>
        {/* Day / Week / Month tabs */}
        <div className="flex gap-1 rounded-lg border border-zinc-700 p-0.5 text-xs">
          <button className="rounded px-2 py-1 text-zinc-300">Day</button>
          <button className="rounded px-2 py-1 text-zinc-300">Week</button>
          <button className="rounded px-2 py-1 text-zinc-300">Month</button>
        </div>
      </div>
      {/* recharts LineChart / BarChart goes here */}
      <div className="h-48 rounded bg-zinc-800" />
    </section>
  );
}
