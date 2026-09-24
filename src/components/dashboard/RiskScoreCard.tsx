import { TrendingUp } from "lucide-react";
import { cn } from "../../utils/cn";
import { RiskLevelBadge, type RiskLevel } from "./RiskLevelBadge";

export interface RiskScoreData {
  value: number;
  max: number;
  level: RiskLevel;
  delta: number;
  deltaWindow: string;
  trend: string;
  baseline: number;
  caption: string;
}

const RING_TONE: Record<RiskLevel, string> = {
  LOW: "#22CC82",
  MODERATE: "#F7AC2B",
  MEDIUM: "#F7AC2B",
  HIGH: "#F8495F",
  CRITICAL: "#F8495F",
};

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Composite risk score KPI with radial gauge, level badge and trend delta. */
export function RiskScoreCard({ score }: { score: RiskScoreData }) {
  const pct = Math.min(1, Math.max(0, score.value / score.max));
  const rising = score.delta >= 0;

  return (
    <article className="flex flex-col rounded-lg border border-line bg-ink-800/60 p-4 transition-colors duration-200 hover:border-line-bright">
      <header className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-mist-500">
          Composite risk score
        </span>
        <RiskLevelBadge level={score.level} size="sm" />
      </header>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative grid size-24 shrink-0 place-items-center">
          <svg viewBox="0 0 96 96" className="size-full -rotate-90" aria-hidden>
            <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="var(--color-ink-700)" strokeWidth="7" />
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="none"
              stroke={RING_TONE[score.level]}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - pct)}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center leading-none">
            <div>
              <span className="font-display text-[26px] font-bold tabular-nums text-mist-50">
                {score.value}
              </span>
              <span className="block pt-1 font-mono text-[9px] uppercase tracking-wider text-mist-600">
                / {score.max}
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2.5">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[10px] font-medium tabular-nums",
              rising
                ? "border-crit-500/25 bg-crit-500/10 text-crit-400"
                : "border-safe-500/25 bg-safe-500/10 text-safe-400",
            )}
          >
            <TrendingUp size={12} className={cn(!rising && "rotate-180")} aria-hidden />
            {rising ? "+" : ""}
            {score.delta} pts · {score.deltaWindow}
          </div>
          <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-mist-600">
            Baseline {score.baseline} · {score.trend}
          </div>
        </div>
      </div>

      <p className="mt-auto pt-4 text-[11.5px] leading-relaxed text-mist-500">{score.caption}</p>
    </article>
  );
}
