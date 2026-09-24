import {
  Activity,
  GitBranch,
  Repeat,
  ScanSearch,
  Timer,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../utils/cn";

export interface BehaviourStatData {
  id: string;
  label: string;
  value: string;
  unit: string;
  baseline: string;
  delta: string;
  tone: "crit" | "warn" | "safe" | "pulse";
  note: string;
}

const ICONS: Record<string, LucideIcon> = {
  "packet-rate": Zap,
  "byte-rate": Waves,
  "active-flows": GitBranch,
  "conn-rate": Repeat,
  "flow-duration": Timer,
  "anomaly-score": ScanSearch,
};

const TONE_CHIP: Record<BehaviourStatData["tone"], string> = {
  crit: "border-crit-500/25 bg-crit-500/10 text-crit-400",
  warn: "border-warn-500/25 bg-warn-500/10 text-warn-400",
  safe: "border-safe-500/25 bg-safe-500/10 text-safe-400",
  pulse: "border-pulse-500/25 bg-pulse-500/10 text-pulse-400",
};

const TONE_ICON: Record<BehaviourStatData["tone"], string> = {
  crit: "text-crit-400",
  warn: "text-warn-400",
  safe: "text-safe-400",
  pulse: "text-pulse-400",
};

/** One live snapshot tile in the "Current traffic behaviour" section. */
export function BehaviourStat({ stat, index = 0 }: { stat: BehaviourStatData; index?: number }) {
  const Icon = ICONS[stat.id] ?? Activity;

  return (
    <article
      className="animate-enter rounded-md border border-line bg-ink-850/70 p-3.5 transition-colors duration-200 hover:border-line-bright"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist-600">
          <Icon size={12} className={cn("shrink-0", TONE_ICON[stat.tone])} aria-hidden />
          <span className="truncate">{stat.label}</span>
        </span>
        <span
          className={cn(
            "shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-medium tabular-nums",
            TONE_CHIP[stat.tone],
          )}
        >
          {stat.delta}
        </span>
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="font-display text-[22px] font-bold leading-none tabular-nums text-mist-50">
          {stat.value}
        </span>
        <span className="font-mono text-[10px] text-mist-500">{stat.unit}</span>
      </div>

      <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-mist-600">
        {stat.baseline}
      </div>
      <p className="mt-1.5 text-[10.5px] leading-relaxed text-mist-500">{stat.note}</p>
    </article>
  );
}
