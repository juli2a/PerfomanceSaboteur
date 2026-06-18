import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/card";
import { Sparkline } from "@/components/ui/sparkline";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { CopyButton } from "@/components/ui/copy-button";

interface Props {
  title: string;
  sku: string;
  marginality: number;
  value: string;
  rating: number;
  sparklineData: number[];
  lowMargin: boolean;
}

export default function MicroCard({
  title,
  sku,
  marginality,
  value,
  rating,
  sparklineData,
  lowMargin,
}: Props) {
  const isGood = rating >= 4;

  return (
    <Card
      disabled={lowMargin}
      className={cn("py-2.5 px-3", !lowMargin && "border-border-strong")}
    >
      <div className="flex items-center justify-between gap-2">
        <Tooltip>
          <TooltipTrigger
            render={<span className="truncate text-xs font-medium text-text-2" />}
            tabIndex={0}
          >
            {title}
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium text-foreground">{title}</p>
            <div className="mt-1 flex items-center gap-1 text-text-3">
              <span>SKU {sku}</span>
              <CopyButton value={sku} label="SKU" />
            </div>
          </TooltipContent>
        </Tooltip>
        <span className="shrink-0 whitespace-nowrap rounded-xs border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-text-3">
          GM% {marginality}
        </span>
      </div>

      <div className="mt-2.5 flex items-end justify-between gap-2.5">
        <div>
          <p className="tabular-nums text-base font-semibold tracking-tight text-foreground">
            {value}
          </p>
          <div className="mt-1.5 flex items-center gap-1">
            <span
              className={cn(
                "text-[11px] leading-none",
                isGood ? "text-pos" : "text-alert",
              )}
            >
              ★
            </span>
            <span className="tabular-nums text-xs font-semibold text-foreground">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
        <Sparkline
          data={sparklineData}
          className="w-[92px] h-[30px] lg:w-[50px] lg:h-[17px] 3xl:w-[92px] 3xl:h-[30px]"
        />
      </div>
    </Card>
  );
}
