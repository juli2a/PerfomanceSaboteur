import { getCarts } from "@/lib/server/dashboard";
import { SalesChartClient } from "./SalesChartClient";

export default async function SalesChart() {
  const { orders } = await getCarts();
  return <SalesChartClient orders={orders} />;
}
