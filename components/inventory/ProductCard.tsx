import Image from "next/image";

import type { AmplifiedProduct } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { getStatusTone } from "@/lib/utils/inventory";
import { formatCurrency } from "@/lib/utils/format";
import { useInventoryStatusStore } from "@/store/inventory-status";
import StatusChangeSheet from "@/components/inventory/StatusChangeSheet";

interface ProductCardProps {
  product: AmplifiedProduct;
}

// Mobile card variant of a product row — status-change wiring lives in
// StatusChangeSheet, triggered by the "Change" button below.
export default function ProductCard({ product }: ProductCardProps) {
  const logisticStatus = useInventoryStatusStore(
    (state) => state.statuses.get(product.id) ?? product.logisticStatus,
  );

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-3">
      <div className="flex items-center gap-3">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={54}
          height={54}
          sizes="54px"
          className="size-13.5 shrink-0 rounded bg-white object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{product.title}</p>
          <p className="mt-1 font-mono text-xs text-text-3">{product.sku}</p>
          <div className="mt-1.5 flex items-center gap-1.75">
            <span className="rounded-xs border border-border bg-surface-2 px-2 py-0.5 text-[11.5px] font-semibold text-text-2">
              {product.category}
            </span>
            <span className="text-xs text-text-2">
              <span
                className={
                  product.stock === 0
                    ? "font-semibold text-alert tabular-nums"
                    : "font-semibold text-foreground tabular-nums"
                }
              >
                {product.stock}
              </span>{" "}
              in stock
            </span>
          </div>
        </div>
        <span className="self-start text-sm font-semibold text-foreground tabular-nums">
          {formatCurrency(product.price)}
        </span>
      </div>
      <div className="flex items-center gap-2.5 border-t border-border pt-3">
        <Badge tone={getStatusTone(logisticStatus)} dot>
          {logisticStatus}
        </Badge>
        <div className="flex-1" />
        <StatusChangeSheet product={product} currentStatus={logisticStatus} />
      </div>
    </div>
  );
}
