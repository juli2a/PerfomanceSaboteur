"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

// apiFetch throws `[DummyJSON] ${path} → ${status} ${statusText}` on any
// non-2xx response (see lib/server/fetcher.ts) — pull the status back out
// so the page can show it instead of a hardcoded number.
const STATUS_PATTERN = /→ (\d{3})/;

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

  const status = error.message.match(STATUS_PATTERN)?.[1];

  return (
    <div className="error-page-glow relative flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-[13px] font-medium tracking-[2px] text-primary">
        ERROR{status ? ` · ${status}` : ""}
      </p>
      {status && (
        <p className="error-number font-brand text-[64px] leading-none font-bold sm:text-[96px]">
          {status}
        </p>
      )}
      <p className="text-[22px] font-semibold tracking-[-0.2px] text-foreground">
        Failed to load data
      </p>
      <p className="max-w-sm text-[15px] leading-[1.6] text-text-2">
        {error.message}
      </p>
      <Button onClick={unstable_retry}>Try again</Button>
    </div>
  );
}
