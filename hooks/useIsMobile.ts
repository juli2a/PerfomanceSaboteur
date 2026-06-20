"use client";

import { useSyncExternalStore } from "react";

// Mirrors Tailwind's `lg` breakpoint (64rem / 1024px) — anything narrower
// renders the mobile layout.
const MOBILE_QUERY = "(max-width: 1023.98px)";

function subscribe(onChange: () => void) {
  const mediaQuery = window.matchMedia(MOBILE_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

// `false` (desktop) so SSR output matches the client's first paint — same
// hydration-safety pattern as Case 6: the real value only takes effect
// once the browser's matchMedia is available.
function getServerSnapshot(): boolean {
  return false;
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
