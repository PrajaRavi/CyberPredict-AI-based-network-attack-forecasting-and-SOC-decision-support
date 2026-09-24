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
import { Panel } from "../ui/Panel";

export interface TimelinePoint {
  label: string;
  past: number | null;
  forecast: number | null;
  band: readonly [number, number] | null;
}

interface RiskTimelineProps {
  points: readonly TimelinePoint[];
  threshold: number;
  /** X label where history begins (defaults to the dashboard's 60m window). */
  historyStart?: string;
  /** X label where the forecast horizon ends. */
  forecastEnd?: string;
  /** Header meta marker. */
  code?: string;
}

const MONO = "'IBM Plex Mono', monospace";
const AXIS_TICK = { fill: "#64789A", fontSize: 10, fontFamily: MONO };

const ZONE_TONES: Record<string, string> = {
  Historical: "border-pulse-500/30 bg-pulse-500/10 text-pulse-400",
  Current: "border-line-bright bg-ink-750 text-mist-100",
  Forecast: "border-warn-500/30 bg-warn-500/10 text-warn-400",
};

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
  const zone = point.label === "now" ? "Current" : point.forecast !== null ? "Forecast" : "Historical";
  const value = point.forecast ?? point.past;
  const above = value !== null && value > threshold;

  return (
    <div className="min-w-[196px] rounded-md border border-line bg-ink-850/95 px-3 py-2.5 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-2">
        <span className="font-mono text-[11px] font-medium tabular-nums text-mist-100">
          {point.label === "now" ? "Now" : point.label}
        </span>
        <span
          className={`rounded border px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] ${ZONE_TONES[zone]}`}
        >
          {zone}
        </span>
      </div>
      <dl className="space-y-1.5 pt-2 font-mono text-[10.5px]">
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-1.5 text-mist-500">
            <span className="h-[3px] w-3 rounded-full bg-pulse-400" /> Historical risk
          </dt>
          <dd className="tabular-nums text-mist-200">{point.past ?? "—"}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-1.5 text-mist-500">
            <span className="h-0 w-3 border-t-2 border-dashed border-warn-400" /> Forecast risk
          </dt>
          <dd className="tabular-nums text-mist-200">{point.forecast ?? "—"}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-mist-500">Confidence band</dt>
          <dd className="tabular-nums text-mist-200">
            {point.band ? `${point.band[0]}–${point.band[1]}` : "—"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line/60 pt-1.5">
          <dt className="text-mist-500">Threshold {threshold}</dt>
          <dd className={above ? "text-crit-400" : "text-safe-400"}>
            {value === null ? "—" : above ? "Above" : "Below"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * Large interactive risk timeline: solid cyan history through "now",
 * dashed amber forecast with confidence band, threshold reference line,
 * and shaded HISTORICAL / FORECAST regions.
 */
export function RiskTimeline({
  points,
  threshold,
  historyStart = "-60m",
  forecastEnd = "+15m",
  code = "60m window · 15m horizon",
}: RiskTimelineProps) {
  return (
    <Panel
      title="Risk timeline"
      code={code}
      className="flex h-full flex-col"
      bodyClassName="flex flex-1 flex-col"
      actions={
        <div className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-mist-500 md:flex">
          <span className="flex items-center gap-1.5">
            <span className="h-[3px] w-4 rounded-full bg-pulse-400" /> Historical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0 w-4 border-t-2 border-dashed border-warn-400" /> Forecast
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-xs bg-warn-500/25" /> Confidence
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0 w-4 border-t border-dashed border-crit-500/80" /> Threshold
          </span>
        </div>
      }
    >
      <div
        className="h-[300px] sm:h-[340px]"
        role="img"
        aria-label="Risk timeline: historical risk flowing into the forecast horizon with confidence band and threshold line"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points as TimelinePoint[]} margin={{ top: 14, right: 14, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="riskPastFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1CC5EA" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#1CC5EA" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#142138" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: "#142138" }}
              interval="preserveStartEnd"
              minTickGap={20}
              padding={{ left: 6, right: 6 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={32}
            />

            {/* Region shading: history vs forecast horizon */}
            <ReferenceArea
              x1={historyStart}
              x2="now"
              fill="#1CC5EA"
              fillOpacity={0.035}
              label={{ value: "HISTORICAL", position: "insideTopLeft", fill: "#0C81A0", fontSize: 9, fontFamily: MONO }}
            />
            <ReferenceArea
              x1="now"
              x2={forecastEnd}
              fill="#F7AC2B"
              fillOpacity={0.05}
              label={{ value: "FORECAST", position: "insideTopRight", fill: "#D18F14", fontSize: 9, fontFamily: MONO }}
            />

            {/* Confidence band (range area) */}
            <Area
              type="monotone"
              dataKey="band"
              stroke="none"
              fill="#F7AC2B"
              fillOpacity={0.13}
              name="Confidence band"
              dot={false}
              activeDot={false}
              connectNulls={false}
              isAnimationActive={false}
            />

            {/* Historical risk */}
            <Area
              type="monotone"
              dataKey="past"
              stroke="#45DDF8"
              strokeWidth={2}
              fill="url(#riskPastFill)"
              name="Historical risk"
              dot={false}
              activeDot={{ r: 4, fill: "#45DDF8", stroke: "#05080F", strokeWidth: 2 }}
              connectNulls={false}
            />

            {/* Forecast risk */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#F7AC2B"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{ r: 3, fill: "#F7AC2B", strokeWidth: 0 }}
              activeDot={{ r: 4, fill: "#F7AC2B", stroke: "#05080F", strokeWidth: 2 }}
              name="Forecast risk"
              connectNulls={false}
            />

            <ReferenceLine y={threshold} stroke="#F8495F" strokeDasharray="5 4" strokeOpacity={0.7} />
            <ReferenceLine
              x="now"
              stroke="#8298B8"
              strokeDasharray="3 3"
              label={{ value: "NOW", position: "insideTop", fill: "#A9BCD6", fontSize: 9, fontFamily: MONO }}
            />

            <Tooltip
              content={<TimelineTooltip threshold={threshold} />}
              cursor={{ stroke: "#1F3357", strokeDasharray: "3 3" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.14em] leading-relaxed text-mist-600">
        Shaded amber region = forecast horizon — values are probabilistic estimates, not confirmed activity.
      </p>
    </Panel>
  );
}
