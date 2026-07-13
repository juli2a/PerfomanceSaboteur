import { Card } from "@/components/ui/card";
import { Sparkline } from "@/components/ui/sparkline";
import { formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface Props {
  label: string;
  value: string;
  deltaPercent: number;
  spark: number[];
}

export default function KpiCard({ label, value, deltaPercent, spark }: Props) {
  const isPositive = deltaPercent >= 0;
  const deltaText = `${formatPercent(deltaPercent)}*`;

  return (
    <Card variant="global" size="kpi">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-xs font-medium text-text-2 @min-[640px]:text-lg">
          {label}
        </p>
        <span
          className={cn(
            "hidden shrink-0 rounded-sm px-2.25 py-0.75 font-semibold @min-[640px]:inline",
            isPositive ? "bg-pos-dim text-pos" : "bg-alert/12 text-alert",
          )}
        >
          {deltaText}
        </span>
      </div>

      <p className="mt-2 mb-1 truncate text-[22px] font-semibold tracking-[-0.4px] text-foreground tabular-nums @min-[640px]:mt-3 @min-[640px]:mb-3.5 @min-[640px]:text-[28px] @min-[640px]:tracking-[-0.6px]">
        {value}
      </p>

      <div className="flex items-center gap-4">
        {/* narrow container only: badge moves down to sit next to the sparkline */}
        <span
          className={cn(
            "shrink-0 text-sm font-semibold @min-[640px]:hidden",
            isPositive ? "text-pos" : "text-alert",
          )}
        >
          {deltaText}
        </span>
        <Sparkline
          isGood={isPositive}
          data={spark}
          className="h-5.5 min-w-0 flex-1 @min-[640px]:h-8.5"
        />
      </div>
    </Card>
  );
}
