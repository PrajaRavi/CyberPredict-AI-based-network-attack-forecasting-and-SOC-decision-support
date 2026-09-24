import { Repeat, ScanSearch, Waves, Zap, type LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

export interface RiskFactor {
  id: string;
  label: string;
  metric: string;
  detail: string;
  contribution: number;
  severity: "high" | "medium" | "low";
}

/* Factor id → icon map kept in the component so mock data stays serializable. */
const ICONS: Record<string, LucideIcon> = {
  "packet-rate": Zap,
  "traffic-volume": Waves,
  "source-behaviour": ScanSearch,
  "connection-frequency": Repeat,
};

const SEVERITY = {
  high: {
    tile: "border-crit-500/30 bg-crit-500/10 text-crit-400",
    bar: "bg-crit-500",
    text: "text-crit-400",
  },
  medium: {
    tile: "border-warn-500/30 bg-warn-500/10 text-warn-400",
    bar: "bg-warn-500",
    text: "text-warn-400",
  },
  low: {
    tile: "border-safe-500/30 bg-safe-500/10 text-safe-400",
    bar: "bg-safe-500",
    text: "text-safe-400",
  },
} as const;

/** One contributing factor behind the composite risk score. */
export function RiskFactorCard({ factor, index = 0 }: { factor: RiskFactor; index?: number }) {
  const Icon = ICONS[factor.id] ?? Zap;
  const sev = SEVERITY[factor.severity] ?? SEVERITY.medium;
  const barWidth = Math.min(100, (factor.contribution / 30) * 100);

  return (
    <article
      className="animate-enter rounded-md border border-line bg-ink-850/70 p-3.5 transition-colors duration-200 hover:border-line-bright"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={cn("grid size-8 shrink-0 place-items-center rounded-md border", sev.tile)}>
          <Icon size={15} strokeWidth={1.9} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate text-[13px] font-semibold text-mist-100">{factor.label}</h3>
            <span className={cn("shrink-0 font-mono text-[10px] font-medium tabular-nums", sev.text)}>
              {factor.metric}
            </span>
          </div>
          <p className="mt-1 text-[11.5px] leading-relaxed text-mist-500">{factor.detail}</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-mist-600">
          <span>Risk contribution</span>
          <span className={sev.text}>+{factor.contribution} pts</span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-ink-700">
          <div className={cn("h-full rounded-full", sev.bar)} style={{ width: `${barWidth}%` }} />
        </div>
      </div>
    </article>
  );
}
