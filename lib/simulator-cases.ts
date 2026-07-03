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
        label: "Request waterfall", //case 5
        key: "waterfall",
        tip: {
          problem:
            "The dashboard's four data requests are awaited one after another instead of at the same time, so their delays stack up instead of overlapping.",
          reproduction:
            "Switch this toggle on — the page reloads so the server can refetch sequentially.",
          effect:
            "The dashboard stays blank for several seconds, then the whole layout snaps in at once instead of streaming in section by section — both TTFB and LCP spike in the Performance Panel, since nothing can render until the last request finishes.",
          badCode:
            "Each request is awaited before the next one starts, so the server can't send even its first byte until all four — normally independent — have finished one by one.",
          goodCode:
            "Each dashboard section fetches its own data inside its own Suspense boundary, so all four requests fire the moment the server starts rendering instead of waiting on each other.",
          summary:
            "Independent data requests should never block each other behind sequential awaits — run them concurrently (Promise.all, parallel Suspense boundaries) so total latency tracks the slowest request, not the sum of all of them.",
        },
        alert: {
          title: "Request Waterfall",
          body: "Requests fired one after another instead of in parallel — TTFB and LCP both spiked.",
        },
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
          problem:
            "The sidebar's collapsed/expanded preference is saved to localStorage only, so the server has no way to know it and always renders the sidebar expanded — the client corrects it right after the page loads.",
          reproduction:
            "Collapse the sidebar with the arrow button above the nav icons, then turn this toggle on — the page reloads so the server can re-render with the change.",
          effect:
            "The sidebar and the logo next to it briefly render expanded, then animate to collapsed a moment after the page finishes loading — CLS ticks up in the Performance Panel even though the shift itself looks smooth.",
          badCode:
            "Persists the collapsed flag with zustand's persist middleware — localStorage only, so the very first server-rendered HTML always shows the sidebar expanded, whatever the user last picked.",
          goodCode:
            "Mirrors the same flag into a cookie the server can read, so the Server Component renders the sidebar at its real width from the first paint — nothing to correct after the client mounts.",
          summary:
            "Any UI preference that changes layout — a collapsed sidebar, a dismissed banner, a saved column width — needs to be readable server-side (a cookie, not just localStorage), or it will shift into place after every load.",
        },
        alert: {
          title: "Layout Shift",
          body: "Sidebar width corrected after the page had already rendered.",
        },
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
          problem:
            "The dashboard's \"Updated\" time is computed with new Date().toLocaleTimeString() directly in render — the server renders it in UTC while the browser renders it in your local timezone, so the two reads never agree.",
          reproduction:
            "Switch this toggle on — the page reloads so the server renders the timestamp fresh.",
          effect:
            "The \"Updated\" time first shows the server's UTC reading, then immediately snaps to your local time once React notices the mismatch — the browser console throws a hydration-failed error, and the Performance Panel raises a Hydration Mismatch alert.",
          badCode:
            "Calls new Date().toLocaleTimeString() straight in the render body, so the server computes one clock reading and the client immediately computes a different one in its place.",
          goodCode:
            "Renders the same fixed placeholder text on the server and on the browser's very first render, then swaps in the real, browser-only timestamp right after — so the server and client never actually disagree on what to show.",
          summary:
            "If a value can come out differently on the server than in the browser — the time, the locale, anything based on window — don't render it on the very first pass. Show a placeholder first, then swap in the real value once you know you're running on the client.",
        },
        alert: {
          title: "Hydration Mismatch",
          body: "Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client.",
        },
      },
      {
        label: "Context re-render storm", //case 7
        key: "contextOverhead",
        tip: {
          problem:
            "Row selection lives in one shared React Context instead of a per-row store selector, so every row component subscribes to the exact same value — not just the slice it actually needs.",
          reproduction:
            "Click a checkbox in the Inventory Control table.",
          effect:
            "Every visible row's Flash on Update outline fires at once, not just the one you clicked, and the Performance Panel raises a Context Re-render Storm alert naming how many rows re-rendered. Blocking Time and Interaction Latency both spike too, since re-rendering every visible row for one click is real main-thread work.",
          badCode:
            "Every row reads the same Context value; toggling one checkbox builds a brand-new context object, which forces every row consuming it to re-render, not just the one whose checkbox changed.",
          goodCode:
            "Each row subscribes to a Zustand selector scoped to just its own id, so only the row whose selection actually changed gets notified and re-renders.",
          summary:
            "Shared Context re-renders every consumer on any change, no matter how small — for state many components read but each only care about their own slice of (a row, an id, a field), use a store with per-item selectors instead.",
        },
        alert: {
          title: "Context Re-render Storm",
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
