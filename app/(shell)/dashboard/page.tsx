import { Suspense } from "react";
import LiveIndicator from "@/components/dashboard/LiveIndicator";
import TopProductsBanner from "@/components/dashboard/TopProductsBanner";
import KpiGrid from "@/components/dashboard/KpiGrid";
import SalesChart from "@/components/dashboard/SalesChart";
import CategoryAnalytics from "@/components/dashboard/CategoryAnalytics";
import TopCustomers from "@/components/dashboard/TopCustomers";
import MicroCardsGrid from "@/components/dashboard/MicroCardsGrid";
import {
  BannerSkeleton,
  KpiSkeleton,
  ChartSkeleton,
  AnalyticsPairSkeleton,
  MicroCardsSkeleton,
} from "@/components/dashboard/skeletons";

// Server Component — parallel data fetching (Case 5 demo)
// Each Suspense boundary streams independently; getCarts() is shared via React.cache()
// so KpiGrid + SalesChart resolve together at ~700ms without a double fetch.
//
// Streaming order (good path):
//   ~400ms  CategoryAnalytics resolves (getCategories)
//   ~600ms  TopCustomers resolves      (getUsers)     → AnalyticsPair streams
//   ~700ms  KpiGrid + SalesChart       (getCarts)     → two boundaries stream together
//   ~800ms  MicroCardsGrid             (getProducts)
export default function DashboardPage() {
  return (
    <div className="space-y-4.5 px-4 py-4.5 lg:space-y-5.5 lg:p-7.5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1">Dashboard</h1>
          <p className="mt-heading-subtitle-gap hidden text-sm text-text-2 lg:block">
            Merchant analytics overview · last 30 days
          </p>
        </div>
        <div className="hidden items-center gap-3.5 lg:flex">
          <span className="whitespace-nowrap text-[13px] text-text-2">
            Updated{" "}
            <span className="font-semibold tabular-nums text-foreground">
              —
            </span>
          </span>
          <LiveIndicator />
        </div>
      </div>

      <Suspense fallback={<BannerSkeleton />}>
        <TopProductsBanner />
      </Suspense>

      <Suspense fallback={<KpiSkeleton />}>
        <KpiGrid />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <SalesChart />
      </Suspense>

      <Suspense fallback={<AnalyticsPairSkeleton />}>
        <div className="flex flex-col gap-4 lg:flex-row">
          <CategoryAnalytics />
          <TopCustomers />
        </div>
      </Suspense>

      <Suspense fallback={<MicroCardsSkeleton />}>
        <MicroCardsGrid />
      </Suspense>
    </div>
  );
}
