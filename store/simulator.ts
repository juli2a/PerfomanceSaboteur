import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CaseKey, SimulatorState } from "@/types/simulator";

const DEFAULT_TOGGLES: Record<CaseKey, boolean> = {
  imageOptimization: false,
  layoutShift: false,
  heavyMounting: false,
  raceCondition: false,
  waterfall: false,
  hydrationMismatch: false,
  contextOverhead: false,
  overMemoization: false,
};

// Only `toggles` is persisted — survives refresh (required for Case 5,
// whose cookie-mirrored value is read server-side on reload). `vitals` is
// live data reported by web-vitals each session and must start fresh,
// never restored from a stale localStorage snapshot.
export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set) => ({
      toggles: DEFAULT_TOGGLES,
      setToggle: (key, value) =>
        set((state) => ({ toggles: { ...state.toggles, [key]: value } })),
      vitals: { lcp: null, cls: null, inp: null },
      setVital: (key, value) =>
        set((state) => ({ vitals: { ...state.vitals, [key]: value } })),
      activeGuideKey: null,
      setActiveGuide: (key) => set({ activeGuideKey: key }),
    }),
    {
      name: "simulator-toggles",
      partialize: (state) => ({ toggles: state.toggles }),
    },
  ),
);
