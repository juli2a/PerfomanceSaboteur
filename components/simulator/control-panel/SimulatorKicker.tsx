import { cn } from "@/lib/utils/cn";

interface Props {
  size?: "sm" | "lg";
}

export default function SimulatorKicker({ size = "sm" }: Props) {
  return (
    <div className={cn("flex flex-col", "gap-heading-subtitle-gap")}>
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_var(--brand-accent)]" />
        <span
          className={cn("heading-brand-kicker", size === "lg" && "text-[11px]")}
        >
          SIMULATOR
        </span>
      </span>
      <span
        className={cn(
          "leading-[1.3] text-brand-muted",
          size === "sm" ? "max-w-30 text-[10px]" : "text-[12.5px]",
        )}
      >
        Turn on an anti-pattern and see what goes wrong
      </span>
    </div>
  );
}
