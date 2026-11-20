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
  threshold: number;
  peak: { at: string; value: number };
  note: string;
  points: readonly HorizonPoint[];
}

const FONT_SANS = "'Plus Jakarta Sans', system-ui, sans-serif";
const AXIS_TICK = { fill: "#94A3B8", fontSize: 10, fontFamily: FONT_SANS, fontWeight: 500 };

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
  const zone = point.label === "now" ? "Current" : point.projected !== null ? "Projected" : "Observed";
  const value = point.projected ?? point.observed;
  const above = value !== null && value > threshold;

  return (
    <div className="min-w-[190px] sm:min-w-[210px] rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-3.5 shadow-xl shadow-slate-900/10">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <span className="font-display text-xs font-bold text-slate-800">
          {point.label === "now" ? "Now (Live)" : point.label}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
            zone === "Projected"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          {zone}
        </span>
      </div>
      <dl className="space-y-1.5 pt-2 text-xs font-medium">
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-1.5 text-slate-500">
            <span className="size-2 rounded-full bg-blue-500" /> Observed
          </dt>
          <dd className="font-bold text-slate-800">{point.observed === null ? "—" : `${point.observed}%`}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-1.5 text-slate-500">
            <span className="size-2 rounded-full bg-amber-500" /> Projected
          </dt>
          <dd className="font-bold text-amber-600">
            {point.projected === null ? "—" : `${point.projected}%`}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">Band</dt>
          <dd className="font-mono text-slate-700">
            {point.band ? `${point.band[0]}–${point.band[1]}%` : "—"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-1.5 text-[11px]">
          <dt className="text-slate-500">Threshold {threshold}%</dt>
          <dd className={above ? "font-bold text-rose-600" : "font-bold text-emerald-600"}>
            {value === null ? "—" : above ? "Above" : "Below"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function ForecastHorizonChart({ data }: { data: HorizonData }) {
  return (
    <Panel
      title="Attack Probability Horizon"
      code="45m Observed · 60m Projected"
      className="flex h-full flex-col"
      bodyClassName="flex flex-1 flex-col"
      actions={
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2 rounded-full bg-blue-500" /> Observed
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2 rounded-full bg-amber-500" /> Projected
            </span>
          </div>
          <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-rose-700">
            Peak {data.peak.value}% @ {data.peak.at}
          </span>
        </div>
      }
    >
      <div className="h-64 sm:h-[340px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data.points as HorizonPoint[]}
            margin={{ top: 12, right: 8, bottom: 0, left: -14 }}
          >
            <defs>
              <linearGradient id="horizonObsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="horizonProjFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.16} />
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
              tickFormatter={(v: number) => `${v}%`}
              tickLine={false}
              axisLine={false}
              width={38}
            />

            <ReferenceArea
              x1="now"
              x2="+15m"
              fill="#F59E0B"
              fillOpacity={0.04}
            />

            <Area
              type="monotone"
              dataKey="band"
              stroke="none"
              fill="url(#horizonProjFill)"
              dot={false}
              activeDot={false}
              connectNulls={false}
              isAnimationActive={false}
            />

            <Area
              type="monotone"
              dataKey="observed"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fill="url(#horizonObsFill)"
              dot={false}
              activeDot={{ r: 5, fill: "#3B82F6", stroke: "#FFFFFF", strokeWidth: 2 }}
              connectNulls={false}
            />

            <Line
              type="monotone"
              dataKey="projected"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={{ r: 3, fill: "#F59E0B", strokeWidth: 1.5, stroke: "#FFFFFF" }}
              activeDot={{ r: 5, fill: "#F59E0B", stroke: "#FFFFFF", strokeWidth: 2 }}
              connectNulls={false}
            />

            <ReferenceLine y={data.threshold} stroke="#F43F5E" strokeDasharray="4 4" strokeOpacity={0.8} />
            <ReferenceLine x="now" stroke="#94A3B8" strokeDasharray="3 3" />

            <Tooltip
              content={<HorizonTooltip threshold={data.threshold} />}
              cursor={{ stroke: "#94A3B8", strokeDasharray: "4 4" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 border-t border-slate-100 pt-2.5 font-sans text-xs text-slate-500">
        {data.note}
      </p>
    </Panel>
  );
}
