import { cookies } from "next/headers";
import { getCarts } from "@/lib/server/dashboard";
import { SalesChartClient } from "./SalesChartClient";

export default async function SalesChart() {
  const cookieStore = await cookies();
  const isUnstable = cookieStore.get("layoutShift")?.value === "on";
  const { salesChart } = await getCarts();
  return <SalesChartClient data={salesChart} isUnstable={isUnstable} />;
}
