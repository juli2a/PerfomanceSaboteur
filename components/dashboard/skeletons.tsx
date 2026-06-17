function Shimmer({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-raise ${className}`} />;
}

export function KpiSkeleton() {
  return (
    <section>
      <h2 className="sr-only">KPI Overview</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Shimmer className="h-24" />
        <Shimmer className="h-24" />
        <Shimmer className="h-24" />
        <Shimmer className="h-24" />
      </div>
    </section>
  );
}

export function ChartSkeleton() {
  return <Shimmer className="h-64" />;
}

export function AnalyticsPairSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Shimmer className="h-64" />
      <Shimmer className="h-64" />
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
