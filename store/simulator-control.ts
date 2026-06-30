import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CaseKey, SimControlState } from "@/types/simulator";

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
// whose cookie-mirrored value is read server-side on reload). Guide and
// alert state are transient UI state, not something that should survive a
// refresh.
export const useSimControlStore = create<SimControlState>()(
  persist(
    (set) => ({
      toggles: DEFAULT_TOGGLES,
      setToggle: (key, value) =>
        set((state) => ({ toggles: { ...state.toggles, [key]: value } })),
      activeGuideKey: null,
      setActiveGuide: (key) => set({ activeGuideKey: key }),
      controlsOpen: false,
      setControlsOpen: (open) => set({ controlsOpen: open }),
      caseAlerts: {},
      triggerAlert: (key) =>
        set((state) =>
          state.caseAlerts[key] === "shown"
            ? state
            : { caseAlerts: { ...state.caseAlerts, [key]: "shown" } },
        ),
      // User explicitly closed it — recorded as "dismissed" so we know this
      // occurrence was seen, not just forgotten.
      dismissAlert: (key) =>
        set((state) => ({
          caseAlerts: { ...state.caseAlerts, [key]: "dismissed" },
        })),
      // The case's own trigger condition resolved on its own — nothing was
      // actually dismissed, so the key is removed entirely (back to the
      // never-triggered baseline) rather than marked "dismissed".
      closeAlert: (key) =>
        set((state) => {
          const caseAlerts = { ...state.caseAlerts };
          delete caseAlerts[key];
          return { caseAlerts };
        }),
    }),
    {
      name: "simulator-toggles",
      partialize: (state) => ({ toggles: state.toggles }),
    },
  ),
);
