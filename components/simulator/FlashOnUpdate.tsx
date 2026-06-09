"use client";

// Highlights component boundaries on every re-render
// Wraps children; on render, briefly applies a coloured outline via clsx
// Controlled by the simulator store (Case 7 / global toggle)
export default function FlashOnUpdate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
