"use client";

import { useEffect, useState } from "react";
import type { AnalyticCardData } from "@/types/analytics";
import { formatCurrency } from "@/lib/utils/format";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import MicroCard from "@/components/dashboard/MicroCard";

interface Props {
  products: AnalyticCardData[];
}

export function MicroCardsGridClient({ products }: Props) {
  const [threshold, setThreshold] = useState(10);

  useEffect(() => {
    console.log("[Stream] MicroCardsGrid mounted at", new Date().toISOString());
  }, []);

  const activeCount = products.filter((p) => p.marginality >= threshold).length;

  return (
    <Card variant="global">
      <div className="mb-heading-gap flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center justify-between sm:contents">
          <h2 className="heading-2">Analytics Grid</h2>
          <span className="tabular-nums text-xs text-text-3 sm:ml-auto">
            <span className="font-semibold text-foreground">{activeCount}</span>
            <span> / {products.length}</span>
          </span>
        </div>
        <div className="flex items-center justify-end gap-3 text-xs text-text-3">
          <span>Min GM%</span>
          <Slider
            min={0}
            max={40}
            value={threshold}
            onChange={setThreshold}
            className="w-32"
          />
          <span className="w-8 text-right">{threshold}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((p) => (
          <MicroCard
            key={p.id}
            title={p.meta.title}
            sku={p.meta.sku}
            marginality={p.marginality}
            value={formatCurrency(p.metrics.currentValue)}
            rating={p.metrics.rating}
            sparklineData={p.sparklineData}
            lowMargin={p.marginality < threshold}
          />
        ))}
      </div>
    </Card>
  );
}
