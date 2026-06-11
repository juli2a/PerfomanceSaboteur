import { Suspense } from "react";
import LiveIndicator from "@/components/dashboard/LiveIndicator";
import KpiGrid from "@/components/dashboard/KpiGrid";
import SalesChart from "@/components/dashboard/SalesChart";
import CategoryAnalytics from "@/components/dashboard/CategoryAnalytics";
import TopCustomers from "@/components/dashboard/TopCustomers";
import MicroCardsGrid from "@/components/dashboard/MicroCardsGrid";
import {
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
    <div className="p-6 space-y-6">
      <LiveIndicator />

      <Suspense fallback={<KpiSkeleton />}>
        <KpiGrid />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <SalesChart />
      </Suspense>

      <Suspense fallback={<AnalyticsPairSkeleton />}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
