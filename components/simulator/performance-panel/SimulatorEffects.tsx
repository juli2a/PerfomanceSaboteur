"use client";

import { useWebVitalsReporter } from "@/hooks/useWebVitalsReporter";
import { useBlockingTimeReporter } from "@/hooks/useBlockingTimeReporter";
import { useDomNodesReporter } from "@/hooks/useDomNodesReporter";
import { useInteractionLatencyReporter } from "@/hooks/useInteractionLatencyReporter";
import { useRerenderNodesReporter } from "@/hooks/useRerenderNodesReporter";
import { useClearAlertsOnNavigate } from "@/hooks/useClearAlertsOnNavigate";
import { useSyncSsrCookies } from "@/hooks/useSyncSsrCookies";
import { useSimControlStore } from "@/store/simulator-control";
import { ENV } from "@/lib/config";

// Case 6 (docs/case6.md): a text-child hydration mismatch throws
// synchronously *during* React's initial hydration pass
// (react-dom-client.development.js's throwOnHydrationMismatch), and Next.js
// reports it via the browser's global `reportError` (see
// node_modules/next/dist/client/react-client-callbacks/report-global-error.js)
// in that same synchronous call stack — before any component's useEffect
// gets a chance to run. So this listener has to be registered at
// module-evaluation time (the whole client bundle evaluates before
// hydrateRoot is ever called), not inside a useEffect like the reporter
// hooks below, which would simply miss an event that fires during the very
// first hydration pass.
// Dev builds throw the full message below. Production builds minify it down
// to error #418 (throwOnHydrationMismatch's code in the currently installed
// react-dom — verified against
// node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.production.js;
// re-check that file after any React/Next upgrade, since minified codes are
// assigned at build time and can shift), surfaced as a link to
// react.dev/errors/418 instead of readable text — process.env.NODE_ENV
// (inlined at build time, so this is a static branch, not a runtime read)
// picks the signature that actually matches the bundle running.
//
// Exported as two raw strings (rather than only the resolved
// HYDRATION_MISMATCH_SIGNATURE below) so e2e/case6-hydration-mismatch.spec.ts
// can import the literal text without re-deriving it from ENV itself: that
// spec runs in the Playwright test runner's own Node process, where
// process.env.NODE_ENV is unset even though the page under test is a real
// production build — so ENV there would resolve to the dev branch and match
// the wrong string.
export const HYDRATION_MISMATCH_SIGNATURE_PROD = "react.dev/errors/418";
export const HYDRATION_MISMATCH_SIGNATURE_DEV =
  "Hydration failed because the server rendered";

const HYDRATION_MISMATCH_SIGNATURE =
  ENV === "production"
    ? HYDRATION_MISMATCH_SIGNATURE_PROD
    : HYDRATION_MISMATCH_SIGNATURE_DEV;

if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    const message = event.error?.message ?? event.message ?? "";
    if (message.includes(HYDRATION_MISMATCH_SIGNATURE)) {
      useSimControlStore.getState().triggerAlert("hydrationMismatch");
    }
  });
}

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
  useRerenderNodesReporter("contextOverhead", 1);
  useRerenderNodesReporter("brokenMemoization", 100);
  useClearAlertsOnNavigate();
  useSyncSsrCookies();

  return null;
}
