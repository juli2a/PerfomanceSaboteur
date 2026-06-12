"use client";

// Toggle group rendered in the Header (desktop) and bottom sheet (mobile)
// Three zones: Network | Rendering | Computing
// Each toggle maps to a case key in the Zustand simulator store
export default function ControlPanel() {
  return (
    <div className="flex items-center gap-6">
      {/* Network */}
      <div className="hidden lg:flex items-center gap-3">
        <span className="text-xs font-medium text-brand-muted uppercase tracking-wider">Network</span>
        {/* Race Condition toggle — Case 4 */}
        {/* Request Waterfall toggle — Case 5 */}
      </div>

      {/* Rendering */}
      <div className="hidden lg:flex items-center gap-3">
        <span className="text-xs font-medium text-brand-muted uppercase tracking-wider">Rendering</span>
        {/* Image Optimization toggle — Case 1 */}
        {/* Layout Shift toggle — Case 2 */}
        {/* Hydration Mismatch toggle — Case 6 */}
        {/* Context Overhead toggle — Case 7 */}
      </div>

      {/* Computing */}
      <div className="hidden lg:flex items-center gap-3">
        <span className="text-xs font-medium text-brand-muted uppercase tracking-wider">Computing</span>
        {/* Heavy Mounting toggle — Case 3 */}
        {/* Over-memoization toggle — Case 8 */}
      </div>

      {/* Mobile: "Controls" button opens bottom sheet */}
      <button className="lg:hidden rounded-lg border border-brand-border bg-brand-bg px-3 py-1.5 text-xs font-medium text-brand-accent">
        Controls
      </button>
    </div>
  );
}
