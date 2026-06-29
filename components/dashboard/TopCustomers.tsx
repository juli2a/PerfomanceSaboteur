import { getUsers } from "@/lib/server/dashboard";
import { formatCurrency } from "@/lib/utils/format";
import { deriveHue } from "@/lib/utils/derive";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/card";

export default async function TopCustomers() {
  const customers = await getUsers();

  return (
    <Card variant="global" className="lg:flex-1">
      <h2 className="heading-2 mb-heading-gap">Top Customers</h2>
      <ul>
        {customers.map((c, i) => {
          const hue = deriveHue(c.id);
          const initials = c.name
            .split(" ")
            .map((part) => part[0])
            .join("");

          return (
            <li
              key={c.id}
              className={cn(
                "flex items-center gap-3 py-2.5 lg:gap-3.5 lg:py-3",
                i < customers.length - 1 && "border-b border-border",
              )}
            >
              <span
                className="flex size-8.5 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white lg:size-9.5 lg:text-[13px]"
                style={{
                  background: `linear-gradient(135deg, hsl(${hue} 60% 55%), hsl(${hue + 30} 60% 45%))`,
                }}
              >
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {c.name}
                </p>
                <p className="truncate text-[11px] text-text-3 sm:text-xs">
                  {c.company}
                </p>
              </div>
              <div className="text-right">
                <p className="tabular-nums text-sm font-semibold text-foreground">
                  {formatCurrency(c.ltv)}
                </p>
                <p className="text-xs text-text-3">{c.orders} orders</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
