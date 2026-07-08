import { cn } from "@/lib/utils/cn";

function Shimmer({ className }: { className: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-raise", className)} />;
}

export function KpiSkeleton() {
  return (
    <section>
      <h2 className="sr-only">KPI Overview</h2>
      <div className="grid grid-cols-1 gap-3 @min-[340px]:grid-cols-2 @min-[1280px]:grid-cols-4 @min-[1280px]:gap-4">
        <Shimmer className="h-28.75 @min-[640px]:h-41.25" />
        <Shimmer className="h-28.75 @min-[640px]:h-41.25" />
        <Shimmer className="h-28.75 @min-[640px]:h-41.25" />
        <Shimmer className="h-28.75 @min-[640px]:h-41.25" />
      </div>
    </section>
  );
}

export function ChartSkeleton() {
  return <Shimmer className="h-75.5 @min-[640px]:h-78.25" />;
}

export function AnalyticsPairSkeleton() {
  return (
    <div className="flex flex-col gap-4 @min-[1024px]:flex-row">
      <Shimmer className="h-64 @min-[1024px]:flex-[0_0_38%]" />
      <Shimmer className="h-64 @min-[1024px]:flex-1" />
    </div>
  );
}

export function BannerSkeleton() {
  return <Shimmer className="h-75 w-full" />;
}

export function MicroCardsSkeleton() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <Shimmer className="h-5 w-32 rounded" />
        <Shimmer className="h-5 w-48 rounded" />
      </div>
      <div className="grid grid-cols-1 gap-3 @min-[640px]:grid-cols-2 @min-[1024px]:grid-cols-4 @min-[1280px]:grid-cols-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <Shimmer key={i} className="h-28" />
        ))}
      </div>
    </section>
  );
}
