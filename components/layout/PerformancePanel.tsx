"use client";

// Floating widget in the corner of the screen
// Desktop: full panel; Mobile: compact dot indicators, expands on tap
// Displays: LCP, CLS, INP, DOM element count, CPU compute indicator
export default function PerformancePanel() {
  return (
    <aside className="fixed bottom-4 right-4 z-50 rounded-xl border border-brand-border bg-brand-bg p-3 text-xs text-brand-text shadow-xl">
      <p className="mb-2 font-semibold text-brand-accent">Performance</p>
      <dl className="space-y-1">
        <div className="flex justify-between gap-6"><dt>LCP</dt><dd>—</dd></div>
        <div className="flex justify-between gap-6"><dt>CLS</dt><dd>—</dd></div>
        <div className="flex justify-between gap-6"><dt>INP</dt><dd>—</dd></div>
        <div className="flex justify-between gap-6"><dt>DOM</dt><dd>—</dd></div>
        <div className="flex justify-between gap-6"><dt>CPU</dt><dd>—</dd></div>
      </dl>
    </aside>
  );
}
