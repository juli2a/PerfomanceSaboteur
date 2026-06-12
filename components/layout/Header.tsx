"use client";

import ControlPanel from "@/components/layout/ControlPanel";

// Fixed top bar: logo | ControlPanel toggles | last-updated timestamp
// Mobile: burger menu button + "Error Control" button (opens ControlPanel bottom sheet)
export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-surface-2 px-4 py-3">
      <span className="text-sm font-semibold tracking-tight text-foreground">PerfSaboteur</span>
      <ControlPanel />
      <span className="hidden text-xs text-text-2 lg:block">Last updated: —</span>
    </header>
  );
}
