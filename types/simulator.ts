// Simulator toggle keys — one per case
export type CaseKey =
  | "imageOptimization" // Case 1 — LCP
  | "layoutShift" // Case 2 — CLS
  | "heavyMounting" // Case 3 — INP
  | "raceCondition" // Case 4 — Data freshness
  | "waterfall" // Case 5 — TTFB
  | "hydrationMismatch" // Case 6 — Hydration
  | "contextOverhead" // Case 7 — Rerender nodes / FPS
  | "overMemoization"; // Case 8 — INP

export type ToggleGroup = "network" | "rendering" | "computing";

// A case's alert visibility. Absent key = never triggered yet (not shown).
// triggerAlert always sets "shown", even over a "dismissed" status — so
// closing one occurrence doesn't suppress the next, distinct one.
export type AlertStatus = "shown" | "dismissed";

// Three-tier gauge rating. Derived from web-vitals' own Metric.rating
// ("good" | "needs-improvement" | "poor") — useWebVitalsReporter maps
// "needs-improvement" to "degraded" so the scale reads as three clearly
// distinct words, but the underlying thresholds stay exactly the package's
// official ones.
export type VitalRating = "good" | "degraded" | "poor";

export interface VitalReading {
  value: number;
  rating: VitalRating;
}

// Toggles, case guide, and case alerts — driven by user interaction with the
// control panel (desktop) / control sheet (mobile).
export interface SimControlState {
  toggles: Record<CaseKey, boolean>;
  setToggle: (key: CaseKey, value: boolean) => void;
  // Which case's guide is open — the right slide-out panel on desktop, a
  // row's inline info on the mobile control sheet — null when none is.
  // Shared between both surfaces so opening one closes whichever was open on
  // the other. Not persisted: it's transient UI state, not something that
  // should survive a refresh.
  activeGuideKey: CaseKey | null;
  setActiveGuide: (key: CaseKey | null) => void;
  // Whether the mobile simulator-controls bottom sheet is open. A distinct
  // concept from activeGuideKey above — this sheet can be open with no guide
  // expanded inside it (e.g. just flipping a switch). Lives here (rather
  // than as Header's own local state) so the mobile Performance Panel dock
  // can force itself open while it's open — see docs/ui.md "Floating
  // Performance Panel" → Mobile (`dockOpen = vitalsExpanded || controlsOpen`).
  controlsOpen: boolean;
  setControlsOpen: (open: boolean) => void;
  caseAlerts: Partial<Record<CaseKey, AlertStatus>>;
  triggerAlert: (key: CaseKey) => void;
  // Two call sites, same effect — kept as separate names so each call site
  // documents *why* the alert went away: dismissAlert is the user clicking
  // close; closeAlert is the case's own trigger condition resolving on its own
  // (e.g. isStale flipping back to false).
  dismissAlert: (key: CaseKey) => void;
  closeAlert: (key: CaseKey) => void;
}

// Live measurements reported by the simulator's PerformanceObserver-based
// reporters — read by the floating Performance Panel, never persisted.
export interface SimPerformanceState {
  vitals: {
    lcp: VitalReading | null;
    cls: VitalReading | null;
    inp: VitalReading | null;
  };
  setVital: (
    key: keyof SimPerformanceState["vitals"],
    reading: VitalReading,
  ) => void;
  // Total DOM element count — Case 3 (Heavy Mounting). Recomputed by
  // useDomNodesReporter on every navigation / Case 3 toggle change, not live-polled.
  domNodes: number | null;
  setDomNodes: (count: number) => void;
  // Duration (ms) of the most recently observed long task — "Blocking Time"
  // in the panel. Overwritten per task, not accumulated, so it reflects the
  // current freeze rather than an ever-growing session total.
  blockingTime: number;
  setBlockingTime: (ms: number) => void;
  // Duration (ms) of the most recent interaction's Event Timing entry —
  // "Interaction Latency" in the panel, for Case 3 / Case 8. Unlike
  // web-vitals' own INP (a worst-case-this-session aggregate that only ever
  // ratchets up), this is a single live sample: it goes back down once the
  // anti-pattern is fixed, without needing a page reload.
  interactionLatency: number;
  setInteractionLatency: (ms: number) => void;
  // Current rendered height (px) of the mobile Performance Panel — it's
  // always expanded while the simulator controls sheet is open, so
  // MobileControlSheet reads this to reserve the same amount of bottom
  // padding in its own scroll area, keeping its last rows from ending up
  // hidden behind the panel.
  mobilePanelHeight: number;
  setMobilePanelHeight: (height: number) => void;
}
