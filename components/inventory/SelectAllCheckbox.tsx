"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useInventorySelectionStore, type SelectedProduct } from "@/store/inventory-selection";

interface SelectAllCheckboxProps {
  visibleProducts: SelectedProduct[];
}

// Reads the full selection set — kept out of the row list so its re-render
// never cascades into ProductTableRow's atomic per-row subscriptions.
export default function SelectAllCheckbox({ visibleProducts }: SelectAllCheckboxProps) {
  const selected = useInventorySelectionStore((state) => state.selected);
  const setSelection = useInventorySelectionStore((state) => state.setSelection);

  const allVisibleSelected =
    visibleProducts.length > 0 && visibleProducts.every((product) => selected.has(product.id));

  return (
    <Checkbox
      checked={allVisibleSelected}
      onCheckedChange={(checked) => setSelection(visibleProducts, checked)}
      aria-label="Select all visible products"
    />
  );
}
