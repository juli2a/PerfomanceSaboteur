"use client";

import ControlPanelTogglers from "@/components/layout/ControlPanelTogglers";
import SimulatorKicker from "@/components/layout/SimulatorKicker";

export default function ControlPanel() {
  return (
    <div className="sim-card">
      <div className="flex shrink-0 items-center self-stretch pr-4">
        <SimulatorKicker />
      </div>

      <ControlPanelTogglers />
    </div>
  );
}
