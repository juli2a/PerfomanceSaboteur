import type { CaseKey } from "@/types/simulator";

// Mirrors the 4-part tip structure from
// .claude/skills/content-maker/SKILL.md.
export interface CaseTip {
  problem: string;
  reproduction: string;
  effect: string;
  badCode: string;
  goodCode: string;
  summary: string;
}

export interface ToggleItem {
  label: string;
  key: CaseKey;
  tip: CaseTip;
  alert: string;
}

// Shared case definitions for the simulator control panel — consumed by both
// the desktop ControlPanelTogglers and the mobile MobileControlSheet.
// `key` matches `CaseKey` exactly so both can read/write `useSimulatorStore`
// without a separate name-mapping table.
// `tip`/`alert` are filled in by the content-maker skill
// (.claude/skills/content-maker/SKILL.md).
export const SIMULATOR_CASES: { title: string; items: ToggleItem[] }[] = [
  {
    title: "Network",
    items: [
      {
        label: "Search race condition", //case 4
        key: "raceCondition",
        tip: {
          problem:
            "Each keystroke fires its own search request, and a slower response for an earlier, shorter query can arrive after a faster response for what you actually typed. This overwrites the table with stale data, so the search box and table are out of sync.",
          reproduction:
            'Type a product name into the Inventory search box quickly, e.g. "lipstick".',
          effect:
            'The search box shows "lipstick", but the table still shows results for "l" or "li" — the panel raises a race-condition alert until a fresh response corrects it.',
          badCode:
            "Fires a fetch on every keystroke with no debounce and no cancellation, so whichever response resolves last wins — not whichever request was sent last.",
          goodCode:
            "Debounces the input 300ms and cancels the previous request with an AbortController on every keystroke, so only the response for the final query ever gets applied.",
          summary:
            "Debounce and cancel requests triggered by fast-changing input — never trust that responses arrive in the same order they were sent.",
        },
        alert:
          "Race Condition Alert: stale response overwrote a newer search result",
      },
      {
        label: "Waterfall", //case 5
        key: "waterfall",
        tip: {
          problem: "",
          reproduction: "",
          effect: "",
          badCode: "",
          goodCode: "",
          summary: "",
        },
        alert: "",
      },
    ],
  },
  {
    title: "Rendering",
    items: [
      {
        label: "Layout shift", //case 2
        key: "layoutShift",
        tip: {
          problem: "",
          reproduction: "",
          effect: "",
          badCode: "",
          goodCode: "",
          summary: "",
        },
        alert: "",
      },
      {
        label: "Images optimization", //case 1
        key: "imageOptimization",
        tip: {
          problem: "",
          reproduction: "",
          effect: "",
          badCode: "",
          goodCode: "",
          summary: "",
        },
        alert: "",
      },
      {
        label: "Hydration mismatch", //case 6
        key: "hydrationMismatch",
        tip: {
          problem: "",
          reproduction: "",
          effect: "",
          badCode: "",
          goodCode: "",
          summary: "",
        },
        alert: "",
      },
      {
        label: "Context overhead", //case 7
        key: "contextOverhead",
        tip: {
          problem: "",
          reproduction: "",
          effect: "",
          badCode: "",
          goodCode: "",
          summary: "",
        },
        alert: "",
      },
    ],
  },
  {
    title: "Computing",
    items: [
      {
        label: "Heavy mounting", //case 3
        key: "heavyMounting",
        tip: {
          problem: "",
          reproduction: "",
          effect: "",
          badCode: "",
          goodCode: "",
          summary: "",
        },
        alert: "",
      },
      {
        label: "Over memoization", //case 8
        key: "overMemoization",
        tip: {
          problem: "",
          reproduction: "",
          effect: "",
          badCode: "",
          goodCode: "",
          summary: "",
        },
        alert: "",
      },
    ],
  },
];

// Looks up a single case's definition by key, plus the zone (Network /
// Rendering / Computing) it belongs to — e.g. so PerformancePanel can show a
// case's authored `alert` text, and the right-hand guide panel can show its
// zone as a subtitle, without scanning SIMULATOR_CASES twice.
export function getSimulatorCase(key: CaseKey): ToggleItem & { zoneTitle: string } {
  for (const zone of SIMULATOR_CASES) {
    const item = zone.items.find((candidate) => candidate.key === key);
    if (item) return { ...item, zoneTitle: zone.title };
  }
  throw new Error(`Unknown simulator case: ${key}`);
}
