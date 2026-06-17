"use client";

import { useEffect } from "react";

export function ClientLogger({ label }: { label: string }) {
  useEffect(() => {
    console.log(`[Stream] ${label} mounted at`, new Date().toISOString());
  }, [label]);
  return null;
}
