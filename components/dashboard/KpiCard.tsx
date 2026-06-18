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
        <p className="min-w-0 truncate text-xs font-medium text-text-2 sm:text-[13px]">
          {label}
        </p>
        <span
          className={cn(
            "hidden shrink-0 rounded-sm px-2.25 py-0.75 text-[13px] font-semibold sm:inline",
            isPositive ? "bg-pos-dim text-pos" : "bg-alert/12 text-alert",
          )}
        >
          {deltaText}
        </span>
      </div>

      <p className="mt-2 mb-1 truncate text-[22px] font-semibold tracking-[-0.4px] text-foreground tabular-nums sm:mt-3 sm:mb-3.5 sm:text-[28px] sm:tracking-[-0.6px]">
        {value}
      </p>

      <div className="flex items-center gap-4">
        {/* mobile only: badge moves down to sit next to the sparkline */}
        <span className={cn("shrink-0 text-xs font-semibold sm:hidden", isPositive ? "text-pos" : "text-alert")}>
          {deltaText}
        </span>
        <Sparkline isGood={isPositive} data={spark} className="h-5.5 min-w-0 flex-1 sm:h-8.5" />
      </div>
    </Card>
  );
}
