"use client";

import Link from "next/link";

// Left vertical nav — desktop only (hidden on mobile)
// Links: Dashboard, Inventory Control
export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-zinc-800 bg-zinc-950 lg:flex lg:flex-col">
      <nav className="flex flex-col gap-1 p-3">
        <Link href="/dashboard" className="rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
          Dashboard
        </Link>
        <Link href="/inventory" className="rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
          Inventory Control
        </Link>
      </nav>
    </aside>
  );
}
