"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { ChartPoint } from "@/types/analytics";
import { formatCurrency } from "@/lib/utils/format";

interface Props {
  data: ChartPoint[];
}

export default function SalesChartCanvas({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={192}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--color-chart-1)", stopOpacity: 0.35 }} />
            <stop offset="100%" style={{ stopColor: "var(--color-chart-1)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" hide />
        <Tooltip
          cursor={{ stroke: "var(--color-border-strong)" }}
          content={({ active, payload }) => {
            const point = payload?.[0]?.payload as ChartPoint | undefined;
            if (!active || !point) return null;
            return (
              <div className="rounded-md border border-border-strong bg-popover px-2 py-1 text-xs shadow-lg">
                <p className="text-text-3">{point.label}</p>
                <p className="font-medium text-foreground">{formatCurrency(point.value)}</p>
                <p className="text-text-3">
                  {point.count} order{point.count === 1 ? "" : "s"}
                </p>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-chart-1)"
          strokeWidth={1.8}
          fill="url(#salesGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
