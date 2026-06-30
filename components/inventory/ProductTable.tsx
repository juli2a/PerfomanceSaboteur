"use client";

import { useContext, useMemo, useRef } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFiltersState,
  type FilterFn,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import type { AmplifiedProduct } from "@/types/inventory";
import { MediaContext } from "@/context/MediaContext";
import { useInventoryFiltersStore } from "@/store/inventory-filters";
import { useInventorySearchStore } from "@/store/inventory-search";
import ProductCard from "@/components/inventory/ProductCard";
import ProductTableRow from "@/components/inventory/ProductTableRow";
import SelectAllCheckbox from "@/components/inventory/SelectAllCheckbox";

const columnHelper = createColumnHelper<AmplifiedProduct>();

// Exact membership check — built-in filterFns either expect the row value
// to be an array (arrIncludes) or do substring matching (includesString),
// neither of which is right for "is this scalar category in the selected set".
const categoryFilterFn: FilterFn<AmplifiedProduct> = (
  row,
  columnId,
  filterValue: Set<string>,
) => filterValue.has(row.getValue(columnId));

// Column order mirrors the visual columns; `size` is the single source of
// truth for desktop column width — read by gridTemplateColumns below
// instead of a hand-maintained CSS string, so columns and layout can't
// drift apart. Unused on the mobile card layout.
const columns = [
  columnHelper.display({ id: "select", size: 44 }),
  columnHelper.display({ id: "thumbnail", size: 60 }),
  columnHelper.accessor("title", { id: "name", size: 320 }),
  columnHelper.accessor("category", {
    id: "category",
    size: 140,
    filterFn: categoryFilterFn,
  }),
  columnHelper.accessor("price", { id: "price", size: 120 }),
  columnHelper.accessor("stock", { id: "stock", size: 80 }),
  columnHelper.accessor("logisticStatus", { id: "status", size: 110 }),
];

// The only column that should flex with available width instead of using
// its own `size` literally.
const FLEX_COLUMN_ID = "name";

const ROW_HEIGHT_PX = 58;
const CARD_HEIGHT_PX = 122;

interface ProductTableProps {
  products: AmplifiedProduct[];
}

// One virtualizer + one scroll container shared by both layouts: switching
// the rendered item template on a breakpoint change (e.g. tablet rotation)
// keeps the same scroll offset, instead of two independent containers each
// tracking their own (and one silently losing its position while hidden).
export default function ProductTable({ products }: ProductTableProps) {
  const isMobile = useContext(MediaContext);
  const selectedCategories = useInventoryFiltersStore(
    (state) => state.categories,
  );
  const matchedIds = useInventorySearchStore((state) => state.matchedIds);

  // Search matches only base DummyJSON ids (1-100, see Toolbar/Case 4) —
  // every batch duplicate beyond the first keeps an id above that range, so
  // this naturally surfaces just the one canonical row per match instead of
  // 20 near-identical "(Batch N)" rows. Pre-filtered here (not via
  // columnFilters) since it narrows the underlying dataset rather than a
  // displayed column's value.
  const searchedProducts = useMemo(
    () => (matchedIds === null ? products : products.filter((product) => matchedIds.has(product.id))),
    [products, matchedIds],
  );

  // Memoized so the reference is stable across renders when the selection
  // hasn't changed — react-table's controlled `state.columnFilters` treats
  // a new reference as a real change and recomputes the filtered row model
  // every render, which (with no compiler memoization on this component —
  // see the useReactTable() opt-out warning below) caused a render storm.
  const columnFilters: ColumnFiltersState = useMemo(
    () =>
      selectedCategories.size > 0
        ? [{ id: "category", value: selectedCategories }]
        : [],
    [selectedCategories],
  );

  const table = useReactTable({
    data: searchedProducts,
    columns,
    state: { columnFilters },
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;
  const visibleProducts = rows.map((row) => ({
    id: row.original.id,
    title: row.original.title,
    sku: row.original.sku,
    logisticStatus: row.original.logisticStatus,
  }));

  const gridTemplateColumns = table
    .getAllColumns()
    .map((column) =>
      column.id === FLEX_COLUMN_ID ? "minmax(0,1fr)" : `${column.getSize()}px`,
    )
    .join(" ");

  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => (isMobile ? CARD_HEIGHT_PX : ROW_HEIGHT_PX),
    overscan: isMobile ? 6 : 10,
  });

  if (isMobile === undefined) return null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border-t">
      <div
        ref={scrollRef}
        className={
          isMobile
            ? "flex-1 overflow-auto p-3"
            : "card-surface-bg flex-1 overflow-auto"
        }
      >
        {!isMobile && (
          <div
            role="row"
            className="sticky top-0 z-10 grid border-border bg-surface-2 px-4 py-3.75 text-left text-xs font-semibold tracking-wide text-text-3 uppercase"
            style={{ gridTemplateColumns }}
          >
            <span role="columnheader">
              <SelectAllCheckbox visibleProducts={visibleProducts} />
            </span>
            <span role="columnheader" />
            <span role="columnheader">Name / SKU</span>
            <span role="columnheader">Category</span>
            <span role="columnheader">Price</span>
            <span role="columnheader">Stock</span>
            <span role="columnheader">Status</span>
          </div>
        )}
        <div
          role="rowgroup"
          style={{ height: virtualizer.getTotalSize(), position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const product = rows[virtualItem.index].original;
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                  paddingBottom: isMobile ? 8 : 0,
                }}
              >
                {isMobile ? (
                  <ProductCard product={product} />
                ) : (
                  <ProductTableRow
                    product={product}
                    gridTemplateColumns={gridTemplateColumns}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
