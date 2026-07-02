import { cookies } from "next/headers";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import CaseDetailPanel from "@/components/simulator/control-panel/CaseDetailPanel";
import PerformancePanel from "@/components/simulator/performance-panel/PerformancePanel";
import { getCaseTipContent } from "@/lib/server/case-info";

// Shell layout: Header (with mobile drawer) + Sidebar (desktop) + CaseDetailPanel + PerformancePanel
export default async function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const caseTipContent = getCaseTipContent();

  // Case 2 (Layout Shift): on means the sidebar collapse state has no
  // cookie at all (localStorage-only), so the server can't know it — pretend
  // it doesn't, same as the real broken implementation would.
  const cookieStore = await cookies();
  const isLayoutShiftOn = cookieStore.get("layoutShift")?.value === "on";
  const initialCollapsed = isLayoutShiftOn
    ? false
    : cookieStore.get("sidebarCollapsed")?.value === "on";

  return (
    <div className="flex h-full flex-col">
      <Header
        caseTipContent={caseTipContent}
        isLayoutShiftOn={isLayoutShiftOn}
        initialCollapsed={initialCollapsed}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isLayoutShiftOn={isLayoutShiftOn}
          initialCollapsed={initialCollapsed}
        />
        <main className="flex-1 overflow-auto">{children}</main>
        <CaseDetailPanel caseTipContent={caseTipContent} />
      </div>
      <PerformancePanel />
    </div>
  );
}
