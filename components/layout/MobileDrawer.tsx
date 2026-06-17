"use client";

import Link from "next/link";
import { X } from "lucide-react";
import Logo from "@/components/layout/Logo";
import MainNav from "@/components/layout/MainNav";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-[rgba(4,6,10,0.62)] backdrop-blur-sm transition-opacity duration-250"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      />

      {/* Drawer */}
      <aside
        className="fixed bottom-0 left-0 top-0 z-41 flex w-71.5 flex-col border-r border-border bg-surface-2 p-4.5 shadow-[10px_0_44px_rgba(0,0,0,0.5)] transition-transform duration-280 ease-[cubic-bezier(0.2,0.7,0.3,1)]"
        style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}
      >
        {/* Header: logo + close */}
        <div className="mb-5 flex items-center justify-between">
          <Link href="/dashboard" onClick={onClose}>
            <Logo size="sm" />
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex items-center p-1 text-text-2"
          >
            <X size={18} />
          </button>
        </div>

        <MainNav onNavigate={onClose} linkClassName="text-[15px]" />

        <div className="flex-1" />
      </aside>
    </>
  );
}
