"use client";

import Link from "next/link";

// Bottom navigation — mobile only (hidden on desktop)
// Large tap targets for switching between two pages
export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-zinc-800 bg-zinc-950 lg:hidden">
      <Link href="/dashboard" className="flex flex-1 flex-col items-center py-3 text-xs text-zinc-400">
        Dashboard
      </Link>
      <Link href="/inventory" className="flex flex-1 flex-col items-center py-3 text-xs text-zinc-400">
        Inventory
      </Link>
    </nav>
  );
}
