// Skeleton shown while inventory Server Component amplifies product data
export default function InventoryLoading() {
  return (
    <div className="p-6 space-y-3 animate-pulse">
      <div className="h-10 w-full rounded-lg bg-raise" />
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-12 w-full rounded-lg bg-raise" />
      ))}
    </div>
  );
}
