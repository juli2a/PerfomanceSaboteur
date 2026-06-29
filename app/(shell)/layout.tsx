import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import CaseDetailPanel from "@/components/simulator/control-panel/CaseDetailPanel";
import PerformancePanel from "@/components/simulator/performance-panel/PerformancePanel";
import { getCaseTipContent } from "@/lib/server/case-info";

// Shell layout: Header (with mobile drawer) + Sidebar (desktop) + CaseDetailPanel + PerformancePanel
export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const caseTipContent = getCaseTipContent();

  return (
    <div className="flex h-full flex-col">
      <Header caseTipContent={caseTipContent} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
        <CaseDetailPanel caseTipContent={caseTipContent} />
      </div>
      <PerformancePanel />
    </div>
  );
}
