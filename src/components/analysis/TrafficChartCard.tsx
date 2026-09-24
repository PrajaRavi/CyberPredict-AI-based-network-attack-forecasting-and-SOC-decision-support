import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "../../utils/cn";

export interface MetricPoint {
  t: string;
  /** Observed value. */
  v: number | null;
  /** Projected continuation (optional). */
  f: number | null;
}

export interface TrafficMetric {
  id: string;
  label: string;
  unit: string;
  current: string;
  baseline: number;
  deltaPct: string;
  tone: "crit" | "warn" | "safe" | "pulse";
  hasForecast: boolean;
  series: readonly MetricPoint[];
}

const TONE_TEXT: Record<TrafficMetric["tone"], string> = {
  crit: "text-crit-400",
  warn: "text-warn-400",
  safe: "text-safe-400",
  pulse: "text-pulse-400",
};

const TONE_CHIP: Record<TrafficMetric["tone"], string> = {
  crit: "border-crit-500/25 bg-crit-500/10 text-crit-400",
  warn: "border-warn-500/25 bg-warn-500/10 text-warn-400",
  safe: "border-safe-500/25 bg-safe-500/10 text-safe-400",
  pulse: "border-pulse-500/25 bg-pulse-500/10 text-pulse-400",
};

function MiniTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: MetricPoint }>;
  unit: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-md border border-line bg-ink-850/95 px-2.5 py-2 font-mono text-[10px] shadow-[0_10px_28px_-10px_rgba(0,0,0,0.8)]">
      <div className="text-mist-600">{p.t}</div>
      <div className="mt-1 flex items-center justify-between gap-4">
        <span className="text-mist-500">Observed</span>
        <span className="tabular-nums text-mist-100">{p.v ?? "—"} {unit}</span>
      </div>
      {p.f !== null && (
        <div className="flex items-center justify-between gap-4">
          <span className="text-mist-500">Projected</span>
          <span className="tabular-nums text-warn-400">{p.f} {unit}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact trend chart for one traffic metric: observed history as a cyan
 * area against the dashed baseline, with an optional amber projection tail.
 */
export function TrafficChartCard({ metric, index = 0 }: { metric: TrafficMetric; index?: number }) {
  return (
    <article
      className="animate-enter flex flex-col rounded-md border border-line bg-ink-850/70 p-3.5 transition-colors duration-200 hover:border-line-bright"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-[12.5px] font-semibold text-mist-100">{metric.label}</h3>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span
              className={cn(
                "font-display text-[20px] font-bold leading-none tabular-nums",
                TONE_TEXT[metric.tone],
              )}
            >
              {metric.current}
            </span>
            <span className="font-mono text-[9.5px] text-mist-500">{metric.unit}</span>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-medium tabular-nums",
            TONE_CHIP[metric.tone],
          )}
        >
          {metric.deltaPct}
        </span>
      </div>

      <div className="mt-3 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={metric.series as MetricPoint[]}
            margin={{ top: 4, right: 2, bottom: 0, left: 2 }}
          >
            <defs>
              <linearGradient id={`trend-fill-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1CC5EA" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#1CC5EA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="t"
              tick={{ fill: "#4A5C7C", fontSize: 8.5, fontFamily: "'IBM Plex Mono', monospace" }}
              tickLine={false}
              axisLine={{ stroke: "#142138" }}
              interval="preserveStartEnd"
              minTickGap={26}
            />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              content={<MiniTooltip unit={metric.unit} />}
              cursor={{ stroke: "#1F3357", strokeDasharray: "3 3" }}
            />
            <ReferenceLine y={metric.baseline} stroke="#64789A" strokeDasharray="4 4" strokeOpacity={0.45} />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#45DDF8"
              strokeWidth={1.75}
              fill={`url(#trend-fill-${metric.id})`}
              dot={false}
              activeDot={{ r: 3, fill: "#45DDF8", stroke: "#05080F", strokeWidth: 2 }}
              connectNulls={false}
            />
            {metric.hasForecast && (
              <Line
                type="monotone"
                dataKey="f"
                stroke="#F7AC2B"
                strokeWidth={1.75}
                strokeDasharray="5 4"
                dot={false}
                activeDot={{ r: 3, fill: "#F7AC2B", stroke: "#05080F", strokeWidth: 2 }}
                connectNulls={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[8.5px] uppercase tracking-[0.12em] text-mist-600">
        <span>
          Baseline {metric.baseline} {metric.unit}
        </span>
        {metric.hasForecast && (
          <span className="flex items-center gap-1.5">
            <span className="h-0 w-3.5 border-t-2 border-dashed border-warn-400" /> Projected
          </span>
        )}
      </div>
    </article>
  );
}
