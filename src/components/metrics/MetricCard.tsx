import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../utils/cn";

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

const TONE_TEXT = {
  safe: "text-safe-400",
  warn: "text-warn-400",
  crit: "text-crit-400",
  pulse: "text-pulse-400",
} as const;

const TONE_BAR = {
  safe: "bg-safe-500",
  warn: "bg-warn-500",
  crit: "bg-crit-500",
  pulse: "bg-pulse-500",
} as const;

/** Reusable evaluation-metric card: value, trend vs baseline, scale bar. */
export function MetricCard({ metric, index = 0 }: { metric: MetricCardData; index?: number }) {
  const improved = metric.higherIsBetter ? metric.value > metric.baseline : metric.value < metric.baseline;
  const Icon = metric.higherIsBetter ? TrendingUp : TrendingDown;
  const width = Math.min(100, Math.max(0, metric.value));

  return (
    <article
      className="animate-enter flex flex-col rounded-lg border border-line bg-ink-800/60 p-4 transition-colors duration-200 hover:border-line-bright"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <header className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-mist-500">
          {metric.label}
        </span>
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded border",
            improved
              ? "border-safe-500/25 bg-safe-500/10 text-safe-400"
              : "border-crit-500/25 bg-crit-500/10 text-crit-400",
          )}
          title={improved ? "Improved vs baseline" : "Regressed vs baseline"}
        >
          <Icon size={13} aria-hidden />
        </span>
      </header>

      <div className="mt-3 flex items-baseline gap-1">
        <span className={cn("font-display text-[24px] font-bold leading-none tabular-nums", TONE_TEXT[metric.tone])}>
          {metric.value.toFixed(1)}
        </span>
        <span className="font-mono text-[11px] text-mist-500">{metric.unit}</span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-700">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", TONE_BAR[metric.tone])}
          style={{ width: `${width}%` }}
        />
      </div>

      <div className="mt-auto pt-3">
        <div
          className={cn(
            "inline-flex rounded border px-1.5 py-0.5 font-mono text-[9px] font-medium tabular-nums",
            improved
              ? "border-safe-500/25 bg-safe-500/10 text-safe-400"
              : "border-crit-500/25 bg-crit-500/10 text-crit-400",
          )}
        >
          {metric.delta}
        </div>
        <div className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-mist-600">{metric.note}</div>
      </div>
    </article>
  );
}
