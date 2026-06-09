import Toolbar from "@/components/inventory/Toolbar";
import ProductTable from "@/components/inventory/ProductTable";

// Server Component — fetches 100 products, amplifies to 2000+ rows server-side
export default async function InventoryPage() {
  return (
    <div className="flex flex-col h-full">
      <Toolbar />
      <ProductTable />
    </div>
  );
}
