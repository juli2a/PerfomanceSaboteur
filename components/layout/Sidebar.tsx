"use client";

import Link from "next/link";

// Left vertical nav — desktop only (hidden on mobile)
// Links: Dashboard, Inventory Control
export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-surface-2 lg:flex lg:flex-col">
      <nav className="flex flex-col gap-1 p-3">
        <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm text-text-2 transition-colors hover:bg-raise hover:text-foreground">
          Dashboard
        </Link>
        <Link href="/inventory" className="rounded-lg px-3 py-2 text-sm text-text-2 transition-colors hover:bg-raise hover:text-foreground">
          Inventory Control
        </Link>
      </nav>
    </aside>
  );
}
