import { useEffect } from "react";

import { useRenderCounterStore } from "@/store/render-counter";
import { useSimPerformanceStore } from "@/store/simulator-performance";
import { useSimControlStore } from "@/store/simulator-control";

const SETTLE_DELAY_MS = 100;

// Called once from SimulatorEffects — watches the render-counter store
// FlashOnUpdate feeds (Case 7, Context Overhead) while it's tracking a
// row-selection click, restarting a 100ms timer on every increment. Once
// the burst settles: publishes the total as "Rerendered Nodes" and flags
// the contextOverhead alert only when more than one row reacted to a
// single click — the good path always settles at 1 and never alerts, the
// bad path settles near the full flat row count and does.
export function useRerenderNodesReporter() {
  const count = useRenderCounterStore((state) => state.count);
  const isTracking = useRenderCounterStore((state) => state.isTracking);
  const stopTracking = useRenderCounterStore((state) => state.stopTracking);
  const setRerenderedNodes = useSimPerformanceStore(
    (state) => state.setRerenderedNodes,
  );
  const triggerAlert = useSimControlStore((state) => state.triggerAlert);
  const closeAlert = useSimControlStore((state) => state.closeAlert);

  useEffect(() => {
    if (!isTracking) return;

    const timer = setTimeout(() => {
      setRerenderedNodes(count);
      if (count > 1) triggerAlert("contextOverhead");
      else closeAlert("contextOverhead");
      stopTracking();
    }, SETTLE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [
    count,
    isTracking,
    setRerenderedNodes,
    triggerAlert,
    closeAlert,
    stopTracking,
  ]);
}
