import { getCarts } from "@/lib/server/dashboard";
import { formatCurrency, formatCompact } from "@/lib/utils/format";
import KpiCard from "./KpiCard";
import { ClientLogger } from "@/components/simulator/ClientLogger";

export default async function KpiGrid() {
  const { kpi } = await getCarts();
  console.log("KPI Data:", kpi);

  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(kpi.totalRevenue),
      sub: "+12.4% vs last month",
    },
    {
      label: "Orders",
      value: formatCompact(kpi.totalOrders),
      sub: `${kpi.totalOrders} this period`,
    },
    {
      label: "Active Clients",
      value: formatCompact(kpi.activeClients),
      sub: "Unique buyers",
    },
    {
      label: "Avg Check",
      value: formatCurrency(kpi.avgCheck),
      sub: "Per order",
    },
  ];

  return (
    <section>
      <h2 className="sr-only">KPI Overview</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>
      <ClientLogger label="KpiGrid" />
    </section>
  );
}
