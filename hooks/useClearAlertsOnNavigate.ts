import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useSimControlStore } from "@/store/simulator-control";

// Called once from SimulatorEffects — a case's alert only makes sense on the
// page that demonstrates it, but the store it lives in (and the panel that
// renders it) both sit above the shell's {children}, so they survive
// navigation on their own. Clears every shown alert on each pathname change
// so one page's alert doesn't keep following the user onto another.
export function useClearAlertsOnNavigate() {
  const pathname = usePathname();
  const clearAlerts = useSimControlStore((state) => state.clearAlerts);

  useEffect(() => {
    clearAlerts();
  }, [pathname, clearAlerts]);
}
