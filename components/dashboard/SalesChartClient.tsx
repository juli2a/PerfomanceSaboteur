"use client";

import { useEffect, useMemo, useState } from "react";
import type { CartEntry, ChartPoint } from "@/types/analytics";
import { formatCurrency } from "@/lib/utils/format";

type Period = "day" | "week" | "month";

interface Props {
  orders: CartEntry[];
}

function aggregateOrders(orders: CartEntry[], period: Period): ChartPoint[] {
  const now = new Date();

  if (period === "day") {
    const todayStr = now.toDateString();
    const hours = new Array<number>(24).fill(0);
    orders
      .filter((o) => new Date(o.timestamp).toDateString() === todayStr)
      .forEach((o) => {
        hours[new Date(o.timestamp).getHours()] += o.value;
      });
    return hours.map((v, i) => ({
      label: `${i.toString().padStart(2, "0")}:00`,
      value: Math.round(v),
    }));
  }

  if (period === "week") {
    const slots = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return {
        dateStr: d.toDateString(),
        label: d.toLocaleString("en-US", { weekday: "short" }),
        value: 0,
      };
    });
    orders.forEach((o) => {
      const dateStr = new Date(o.timestamp).toDateString();
      const slot = slots.find((s) => s.dateStr === dateStr);
      if (slot) slot.value += o.value;
    });
    return slots.map(({ label, value }) => ({ label, value: Math.round(value) }));
  }

  // month
  const slots = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    d.setHours(0, 0, 0, 0);
    return {
      dateStr: d.toDateString(),
      label: `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })}`,
      value: 0,
    };
  });
  orders.forEach((o) => {
    const dateStr = new Date(o.timestamp).toDateString();
    const slot = slots.find((s) => s.dateStr === dateStr);
    if (slot) slot.value += o.value;
  });
  return slots.map(({ label, value }) => ({ label, value: Math.round(value) }));
}

export function SalesChartClient({ orders }: Props) {
  const [period, setPeriod] = useState<Period>("week");

  useEffect(() => {
    console.log("[Stream] SalesChart mounted at", new Date().toISOString());
  }, []);

  const data = useMemo(() => aggregateOrders(orders, period), [orders, period]);
  const max = Math.max(...data.map((p) => p.value), 1);
  const total = data.reduce((s, p) => s + p.value, 0);

  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Revenue</h2>
          <p className="text-xs text-text-2">{formatCurrency(total)} this period</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border-strong p-0.5 text-xs">
          {(["day", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={[
                "rounded px-2 py-1 capitalize transition-colors",
                period === p
                  ? "bg-raise text-foreground"
                  : "text-text-3 hover:text-foreground",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart — recharts replaces this when installed */}
      <div className="flex h-48 items-end gap-px">
        {data.map((point, i) => (
          <div
            key={i}
            title={`${point.label}: ${formatCurrency(point.value)}`}
            className="group relative flex flex-1 flex-col items-center justify-end"
          >
            <div
              className="w-full min-h-px rounded-t bg-primary/70 transition-all group-hover:bg-primary"
              style={{ height: `${(point.value / max) * 100}%` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-text-3">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </section>
  );
}
