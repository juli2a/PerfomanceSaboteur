function Shimmer({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-raise ${className}`} />;
}

export function KpiSkeleton() {
  return (
    <section>
      <h2 className="sr-only">KPI Overview</h2>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
        <Shimmer className="h-28.75 sm:h-41.25" />
        <Shimmer className="h-28.75 sm:h-41.25" />
        <Shimmer className="h-28.75 sm:h-41.25" />
        <Shimmer className="h-28.75 sm:h-41.25" />
      </div>
    </section>
  );
}

export function ChartSkeleton() {
  return <Shimmer className="h-75.5 sm:h-78.25" />;
}

export function AnalyticsPairSkeleton() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <Shimmer className="h-64 lg:flex-[0_0_38%]" />
      <Shimmer className="h-64 lg:flex-1" />
    </div>
  );
}

export function MicroCardsSkeleton() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <Shimmer className="h-5 w-32 rounded" />
        <Shimmer className="h-5 w-48 rounded" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <Shimmer key={i} className="h-28" />
        ))}
      </div>
    </section>
  );
}
