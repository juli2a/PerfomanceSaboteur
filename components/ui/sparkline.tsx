import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { deriveTrend } from "@/lib/utils/derive";

interface SparklineProps {
  data: number[];
  isGood?: boolean;
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
}

export function Sparkline({
  data,
  isGood,
  width = 92,
  height = 30,
  strokeWidth = 1.8,
  className,
}: SparklineProps) {
  const edgePad = strokeWidth + 1;
  const isTrendingUp = isGood ?? deriveTrend(data);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => [
    edgePad + (index / (data.length - 1)) * (width - edgePad * 2),
    height - edgePad - ((value - min) / range) * (height - edgePad * 2),
  ]);

  const line = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${point[0].toFixed(1)},${point[1].toFixed(1)}`,
    )
    .join(" ");
  const area = `${line} L${points.at(-1)![0].toFixed(1)},${height} L${points[0][0].toFixed(1)},${height} Z`;
  const color = isTrendingUp ? "var(--color-accent)" : "var(--color-alert)";
  const gradientId = React.useId();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={isTrendingUp ? "Trending up" : "Trending down"}
      className={cn("shrink-0 overflow-visible", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.34} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
