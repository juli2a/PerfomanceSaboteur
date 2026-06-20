"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, RefreshCw, X } from "lucide-react";

import { LOGISTIC_STATUSES, type AmplifiedProduct, type LogisticStatus } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetBody,
  SheetFooter,
} from "@/components/ui/sheet";
import { getStatusDotClass, getStatusRowClass } from "@/lib/utils/inventory";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { useInventoryStatusStore } from "@/store/inventory-status";
import { updateLogisticStatus } from "@/lib/server/inventory-actions";

interface StatusChangeSheetProps {
  product: AmplifiedProduct;
  currentStatus: LogisticStatus;
}

// Mobile per-product status-change sheet, triggered from ProductCard's
// "Change" button. Same PATCH + optimistic-overlay pattern as Bulk
// Actions, just scoped to a single product.
export default function StatusChangeSheet({ product, currentStatus }: StatusChangeSheetProps) {
  const setStatuses = useInventoryStatusStore((state) => state.setStatuses);

  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState<LogisticStatus | null>(null);
  const [pending, setPending] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setPick(null);
  };

  const handleChange = async () => {
    if (!pick) return;
    setPending(true);
    await updateLogisticStatus([product.id], pick);
    setStatuses([product.id], pick);
    setPending(false);
    handleOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button variant="secondary" size="sm" aria-label="Change status" />}>
        <RefreshCw className="size-3.75" />
        Change
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Change status</SheetTitle>
          <SheetClose aria-label="Close" className="text-text-2">
            <X className="size-5" />
          </SheetClose>
        </SheetHeader>
        <SheetBody className="flex flex-col px-3.5 pt-3 pb-5.5">
          <div className="mb-4.5 flex items-center gap-3.25 rounded-md border border-border bg-surface-2 p-3.25">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={50}
              height={50}
              sizes="50px"
              className="size-12.5 shrink-0 rounded bg-white object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14.5px] font-semibold text-foreground">{product.title}</p>
              <p className="mt-0.75 truncate font-mono text-[11.5px] text-text-3">{product.sku}</p>
              <p className="mt-1.25 text-xs text-text-2">
                {product.category} ·{" "}
                <span
                  className={cn("font-semibold", product.stock === 0 ? "text-alert" : "text-foreground")}
                >
                  {product.stock}
                </span>{" "}
                in stock
              </p>
            </div>
            <span className="self-start text-sm font-semibold text-foreground tabular-nums">
              {formatCurrency(product.price)}
            </span>
          </div>

          <p className="mb-2.75 text-[12.5px] font-semibold text-text-2">Select a new status</p>
          <div className="flex flex-col gap-2.25">
            {LOGISTIC_STATUSES.map((s) => {
              const isCurrent = s === currentStatus;
              const isPicked = pick === s;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={isCurrent}
                  onClick={() => setPick(s)}
                  className={cn(
                    "flex w-full items-center gap-2.75 rounded-md border px-3.75 py-3.25 text-left text-sm font-semibold transition-colors",
                    getStatusRowClass(s),
                    isPicked ? "border-current" : "border-transparent",
                    isCurrent && "opacity-40",
                  )}
                >
                  <span className={cn("size-2.25 shrink-0 rounded-full", getStatusDotClass(s))} />
                  <span className="flex-1">{s}</span>
                  {isCurrent && <span className="text-[11px] font-semibold text-text-3">Current</span>}
                  {isPicked && <Check className="size-4" />}
                </button>
              );
            })}
          </div>
        </SheetBody>
        <SheetFooter className="grid grid-cols-2 gap-2.5">
          <SheetClose render={<Button variant="outline" className="w-full" />}>Cancel</SheetClose>
          <Button className="w-full" disabled={!pick || pending} onClick={handleChange}>
            Change
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
