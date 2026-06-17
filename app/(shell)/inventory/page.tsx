import Toolbar from "@/components/inventory/Toolbar";
import ProductTable from "@/components/inventory/ProductTable";

// Server Component — fetches 100 products, amplifies to 2000+ rows server-side
export default async function InventoryPage() {
  return (
    <div className="flex h-full flex-col px-4 py-4.5 lg:p-7.5">
      <div className="pb-5">
        <h1 className="heading-1">Inventory Control</h1>
        <p className="mt-heading-subtitle-gap hidden text-sm text-text-2 lg:block">
          2,000 SKUs across 18 warehouses
        </p>
      </div>
      <Toolbar />
      <ProductTable />
    </div>
  );
}
