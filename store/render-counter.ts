import { create } from "zustand";

// Case 7 (Context Overhead) — a transient accumulator FlashOnUpdate feeds
// and useRerenderNodesReporter watches. `increment` only counts while
// `isTracking` is on, so re-renders caused by anything other than a
// tracked row-selection click (category filters, Bulk Actions, Select All)
// never pollute the count — startTracking/stopTracking bracket exactly the
// window a click's own re-render burst happens in, independent of whether
// the contextOverhead toggle itself is on or off.
interface RenderCounterState {
  count: number;
  isTracking: boolean;
  startTracking: () => void;
  increment: () => void;
  stopTracking: () => void;
}

export const useRenderCounterStore = create<RenderCounterState>((set, get) => ({
  count: 0,
  isTracking: false,
  startTracking: () => set({ count: 0, isTracking: true }),
  increment: () => {
    if (get().isTracking) set((state) => ({ count: state.count + 1 }));
  },
  stopTracking: () => set({ isTracking: false }),
}));
