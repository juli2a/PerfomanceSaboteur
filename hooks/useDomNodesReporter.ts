import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useSimPerformanceStore } from "@/store/simulator-performance";
import { useSimulatorCase } from "@/hooks/useSimulatorCase";

// Called once from SimulatorEffects — recomputes the page's total DOM
// element count on every navigation, plus whenever Case 3 (Heavy Mounting)
// toggles, since that's the case this counter exists to demonstrate.
export function useDomNodesReporter() {
  const setDomNodes = useSimPerformanceStore((state) => state.setDomNodes);
  const pathname = usePathname();
  const isHeavyMountingOn = useSimulatorCase("heavyMounting");

  useEffect(() => {
    setDomNodes(document.querySelectorAll("*").length);
  }, [pathname, isHeavyMountingOn, setDomNodes]);
}
