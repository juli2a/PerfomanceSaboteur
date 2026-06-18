"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import MainNav from "@/components/layout/MainNav";

export default function Sidebar() {
  return (
    <aside className="hidden w-[248px] shrink-0 flex-col overflow-y-auto border-r border-border bg-surface-2 lg:flex pb-15">
      <div className="p-4.5">
        <MainNav />
      </div>

      <div className="flex-1" />

      {/* DEV ONLY — button variants preview */}
      <div className="flex flex-col items-start gap-3 border-t border-border p-4">
        <Button variant="default">Bulk Actions</Button>
        <Button variant="outline" className="px-6.5">
          Cancel
        </Button>
        <Button variant="secondary" size="sm">
          Change
        </Button>
        <Button variant="ghost" size="sm" weight="medium" className="px-2">
          Clear all
        </Button>
        <Button variant="brand" size="sm" className="text-xs">
          Controls
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-xs">
            ✕
          </Button>
          <Button variant="ghost" size="icon-sm">
            ✕
          </Button>
          <Button variant="ghost" size="icon">
            ✕
          </Button>
          <Button variant="ghost" size="icon-lg">
            ✕
          </Button>
        </div>
      </div>

      {/* DEV ONLY — badge variants preview */}
      <div className="flex flex-col gap-3 border-t border-border p-4">
        {/* status — 5 tones, default size, dot */}
        <div className="flex flex-wrap gap-2">
          <Badge tone="instock" dot>
            In Stock
          </Badge>
          <Badge tone="toorder" dot>
            To Order
          </Badge>
          <Badge tone="ordered" dot>
            Ordered
          </Badge>
          <Badge tone="transit" dot>
            In Transit
          </Badge>
          <Badge tone="outofstock" dot>
            Out of Stock
          </Badge>
        </div>

        {/* signal default — vitals style (dot) */}
        <div className="flex gap-2">
          <Badge tone="pos" dot>
            Good
          </Badge>
          <Badge tone="alert" dot>
            Bad
          </Badge>
        </div>

        {/* signal sm — delta style (no dot) */}
        <div className="flex gap-2">
          <Badge tone="pos" size="sm">
            +12.4%
          </Badge>
          <Badge tone="alert" size="sm">
            -3.1%
          </Badge>
        </div>
      </div>

      {/* DEV ONLY — checkbox variants preview */}
      <div className="flex items-center gap-3 border-t border-border p-4">
        <Checkbox defaultChecked />
        <Checkbox disabled />
        <Checkbox disabled defaultChecked />
      </div>

      {/* DEV ONLY — input variants preview */}
      <div className="flex flex-col gap-3 border-t border-border p-4">
        <Input placeholder="Search products or SKU…" />
        <Input placeholder="Disabled" disabled />
        <Input placeholder="Invalid" aria-invalid />
      </div>
    </aside>
  );
}
