import { X } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface ChipProps extends React.ComponentProps<"span"> {
  onRemove?: () => void;
  removeLabel?: string;
}

function Chip({
  className,
  children,
  onRemove,
  removeLabel = "Remove",
  ...props
}: ChipProps) {
  return (
    <span
      data-slot="chip"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface py-1.5 pr-2 pl-3.25 text-[12.5px] font-medium text-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="grid size-4.75 shrink-0 place-items-center rounded-full bg-white/5 text-text-3 transition-colors hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}

export { Chip };
