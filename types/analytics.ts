// Shared data types for Dashboard page

export interface KpiData {
  totalRevenue: number;
  totalOrders: number;
  activeClients: number;
  avgCheck: number;
}

export interface ChartPoint {
  label: string;   // "Mon", "12 Jun", "Jun"
  value: number;
}

export interface AnalyticCardData {
  id: string;
  meta: {
    title: string;   // "Smartphones — Kyiv"
    region: string;
  };
  metrics: {
    currentValue: number;
    previousValue: number;
    trends: { percentage: number; direction: "up" | "down" };
  };
  marginality: number;       // = product.discountPercentage (0–67%)
  sparklineData: number[];   // 7 deterministic points
}
