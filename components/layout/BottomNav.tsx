"use client";

import Link from "next/link";

// Bottom navigation — mobile only (hidden on desktop)
// Large tap targets for switching between two pages
export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-background lg:hidden">
      <Link href="/dashboard" className="flex flex-1 flex-col items-center py-3 text-xs text-text-3 transition-colors hover:text-foreground">
        Dashboard
      </Link>
      <Link href="/inventory" className="flex flex-1 flex-col items-center py-3 text-xs text-text-3 transition-colors hover:text-foreground">
        Inventory
      </Link>
    </nav>
  );
}
