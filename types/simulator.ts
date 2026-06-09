// Simulator toggle keys — one per case
export type CaseKey =
  | "imageOptimization"   // Case 1 — LCP
  | "layoutShift"         // Case 2 — CLS
  | "heavyMounting"       // Case 3 — INP
  | "raceCondition"       // Case 4 — Data freshness
  | "waterfall"           // Case 5 — TTFB
  | "hydrationMismatch"   // Case 6 — Hydration
  | "contextOverhead"     // Case 7 — Rerender nodes / FPS
  | "overMemoization";    // Case 8 — INP

export type ToggleGroup = "network" | "rendering" | "computing";

export interface SimulatorState {
  toggles: Record<CaseKey, boolean>;
  setToggle: (key: CaseKey, value: boolean) => void;
  vitals: { lcp: number | null; cls: number | null; inp: number | null };
  setVital: (key: keyof SimulatorState["vitals"], value: number) => void;
}
