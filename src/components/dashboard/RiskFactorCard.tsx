import { Repeat, ScanSearch, Waves, Zap, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

export interface RiskFactor {
  id: string;
  label: string;
  metric: string;
  detail: string;
  contribution: number;
  severity: "high" | "medium" | "low";
}

const ICONS: Record<string, { icon: LucideIcon; bg: string; text: string; gradient: string }> = {
  "packet-rate": {
    icon: Zap,
    bg: "bg-rose-50 border-rose-100",
    text: "text-rose-600",
    gradient: "from-rose-500 to-pink-500",
  },
  "traffic-volume": {
    icon: Waves,
    bg: "bg-blue-50 border-blue-100",
    text: "text-blue-600",
    gradient: "from-blue-500 to-indigo-500",
  },
  "source-behaviour": {
    icon: ScanSearch,
    bg: "bg-purple-50 border-purple-100",
    text: "text-purple-600",
    gradient: "from-purple-500 to-violet-500",
  },
  "connection-frequency": {
    icon: Repeat,
    bg: "bg-amber-50 border-amber-100",
    text: "text-amber-600",
    gradient: "from-amber-500 to-orange-500",
  },
};

export function RiskFactorCard({ factor, index = 0 }: { factor: RiskFactor; index?: number }) {
  const meta = ICONS[factor.id] ?? {
    icon: Zap,
    bg: "bg-blue-50 border-blue-100",
    text: "text-blue-600",
    gradient: "from-blue-500 to-indigo-500",
  };
  const Icon = meta.icon;
  const barWidth = Math.min(100, (factor.contribution / 30) * 100);

  return (
    <article
      className="animate-enter group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-[0_2px_12px_rgba(20,30,55,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-4px_rgba(20,30,55,0.08)] hover:border-slate-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-3.5">
        {/* Meaningful Icon in colorful rounded box */}
        <div
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-2xl border shadow-2xs transition-transform duration-200 group-hover:scale-105",
            meta.bg,
            meta.text
          )}
        >
          <Icon size={18} strokeWidth={2.4} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-bold text-[13.5px] text-slate-800 truncate group-hover:text-blue-600 transition-colors">
              {factor.label}
            </h3>
            <span className={cn("shrink-0 font-mono text-xs font-bold tabular-nums", meta.text)}>
              {factor.metric}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
            {factor.detail}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-slate-600 font-medium">
          <span>Risk Contribution</span>
          <span className={cn("font-bold", meta.text)}>+{factor.contribution} pts</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out", meta.gradient)}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </article>
  );
}
