import { getCategories } from "@/lib/server/dashboard";
import { formatCurrency } from "@/lib/utils/format";
import { Card } from "@/components/ui/card";

export default async function CategoryAnalytics() {
  const categories = await getCategories();

  return (
    <Card variant="global" className="lg:flex-[0_0_38%]">
      <h2 className="heading-2 mb-heading-gap">Categories</h2>
      <ul className="flex flex-col gap-3.75">
        {categories.map((cat) => (
          <li key={cat.slug} className="flex flex-col gap-1.75">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-foreground">
                {cat.name}
              </span>
              <span className="text-xs text-text-2 lg:text-[13px]">
                <span className="hidden lg:inline">
                  {formatCurrency(cat.stockValue)} ·{" "}
                </span>
                {cat.share}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-xs bg-surface-2">
              <div
                className="h-full rounded-xs bg-linear-to-r from-accent to-accent-2"
                style={{ width: `${Math.min(cat.share * 3, 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
