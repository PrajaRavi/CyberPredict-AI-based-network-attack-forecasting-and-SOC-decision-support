import { cn } from "../../lib/utils";

export type RiskLevel = "LOW" | "MODERATE" | "MEDIUM" | "HIGH" | "CRITICAL";

const STYLES: Record<RiskLevel, { chip: string; dot: string; pulse: boolean }> = {
  LOW: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-2xs",
    dot: "bg-emerald-500",
    pulse: false,
  },
  MODERATE: {
    chip: "border-amber-200 bg-amber-50 text-amber-700 shadow-2xs",
    dot: "bg-amber-500",
    pulse: false,
  },
  MEDIUM: {
    chip: "border-amber-200 bg-amber-50 text-amber-700 shadow-2xs",
    dot: "bg-amber-500",
    pulse: false,
  },
  HIGH: {
    chip: "border-rose-200 bg-rose-50 text-rose-700 shadow-2xs",
    dot: "bg-rose-500",
    pulse: true,
  },
  CRITICAL: {
    chip: "border-rose-300 bg-rose-100/80 text-rose-800 shadow-2xs",
    dot: "bg-rose-600",
    pulse: true,
  },
};

interface RiskLevelBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
  className?: string;
}

/** Semantic risk-level pill used across all dashboard surfaces. */
export function RiskLevelBadge({ level, size = "md", className }: RiskLevelBadgeProps) {
  const s = STYLES[level] ?? STYLES.MEDIUM;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono font-bold uppercase leading-none transition-all",
        size === "sm"
          ? "px-2.5 py-1 text-[9.5px] tracking-[0.1em]"
          : "px-3 py-1.5 text-[11px] tracking-[0.12em]",
        s.chip,
        className
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", s.dot, s.pulse && "animate-pulse")} />
      {level}
    </span>
  );
}
