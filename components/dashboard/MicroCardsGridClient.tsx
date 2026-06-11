"use client";

import { useEffect, useState } from "react";
import type { AnalyticCardData } from "@/types/analytics";
import { formatCurrency } from "@/lib/utils/format";

interface Props {
  products: AnalyticCardData[];
}

function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 56;
  const H = 24;
  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`
    )
    .join(" ");

  return (
    <svg width={W} height={H} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="#6366f1"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MicroCardsGridClient({ products }: Props) {
  const [threshold, setThreshold] = useState(20);

  useEffect(() => {
    console.log("[Stream] MicroCardsGrid mounted at", new Date().toISOString());
  }, []);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Analytics Grid</h2>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>Min GM%</span>
          <input
            type="range"
            min={0}
            max={50}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-32"
          />
          <span className="w-8 text-right">{threshold}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((p) => {
          const lowMargin = p.marginality < threshold;
          const lowRating = p.metrics.rating < 4;

          return (
            <div
              key={p.id}
              className={[
                "rounded-xl border p-3 transition-colors",
                lowMargin
                  ? "border-red-900/50 bg-red-950/20"
                  : "border-zinc-800 bg-zinc-900",
              ].join(" ")}
            >
              <div className="mb-2 flex items-start justify-between gap-1">
                <p className="line-clamp-2 text-xs font-medium leading-tight text-zinc-200">
                  {p.meta.title}
                </p>
                <span
                  className={[
                    "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
                    lowMargin
                      ? "bg-red-900/50 text-red-400"
                      : "bg-zinc-800 text-zinc-400",
                  ].join(" ")}
                >
                  GM% {p.marginality}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    {formatCurrency(p.metrics.currentValue)}
                  </p>
                  <p
                    className={[
                      "text-[10px] font-medium",
                      lowRating ? "text-red-400" : "text-zinc-400",
                    ].join(" ")}
                  >
                    ★ {p.metrics.rating.toFixed(1)}
                  </p>
                </div>
                <Sparkline data={p.sparklineData} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
