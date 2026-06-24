"use client";

import { useInventorySearchStore } from "@/store/inventory-search";
import { useInventorySearch } from "@/hooks/useInventorySearch";
import { SearchInput } from "@/components/ui/search-input";

export default function InventorySearch() {
  const query = useInventorySearchStore((state) => state.query);
  const setQuery = useInventorySearchStore((state) => state.setQuery);
  useInventorySearch();

  return (
    <SearchInput
      placeholder="Search products or SKU…"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      containerClassName="flex-1 lg:max-w-90"
    />
  );
}
