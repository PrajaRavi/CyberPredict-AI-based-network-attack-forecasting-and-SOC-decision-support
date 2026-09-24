import { cn } from "../../utils/cn";

export type RiskLevel = "LOW" | "MODERATE" | "MEDIUM" | "HIGH" | "CRITICAL";

const STYLES: Record<RiskLevel, { chip: string; dot: string; pulse: boolean }> = {
  LOW: { chip: "border-safe-500/30 bg-safe-500/10 text-safe-400", dot: "bg-safe-400", pulse: false },
  MODERATE: { chip: "border-warn-500/30 bg-warn-500/10 text-warn-400", dot: "bg-warn-400", pulse: false },
  MEDIUM: { chip: "border-warn-500/30 bg-warn-500/10 text-warn-400", dot: "bg-warn-400", pulse: false },
  HIGH: { chip: "border-crit-500/30 bg-crit-500/10 text-crit-400", dot: "bg-crit-400", pulse: true },
  CRITICAL: { chip: "border-crit-500/60 bg-crit-500/20 text-crit-400", dot: "bg-crit-400", pulse: true },
};

interface RiskLevelBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
  className?: string;
}

/** Semantic risk-level pill used across all dashboard surfaces. */
export function RiskLevelBadge({ level, size = "md", className }: RiskLevelBadgeProps) {
  const s = STYLES[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border font-mono font-semibold uppercase leading-none",
        size === "sm"
          ? "px-2 py-[5px] text-[9.5px] tracking-[0.12em]"
          : "px-2.5 py-1.5 text-[11px] tracking-[0.14em]",
        s.chip,
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", s.dot, s.pulse && "animate-pulse")} />
      {level}
    </span>
  );
}
