import { getUsers } from "@/lib/server/dashboard";
import { formatCurrency } from "@/lib/utils/format";
import { ClientLogger } from "@/components/simulator/ClientLogger";

export default async function TopCustomers() {
  const customers = await getUsers();

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="mb-3 text-sm font-semibold text-zinc-100">Top Customers</h2>
      <ul className="space-y-1">
        {customers.map((c, i) => (
          <li
            key={c.id}
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-zinc-800/50"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-400">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-zinc-200">{c.name}</p>
              <p className="truncate text-xs text-zinc-500">{c.company}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-zinc-100">
                {formatCurrency(c.ltv)}
              </p>
              <p className="text-xs text-zinc-500">{c.orders} orders</p>
            </div>
          </li>
        ))}
      </ul>
      <ClientLogger label="TopCustomers" />
    </section>
  );
}
