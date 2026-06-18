"use client";

import { useState } from "react";
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
import { SIMULATOR_TOGGLE_ZONES } from "@/lib/simulator-toggles";
import SimulatorKicker from "@/components/layout/SimulatorKicker";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ToggleRow({ label, tip }: { label: string; tip: string }) {
  const [isOn, setIsOn] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded border transition-colors",
        isOn
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
          onClick={() => setIsInfoOpen((value) => !value)}
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
        <Switch color="brand" checked={isOn} onCheckedChange={setIsOn} />
      </label>
      {isInfoOpen && (
        <p className="px-3.5 pb-3 text-[11.5px] leading-[1.4] text-text-2">
          {tip}
        </p>
      )}
    </div>
  );
}

export default function MobileControlSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SimulatorKicker size="lg" />
          <SheetClose
            render={
              <Button variant="ghost" size="icon-sm" aria-label="Close" />
            }
          >
            <X className="size-5" />
          </SheetClose>
        </SheetHeader>
        <SheetBody className="flex flex-col gap-4.5 px-4.5 py-3.5">
          {SIMULATOR_TOGGLE_ZONES.map((zone) => (
            <div key={zone.title} className="flex flex-col gap-2.25">
              <span className="heading-brand-group">{zone.title}</span>
              {zone.items.map((item) => (
                <ToggleRow key={item.key} label={item.label} tip={item.tip} />
              ))}
            </div>
          ))}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
