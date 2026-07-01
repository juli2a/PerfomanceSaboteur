"use client";

import { useWebVitalsReporter } from "@/hooks/useWebVitalsReporter";
import { useBlockingTimeReporter } from "@/hooks/useBlockingTimeReporter";
import { useDomNodesReporter } from "@/hooks/useDomNodesReporter";
import { useInteractionLatencyReporter } from "@/hooks/useInteractionLatencyReporter";
import { useSyncSsrCookies } from "@/hooks/useSyncSsrCookies";

// Mounted once in the root layout — the one "use client" boundary for every
// side-effect-only hook that has no UI of its own: the PerformanceObserver
// reporters feeding the floating Performance Panel, plus SSR-cookie sync.
// None of these hooks render anything, so this never grows the fiber tree
// beyond this single boundary — adding another effect-only hook means
// calling it here, not adding a new component.
export default function SimulatorEffects() {
  useWebVitalsReporter();
  useBlockingTimeReporter();
  useDomNodesReporter();
  useInteractionLatencyReporter();
  useSyncSsrCookies();

  return null;
}
