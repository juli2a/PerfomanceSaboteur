import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PanelExpandedState {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

// Case 2 (Layout Shift) "bad" path — the mobile panel's original
// persistence model: localStorage only, no cookie, no SSR awareness. The
// server always renders expanded=false; zustand's persist middleware
// deliberately skips synchronous rehydration on the first client render (to
// avoid a hydration warning), so that first render matches the server too.
// Once mounted, the store updates to the real localStorage value via an
// ordinary setState — no React warning, just a plain state change that
// grows the fixed, bottom-anchored panel in place, which is exactly the
// layout shift this case measures.
export const usePanelExpandedStoreUnstable = create<PanelExpandedState>()(
  persist(
    (set) => ({
      expanded: false,
      setExpanded: (expanded) => set({ expanded }),
    }),
    {
      name: "panel-expanded-unstable",
    },
  ),
);
