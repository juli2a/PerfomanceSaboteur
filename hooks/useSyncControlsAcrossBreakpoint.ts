"use client";

import { useEffect, useRef } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useSimControlStore } from "@/store/simulator-control";

// Mobile and desktop both read the same activeGuideKey, so an open guide
// already reappears on whichever screen is entered without extra code —
// CaseDetailPanel (desktop) and ToggleRow (mobile) each render it directly
// off that shared field. The one thing that doesn't carry over on its own
// is controlsOpen: it's a mobile-only sheet, so entering mobile with a guide
// already active must force the sheet open (otherwise the now-active guide
// has nowhere to show), and entering desktop must close it (it has no
// desktop equivalent to stay open in).
export function useSyncControlsAcrossBreakpoint() {
  const isMobile = useIsMobile();
  const activeGuideKey = useSimControlStore((state) => state.activeGuideKey);
  const setControlsOpen = useSimControlStore((state) => state.setControlsOpen);
  const wasMobileRef = useRef(isMobile);

  useEffect(() => {
    if (wasMobileRef.current === isMobile) return;
    wasMobileRef.current = isMobile;

    if (isMobile) {
      if (activeGuideKey) setControlsOpen(true);
    } else {
      setControlsOpen(false);
    }
  }, [isMobile, activeGuideKey, setControlsOpen]);
}
