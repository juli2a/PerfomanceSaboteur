"use client";

import MainNav from "@/components/layout/MainNav";
import { useSidebarStore } from "@/store/sidebar";
import { cn } from "@/lib/utils/cn";

export default function Sidebar() {
  const collapsed = useSidebarStore((state) => state.collapsed);

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col overflow-y-auto border-r border-border bg-surface-2 pb-15 transition-[width] duration-280 lg:flex",
        collapsed ? "w-[76px]" : "w-[248px]",
      )}
    >
      <div
        className={cn(
          "pt-heading-gap transition-[padding] duration-280",
          collapsed ? "px-3.5" : "px-heading-gap",
        )}
      >
        <MainNav collapsible />
      </div>

      <div className="flex-1" />
    </aside>
  );
}
