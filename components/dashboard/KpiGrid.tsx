import KpiCard from "@/components/dashboard/KpiCard";

// Desktop: 4 cards in a row; Mobile: 2×2 grid or carousel
// Cards: Total Revenue | Orders | Active Clients | Avg. Check
export default function KpiGrid() {
  return (
    <section>
      <h2 className="sr-only">KPI Overview</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard />
        <KpiCard />
        <KpiCard />
        <KpiCard />
      </div>
    </section>
  );
}
