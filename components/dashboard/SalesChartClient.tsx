"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { ChartPoint, SalesChartData } from "@/types/analytics";
import { formatCurrency } from "@/lib/utils/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Period = "day" | "week" | "month";

interface Props {
  data: SalesChartData;
}

export function SalesChartClient({ data: salesChart }: Props) {
  const [period, setPeriod] = useState<Period>("week");

  const data = salesChart[period];
  const total = data.reduce((s, p) => s + p.value, 0);

  return (
    <Card variant="global">
      <div className="mb-heading-gap flex items-center justify-between">
        <div>
          <h2 className="heading-2">Revenue</h2>
          <p className="text-xs text-text-2">
            {formatCurrency(total)} this period
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border-strong p-0.5">
          {(["day", "week", "month"] as Period[]).map((p) => (
            <Button
              key={p}
              type="button"
              size="sm"
              variant={period === p ? "default" : "ghost"}
              onClick={() => setPeriod(p)}
              className="border capitalize"
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
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
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-text-3">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </Card>
  );
}
