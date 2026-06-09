// Top 5 customers by Lifetime Value (derived deterministically from user.id)
// Each row: avatar (or initials fallback) + name + LTV
// Data: GET /users?limit=100
export default function TopCustomers() {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="mb-3 text-sm font-semibold text-zinc-100">Top Customers</h2>
      {/* Customer rows */}
    </section>
  );
}
