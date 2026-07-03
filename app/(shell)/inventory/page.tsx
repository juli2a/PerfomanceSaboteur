import Toolbar from "@/components/inventory/Toolbar";
import ProductTable from "@/components/inventory/ProductTable";
import { TableSelectionProvider } from "@/context/TableSelectionContext";
import {
  getAmplifiedProducts,
  getInventoryCategories,
} from "@/lib/server/inventory";

// Server Component — fetches 100 products, amplifies to 2000+ rows server-side
export default async function InventoryPage() {
  const [products, categories] = await Promise.all([
    getAmplifiedProducts(),
    getInventoryCategories(),
  ]);

  return (
    <div className="flex h-full flex-col px-4 py-4.5 lg:p-7.5">
      <div className="pb-5">
        <h1 className="heading-1">Inventory Control</h1>
        <p className="mt-heading-subtitle-gap hidden text-sm text-text-2 lg:block">
          2,000 SKUs
        </p>
      </div>
      {/* Case 7 (Context Overhead): shared by Toolbar's Bulk Actions/Select
          All and ProductTable's rows, so whichever selection source is
          active (Zustand or this isolated Context) stays consistent across
          both, not just within the table. */}
      <TableSelectionProvider>
        <Toolbar categories={categories} />
        <ProductTable products={products} />
      </TableSelectionProvider>
    </div>
  );
}
