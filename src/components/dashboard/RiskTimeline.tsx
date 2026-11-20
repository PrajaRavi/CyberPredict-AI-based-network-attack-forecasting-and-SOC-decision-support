import { ChevronDown } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TimelinePoint {
  label: string;
  past: number | null;
  forecast: number | null;
  band: readonly [number, number] | null;
}

interface RiskTimelineProps {
  points: readonly TimelinePoint[];
  threshold: number;
  historyStart?: string;
  forecastEnd?: string;
  code?: string;
}

const FONT_SANS = "'Plus Jakarta Sans', system-ui, sans-serif";
const AXIS_TICK = { fill: "#94A3B8", fontSize: 10, fontFamily: FONT_SANS, fontWeight: 500 };

function TimelineTooltip({
  active,
  payload,
  threshold,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: TimelinePoint }>;
  threshold: number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  const zone = point.label === "now" ? "Current" : point.forecast !== null ? "Forecast Horizon" : "Historical";
  const value = point.forecast ?? point.past;
  const above = value !== null && value > threshold;

  return (
    <div className="min-w-[190px] sm:min-w-[210px] rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 shadow-xl shadow-slate-900/10">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <span className="font-display text-xs font-bold text-slate-800">
          {point.label === "now" ? "Now (Live)" : point.label}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
            zone === "Forecast Horizon"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          {zone}
        </span>
      </div>
      <dl className="space-y-1.5 sm:space-y-2 pt-2 text-xs font-medium">
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-1.5 text-slate-500">
            <span className="size-2 rounded-full bg-blue-500" /> Historical
          </dt>
          <dd className="font-bold text-slate-800">{point.past !== null ? `${point.past} pts` : "—"}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-1.5 text-slate-500">
            <span className="size-2 rounded-full bg-amber-500" /> Forecast
          </dt>
          <dd className="font-bold text-amber-600">{point.forecast !== null ? `${point.forecast} pts` : "—"}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">Band</dt>
          <dd className="font-mono text-slate-700">
            {point.band ? `${point.band[0]}–${point.band[1]}` : "—"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-1.5 text-[11px]">
          <dt className="text-slate-500">Threshold ({threshold})</dt>
          <dd className={above ? "font-bold text-rose-600" : "font-bold text-emerald-600"}>
            {value === null ? "—" : above ? "Above threshold" : "Below threshold"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function RiskTimeline({
  points,
  threshold,
  historyStart = "-60m",
  forecastEnd = "+15m",
}: RiskTimelineProps) {
  return (
    <section className="flex h-full flex-col rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-6 shadow-[0_4px_24px_-4px_rgba(20,30,55,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(20,30,55,0.09)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <h2 className="font-display text-[15px] sm:text-[17px] font-bold text-slate-900 truncate">
            Risk Likelihood Trajectory
          </h2>
          <ChevronDown size={16} className="text-slate-400 cursor-pointer" />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <span className="size-2 rounded-full bg-blue-500" /> Past
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="size-2 rounded-full bg-amber-500" /> Forecast
            </span>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span>60m + 15m Horizon</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Area Chart */}
      <div className="h-[220px] sm:h-[280px] lg:h-[320px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={points as TimelinePoint[]}
            margin={{ top: 12, right: 8, bottom: 0, left: -16 }}
          >
            <defs>
              <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B9DF8" stopOpacity={0.28} />
                <stop offset="60%" stopColor="#5B9DF8" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#5B9DF8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="forecastBandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              interval="preserveStartEnd"
              minTickGap={20}
              padding={{ left: 6, right: 6 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={34}
            />

            <ReferenceArea x1={historyStart} x2="now" fill="#5B9DF8" fillOpacity={0.02} />
            <ReferenceArea x1="now" x2={forecastEnd} fill="#F59E0B" fillOpacity={0.03} />

            <Area
              type="monotone"
              dataKey="band"
              stroke="none"
              fill="url(#forecastBandGrad)"
              name="Confidence band"
              dot={false}
              activeDot={false}
              connectNulls={false}
              isAnimationActive={false}
            />

            <Area
              type="monotone"
              dataKey="past"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fill="url(#riskAreaGrad)"
              name="Historical risk"
              dot={false}
              activeDot={{ r: 5, fill: "#3B82F6", stroke: "#FFFFFF", strokeWidth: 2 }}
              connectNulls={false}
            />

            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={{ r: 3, fill: "#F59E0B", strokeWidth: 1.5, stroke: "#FFFFFF" }}
              activeDot={{ r: 5, fill: "#F59E0B", stroke: "#FFFFFF", strokeWidth: 2 }}
              name="Forecast risk"
              connectNulls={false}
            />

            <ReferenceLine
              y={threshold}
              stroke="#F43F5E"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              strokeOpacity={0.8}
            />

            <ReferenceLine
              x="now"
              stroke="#94A3B8"
              strokeDasharray="3 3"
            />

            <Tooltip
              content={<TimelineTooltip threshold={threshold} />}
              cursor={{ stroke: "#94A3B8", strokeDasharray: "4 4", strokeWidth: 1 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500 font-medium">
        <span className="truncate">Continuous neural tracking (30s)</span>
        <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0">
          Peak @ +10m
        </span>
      </div>
    </section>
  );
}
