import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";

export interface MetricCardData {
  id: string;
  label: string;
  value: number;
  unit: string;
  baseline: number;
  delta: string;
  tone: "safe" | "warn" | "crit" | "pulse";
  note: string;
  higherIsBetter: boolean;
}

const TONE_BAR = {
  safe: "from-emerald-400 to-teal-500",
  warn: "from-amber-400 to-orange-500",
  crit: "from-rose-400 to-pink-500",
  pulse: "from-blue-500 to-indigo-600",
} as const;

export function MetricCard({ metric, index = 0 }: { metric: MetricCardData; index?: number }) {
  const improved = metric.higherIsBetter ? metric.value > metric.baseline : metric.value < metric.baseline;
  const Icon = metric.higherIsBetter ? TrendingUp : TrendingDown;
  const width = Math.min(100, Math.max(0, metric.value));

  return (
    <article
      className="animate-enter group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(20,30,55,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-4px_rgba(20,30,55,0.08)] hover:border-slate-300 cursor-pointer overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div>
        <header className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {metric.label}
          </span>
          <span
            className={cn(
              "grid size-6 shrink-0 place-items-center rounded-lg border shadow-2xs transition-transform group-hover:scale-105",
              improved
                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                : "border-rose-200 bg-rose-50 text-rose-600"
            )}
            title={improved ? "Improved vs baseline" : "Regressed vs baseline"}
          >
            <Icon size={13} strokeWidth={2.4} aria-hidden />
          </span>
        </header>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-display text-[26px] sm:text-[30px] font-extrabold leading-none tabular-nums text-slate-900">
            {metric.value.toFixed(1)}
          </span>
          <span className="font-sans text-xs font-semibold text-slate-400">{metric.unit}</span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full rounded-full bg-linear-to-r transition-all duration-700 ease-out",
              TONE_BAR[metric.tone]
            )}
            style={{ width: `${width}%` }}
          />
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <div
          className={cn(
            "inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold tabular-nums shadow-2xs",
            improved
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          )}
        >
          {metric.delta}
        </div>
        <div className="mt-1 font-sans text-[11px] text-slate-400 font-medium">{metric.note}</div>
      </div>
    </article>
  );
}
