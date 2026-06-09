import type { KpiData, ChartPoint, AnalyticCardData } from "@/types/analytics";

// All functions are server-only — called from Server Components
// Each has an artificial delay to simulate realistic microservice latency

// 800ms — products, categories, micro-cards
export async function getProducts() {}

// 700ms — carts for KPI + chart aggregation
export async function getCarts(): Promise<{ kpi: Pick<KpiData, "totalRevenue" | "totalOrders" | "activeClients" | "avgCheck">; chart: ChartPoint[] }> {
  return { kpi: { totalRevenue: 0, totalOrders: 0, activeClients: 0, avgCheck: 0 }, chart: [] };
}

// 600ms — top customers
export async function getUsers() {}

// 400ms — category list with revenue share
export async function getCategories() {}

// Fetches all four in parallel (Case 5 "good" mode)
export async function getDashboardData() {}

// Fetches all four sequentially (Case 5 "bad" mode — waterfall)
export async function getDashboardDataWaterfall() {}
