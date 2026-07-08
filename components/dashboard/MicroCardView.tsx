import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/card";
import { Sparkline } from "@/components/ui/sparkline";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CopyButton } from "@/components/ui/copy-button";
import FlashOnUpdate from "@/components/simulator/FlashOnUpdate";

interface Props {
  id: string;
  title: string;
  sku: string;
  marginality: number;
  value: string;
  rating: number;
  sparklineData: number[];
  lowMargin: boolean;
}

// Shared visual markup for the KPI micro-card. Both MicroCard (Case 8 good
// path) and MicroCardUnoptimized (Case 8 bad path) render through this and are
// both wrapped in React.memo, so the two are pixel-identical and only differ
// in the one thing Case 8 demonstrates: MicroCard gets reference-stable
// props so memo's comparison actually skips work, while MicroCardUnoptimized
// gets a freshly-spread object and callback every render so the same
// comparison never skips anything — pure overhead on top of the re-render.
export default function MicroCardView({
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
    <FlashOnUpdate caseKey="brokenMemoization">
      <Popover>
        <PopoverTrigger
          nativeButton={false}
          render={
            <Card
              disabled={lowMargin}
              className={cn(
                "py-2.5 px-3",
                !lowMargin && "border-border-strong",
              )}
            />
          }
        >
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-medium text-text-2">
              {title}
            </span>
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
        </PopoverTrigger>
        <PopoverContent sideOffset={-40}>
          <p className="font-medium text-foreground">{title}</p>
          <div className="mt-1 flex items-center gap-1 text-text-3">
            <span>SKU {sku}</span>
            <CopyButton value={sku} label="SKU" />
          </div>
        </PopoverContent>
      </Popover>
    </FlashOnUpdate>
  );
}
