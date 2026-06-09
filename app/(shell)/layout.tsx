import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import PerformancePanel from "@/components/layout/PerformancePanel";

// Shell layout: Header + Sidebar (desktop) + BottomNav (mobile) + PerformancePanel
export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <BottomNav />
      <PerformancePanel />
    </div>
  );
}
