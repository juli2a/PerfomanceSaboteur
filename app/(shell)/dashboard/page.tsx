import LiveIndicator from "@/components/dashboard/LiveIndicator";
import KpiGrid from "@/components/dashboard/KpiGrid";
import SalesChart from "@/components/dashboard/SalesChart";
import CategoryAnalytics from "@/components/dashboard/CategoryAnalytics";
import TopCustomers from "@/components/dashboard/TopCustomers";
import MicroCardsGrid from "@/components/dashboard/MicroCardsGrid";

// Server Component — parallel data fetching (Case 5 demo)
export default async function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <LiveIndicator />
      <KpiGrid />
      <SalesChart />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryAnalytics />
        <TopCustomers />
      </div>
      <MicroCardsGrid />
    </div>
  );
}
