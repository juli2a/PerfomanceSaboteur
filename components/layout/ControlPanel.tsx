"use client";

import ControlPanelTogglers from "@/components/layout/ControlPanelTogglers";

export default function ControlPanel() {
  return (
    <div className="sim-card">
      <div className="flex shrink-0 flex-col justify-center gap-1.25 self-stretch pr-4">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_var(--brand-accent)]" />
          <span className="font-brand text-[10px] font-bold tracking-[1.3px] text-brand-accent">
            SIMULATOR
          </span>
        </span>
        <span className="max-w-23 text-[10px] leading-[1.3] text-brand-muted">
          Anti-pattern controls
        </span>
      </div>

      <ControlPanelTogglers />
    </div>
  );
}
