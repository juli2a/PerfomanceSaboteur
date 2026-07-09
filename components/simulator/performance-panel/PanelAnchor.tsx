// Case 2 (Layout Shift), mobile half — see docs/case2-v2.md "Мобільна
// версія". Isolated bad/good pair for how PerformancePanelMobile anchors
// itself to the bottom of the screen.

// Toggle OFF (good path): `bottom: 0` on a fixed element is already correct
// by construction — the browser keeps it flush with the real, current
// visible edge on its own, adapting automatically as the mobile browser's
// address bar hides/shows. No vh/dvh math needed at all.
export function PanelAnchorStable({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-x-0 bottom-0 z-60">{children}</div>;
}

// Toggle ON (bad path): reproduces a real mistake — a full-screen overlay
// wrapper (`h-screen flex items-center justify-center`, one of the most
// copy-pasted patterns for centering a modal) got repurposed into a bottom
// panel by swapping `justify-center` for `justify-end`, without anyone
// questioning why `h-screen` was still there. `h-screen` (100vh) is the
// browser's *static*, largest-viewport height — it doesn't shrink while the
// address bar is showing, so the "bottom" this computes sits below the
// actual visible edge until the address bar hides during a real scroll.
export function PanelAnchorUnstable({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-60 flex h-screen flex-col justify-end">
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}
