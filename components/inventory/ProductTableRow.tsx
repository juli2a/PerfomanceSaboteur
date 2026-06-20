"use client";

import Image from "next/image";

import type { AmplifiedProduct } from "@/types/inventory";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getStatusTone } from "@/lib/utils/inventory";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { useInventorySelectionStore } from "@/store/inventory-selection";
import { useInventoryStatusStore } from "@/store/inventory-status";
import FlashOnUpdate from "@/components/simulator/FlashOnUpdate";

interface ProductTableRowProps {
  product: AmplifiedProduct;
  gridTemplateColumns: string;
}

// Subscribes to its own id only — toggling one row's checkbox re-renders
// just this component, not the rest of the (virtualized) row list. This is
// the atomic-selector baseline Case 7 contrasts against Context later.
export default function ProductTableRow({ product, gridTemplateColumns }: ProductTableRowProps) {
  const isSelected = useInventorySelectionStore((state) => state.selected.has(product.id));
  const toggleRow = useInventorySelectionStore((state) => state.toggleRow);
  const logisticStatus = useInventoryStatusStore(
    (state) => state.statuses.get(product.id) ?? product.logisticStatus,
  );

  return (
    <FlashOnUpdate>
      <div
        role="row"
        className={cn(
          "grid items-center border-b border-border px-4 py-2.5 text-xs",
          isSelected && "bg-accent-dim",
        )}
        style={{ gridTemplateColumns }}
      >
        <span role="cell">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() =>
              toggleRow({
                id: product.id,
                title: product.title,
                sku: product.sku,
                logisticStatus: product.logisticStatus,
              })
            }
            aria-label={`Select ${product.title}`}
          />
        </span>
        <span role="cell">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={42}
            height={42}
            sizes="42px"
            className="size-10.5 rounded bg-white object-cover"
          />
        </span>
        <span role="cell" className="min-w-0 pr-3">
          <p className="truncate font-medium text-foreground">{product.title}</p>
          <p className="mt-0.75 truncate font-mono text-[11px] text-text-3">{product.sku}</p>
        </span>
        <span role="cell" className="truncate text-text-2">
          {product.category}
        </span>
        <span role="cell" className="font-medium text-foreground tabular-nums">
          {formatCurrency(product.price)}
        </span>
        <span
          role="cell"
          className={cn("tabular-nums", product.stock === 0 ? "text-alert" : "text-foreground")}
        >
          {product.stock}
        </span>
        <span role="cell">
          <Badge tone={getStatusTone(logisticStatus)} dot>
            {logisticStatus}
          </Badge>
        </span>
      </div>
    </FlashOnUpdate>
  );
}
