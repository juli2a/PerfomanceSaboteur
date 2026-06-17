"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard",        Icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory Control", Icon: Package },
];

interface MainNavProps {
  onNavigate?: () => void;
  linkClassName?: string;
}

export default function MainNav({ onNavigate, linkClassName }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1.5">
      <span className="px-3.5 pb-2.5 pt-1.5 text-[10.5px] font-semibold tracking-[1px] text-text-3">
        WORKSPACE
      </span>
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3.25 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
              linkClassName,
              active
                ? "nav-item-active bg-accent-dim font-semibold text-foreground"
                : "text-text-2 hover:bg-raise hover:text-foreground",
            )}
          >
            <Icon size={18} className={active ? "text-accent" : "text-text-3"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
