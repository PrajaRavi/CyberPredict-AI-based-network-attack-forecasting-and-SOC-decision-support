import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface CompareDatum {
  metric: string;
  cyberpredict: number;
  baseline: number;
}

const FONT_SANS = "'Plus Jakarta Sans', system-ui, sans-serif";
const AXIS_TICK = { fill: "#94A3B8", fontSize: 11, fontFamily: FONT_SANS, fontWeight: 500 };

function CompareTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  label?: string;
  payload?: ReadonlyArray<{ name?: string; value?: number | string; color?: string; fill?: string }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="min-w-[190px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-3 shadow-xl text-xs text-slate-800">
      <div className="border-b border-slate-100 pb-1.5 font-bold">{label}</div>
      <div className="space-y-1.5 pt-1.5">
        {payload.map((entry) => (
          <div key={String(entry.name)} className="flex items-center justify-between gap-4 font-mono">
            <span className="flex items-center gap-1.5 text-slate-500 font-sans">
              <span className="size-2 rounded-full" style={{ background: entry.color ?? entry.fill }} />
              {entry.name}:
            </span>
            <span className="font-bold text-slate-900">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompareBarChart({ data }: { data: readonly CompareDatum[] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-blue-600" /> CyberPredict v2.4
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-slate-300" /> Baseline · Threshold IDS
        </span>
      </div>
      <div className="h-[260px] sm:h-[280px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data as CompareDatum[]} margin={{ top: 8, right: 8, bottom: 0, left: -14 }} barGap={6} barCategoryGap="28%">
            <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="metric"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
              interval={0}
            />
            <YAxis
              domain={[0, 100]}
              tick={AXIS_TICK}
              tickFormatter={(v: number) => `${v}%`}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CompareTooltip />} cursor={{ fill: "rgba(241,245,249,0.7)" }} />
            <Bar dataKey="baseline" name="Baseline" fill="#CBD5E1" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="cyberpredict" name="CyberPredict v2.4" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-400">
        All values in % · For false alarm rate, lower is better · Research Benchmark
      </p>
    </div>
  );
}
