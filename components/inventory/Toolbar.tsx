import CategoryFilter from "@/components/inventory/CategoryFilter";
import BulkActions from "@/components/inventory/BulkActions";
import InventorySearch from "@/components/inventory/InventorySearch";
import SelectedCategoryChips from "@/components/inventory/SelectedCategoryChips";

interface ToolbarProps {
  categories: string[];
}

// Desktop: search input + category multi-select + Bulk Actions button
// Mobile: full-width search + filter icon (collapsed) + Bulk Actions hidden
export default function Toolbar({ categories }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 bg-background py-3">
      <div className="flex items-center gap-3">
        <InventorySearch />
        <CategoryFilter categories={categories} />
        <BulkActions />
      </div>

      <SelectedCategoryChips />
    </div>
  );
}
