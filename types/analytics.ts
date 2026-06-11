export interface KpiData {
  totalRevenue: number;
  totalOrders: number;
  activeClients: number;
  avgCheck: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

// One entry per order. Client aggregates into day/week/month views.
export interface CartEntry {
  timestamp: string; // ISO 8601
  value: number;
}

export interface AnalyticCardData {
  id: string;
  meta: { title: string };
  metrics: {
    currentValue: number;  // price × stock (inventory value)
    rating: number;
  };
  marginality: number;     // discountPercentage used as GM% proxy
  sparklineData: number[];
}

export interface CategoryData {
  name: string;
  slug: string;
  stockValue: number; // sum(price × stock) for all products in this category
  share: number;      // % of total inventory value
  productCount: number;
}

export interface CustomerData {
  id: number;
  name: string;
  company: string;
  ltv: number;
  orders: number;
}
