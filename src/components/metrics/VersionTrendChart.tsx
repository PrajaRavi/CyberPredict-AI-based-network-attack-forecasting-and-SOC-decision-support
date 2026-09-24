import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface VersionPoint {
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

const MONO = "'IBM Plex Mono', monospace";
const AXIS_TICK = { fill: "#8CA0BE", fontSize: 10, fontFamily: MONO };

const SERIES = [
  { key: "accuracy", label: "Accuracy", color: "#45DDF8" },
  { key: "precision", label: "Precision", color: "#6FA9FF" },
  { key: "recall", label: "Recall", color: "#43E59C" },
  { key: "f1", label: "F1 score", color: "#FFC65C" },
] as const;

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  label?: string;
  payload?: ReadonlyArray<{ name?: string; value?: number | string; color?: string }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="min-w-[170px] rounded-md border border-line bg-ink-850/95 px-3 py-2.5 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.8)]">
      <div className="border-b border-line pb-1.5 font-mono text-[10.5px] text-mist-100">
        Ensemble {label}
      </div>
      <div className="space-y-1.5 pt-1.5">
        {payload.map((entry) => (
          <div key={String(entry.name)} className="flex items-center justify-between gap-4 font-mono text-[10.5px]">
            <span className="flex items-center gap-1.5 text-mist-500">
              <span className="h-[3px] w-3 rounded-full" style={{ background: entry.color }} />
              {entry.name}
            </span>
            <span className="tabular-nums text-mist-100">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Metric trend across model versions (rolling-origin evaluation). */
export function VersionTrendChart({ data }: { data: readonly VersionPoint[] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mist-500">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="h-[3px] w-4 rounded-full" style={{ background: s.color }} /> {s.label}
          </span>
        ))}
      </div>
      <div
        className="h-[280px] flex-1"
        role="img"
        aria-label="Line chart of accuracy, precision, recall and F1 score across model versions 2.0 to 2.4"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data as VersionPoint[]} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#142138" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="version" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "#142138" }} />
            <YAxis
              domain={[78, 100]}
              ticks={[80, 85, 90, 95, 100]}
              tick={AXIS_TICK}
              tickFormatter={(v: number) => `${v}%`}
              tickLine={false}
              axisLine={false}
              width={42}
            />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: "#1F3357", strokeDasharray: "3 3" }} />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                dot={{ r: 2.5, fill: s.color, strokeWidth: 0 }}
                activeDot={{ r: 4, fill: s.color, stroke: "#05080F", strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-mist-600">
        Rolling-origin evaluation · 5-min windows · demo data
      </p>
    </div>
  );
}
