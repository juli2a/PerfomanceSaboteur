import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded border border-transparent whitespace-nowrap transition-all outline-none select-none not-disabled:cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-br from-primary to-accent-2 text-primary-foreground hover:brightness-[1.08] hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-primary)_36%,transparent)]",
        outline:
          "border-border-strong bg-transparent text-text-2 hover:bg-[rgba(255,255,255,0.08)] aria-expanded:bg-raise aria-expanded:text-foreground",
        secondary:
          "rounded-sm border-border-strong bg-surface-2 text-foreground hover:bg-raise aria-expanded:bg-raise",
        ghost:
          "border-0 text-text-3 hover:bg-raise hover:text-foreground aria-expanded:bg-raise",
        brand:
          "bg-brand-bg border-brand-border font-brand text-brand-text shadow-[0_0_0_1px_var(--color-brand-accent-dim)] hover:bg-brand-bg-2",
      },
      size: {
        default:
          "h-10 px-4.25 text-sm gap-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 rounded-xs px-2 text-xs gap-1 in-data-[slot=button-group]:rounded has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-sm px-3 text-[13px] gap-1 in-data-[slot=button-group]:rounded has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 px-5.5 text-sm gap-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4.5",
        icon: "size-9 text-lg [&_svg:not([class*='size-'])]:size-4.5",
        "icon-xs":
          "size-6 rounded-xs text-xs in-data-[slot=button-group]:rounded [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-sm text-sm in-data-[slot=button-group]:rounded [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11 text-xl [&_svg:not([class*='size-'])]:size-5",
      },
      weight: {
        medium: "font-medium",
        semibold: "font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "semibold",
    },
  },
);

function Button({
  className,
  variant,
  size,
  weight,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, weight, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
