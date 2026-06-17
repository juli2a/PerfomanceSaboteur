"use client";

import { Switch } from "@/components/ui/switch";

const ZONES = [
  {
    title: "Network",
    items: [
      { label: "Over-fetch", key: "overfetch" },
      { label: "No cache", key: "nocache" },
      { label: "Waterfall", key: "waterfall" },
    ],
  },
  {
    title: "Rendering",
    items: [
      { label: "Layout shift", key: "layoutshift" },
      { label: "Unopt. img", key: "unoptimg" },
      { label: "Re-render", key: "rerender" },
    ],
  },
  {
    title: "Computing",
    items: [
      { label: "Blocking JS", key: "blockingjs" },
      { label: "Mem leak", key: "memleak" },
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
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      ))}
    </div>
  );
}
