// Single KPI card with label, value, and optional sparkline
// Props: label, value, sparklineData?
export default function KpiCard() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs text-zinc-500">Label</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-100">—</p>
      {/* Sparkline placeholder */}
    </div>
  );
}
