// Mobile card variant of a product row
// Left: square product thumbnail; Right: name, price, logistic status badge
export default function ProductCard() {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-surface p-3">
      {/* thumbnail */}
      <div className="h-14 w-14 shrink-0 rounded-lg bg-raise" />
      <div className="flex flex-col justify-center gap-1">
        <p className="text-sm font-medium text-foreground">Product name</p>
        <p className="text-xs text-muted-foreground">$0.00</p>
        {/* Status badge */}
        <span className="w-fit rounded px-1.5 py-0.5 text-xs bg-raise text-text-2">In Stock</span>
      </div>
    </div>
  );
}
