// Shared toggle definitions for the simulator control panel — consumed by both
// the desktop ControlPanelTogglers and the mobile MobileControlSheet.
export const SIMULATOR_TOGGLE_ZONES = [
  {
    title: "Network",
    items: [
      {
        label: "Over-fetch",
        key: "overfetch",
        tip: "Refetches all data on every render with no caching — floods the network and delays interactivity.",
      },
      {
        label: "No cache",
        key: "nocache",
        tip: "Disables HTTP/data caching, so identical requests re-run on every navigation.",
      },
      {
        label: "Waterfall",
        key: "waterfall",
        tip: "Fetches data sequentially instead of in parallel — each request waits for the previous one (slow TTFB).",
      },
    ],
  },
  {
    title: "Rendering",
    items: [
      {
        label: "Layout shift",
        key: "layoutshift",
        tip: "Injects late-loading content with no reserved space, causing visible jumps (high CLS).",
      },
      {
        label: "Unopt. img",
        key: "unoptimg",
        tip: "Serves full-resolution images with no sizing or compression — bloats LCP.",
      },
      {
        label: "Re-render",
        key: "rerender",
        tip: "Triggers global state updates that re-render the whole tree on every interaction.",
      },
    ],
  },
  {
    title: "Computing",
    items: [
      {
        label: "Blocking JS",
        key: "blockingjs",
        tip: "Runs a long synchronous task on the main thread, freezing input (high INP).",
      },
      {
        label: "Mem leak",
        key: "memleak",
        tip: "Keeps adding listeners/timers that are never cleaned up — memory grows until the tab stalls.",
      },
    ],
  },
] as const;
