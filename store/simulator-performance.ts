import { create } from "zustand";

import type { SimPerformanceState } from "@/types/simulator";

// Never persisted — this is live data reported by web-vitals and the other
// PerformanceObserver-based reporters each session, and must start fresh,
// never restored from a stale localStorage snapshot.
export const useSimPerformanceStore = create<SimPerformanceState>()((set) => ({
  vitals: { lcp: null, cls: null, inp: null, ttfb: null },
  setVital: (key, reading) =>
    set((state) => ({ vitals: { ...state.vitals, [key]: reading } })),
  domNodes: null,
  setDomNodes: (count) => set({ domNodes: count }),
  blockingTime: 0,
  setBlockingTime: (ms) => set({ blockingTime: ms }),
  interactionLatency: 0,
  setInteractionLatency: (ms) => set({ interactionLatency: ms }),
  mobilePanelHeight: 0,
  setMobilePanelHeight: (height) => set({ mobilePanelHeight: height }),
}));
