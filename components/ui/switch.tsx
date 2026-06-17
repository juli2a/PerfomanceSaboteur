"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const switchVariants = cva(
  "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-2 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-50 data-unchecked:bg-input",
  {
    variants: {
      color: {
        product: "data-checked:bg-primary",
        brand: "data-checked:bg-brand-accent switch-brand-glow",
      },
      size: {
        sm: "h-[17px] w-[30px]",
        default: "h-[23px] w-[40px]",
      },
    },
    defaultVariants: {
      color: "product",
      size: "default",
    },
  },
);

function Switch({
  className,
  color,
  size,
  ...props
}: SwitchPrimitive.Root.Props & VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ color, size, className }))}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white ring-0 transition-transform",
          size === "sm"
            ? "size-[13px] data-checked:translate-x-[13px] data-unchecked:translate-x-0"
            : "size-[18px] data-checked:translate-x-[18px] data-unchecked:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
