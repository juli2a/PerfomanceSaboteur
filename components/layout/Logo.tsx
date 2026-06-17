import BugIcon from "@/components/icons/BugIcon";

const SIZES = {
  md: {
    badgeSize: "size-9.5",
    icon: 21,
    text: "text-[20px]",
    gap: "gap-2.75",
    radius: "rounded-sm",
  },
  sm: {
    badgeSize: "size-7.5",
    icon: 21,
    text: "text-[16px]",
    gap: "gap-2.25",
    radius: "rounded-sm",
  },
};

interface LogoProps {
  size?: "sm" | "md";
}

export default function Logo({ size = "md" }: LogoProps) {
  const s = SIZES[size];
  return (
    <span className={`flex items-center ${s.gap}`}>
      <span className={`logo-badge ${s.badgeSize} ${s.radius}`}>
        <BugIcon size={s.icon} />
      </span>
      <span
        className={`font-brand ${s.text} font-semibold tracking-[-0.3px] text-foreground`}
      >
        Perf<span className="text-brand-muted">Saboteur</span>
      </span>
    </span>
  );
}
