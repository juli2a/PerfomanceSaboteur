"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import ControlPanel from "@/components/layout/ControlPanel";
import MobileDrawer from "@/components/layout/MobileDrawer";
import Logo from "@/components/layout/Logo";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 flex h-[60px] items-center border-b border-border bg-surface-2 lg:h-24">
        {/* ── Desktop (lg+): logo zone (width matches sidebar) ── */}
        <Link
          href="/dashboard"
          className="hidden w-[248px] shrink-0 items-center pl-4.5 lg:flex"
        >
          <Logo size="md" />
        </Link>

        {/* ── Mobile: hamburger ── */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="flex items-center p-4 text-text-2 lg:hidden"
        >
          <Menu size={21} />
        </button>

        {/* ── <640: logo, left after the hamburger ── */}
        <Link href="/dashboard" className="flex items-center sm:hidden">
          <Logo size="sm" />
        </Link>

        {/* ── 640–1024: centered desktop logo (hamburger still shown) ── */}
        <Link
          href="/dashboard"
          className="absolute left-1/2 hidden -translate-x-1/2 sm:flex lg:hidden"
        >
          <Logo size="md" />
        </Link>

        {/* ── Desktop: control panel + timestamp ── */}
        <div className="hidden flex-1 items-center gap-[18px] px-[30px] lg:flex">
          <ControlPanel />

          <span className="shrink-0 text-[12.5px] text-text-2">
            Updated <span className="tabular-nums text-foreground">—</span>
          </span>
        </div>

        {/* ── Mobile: Controls button ── */}
        <button
          aria-label="Open simulator controls"
          className="relative z-10 ml-auto mr-4 flex items-center gap-1.75 rounded-2.5 border border-brand-border bg-brand-bg px-2.75 py-1.75 font-brand text-[12px] font-semibold text-brand-text shadow-[0_0_0_1px_var(--brand-accent-dim)] lg:hidden"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-accent shadow-[0_0_7px_var(--brand-accent)]" />
          Controls
        </button>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
