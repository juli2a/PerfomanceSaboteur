"use client";

import { useWebVitalsReporter } from "@/hooks/useWebVitalsReporter";
import { useBlockingTimeReporter } from "@/hooks/useBlockingTimeReporter";
import { useDomNodesReporter } from "@/hooks/useDomNodesReporter";
import { useInteractionLatencyReporter } from "@/hooks/useInteractionLatencyReporter";

// Mounted once in the root layout — the one "use client" boundary for every
// PerformanceObserver-based hook feeding the floating Performance Panel, so
// adding/removing a metric only touches this file instead of the layout.
// None of these hooks render anything, so unlike the old per-metric
// reporter components, this never grows the fiber tree beyond this single
// boundary.
export default function SimulatorReporters() {
  useWebVitalsReporter();
  useBlockingTimeReporter();
  useDomNodesReporter();
  useInteractionLatencyReporter();

  return null;
}
