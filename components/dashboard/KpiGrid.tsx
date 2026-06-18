import { getCarts } from "@/lib/server/dashboard";
import { formatCurrency, formatCompact, formatCompactCurrency } from "@/lib/utils/format";
import KpiCard from "./KpiCard";
import { ClientLogger } from "@/components/simulator/ClientLogger";

export default async function KpiGrid() {
  const { kpi } = await getCarts();
  console.log("KPI Data:", kpi);

  const cards = [
    {
      label: "Total Revenue",
      value: formatCompactCurrency(kpi.totalRevenue.value),
      deltaPercent: kpi.totalRevenue.deltaPercent,
      spark: kpi.totalRevenue.spark,
    },
    {
      label: "Orders",
      value: formatCompact(kpi.totalOrders.value),
      deltaPercent: kpi.totalOrders.deltaPercent,
      spark: kpi.totalOrders.spark,
    },
    {
      label: "Active Clients",
      value: formatCompact(kpi.activeClients.value),
      deltaPercent: kpi.activeClients.deltaPercent,
      spark: kpi.activeClients.spark,
    },
    {
      label: "Avg Check",
      value: formatCurrency(kpi.avgCheck.value),
      deltaPercent: kpi.avgCheck.deltaPercent,
      spark: kpi.avgCheck.spark,
    },
  ];

  return (
    <section>
      <h2 className="sr-only">KPI Overview</h2>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
        {cards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>
      <ClientLogger label="KpiGrid" />
    </section>
  );
}
