"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";
import { getRatingPresentation } from "@/lib/utils/gauge";
import { useSimControlStore } from "@/store/simulator-control";
import { useSimPerformanceStore } from "@/store/simulator-performance";
import OverallRatingBadge from "@/components/simulator/performance-panel/OverallRatingBadge";
import type { PerformancePanelMetrics } from "@/components/simulator/performance-panel/panel-metrics";
import type { VitalRating } from "@/types/simulator";

interface MetricPreview {
  label: string;
  display: string;
  rating: VitalRating | null;
}

function RatingDot({ rating }: { rating: VitalRating | null }) {
  return (
    <span
      className="size-1.5 shrink-0 rounded-full"
      style={{
        background: rating
          ? getRatingPresentation(rating).color
          : "var(--brand-muted)",
      }}
    />
  );
}

// "Chart-free" metric for the expanded grid — a coloured number, no gauge
// ring (no room for SVG rings at this width).
function VitalReadout({ label, display, rating }: MetricPreview) {
  return (
    <div className="flex flex-1 items-baseline justify-center gap-1.5">
      <span className="text-[12px] font-semibold tracking-wide text-brand-muted">
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-bold tabular-nums",
          rating ? getRatingPresentation(rating).textClass : "text-brand-text",
        )}
      >
        {display}
      </span>
    </div>
  );
}

function StatTile({ label, display, rating }: MetricPreview) {
  return (
    <div className="flex flex-1 items-center justify-between gap-2 rounded-md border border-brand-border bg-brand-bg-2 px-2.75 py-1">
      <span className="whitespace-nowrap text-[12px] text-brand-muted">
        {label}
      </span>
      <span
        className={cn(
          "text-[13px] font-semibold tabular-nums",
          rating ? getRatingPresentation(rating).textClass : "text-brand-text",
        )}
      >
        {display}
      </span>
    </div>
  );
}

// Bottom panel — mobile counterpart to PerformancePanelDesktop's floating
// corner widget, per docs/ui.md "Floating Performance Panel" → Mobile.
// Receives the metrics PerformancePanel computed once for both branches;
// owns only its own mobile-only UI state (expanded/collapsed, panel height
// for positioning the alert lane above it).
export default function PerformancePanelMobile({
  alerts,
  vitals,
  domNodes,
  blockingTime,
  blockingTimeRating,
  interactionLatency,
  interactionLatencyRating,
  overallRating,
}: PerformancePanelMetrics) {
  const controlsOpen = useSimControlStore((state) => state.controlsOpen);
  const panelHeight = useSimPerformanceStore(
    (state) => state.mobilePanelHeight,
  );
  const setMobilePanelHeight = useSimPerformanceStore(
    (state) => state.setMobilePanelHeight,
  );

  // Forced open while the simulator controls sheet is open, so a reader can
  // never lose sight of the metrics they're about to toggle.
  const [expanded, setExpanded] = useState(false);
  const open = expanded || controlsOpen;

  // Measures the panel's own height into the store — the alert lane below
  // floats its fixed bottom offset just above it, and MobileControlSheet
  // reserves the same amount of bottom padding in its own scroll area, so
  // there's a single source of truth for "how tall is the panel right now"
  // instead of two separate measurements. A ResizeObserver (not a
  // open/alerts.length dependency list) catches every cause of a height
  // change, including the stat-tile row wrapping to a second line on a
  // narrower viewport, not just the two we'd otherwise have to enumerate.
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() =>
      setMobilePanelHeight(el.offsetHeight),
    );
    observer.observe(el);
    // Zero it back out on unmount (e.g. switching to desktop, where
    // PerformancePanelDesktop takes over instead) — otherwise consumers
    // like MobileDrawer keep reserving space for a panel that's no longer
    // in the DOM, going by whatever height this one last measured.
    return () => {
      observer.disconnect();
      setMobilePanelHeight(0);
    };
  }, [setMobilePanelHeight]);

  const lcp: MetricPreview = {
    label: "LCP",
    display: vitals.lcp ? `${(vitals.lcp.value / 1000).toFixed(1)}s` : "—",
    rating: vitals.lcp?.rating ?? null,
  };
  const cls: MetricPreview = {
    label: "CLS",
    display: vitals.cls ? vitals.cls.value.toFixed(2) : "—",
    rating: vitals.cls?.rating ?? null,
  };
  const inp: MetricPreview = {
    label: "INP",
    display: vitals.inp ? `${Math.round(vitals.inp.value)}ms` : "—",
    rating: vitals.inp?.rating ?? null,
  };
  const ttfb: MetricPreview = {
    label: "TTFB",
    display: vitals.ttfb ? `${(vitals.ttfb.value / 1000).toFixed(1)}s` : "—",
    rating: vitals.ttfb?.rating ?? null,
  };

  return (
    <div>
      {alerts.length > 0 && (
        <div
          className="fixed inset-x-3 z-45 flex flex-col gap-2"
          style={{ bottom: panelHeight + 12 }}
        >
          {alerts}
        </div>
      )}
      <div
        ref={panelRef}
        className="sim-panel-mobile relative z-60"
      >
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          disabled={controlsOpen}
          aria-expanded={open}
          aria-label={
            open ? "Collapse Performance Panel" : "Expand Performance Panel"
          }
          className="flex h-12.5 w-full items-center justify-between px-4 disabled:cursor-default"
        >
          <span className="flex items-center gap-1.75 text-[12.5px] font-semibold text-brand-text">
            <span className="heading-brand-kicker">SIMULATOR</span>
            Web Vitals
          </span>
          <span className="flex items-center gap-3">
            {open ? (
              <OverallRatingBadge rating={overallRating} />
            ) : (
              <>
                <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                  <RatingDot rating={lcp.rating} />
                  {lcp.label} {lcp.display}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                  <RatingDot rating={inp.rating} />
                  {inp.label} {inp.display}
                </span>
              </>
            )}
            {!controlsOpen && (
              <ChevronDown
                size={14}
                className={cn(
                  "text-brand-muted transition-transform",
                  open && "rotate-180",
                )}
              />
            )}
          </span>
        </button>
        <div className="sim-panel-mobile-content" data-open={open || undefined} data-instant={controlsOpen || undefined}>
          <div className="sim-panel-mobile-content-row flex flex-col gap-2.75 px-4">
            <div className="flex gap-2">
              <VitalReadout {...lcp} />
              <VitalReadout {...cls} />
              <VitalReadout {...inp} />
              <VitalReadout {...ttfb} />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-brand-border pt-2.75 pb-3.5">
              <StatTile
                label="DOM nodes"
                display={domNodes === null ? "—" : formatNumber(domNodes)}
                rating={null}
              />
              <StatTile
                label="Blocking Time"
                display={`${blockingTime}ms`}
                rating={blockingTimeRating}
              />
              <StatTile
                label="Interaction Latency"
                display={`${interactionLatency}ms`}
                rating={interactionLatencyRating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
