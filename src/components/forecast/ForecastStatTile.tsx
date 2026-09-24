import { cn } from "../../utils/cn";

export interface ForecastStat {
  id: string;
  label: string;
  value: string;
  sub: string;
  tone: "mist" | "crit" | "warn" | "pulse" | "safe";
}

const TONE_VALUE: Record<ForecastStat["tone"], string> = {
  mist: "text-mist-50",
  crit: "text-crit-400",
  warn: "text-warn-400",
  pulse: "text-pulse-400",
  safe: "text-safe-400",
};

/** Compact KPI tile for the Forecast summary strip. */
export function ForecastStatTile({ stat, index = 0 }: { stat: ForecastStat; index?: number }) {
  return (
    <article
      className="animate-enter rounded-md border border-line bg-ink-850/70 px-3.5 py-3 transition-colors duration-200 hover:border-line-bright"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600">{stat.label}</div>
      <div
        className={cn(
          "mt-1.5 truncate font-display text-[19px] font-bold leading-none tracking-tight",
          TONE_VALUE[stat.tone],
        )}
        title={stat.value}
      >
        {stat.value}
      </div>
      <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mist-600">
        {stat.sub}
      </div>
    </article>
  );
}
