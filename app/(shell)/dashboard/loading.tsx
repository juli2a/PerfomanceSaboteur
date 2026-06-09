// Skeleton shown while dashboard Server Component fetches data
export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-24 rounded-xl bg-zinc-800" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-zinc-800" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-zinc-800" />
    </div>
  );
}
