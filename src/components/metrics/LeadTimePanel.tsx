import { cn } from "../../lib/utils";
import { StatusBadge } from "../ui/Badge";
import { Panel } from "../ui/Panel";

export interface LeadScenario {
  id: string;
  vector: string;
  cpAlarmMin: number;
  baseAlarmMin: number;
}

export interface LeadTimeData {
  trackMaxMin: number;
  average: { cyberpredict: number; baseline: number; leadMin: number; factor: string };
  scenarios: readonly LeadScenario[];
}

const pct = (min: number, max: number) => Math.min(100, Math.max(0, (min / max) * 100));

function ScenarioRow({ s, max, index }: { s: LeadScenario; max: number; index: number }) {
  const cp = pct(s.cpAlarmMin, max);
  const base = pct(s.baseAlarmMin, max);
  const lead = s.baseAlarmMin - s.cpAlarmMin;

  return (
    <div
      className="grid grid-cols-[80px_minmax(0,1fr)_50px] sm:grid-cols-[96px_minmax(0,1fr)_56px] animate-enter items-center gap-2 sm:gap-3 border-b border-slate-100 py-2.5 transition-colors duration-150 last:border-0 hover:bg-slate-50/80 rounded-xl px-2"
      style={{ animationDelay: `${index * 60}ms` }}
      title={`${s.vector}: CyberPredict T+${s.cpAlarmMin} min vs baseline T+${s.baseAlarmMin} min`}
    >
      <div className="min-w-0">
        <div className="font-mono text-xs font-bold text-slate-800">{s.id}</div>
        <div className="truncate font-sans text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold">{s.vector}</div>
      </div>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-100" />
        <div className="absolute left-0 top-1/2 h-3.5 w-1.5 -translate-y-1/2 rounded-full bg-rose-500" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-emerald-500/25"
          style={{ left: `${cp}%`, width: `${base - cp}%` }}
        />
        <div
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 ring-2 ring-white shadow-xs"
          style={{ left: `${cp}%` }}
        />
        <div
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 ring-2 ring-white shadow-xs"
          style={{ left: `${base}%` }}
        />
      </div>
      <div className="text-right font-mono text-xs font-bold tabular-nums text-emerald-600">−{lead}m</div>
    </div>
  );
}

export function LeadTimePanel({ data }: { data: LeadTimeData }) {
  const { average } = data;
  const cp = pct(average.cyberpredict, data.trackMaxMin);
  const base = pct(average.baseline, data.trackMaxMin);
  const scaleTicks = [0, 10, 20, 30, 40];

  return (
    <Panel
      title="Forecast Lead Time"
      code="Onset → Alarm · Benchmark"
      className="flex h-full flex-col"
      bodyClassName="flex flex-1 flex-col"
      actions={<StatusBadge tone="safe">Key Research Result</StatusBadge>}
    >
      {/* Dimension diagram (mean scenario) */}
      <div className="relative mx-1 h-44 sm:mx-3 pt-2">
        {/* Main track */}
        <div className="absolute inset-x-0 top-[62%] h-2 rounded-full bg-slate-100" />

        {/* Lead-time band */}
        <div
          className="absolute top-[62%] h-2 rounded-full bg-emerald-500/30"
          style={{ left: `${cp}%`, width: `${base - cp}%` }}
        />

        {/* Dimension line + ticks */}
        <div
          className="absolute top-[38%] border-t-2 border-dashed border-emerald-500/80"
          style={{ left: `${cp}%`, width: `${base - cp}%` }}
        />
        <div className="absolute top-[32%] h-4 w-1 rounded-full bg-emerald-500" style={{ left: `${cp}%` }} />
        <div className="absolute top-[32%] h-4 w-1 rounded-full bg-emerald-500" style={{ left: `${base}%` }} />

        {/* Lead label pill */}
        <div className="absolute top-[38%] -translate-x-1/2" style={{ left: `${(cp + base) / 2}%` }}>
          <span className="whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[10.5px] font-bold tabular-nums text-emerald-700 shadow-xs">
            {average.leadMin} min earlier · {average.factor} faster
          </span>
        </div>

        {/* Attack onset marker */}
        <div className="absolute left-0 top-[46%] h-10 w-1.5 rounded-full bg-rose-500" />
        <div className="absolute left-0 top-[78%] font-mono text-[9px] uppercase tracking-wider font-bold text-rose-600">
          Onset · T+0
        </div>

        {/* CyberPredict alarm marker */}
        <div className="absolute top-[46%] h-10 w-1.5 -translate-x-1/2 rounded-full bg-blue-600" style={{ left: `${cp}%` }} />
        <div
          className="absolute top-[62%] size-3.5 -translate-x-1/2 -translate-y-1/4 rounded-full bg-blue-600 ring-2 ring-white shadow-md shadow-blue-500/50"
          style={{ left: `${cp}%` }}
        />
        <div className="absolute top-[2%] -translate-x-1/4" style={{ left: `${cp}%` }}>
          <div className="whitespace-nowrap font-sans text-[10px] uppercase font-bold text-blue-600">
            CyberPredict
            <span className="block font-mono text-slate-800 text-xs">T+{average.cyberpredict.toFixed(1)}m</span>
          </div>
        </div>

        {/* Baseline alarm marker */}
        <div className="absolute top-[46%] h-10 w-1.5 -translate-x-1/2 rounded-full bg-amber-500" style={{ left: `${base}%` }} />
        <div
          className="absolute top-[78%] -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider font-bold text-amber-600"
          style={{ left: `${base}%` }}
        >
          Baseline · T+{average.baseline.toFixed(1)}m
        </div>

        {/* Scale ticks */}
        {scaleTicks.map((t) => (
          <div
            key={t}
            className={cn(
              "absolute top-[92%] font-mono text-[9px] font-medium tabular-nums text-slate-400",
              t !== 0 && "-translate-x-1/2"
            )}
            style={{ left: `${pct(t, data.trackMaxMin)}%` }}
          >
            {t}m
          </div>
        ))}
      </div>

      {/* Per-scenario tracks */}
      <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-2 sm:p-3">
        {data.scenarios.map((s, i) => (
          <ScenarioRow key={s.id} s={s} max={data.trackMaxMin} index={i} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-slate-100 font-mono text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-blue-600" /> CyberPredict Alarm
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500" /> Baseline Alarm
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-full bg-emerald-500/30" /> Lead Time Gained
        </span>
      </div>
    </Panel>
  );
}
