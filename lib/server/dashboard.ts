import { cache } from "react";
import { apiFetch } from "@/lib/server/fetcher";
import { deriveLtv, deriveSparkline } from "@/lib/utils/derive";
import type {
  KpiData,
  CartEntry,
  AnalyticCardData,
  CategoryData,
  CustomerData,
} from "@/types/analytics";

// ─── DummyJSON shapes ──────────────────────────────────────────────────────────

interface DummyCart {
  id: number;
  discountedTotal: number;
  userId: number;
}

interface DummyProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  sku: string;
}

interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  company: { name: string };
}

// ─── Simulation params (stable within a calendar day) ─────────────────────────
// ordersCount: orders to fetch (130–150); usersCount: unique user pool (90–120, always < ordersCount).
// Both derived from today's date so all Suspense streams stay consistent
// without coupling getCarts ↔ getUsers at runtime.

function getDailySimConfig(): { ordersCount: number; usersCount: number } {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return {
    ordersCount: 130 + (seed % 21),
    usersCount: 90 + (seed % 31),
  };
}

// Biases order timestamps toward later hours (peak ~16–18h).
// Math.max(r1, r2) skews the uniform distribution rightward.
function setRealisticTime(d: Date): Date {
  const r1 = Math.random();
  const r2 = Math.random();
  const hour = Math.floor(Math.max(r1, r2) * 24);
  const minute = Math.floor(Math.random() * 60);
  d.setHours(hour, minute, 0, 0);
  return d;
}

// ─── Memoised per-request fetchers ────────────────────────────────────────────
// React.cache deduplicates within a single render pass:
// KpiGrid and SalesChart both call getCarts() but trigger only one fetch.

export const getCarts = cache(
  async (): Promise<{ kpi: KpiData; orders: CartEntry[] }> => {
    await new Promise((r) => setTimeout(r, 700));

    const { ordersCount, usersCount } = getDailySimConfig();

    const { carts } = await apiFetch<{ carts: DummyCart[] }>(
      `/carts?limit=${ordersCount}`,
    );
    const actualOrdersCount = carts.length; // actual count in case API returns fewer than requested
    console.log("[getCarts] fetched", actualOrdersCount, "carts");

    // Build dayCounts: 30 slots, one per calendar day (oldest → newest).
    // Every day is guaranteed at least 1 order; remaining actualOrdersCount-30 are scattered
    // randomly so the chart has natural variance.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayCounts: Array<{ date: Date; count: number }> = Array.from(
      { length: 30 },
      (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (29 - i));
        return { date: d, count: 1 };
      },
    );

    for (let i = 30; i < actualOrdersCount; i++) {
      dayCounts[Math.floor(Math.random() * 30)].count++;
    }

    // Drain: assign each cart a concrete timestamp.
    // daySlotIdx advances when a day-slot is exhausted — no array mutation.
    let daySlotIdx = 0;
    const orders: CartEntry[] = carts.map((cart) => {
      const d = setRealisticTime(new Date(dayCounts[daySlotIdx].date));

      dayCounts[daySlotIdx].count--;
      if (dayCounts[daySlotIdx].count === 0) daySlotIdx++;

      return { timestamp: d.toISOString(), value: cart.discountedTotal };
    });

    const totalRevenue = Math.round(
      orders.reduce((sum, order) => sum + order.value, 0),
    );
    const avgCheck = Math.round(totalRevenue / actualOrdersCount);

    console.log("[getCarts] KPI:", {
      totalRevenue,
      totalOrders: actualOrdersCount,
      activeClients: usersCount,
      avgCheck,
    });

    return {
      kpi: {
        totalRevenue,
        totalOrders: actualOrdersCount,
        activeClients: usersCount,
        avgCheck,
      },
      orders,
    };
  },
);

export const getProducts = cache(async (): Promise<AnalyticCardData[]> => {
  await new Promise((r) => setTimeout(r, 800));

  const { products } = await apiFetch<{ products: DummyProduct[] }>(
    "/products?limit=100",
  );

  return products.map((p) => ({
    id: String(p.id),
    meta: { title: p.title, sku: p.sku },
    metrics: {
      currentValue: Math.round(p.price * p.stock),
      rating: p.rating,
    },
    marginality: Math.round(p.discountPercentage),
    sparklineData: deriveSparkline(p.id, p.price),
  }));
});

export const getUsers = cache(async (): Promise<CustomerData[]> => {
  await new Promise((r) => setTimeout(r, 600));

  // usersCount is the same user-pool size that getCarts uses for activeClients,
  // derived from the same daily seed — no runtime dependency between the two.
  const { usersCount } = getDailySimConfig();

  const { users } = await apiFetch<{ users: DummyUser[] }>(
    `/users?limit=${usersCount}`,
  );
  console.log(
    "[getUsers] fetched",
    users.length,
    "users (pool usersCount =",
    usersCount,
    ")",
  );

  return users
    .map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      company: u.company.name,
      ltv: deriveLtv(u.id, u.age),
      orders: (u.id % 10) + 1,
    }))
    .sort((a, b) => b.ltv - a.ltv)
    .slice(0, 5);
});

export const getCategories = cache(async (): Promise<CategoryData[]> => {
  await new Promise((r) => setTimeout(r, 400));

  const { products } = await apiFetch<{
    products: Pick<DummyProduct, "id" | "category" | "price" | "stock">[];
  }>("/products?limit=100&select=id,category,price,stock");
  console.log("[getCategories] fetched", products.length, "products");

  const buckets: Record<string, { stockValue: number; count: number }> = {};
  let grandTotal = 0;

  for (const p of products) {
    const value = p.price * p.stock;
    buckets[p.category] ??= { stockValue: 0, count: 0 };
    buckets[p.category].stockValue += value;
    buckets[p.category].count += 1;
    grandTotal += value;
  }

  return Object.entries(buckets)
    .map(([slug, { stockValue, count }]) => ({
      name: slug.replace(/-/g, " "),
      slug,
      stockValue: Math.round(stockValue),
      share: Math.round((stockValue / grandTotal) * 100),
      productCount: count,
    }))
    .sort((a, b) => b.stockValue - a.stockValue)
    .slice(0, 8);
});

// ─── Composite fetchers (Case 5) ───────────────────────────────────────────────

export async function getDashboardData() {
  return Promise.all([getCarts(), getProducts(), getUsers(), getCategories()]);
}

// Sequential — every call blocks the next; total latency ≈ 700+800+600+400 = 2500ms
export async function getDashboardDataWaterfall() {
  const carts = await getCarts();
  const products = await getProducts();
  const users = await getUsers();
  const categories = await getCategories();
  return { carts, products, users, categories };
}
