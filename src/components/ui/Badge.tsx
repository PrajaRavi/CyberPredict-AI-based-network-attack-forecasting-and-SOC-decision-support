import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export type BadgeTone = "safe" | "warn" | "crit" | "pulse" | "neutral";

const TONES: Record<BadgeTone, string> = {
  safe: "border-safe-500/25 bg-safe-500/10 text-safe-400",
  warn: "border-warn-500/25 bg-warn-500/10 text-warn-400",
  crit: "border-crit-500/25 bg-crit-500/10 text-crit-400",
  pulse: "border-pulse-500/25 bg-pulse-500/10 text-pulse-400",
  neutral: "border-line-bright bg-ink-750/60 text-mist-400",
};

interface StatusBadgeProps {
  tone?: BadgeTone;
  /** Animate the status dot (for live / in-progress states). */
  pulse?: boolean;
  className?: string;
  children: ReactNode;
}

export function StatusBadge({ tone = "neutral", pulse = false, className, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-[5px] font-mono text-[10px] font-medium uppercase leading-none tracking-[0.12em]",
        TONES[tone],
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full bg-current", pulse && "animate-pulse")} />
      {children}
    </span>
  );
}

/** Fixed SOC readiness indicator shown in the topbar. */
export function ThreatChip() {
  return (
    <div
      className="hidden h-9 items-center gap-2.5 rounded-md border border-warn-500/25 bg-warn-500/[0.08] px-3 md:inline-flex"
      title="Aggregate threat condition derived from alert volume and forecast probability"
    >
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warn-400 opacity-40 [animation-duration:2.4s]" />
        <span className="relative inline-flex size-1.5 rounded-full bg-warn-400" />
      </span>
      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-warn-400">
        Threatcon 3 · Elevated
      </span>
    </div>
  );
}
