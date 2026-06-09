// Mobile card variant of a product row
// Left: square product thumbnail; Right: name, price, logistic status badge
export default function ProductCard() {
  return (
    <div className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
      {/* thumbnail */}
      <div className="h-14 w-14 shrink-0 rounded bg-zinc-800" />
      <div className="flex flex-col justify-center gap-1">
        <p className="text-sm font-medium text-zinc-100">Product name</p>
        <p className="text-xs text-zinc-400">$0.00</p>
        {/* Status badge */}
        <span className="w-fit rounded px-1.5 py-0.5 text-xs bg-zinc-800 text-zinc-300">In Stock</span>
      </div>
    </div>
  );
}
