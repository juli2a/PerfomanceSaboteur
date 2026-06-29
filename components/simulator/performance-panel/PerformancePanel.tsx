"use client";

import { CLSThresholds, INPThresholds, LCPThresholds } from "web-vitals";

import { getSimulatorCase } from "@/lib/simulator-toggles";
import {
  getOverallRating,
  getRatingPresentation,
  getValueRating,
} from "@/lib/utils/gauge";
import { formatNumber } from "@/lib/utils/format";
import { useSimControlStore } from "@/store/simulator-control";
import { useSimPerformanceStore } from "@/store/simulator-performance";
import { Badge } from "@/components/ui/badge";
import MetricGauge from "@/components/simulator/performance-panel/MetricGauge";
import MetricStat from "@/components/simulator/performance-panel/MetricStat";
import SimulatorAlert from "@/components/simulator/performance-panel/SimulatorAlert";
import type { CaseKey } from "@/types/simulator";

const LCP_POOR = LCPThresholds[1];
const CLS_POOR = CLSThresholds[1];
const INP_GOOD = INPThresholds[0];
const INP_POOR = INPThresholds[1];

// Blocking Time has no official Google threshold (it's our own Long-Tasks
// reading, not a CWV). 100ms is the classic "still feels instant" cutoff
// (Nielsen's response-time heuristic) — the Long Tasks API floor is 50ms, so
// without this a barely-over-the-floor task would read as "degraded" for no real
// reason. 500ms+ matches the same severity register as INP_POOR, which is
// the order of magnitude our Case 3 freeze produces.
const BLOCKING_TIME_GOOD = 100;
const BLOCKING_TIME_POOR = 500;

// Floating widget in the corner of the screen
// Desktop: full panel; Mobile: compact dot indicators, expands on tap
// Displays: LCP, CLS, INP gauges, DOM element count, Blocking Time,
// Interaction Latency
// Case-specific alerts stack above the panel, one SimulatorAlert per case
// whose caseAlerts[key] === "shown" — new cases need no extra wiring here,
// they just call triggerAlert/dismissAlert/closeAlert from their own domain logic.
// domNodes/blockingTime/interactionLatency are written elsewhere (the
// useDomNodesReporter/useBlockingTimeReporter/useInteractionLatencyReporter
// hooks, all called from SimulatorReporters in the root layout) — this
// component only reads the store, it doesn't measure anything itself.
export default function PerformancePanel() {
  const caseAlerts = useSimControlStore((state) => state.caseAlerts);
  const dismissAlert = useSimControlStore((state) => state.dismissAlert);
  const shownAlertKeys = (Object.keys(caseAlerts) as CaseKey[]).filter(
    (key) => caseAlerts[key] === "shown",
  );

  const vitals = useSimPerformanceStore((state) => state.vitals);
  const domNodes = useSimPerformanceStore((state) => state.domNodes);
  const blockingTime = useSimPerformanceStore((state) => state.blockingTime);
  const interactionLatency = useSimPerformanceStore(
    (state) => state.interactionLatency,
  );

  const overallRating = getOverallRating([
    vitals.lcp?.rating ?? null,
    vitals.cls?.rating ?? null,
    vitals.inp?.rating ?? null,
  ]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[470px] flex-col gap-2.5">
      {shownAlertKeys.map((key) => {
        const { title, body } = getSimulatorCase(key).alert;
        return (
          <SimulatorAlert
            key={key}
            title={title}
            body={body}
            onDismiss={() => dismissAlert(key)}
          />
        );
      })}
      <aside className="sim-card h-36.5 flex-col items-stretch justify-between gap-3 text-brand-text">
        <div className="flex items-center justify-between gap-2.5">
          <span className="flex min-w-0 items-center gap-1.75">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent shadow-[0_0_8px_var(--brand-accent)]" />
            <span className="heading-brand-kicker">SIMULATOR</span>
            <span className="whitespace-nowrap text-[12px] font-semibold text-foreground">
              · Core Web Vitals
            </span>
          </span>
          {overallRating && (
            <Badge
              tone={getRatingPresentation(overallRating).tone}
              dot
              className="shrink-0"
            >
              {getRatingPresentation(overallRating).label}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-3.5">
            <MetricGauge
              label="LCP"
              display={
                vitals.lcp ? `${(vitals.lcp.value / 1000).toFixed(1)}s` : "—"
              }
              value={vitals.lcp?.value ?? 0}
              poorThreshold={LCP_POOR}
              rating={vitals.lcp?.rating ?? null}
            />
            <MetricGauge
              label="CLS"
              display={vitals.cls ? vitals.cls.value.toFixed(2) : "—"}
              value={vitals.cls?.value ?? 0}
              poorThreshold={CLS_POOR}
              rating={vitals.cls?.rating ?? null}
            />
            <MetricGauge
              label="INP ms"
              display={vitals.inp ? `${Math.round(vitals.inp.value)}` : "—"}
              value={vitals.inp?.value ?? 0}
              poorThreshold={INP_POOR}
              rating={vitals.inp?.rating ?? null}
            />
          </div>
          <span className="mx-2.5 w-px self-stretch bg-border" />
          <div className="flex flex-wrap justify-between flex-1 gap-x-3 gap-y-1">
            <MetricStat
              label="DOM nodes"
              value={domNodes === null ? "—" : formatNumber(domNodes)}
            />
            <MetricStat
              label="Blocking Time"
              value={`${blockingTime}ms`}
              rating={getValueRating(
                blockingTime,
                BLOCKING_TIME_GOOD,
                BLOCKING_TIME_POOR,
              )}
            />
            <MetricStat
              label="Interaction Latency"
              value={`${interactionLatency}ms`}
              rating={getValueRating(interactionLatency, INP_GOOD, INP_POOR)}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
