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
import { cn } from "../../lib/utils";

export interface MetricPoint {
  t: string;
  v: number | null;
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
  crit: "text-rose-600",
  warn: "text-amber-600",
  safe: "text-emerald-600",
  pulse: "text-blue-600",
};

const TONE_CHIP: Record<TrafficMetric["tone"], string> = {
  crit: "border-rose-200 bg-rose-50 text-rose-700",
  warn: "border-amber-200 bg-amber-50 text-amber-700",
  safe: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pulse: "border-blue-200 bg-blue-50 text-blue-700",
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
    <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md p-2 font-mono text-[10px] shadow-lg text-slate-800">
      <div className="text-slate-400 font-bold">{p.t}</div>
      <div className="mt-1 flex items-center justify-between gap-3">
        <span className="text-slate-500">Observed:</span>
        <span className="font-bold text-slate-900">{p.v ?? "—"} {unit}</span>
      </div>
      {p.f !== null && (
        <div className="flex items-center justify-between gap-3 text-amber-600">
          <span>Projected:</span>
          <span className="font-bold">{p.f} {unit}</span>
        </div>
      )}
    </div>
  );
}

export function TrafficChartCard({ metric, index = 0 }: { metric: TrafficMetric; index?: number }) {
  return (
    <article
      className="animate-enter flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_12px_rgba(20,30,55,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-4px_rgba(20,30,55,0.08)] hover:border-slate-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-xs font-bold text-slate-800 uppercase tracking-wide">{metric.label}</h3>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={cn(
                "font-display text-[22px] font-extrabold leading-none tabular-nums",
                TONE_TEXT[metric.tone]
              )}
            >
              {metric.current}
            </span>
            <span className="font-mono text-[11px] font-medium text-slate-400">{metric.unit}</span>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums shadow-2xs",
            TONE_CHIP[metric.tone]
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
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="t"
              tick={{ fill: "#94A3B8", fontSize: 9, fontFamily: "'IBM Plex Mono', monospace" }}
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              interval="preserveStartEnd"
              minTickGap={20}
            />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              content={<MiniTooltip unit={metric.unit} />}
              cursor={{ stroke: "#CBD5E1", strokeDasharray: "3 3" }}
            />
            <ReferenceLine y={metric.baseline} stroke="#94A3B8" strokeDasharray="3 3" strokeOpacity={0.6} />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#3B82F6"
              strokeWidth={2}
              fill={`url(#trend-fill-${metric.id})`}
              dot={false}
              activeDot={{ r: 4, fill: "#3B82F6", stroke: "#FFFFFF", strokeWidth: 2 }}
              connectNulls={false}
            />
            {metric.hasForecast && (
              <Line
                type="monotone"
                dataKey="f"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={false}
                activeDot={{ r: 4, fill: "#F59E0B", stroke: "#FFFFFF", strokeWidth: 2 }}
                connectNulls={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2 font-mono text-[9px] uppercase tracking-wider text-slate-400">
        <span>
          Baseline {metric.baseline} {metric.unit}
        </span>
        {metric.hasForecast && (
          <span className="flex items-center gap-1 font-semibold text-amber-600">
            <span className="size-1.5 rounded-full bg-amber-500" /> Projected
          </span>
        )}
      </div>
    </article>
  );
}
