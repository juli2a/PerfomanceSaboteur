"use client";

import { useInventorySearchStore } from "@/store/inventory-search";
import { getSimulatorCase } from "@/lib/simulator-toggles";

// Floating widget in the corner of the screen
// Desktop: full panel; Mobile: compact dot indicators, expands on tap
// Displays: LCP, CLS, INP, DOM element count, CPU compute indicator
// Case-specific alerts (e.g. Case 4's race condition) surface here too —
// the other cases will add their own conditional lines the same way.
export default function PerformancePanel() {
  const isStale = useInventorySearchStore((state) => state.isStale);
  const raceConditionAlert = getSimulatorCase("raceCondition").alert;

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
      {isStale && (
        <p className="mt-2 max-w-50 border-t border-brand-border pt-2 font-medium text-alert">
          {raceConditionAlert}
        </p>
      )}
    </aside>
  );
}
