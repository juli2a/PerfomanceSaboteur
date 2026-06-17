import { getUsers } from "@/lib/server/dashboard";
import { formatCurrency } from "@/lib/utils/format";
import { ClientLogger } from "@/components/simulator/ClientLogger";
import { Card } from "@/components/ui/card";

export default async function TopCustomers() {
  const customers = await getUsers();

  return (
    <Card variant="global">
      <h2 className="heading-2 mb-2">Top Customers</h2>
      <ul className="space-y-1">
        {customers.map((c, i) => (
          <li
            key={c.id}
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-raise/50"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-raise text-xs text-text-3">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">{c.company}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {formatCurrency(c.ltv)}
              </p>
              <p className="text-xs text-muted-foreground">{c.orders} orders</p>
            </div>
          </li>
        ))}
      </ul>
      <ClientLogger label="TopCustomers" />
    </Card>
  );
}
