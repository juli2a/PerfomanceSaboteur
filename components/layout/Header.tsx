"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import ControlPanel from "@/components/simulator/control-panel/ControlPanel";
import MobileControlSheet from "@/components/simulator/control-panel/MobileControlSheet";
import MobileDrawer from "@/components/layout/MobileDrawer";
import Logo from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useSyncControlsAcrossBreakpoint } from "@/hooks/useSyncControlsAcrossBreakpoint";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { useSimControlStore } from "@/store/simulator-control";
import type { CaseKey } from "@/types/simulator";

interface HeaderProps {
  caseTipContent: Partial<Record<CaseKey, React.ReactNode>>;
  isLayoutShiftOn: boolean;
  initialCollapsed: boolean;
}

export default function Header({
  caseTipContent,
  isLayoutShiftOn,
  initialCollapsed,
}: HeaderProps) {
  useSyncControlsAcrossBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const controlsOpen = useSimControlStore((state) => state.controlsOpen);
  const setControlsOpen = useSimControlStore((state) => state.setControlsOpen);
  const toggles = useSimControlStore((state) => state.toggles);
  const hasActiveAntiPattern = Object.values(toggles).some(Boolean);
  const { collapsed: sidebarCollapsed } = useSidebarCollapsed(
    isLayoutShiftOn,
    initialCollapsed,
  );

  return (
    <>
      <header className="sticky top-0 z-50 flex h-[60px] items-center border-b border-border bg-surface-2 lg:h-24">
        {/* ── Desktop (lg+): logo zone (width tracks the sidebar) ──
            pl-heading-gap is constant (not toggled) so the badge stays
            left-anchored — toggling justify-center here would snap it to
            the middle of the still-wide box instantly (justify-content
            can't transition), then it'd visibly drift left as the width
            shrinks. */}
        <Link
          href="/dashboard"
          className={cn(
            "hidden shrink-0 items-center pl-heading-gap transition-[width] duration-280 lg:flex",
            sidebarCollapsed ? "w-[76px]" : "w-[248px]",
          )}
        >
          <Logo size="md" iconOnly={sidebarCollapsed} animated />
        </Link>

        {/* ── Mobile: hamburger (toggles the drawer; the drawer itself owns
            the X close button) ── */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setDrawerOpen((open) => !open)}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          className="ml-4 mr-4 lg:hidden"
        >
          <Menu size={18} />
        </Button>

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

        {/* ── Desktop: control panel (stretches full width) ── */}
        <div className="hidden min-w-0 flex-1 items-center pl-[30px] lg:flex">
          <ControlPanel />
        </div>

        {/* ── Mobile: Controls button ── */}
        <Button
          variant="brand"
          size="sm"
          onClick={() => setControlsOpen(true)}
          aria-label="Open simulator controls"
          className="relative z-10 ml-auto mr-4 lg:hidden"
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full mr-1",
              hasActiveAntiPattern
                ? "bg-brand-accent shadow-[0_0_7px_var(--brand-accent)]"
                : "bg-brand-muted",
            )}
          />
          Controls
        </Button>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <MobileControlSheet
        open={controlsOpen}
        onOpenChange={setControlsOpen}
        caseTipContent={caseTipContent}
      />
    </>
  );
}
