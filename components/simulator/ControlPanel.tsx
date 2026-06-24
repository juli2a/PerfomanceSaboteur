"use client";

import ControlPanelTogglers from "@/components/simulator/ControlPanelTogglers";
import SimulatorKicker from "@/components/simulator/SimulatorKicker";

export default function ControlPanel() {
  return (
    <div className="sim-card min-w-0 flex-1">
      <div className="mr-heading-gap flex shrink-0 items-center self-stretch border-r border-brand-border pr-4">
        <SimulatorKicker />
      </div>

      <ControlPanelTogglers />
    </div>
  );
}
