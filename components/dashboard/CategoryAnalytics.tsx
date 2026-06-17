import { getCategories } from "@/lib/server/dashboard";
import { formatCurrency } from "@/lib/utils/format";
import { ClientLogger } from "@/components/simulator/ClientLogger";
import { Card } from "@/components/ui/card";

export default async function CategoryAnalytics() {
  const categories = await getCategories();

  return (
    <Card variant="global">
      <h2 className="heading-2 mb-heading-gap">Categories</h2>
      <ul className="space-y-3">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="capitalize text-text-2">{cat.name}</span>
              <span className="text-text-2">{formatCurrency(cat.stockValue)}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-raise">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${cat.share}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <ClientLogger label="CategoryAnalytics" />
    </Card>
  );
}
