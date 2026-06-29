import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-semibold rounded-xl",
  {
    variants: {
      tone: {
        pos: "text-pos bg-pos/12",
        alert: "text-alert bg-alert/12",
        amber: "text-amber bg-amber/12",
        instock: "text-status-instock bg-status-instock/12",
        toorder: "text-status-toorder bg-status-toorder/12",
        ordered: "text-status-ordered bg-status-ordered/12",
        transit: "text-status-transit bg-status-transit/12",
        outofstock: "text-status-outofstock bg-status-outofstock/12",
      },
      size: {
        default: "py-1.25 px-2.75 text-xs",
        sm: "py-0.75 px-2.25 text-xs rounded-xs",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function Badge({
  tone,
  size,
  dot,
  className,
  children,
}: VariantProps<typeof badgeVariants> & {
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)}>
      {dot && <span className="size-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
