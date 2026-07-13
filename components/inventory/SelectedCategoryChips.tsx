"use client";

import { useInventoryFiltersStore } from "@/store/inventory-filters";
import { formatCategoryLabel } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";

export default function SelectedCategoryChips() {
  const selectedCategories = useInventoryFiltersStore(
    (state) => state.categories,
  );
  const toggleCategory = useInventoryFiltersStore(
    (state) => state.toggleCategory,
  );
  const clearCategories = useInventoryFiltersStore(
    (state) => state.clearCategories,
  );

  if (selectedCategories.size === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {[...selectedCategories].map((category) => (
        <Chip key={category} onRemove={() => toggleCategory(category)}>
          {formatCategoryLabel(category)}
        </Chip>
      ))}
      <Button variant="ghost" size="sm" onClick={clearCategories}>
        Clear all
      </Button>
    </div>
  );
}
