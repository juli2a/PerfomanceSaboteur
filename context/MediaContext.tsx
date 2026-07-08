"use client";

import { createContext } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const MOBILE_QUERY = "(max-width: 1023.98px)";

export const MediaContext = createContext<boolean | undefined>(undefined);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    <MediaContext.Provider value={isMobile}>{children}</MediaContext.Provider>
  );
}
