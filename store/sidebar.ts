import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

// Left workspace sidebar collapse state — unrelated to the simulator, shared
// between Header (logo zone width) and Sidebar without prop drilling through
// the shell layout. Persisted so it survives a refresh, same as the
// simulator toggles.
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    {
      name: "sidebar-collapsed",
    },
  ),
);
