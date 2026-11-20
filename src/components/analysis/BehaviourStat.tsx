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
import { cn } from "../../lib/utils";

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

const STAT_META: Record<
  string,
  { icon: LucideIcon; bg: string; text: string; gradient: string }
> = {
  "packet-rate": {
    icon: Zap,
    bg: "bg-rose-50 border-rose-100",
    text: "text-rose-600",
    gradient: "from-rose-500/10 to-transparent",
  },
  "byte-rate": {
    icon: Waves,
    bg: "bg-blue-50 border-blue-100",
    text: "text-blue-600",
    gradient: "from-blue-500/10 to-transparent",
  },
  "active-flows": {
    icon: GitBranch,
    bg: "bg-purple-50 border-purple-100",
    text: "text-purple-600",
    gradient: "from-purple-500/10 to-transparent",
  },
  "conn-rate": {
    icon: Repeat,
    bg: "bg-amber-50 border-amber-100",
    text: "text-amber-600",
    gradient: "from-amber-500/10 to-transparent",
  },
  "flow-duration": {
    icon: Timer,
    bg: "bg-cyan-50 border-cyan-100",
    text: "text-cyan-600",
    gradient: "from-cyan-500/10 to-transparent",
  },
  "anomaly-score": {
    icon: ScanSearch,
    bg: "bg-rose-50 border-rose-100",
    text: "text-rose-600",
    gradient: "from-rose-500/10 to-transparent",
  },
};

const TONE_CHIP: Record<BehaviourStatData["tone"], string> = {
  crit: "border-rose-200 bg-rose-50 text-rose-700",
  warn: "border-amber-200 bg-amber-50 text-amber-700",
  safe: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pulse: "border-blue-200 bg-blue-50 text-blue-700",
};

/**
 * One live snapshot tile in the "Current traffic behaviour" section.
 * Features meaningful icon with colored background, gradient card effect,
 * and reactive hover animation.
 */
export function BehaviourStat({ stat, index = 0 }: { stat: BehaviourStatData; index?: number }) {
  const meta = STAT_META[stat.id] ?? {
    icon: Activity,
    bg: "bg-slate-100 border-slate-200",
    text: "text-slate-600",
    gradient: "from-slate-500/10 to-transparent",
  };
  const Icon = meta.icon;

  return (
    <article
      className="animate-enter group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-[0_2px_12px_rgba(20,30,55,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_-4px_rgba(20,30,55,0.08)] hover:border-slate-300 cursor-pointer overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top subtle gradient tint */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b opacity-60 transition-opacity group-hover:opacity-100",
          meta.gradient
        )}
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <div
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-xl border shadow-2xs transition-transform duration-200 group-hover:scale-105",
              meta.bg,
              meta.text
            )}
          >
            <Icon size={17} strokeWidth={2.4} aria-hidden />
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold tabular-nums shadow-2xs",
              TONE_CHIP[stat.tone]
            )}
          >
            {stat.delta}
          </span>
        </div>

        <div className="mt-3.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {stat.label}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-[24px] font-extrabold leading-none tracking-tight text-slate-900">
              {stat.value}
            </span>
            <span className="font-mono text-xs font-semibold text-slate-400">{stat.unit}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-3.5 border-t border-slate-100 pt-2.5">
        <div className="font-mono text-[10px] font-medium text-slate-400">{stat.baseline}</div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2">{stat.note}</p>
      </div>
    </article>
  );
}
