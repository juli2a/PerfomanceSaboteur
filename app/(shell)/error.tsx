"use client";

import { useEffect } from "react";

export default function ShellError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[ShellError]", error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm font-medium text-foreground">Failed to load data</p>
      <p className="max-w-sm text-xs text-muted-foreground">{error.message}</p>
      <button
        onClick={unstable_retry}
        className="rounded-lg bg-raise px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
      >
        Try again
      </button>
    </div>
  );
}
