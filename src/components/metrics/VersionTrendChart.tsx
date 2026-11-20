import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface VersionPoint {
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

const FONT_SANS = "'Plus Jakarta Sans', system-ui, sans-serif";
const AXIS_TICK = { fill: "#94A3B8", fontSize: 11, fontFamily: FONT_SANS, fontWeight: 500 };

const SERIES = [
  { key: "accuracy", label: "Accuracy", color: "#3B82F6" },
  { key: "precision", label: "Precision", color: "#6366F1" },
  { key: "recall", label: "Recall", color: "#10B981" },
  { key: "f1", label: "F1 score", color: "#F59E0B" },
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
    <div className="min-w-[170px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-3 shadow-xl text-xs text-slate-800">
      <div className="border-b border-slate-100 pb-1.5 font-bold">
        Ensemble {label}
      </div>
      <div className="space-y-1.5 pt-1.5">
        {payload.map((entry) => (
          <div key={String(entry.name)} className="flex items-center justify-between gap-4 font-mono">
            <span className="flex items-center gap-1.5 text-slate-500 font-sans">
              <span className="size-2 rounded-full" style={{ background: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-slate-900">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VersionTrendChart({ data }: { data: readonly VersionPoint[] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: s.color }} /> {s.label}
          </span>
        ))}
      </div>
      <div className="h-[260px] sm:h-[280px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data as VersionPoint[]} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
            <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="version" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
            <YAxis
              domain={[78, 100]}
              ticks={[80, 85, 90, 95, 100]}
              tick={AXIS_TICK}
              tickFormatter={(v: number) => `${v}%`}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: "#CBD5E1", strokeDasharray: "3 3" }} />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: s.color, strokeWidth: 1.5, stroke: "#FFFFFF" }}
                activeDot={{ r: 5, fill: s.color, stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-400">
        Rolling-origin evaluation · 5-min sliding windows · Model Retraining Cadence
      </p>
    </div>
  );
}
