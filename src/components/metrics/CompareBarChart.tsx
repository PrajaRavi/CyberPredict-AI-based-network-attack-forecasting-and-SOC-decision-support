import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface CompareDatum {
  metric: string;
  cyberpredict: number;
  baseline: number;
}

const MONO = "'IBM Plex Mono', monospace";
const AXIS_TICK = { fill: "#8CA0BE", fontSize: 10, fontFamily: MONO };

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
    <div className="min-w-[190px] rounded-md border border-line bg-ink-850/95 px-3 py-2.5 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.8)]">
      <div className="border-b border-line pb-1.5 font-mono text-[10.5px] text-mist-100">{label}</div>
      <div className="space-y-1.5 pt-1.5">
        {payload.map((entry) => (
          <div key={String(entry.name)} className="flex items-center justify-between gap-4 font-mono text-[10.5px]">
            <span className="flex items-center gap-1.5 text-mist-500">
              <span className="size-2 rounded-xs" style={{ background: entry.color ?? entry.fill }} />
              {entry.name}
            </span>
            <span className="tabular-nums text-mist-100">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Grouped bars — CyberPredict vs static-threshold baseline across metrics. */
export function CompareBarChart({ data }: { data: readonly CompareDatum[] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mist-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-xs bg-[#1CC5EA]" /> CyberPredict v2.4
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-xs bg-[#4A5C7C]" /> Baseline · threshold IDS
        </span>
      </div>
      <div
        className="h-[280px] flex-1"
        role="img"
        aria-label="Grouped bar chart comparing CyberPredict and baseline across accuracy, precision, recall, F1 score and false alarm rate"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data as CompareDatum[]} margin={{ top: 4, right: 8, bottom: 0, left: 0 }} barGap={5} barCategoryGap="26%">
            <CartesianGrid stroke="#142138" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="metric"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: "#142138" }}
              interval={0}
            />
            <YAxis
              domain={[0, 100]}
              tick={AXIS_TICK}
              tickFormatter={(v: number) => `${v}%`}
              tickLine={false}
              axisLine={false}
              width={42}
            />
            <Tooltip content={<CompareTooltip />} cursor={{ fill: "rgba(31,51,87,0.18)" }} />
            <Bar dataKey="baseline" name="Baseline" fill="#4A5C7C" radius={[3, 3, 0, 0]} maxBarSize={26} />
            <Bar dataKey="cyberpredict" name="CyberPredict v2.4" fill="#1CC5EA" radius={[3, 3, 0, 0]} maxBarSize={26} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-mist-600">
        All values in % · for false alarm rate, lower is better · demo data
      </p>
    </div>
  );
}
