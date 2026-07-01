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

// Split title/body so PerformancePanel can render them as a SimulatorAlert
// card directly — title is the short uppercase label, body the explanation.
export interface CaseAlert {
  title: string;
  body: string;
}

export interface ToggleItem {
  label: string;
  key: CaseKey;
  tip: CaseTip;
  alert: CaseAlert;
}

// Shared case definitions for the simulator control panel — consumed by both
// the desktop ControlPanelTogglers and the mobile MobileControlSheet.
// `key` matches `CaseKey` exactly so both can read/write `useSimControlStore`
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
        alert: {
          title: "Race Condition",
          body: "Stale response overwrote a newer search result.",
        },
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
        alert: { title: "", body: "" },
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
        alert: { title: "", body: "" },
      },
      {
        label: "Unoptimized Images", //case 1
        key: "imageOptimization",
        tip: {
          problem:
            "The hero banner's first slide — the page's actual LCP element — skips Next.js's image optimization and priority hint, and loads exactly like every offscreen slide instead.",
          reproduction:
            "Go to the Dashboard, then switch the toggle on and off a few times and wait for the page to reload — compare the LCP reading between the two states.",
          effect:
            "With the toggle on, LCP is noticeably higher because the banner image loads through an unoptimized path (our sample images are already small and already WebP, so we added an artificial loading delay to stand in for a real, uncompressed origin).",
          badCode:
            "Renders every slide as a plain <img> with no priority or lazy-loading hint, so the first slide — the one that's actually the LCP element — loads no faster than the hidden ones.",
          goodCode:
            "Renders every slide with next/image; the first slide gets priority (an eager, high fetch-priority load, since it's the LCP element) while the rest lazy-load by default.",
          summary:
            "Always optimize image size and format — reach for what your framework already offers (like next/image) and give whichever image is the real LCP candidate a priority hint instead of treating it like any other offscreen image.",
        },
        alert: { title: "", body: "" },
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
        alert: { title: "", body: "" },
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
        alert: {
          title: "Context Overhead",
          // Static prefix only — the live count comes from the
          // FlashOnUpdate settle-window counter (see docs/case7.md) and is
          // appended at render time, e.g. `${body}: ${count}`.
          body: "Rerendered Nodes on Action",
        },
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
        alert: { title: "", body: "" },
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
        alert: { title: "", body: "" },
      },
    ],
  },
];

// Looks up a single case's definition by key, plus the zone (Network /
// Rendering / Computing) it belongs to — e.g. so PerformancePanel can show a
// case's authored `alert` text, and the right-hand guide panel can show its
// zone as a subtitle, without scanning SIMULATOR_CASES twice.
export function getSimulatorCase(
  key: CaseKey,
): ToggleItem & { zoneTitle: string } {
  for (const zone of SIMULATOR_CASES) {
    const item = zone.items.find((candidate) => candidate.key === key);
    if (item) return { ...item, zoneTitle: zone.title };
  }
  throw new Error(`Unknown simulator case: ${key}`);
}
