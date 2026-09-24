import {
  Area,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Panel } from "../ui/Panel";

export interface HorizonPoint {
  label: string;
  observed: number | null;
  projected: number | null;
  band: readonly [number, number] | null;
}

export interface HorizonData {
  /** Elevated-risk probability threshold (0–100). */
  threshold: number;
  peak: { at: string; value: number };
  note: string;
  points: readonly HorizonPoint[];
}

const MONO = "'IBM Plex Mono', monospace";
const AXIS_TICK = { fill: "#64789A", fontSize: 10, fontFamily: MONO };

function HorizonTooltip({
  active,
  payload,
  threshold,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: HorizonPoint }>;
  threshold: number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  const zone =
    point.label === "now" ? "Current" : point.projected !== null ? "Projected" : "Observed";
  const zoneTone =
    zone === "Projected"
      ? "border-warn-500/30 bg-warn-500/10 text-warn-400"
      : zone === "Current"
        ? "border-line-bright bg-ink-750 text-mist-100"
        : "border-pulse-500/30 bg-pulse-500/10 text-pulse-400";
  const value = point.projected ?? point.observed;
  const above = value !== null && value > threshold;

  return (
    <div className="min-w-[204px] rounded-md border border-line bg-ink-850/95 px-3 py-2.5 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-2">
        <span className="font-mono text-[11px] font-medium tabular-nums text-mist-100">
          {point.label === "now" ? "Now" : point.label}
        </span>
        <span
          className={`rounded border px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] ${zoneTone}`}
        >
          {zone}
        </span>
      </div>
      <dl className="space-y-1.5 pt-2 font-mono text-[10.5px]">
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-1.5 text-mist-500">
            <span className="h-[3px] w-3 rounded-full bg-pulse-400" /> Observed risk
          </dt>
          <dd className="tabular-nums text-mist-200">{point.observed === null ? "—" : `${point.observed}%`}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-1.5 text-mist-500">
            <span className="h-0 w-3 border-t-2 border-dashed border-warn-400" /> Attack probability
          </dt>
          <dd className="tabular-nums text-mist-200">
            {point.projected === null ? "—" : `${point.projected}%`}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-mist-500">Confidence band</dt>
          <dd className="tabular-nums text-mist-200">
            {point.band ? `${point.band[0]}–${point.band[1]}%` : "—"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line/60 pt-1.5">
          <dt className="text-mist-500">Threshold {threshold}%</dt>
          <dd className={above ? "text-crit-400" : "text-safe-400"}>
            {value === null ? "—" : above ? "Above" : "Below"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * The Forecast page's primary visualization — attack-probability horizon.
 * Observed risk (cyan) flows into the dashed projected probability (amber)
 * with confidence band, elevated-risk threshold and the expected risk
 * window shaded ahead of "now".
 */
export function ForecastHorizonChart({ data }: { data: HorizonData }) {
  return (
    <Panel
      title="Attack probability horizon"
      code="45m observed · 60m projected"
      className="flex h-full flex-col border-pulse-500/25"
      bodyClassName="flex flex-1 flex-col"
      actions={
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-mist-500 md:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-[3px] w-4 rounded-full bg-pulse-400" /> Observed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0 w-4 border-t-2 border-dashed border-warn-400" /> Projected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-4 rounded-xs bg-warn-500/25" /> Confidence
            </span>
          </div>
          <span className="rounded border border-crit-500/30 bg-crit-500/10 px-2 py-1 font-mono text-[9.5px] font-medium tabular-nums text-crit-400">
            Peak {data.peak.value}% @ {data.peak.at}
          </span>
        </div>
      }
    >
      <div
        className="h-80 sm:h-[380px]"
        role="img"
        aria-label="Attack probability horizon: observed risk, projected probability with confidence band, threshold and expected risk window"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data.points as HorizonPoint[]}
            margin={{ top: 14, right: 14, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="horizonObsFill" x1="0" y1="0" x2="0" y2="1">
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
              tickFormatter={(v: number) => `${v}%`}
              tickLine={false}
              axisLine={false}
              width={38}
            />

            {/* Expected risk window, shaded ahead of now */}
            <ReferenceArea
              x1="now"
              x2="+15m"
              fill="#F7AC2B"
              fillOpacity={0.06}
              label={{
                value: "EXPECTED RISK WINDOW",
                position: "insideTopRight",
                fill: "#D18F14",
                fontSize: 9,
                fontFamily: MONO,
              }}
            />

            {/* Confidence band (range area) */}
            <Area
              type="monotone"
              dataKey="band"
              stroke="none"
              fill="#F7AC2B"
              fillOpacity={0.13}
              dot={false}
              activeDot={false}
              connectNulls={false}
              isAnimationActive={false}
            />

            {/* Observed risk */}
            <Area
              type="monotone"
              dataKey="observed"
              stroke="#45DDF8"
              strokeWidth={2}
              fill="url(#horizonObsFill)"
              dot={false}
              activeDot={{ r: 4, fill: "#45DDF8", stroke: "#05080F", strokeWidth: 2 }}
              connectNulls={false}
            />

            {/* Projected attack probability */}
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#F7AC2B"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{ r: 3, fill: "#F7AC2B", strokeWidth: 0 }}
              activeDot={{ r: 4, fill: "#F7AC2B", stroke: "#05080F", strokeWidth: 2 }}
              connectNulls={false}
            />

            <ReferenceLine y={data.threshold} stroke="#F8495F" strokeDasharray="5 4" strokeOpacity={0.7} />
            <ReferenceLine
              x="now"
              stroke="#8298B8"
              strokeDasharray="3 3"
              label={{ value: "NOW", position: "insideTop", fill: "#A9BCD6", fontSize: 9, fontFamily: MONO }}
            />

            <Tooltip
              content={<HorizonTooltip threshold={data.threshold} />}
              cursor={{ stroke: "#1F3357", strokeDasharray: "3 3" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-mist-600">
        {data.note}
      </p>
    </Panel>
  );
}
