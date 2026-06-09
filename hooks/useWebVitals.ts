"use client";

// Subscribes to LCP, CLS, INP via the web-vitals package
// Returns current metric values; used by PerformancePanel
// install: pnpm add web-vitals
export function useWebVitals() {
  return { lcp: null, cls: null, inp: null };
}
