"use client";

import { createContext, useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 1023.98px)";

export const MediaContext = createContext<boolean | undefined>(undefined);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <MediaContext.Provider value={isMobile}>{children}</MediaContext.Provider>
  );
}
