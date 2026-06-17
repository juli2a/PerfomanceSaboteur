"use client"

import * as React from "react"
import { CopyIcon, CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"

interface CopyButtonProps {
  value: string
  label: string
  className?: string
}

function CopyButton({ value, label, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false)

  React.useEffect(() => {
    if (!isCopied) return
    const timeoutId = setTimeout(() => setIsCopied(false), 1500)
    return () => clearTimeout(timeoutId)
  }, [isCopied])

  function handleCopy() {
    navigator.clipboard.writeText(value)
    setIsCopied(true)
  }

  return (
    <span className={cn("relative inline-flex py-4", className)}>
      <span
        aria-live="polite"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 text-[11px] text-pos"
      >
        {isCopied ? "Copied!" : ""}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Copy ${label}`}
        onClick={handleCopy}
      >
        {isCopied ? <CheckIcon className="text-pos" /> : <CopyIcon />}
      </Button>
    </span>
  )
}

export { CopyButton }
