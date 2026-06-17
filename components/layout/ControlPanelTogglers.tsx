"use client";

import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipInfoTrigger, TooltipContent } from "@/components/ui/tooltip";

const ZONES = [
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

export default function ControlPanelTogglers() {
  return (
    <div className="flex w-full items-center justify-around gap-4.5">
      {ZONES.map((zone) => (
        <div key={zone.title} className="flex items-center gap-4.5">
          <span className="w-px self-stretch bg-brand-border" />
          <fieldset className="m-0 border-0 p-0">
            <legend className="heading-brand-group mb-1.75 p-0">{zone.title}</legend>
            <div className="grid grid-flow-col grid-rows-2 gap-x-4.5 gap-y-2.25">
              {zone.items.map((item) => (
                <div key={item.key} className="flex items-center gap-1.75">
                  <Switch color="brand" size="sm" />
                  <span className="whitespace-nowrap text-[12.5px] font-medium text-text-2">
                    {item.label}
                  </span>
                  <Tooltip>
                    <TooltipInfoTrigger color="brand" label={`${item.label} info`} />
                    <TooltipContent color="brand">{item.tip}</TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      ))}
    </div>
  );
}
