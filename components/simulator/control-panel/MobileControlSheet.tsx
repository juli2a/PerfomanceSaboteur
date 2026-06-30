"use client";

import { InfoIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";
import { SIMULATOR_CASES } from "@/lib/simulator-toggles";
import { useSimControlStore } from "@/store/simulator-control";
import { useSimPerformanceStore } from "@/store/simulator-performance";
import type { CaseKey } from "@/types/simulator";
import SimulatorKicker from "@/components/simulator/control-panel/SimulatorKicker";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseTipContent: Partial<Record<CaseKey, React.ReactNode>>;
}

interface ToggleRowProps {
  caseKey: CaseKey;
  label: string;
  tipContent: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

// Shares activeGuideKey with the desktop guide panel's GuideButton — only
// one case's info can be open at a time, here or there, so opening a row's
// info here closes any other row already expanded (and vice versa).
function ToggleRow({
  caseKey,
  label,
  tipContent,
  checked,
  onCheckedChange,
}: ToggleRowProps) {
  const isInfoOpen = useSimControlStore(
    (state) => state.activeGuideKey === caseKey,
  );
  const setActiveGuide = useSimControlStore((state) => state.setActiveGuide);

  return (
    <div
      className={cn(
        "overflow-hidden rounded border transition-colors",
        checked
          ? "border-brand-border bg-brand-accent-dim"
          : "border-border bg-transparent",
      )}
    >
      <label className="flex items-center gap-2.75 px-3.5 py-3">
        <span className="flex-1 truncate text-sm font-semibold text-foreground">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setActiveGuide(isInfoOpen ? null : caseKey)}
          aria-label={`${label} info`}
          aria-expanded={isInfoOpen}
          className={cn(
            "grid size-5.5 shrink-0 place-items-center rounded-full border p-0 transition-colors",
            isInfoOpen
              ? "border-brand-accent bg-brand-accent-dim text-brand-accent"
              : "border-border text-brand-muted",
          )}
        >
          <InfoIcon className="size-3.25" />
        </button>
        <Switch
          color="brand"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </label>
      {isInfoOpen && (
        <div className="px-3.5 pb-3 text-[15px] leading-[1.4] text-text-2">
          {tipContent}
        </div>
      )}
    </div>
  );
}

export default function MobileControlSheet({
  open,
  onOpenChange,
  caseTipContent,
}: Props) {
  const toggles = useSimControlStore((state) => state.toggles);
  const setToggle = useSimControlStore((state) => state.setToggle);
  // The mobile Performance Panel is always forced open (and thus at its
  // tallest) while this sheet is open, and sits on top of this sheet's own
  // bottom edge — reserving the same height as bottom padding keeps the
  // last toggle rows reachable by scrolling instead of stuck behind it.
  const mobilePanelHeight = useSimPerformanceStore(
    (state) => state.mobilePanelHeight,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SimulatorKicker size="lg" />
          <SheetClose
            render={
              <Button variant="outline" size="icon-sm" aria-label="Close" />
            }
          >
            <X size={18} />
          </SheetClose>
        </SheetHeader>
        <SheetBody
          className="flex flex-col gap-4.5 px-4.5 py-3.5"
          style={{ paddingBottom: mobilePanelHeight + 14 }}
        >
          {SIMULATOR_CASES.map((zone) => (
            <div key={zone.title} className="flex flex-col gap-2.25">
              <span className="heading-brand-group">{zone.title}</span>
              {zone.items.map((item) => (
                <ToggleRow
                  key={item.key}
                  caseKey={item.key}
                  label={item.label}
                  tipContent={caseTipContent[item.key]}
                  checked={toggles[item.key]}
                  onCheckedChange={(checked) => setToggle(item.key, checked)}
                />
              ))}
            </div>
          ))}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
