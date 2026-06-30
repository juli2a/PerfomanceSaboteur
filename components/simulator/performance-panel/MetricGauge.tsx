import { getGaugePercent, getRatingPresentation } from "@/lib/utils/gauge";
import type { VitalRating } from "@/types/simulator";

interface MetricGaugeProps {
  label: string;
  display: string;
  value: number;
  poorThreshold: number;
  rating: VitalRating | null;
  size?: number;
}

const STROKE_WIDTH = 4;
const TRACK_COLOR = "rgba(255,255,255,0.08)";

// Single circular CWV gauge (LCP/CLS/INP) — fill % and color come from
// lib/utils/gauge.ts, not a plain value/max ratio. `rating: null` (no
// reading yet) renders an empty neutral ring instead of presupposing "good".
export default function MetricGauge({
  label,
  display,
  value,
  poorThreshold,
  rating,
  size = 46,
}: MetricGaugeProps) {
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = rating ? getGaugePercent(value, poorThreshold) / 100 : 0;
  const color = rating ? getRatingPresentation(rating).color : TRACK_COLOR;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative grid place-items-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={TRACK_COLOR}
            strokeWidth={STROKE_WIDTH}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - percent)}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[13px] font-semibold text-foreground">
          {display}
        </span>
      </div>
      <span className="text-[13px] text-text-2">{label}</span>
    </div>
  );
}
