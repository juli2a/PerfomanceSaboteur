import {
  getCarts,
  getProducts,
  getUsers,
  getCategories,
} from "@/lib/server/dashboard";
import TopProductsBanner from "@/components/dashboard/TopProductsBanner";
import { KpiGridView } from "@/components/dashboard/KpiGridView";
import { SalesChartClient } from "@/components/dashboard/SalesChartClient";
import { CategoryAnalyticsView } from "@/components/dashboard/CategoryAnalyticsView";
import { TopCustomersView } from "@/components/dashboard/TopCustomersView";
import { MicroCardsGridClient } from "@/components/dashboard/MicroCardsGridClient";

// Bad path (toggle on, Case 5): every request — including the banner's,
// reusing <TopProductsBanner /> as-is rather than duplicating its cookie
// read and fetch — is awaited one after another, then the already-resolved
// data is handed straight to the same presentational *View/*Client
// components DashboardContent streams. No per-section fetch, no Suspense
// anywhere: the whole page is fetched the same (wrong) way, not just a
// subset of it. Awaited directly in DashboardPage (not wrapped in
// Suspense), so Next.js can't flush a single byte until this whole chain
// settles — the delay lands squarely on TTFB, regardless of which request
// happens to run first.
export async function DashboardContentUnoptimized() {
  const { kpi, salesChart } = await getCarts(); // ~700ms
  const products = await getProducts(); // then +800ms
  const users = await getUsers(); // then +600ms
  const categories = await getCategories(); // then +400ms
  // then the banner's own fetch, resolved by React itself since nothing
  // above wraps it in Suspense — total ≈ 2750ms

  return (
    <>
      <TopProductsBanner />
      <KpiGridView kpi={kpi} />
      <SalesChartClient data={salesChart} />
      <div className="flex flex-col gap-4 lg:flex-row">
        <CategoryAnalyticsView categories={categories} />
        <TopCustomersView customers={users} />
      </div>
      <MicroCardsGridClient products={products} />
    </>
  );
}
