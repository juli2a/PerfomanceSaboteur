import { getCategories } from "@/lib/server/dashboard";
import { formatCurrency } from "@/lib/utils/format";
import { ClientLogger } from "@/components/simulator/ClientLogger";

export default async function CategoryAnalytics() {
  const categories = await getCategories();

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="mb-3 text-sm font-semibold text-zinc-100">Categories</h2>
      <ul className="space-y-3">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="capitalize text-zinc-300">{cat.name}</span>
              <span className="text-zinc-500">{formatCurrency(cat.stockValue)}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-800">
              <div
                className="h-1.5 rounded-full bg-indigo-500"
                style={{ width: `${cat.share}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <ClientLogger label="CategoryAnalytics" />
    </section>
  );
}
