import { cookies } from "next/headers";
import LiveIndicator from "@/components/dashboard/LiveIndicator";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardContentUnoptimized } from "@/components/dashboard/DashboardContentUnoptimized";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const isWaterfallOn = cookieStore.get("waterfall")?.value === "on";

  return (
    <div className="space-y-4.5 px-4 py-4.5 lg:space-y-5.5 lg:p-7.5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1">Dashboard</h1>
          <p className="mt-heading-subtitle-gap hidden text-sm text-text-2 lg:block">
            Merchant analytics overview · last 30 days
          </p>
        </div>
        <div className="hidden items-center gap-3.5 lg:flex">
          <span className="whitespace-nowrap text-[13px] text-text-2">
            Updated{" "}
            <span className="font-semibold tabular-nums text-foreground">
              —
            </span>
          </span>
          <LiveIndicator />
        </div>
      </div>

      {isWaterfallOn ? <DashboardContentUnoptimized /> : <DashboardContent />}
    </div>
  );
}
