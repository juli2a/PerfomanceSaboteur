"use client";

// Virtualised table for 2000+ rows — @tanstack/react-virtual
// Columns: checkbox | thumbnail | name + SKU | category | price | stock | status badge
// Row hover/change triggers Flash on Update highlight
// Mobile: renders ProductCard list instead
export default function ProductTable() {
  return (
    <div className="flex-1 overflow-auto">
      {/* Desktop table */}
      <table className="hidden w-full text-xs lg:table">
        <thead>
          <tr className="border-b border-zinc-800 text-left text-zinc-500">
            <th className="p-3 w-8" />
            <th className="p-3 w-10" />
            <th className="p-3">Name / SKU</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>{/* virtualised rows */}</tbody>
      </table>

      {/* Mobile card list */}
      <div className="lg:hidden p-3 space-y-2">{/* ProductCard components */}</div>
    </div>
  );
}
