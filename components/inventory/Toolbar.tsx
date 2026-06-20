"use client";

import { Search } from "lucide-react";

import { useInventoryFiltersStore } from "@/store/inventory-filters";
import { formatCategoryLabel } from "@/lib/utils/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import CategoryFilter from "@/components/inventory/CategoryFilter";
import BulkActions from "@/components/inventory/BulkActions";

interface ToolbarProps {
  categories: string[];
}

// Desktop: search input + category multi-select + Bulk Actions button
// Mobile: full-width search + filter icon (collapsed) + Bulk Actions hidden
export default function Toolbar({ categories }: ToolbarProps) {
  const selectedCategories = useInventoryFiltersStore(
    (state) => state.categories,
  );
  const toggleCategory = useInventoryFiltersStore(
    (state) => state.toggleCategory,
  );
  const clearCategories = useInventoryFiltersStore(
    (state) => state.clearCategories,
  );

  return (
    <div className="flex flex-col gap-3 bg-background py-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 lg:max-w-90">
          <Search className="pointer-events-none absolute top-1/2 left-3.75 size-4 -translate-y-1/2 text-text-3" />
          <Input
            type="search"
            placeholder="Search products or SKU…"
            className="h-11 border-border bg-surface pl-9.5"
          />
        </div>

        <CategoryFilter categories={categories} />

        <BulkActions />
      </div>

      {selectedCategories.size > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {[...selectedCategories].map((category) => (
            <Chip key={category} onRemove={() => toggleCategory(category)}>
              {formatCategoryLabel(category)}
            </Chip>
          ))}
          <Button variant="ghost" size="xs" onClick={clearCategories}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
