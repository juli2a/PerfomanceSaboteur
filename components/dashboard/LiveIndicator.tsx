"use client";

// Pulsing green dot in the corner of the Dashboard page (desktop only)
// CSS animation stops when the main thread is blocked — visual freeze indicator
export default function LiveIndicator() {
  return (
    <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      Live
    </div>
  );
}
