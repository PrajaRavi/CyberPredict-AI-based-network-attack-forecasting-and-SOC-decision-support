import { cn } from "../../utils/cn";
import { StatusBadge } from "../ui/Badge";
import { Panel } from "../ui/Panel";

export interface LeadScenario {
  id: string;
  vector: string;
  cpAlarmMin: number;
  baseAlarmMin: number;
}

export interface LeadTimeData {
  /** Track length in minutes after attack onset. */
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
      className="grid grid-cols-[96px_minmax(0,1fr)_56px] animate-enter items-center gap-3 border-b border-line/60 py-2.5 transition-colors duration-150 last:border-0 hover:bg-white"
      style={{ animationDelay: `${index * 70}ms` }}
      title={`${s.vector}: CyberPredict T+${s.cpAlarmMin} min vs baseline T+${s.baseAlarmMin} min`}
    >
      <div className="min-w-0">
        <div className="font-mono text-[10.5px] text-mist-300">{s.id}</div>
        <div className="truncate font-mono text-[8.5px] uppercase tracking-[0.12em] text-mist-600">{s.vector}</div>
      </div>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink-700" />
        <div className="absolute left-0 top-1/2 h-3 w-2 -translate-y-1/2 rounded-full bg-crit-500" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-safe-500/20"
          style={{ left: `${cp}%`, width: `${base - cp}%` }}
        />
        <div
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pulse-400 shadow-[0_0_8px_rgba(69,221,248,0.8)]"
          style={{ left: `${cp}%` }}
        />
        <div
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warn-400"
          style={{ left: `${base}%` }}
        />
      </div>
      <div className="text-right font-mono text-[10.5px] font-medium tabular-nums text-safe-400">−{lead}m</div>
    </div>
  );
}

/**
 * Hero figure — how much earlier CyberPredict alarms than the baseline.
 * A dimension diagram across the mean scenario plus per-scenario tracks.
 */
export function LeadTimePanel({ data }: { data: LeadTimeData }) {
  const { average } = data;
  const cp = pct(average.cyberpredict, data.trackMaxMin);
  const base = pct(average.baseline, data.trackMaxMin);
  const scaleTicks = [0, 10, 20, 30, 40];

  return (
    <Panel
      title="Forecast lead time"
      code="Onset → alarm · demo scenarios"
      className="flex h-full flex-col"
      bodyClassName="flex flex-1 flex-col"
      actions={<StatusBadge tone="safe">Key result</StatusBadge>}
    >
      {/* Dimension diagram (mean scenario) */}
      <div className="relative mx-1 h-44 sm:mx-3">
        {/* Main track */}
        <div className="absolute inset-x-0 top-[62%] h-1.5 rounded-full bg-ink-700" />
        {/* Lead-time band on the track */}
        <div
          className="absolute top-[62%] h-1.5 rounded-full bg-safe-500/25"
          style={{ left: `${cp}%`, width: `${base - cp}%` }}
        />
        {/* Dimension line + end ticks */}
        <div
          className="absolute top-[38%] border-t border-dashed border-safe-400/70"
          style={{ left: `${cp}%`, width: `${base - cp}%` }}
        />
        <div className="absolute top-[33%] h-4 w-2 rounded-full bg-safe-400/70" style={{ left: `${cp}%` }} />
        <div className="absolute top-[33%] h-4 w-2 rounded-full bg-safe-400/70" style={{ left: `${base}%` }} />
        {/* Lead label */}
        <div className="absolute top-[44%] -translate-x-1/2" style={{ left: `${(cp + base) / 2}%` }}>
          <span className="whitespace-nowrap rounded border border-safe-500/30 bg-safe-500/10 px-2.5 py-1 font-mono text-[10px] font-medium tabular-nums text-safe-400">
            {average.leadMin} min earlier · {average.factor}
          </span>
        </div>

        {/* Attack onset marker */}
        <div className="absolute left-0 top-[46%] h-10 w-2 rounded-full bg-crit-500" />
        <div className="absolute left-0 top-[76%] font-mono text-[8.5px] uppercase tracking-[0.12em] text-crit-400">
          Attack onset · T+0
        </div>

        {/* CyberPredict alarm marker */}
        <div className="absolute top-[46%] h-10 w-2 -translate-x-1/2 rounded-full bg-pulse-400" style={{ left: `${cp}%` }} />
        <div
          className="absolute top-[62%] size-3 -translate-x-1/2 -translate-y-1/4 rounded-full bg-pulse-400 shadow-[0_0_10px_rgba(69,221,248,0.9)]"
          style={{ left: `${cp}%` }}
        />
        <div className="absolute top-[4%] -translate-x-1/4" style={{ left: `${cp}%` }}>
          <div className="whitespace-nowrap font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.12em] text-pulse-400">
            CyberPredict alarm
            <span className="block text-mist-400">T+{average.cyberpredict.toFixed(1)} min</span>
          </div>
        </div>

        {/* Baseline alarm marker */}
        <div className="absolute top-[46%] h-10 w-2 -translate-x-1/2 rounded-full bg-warn-400" style={{ left: `${base}%` }} />
        <div
          className="absolute top-[76%] -translate-x-1/2 whitespace-nowrap font-mono text-[8.5px] uppercase tracking-[0.12em] text-warn-400"
          style={{ left: `${base}%` }}
        >
          Baseline alarm · T+{average.baseline.toFixed(1)}
        </div>

        {/* Scale ticks */}
        {scaleTicks.map((t) => (
          <div
            key={t}
            className={cn(
              "absolute top-[90%] font-mono text-[8.5px] tabular-nums text-mist-600",
              t !== 0 && "-translate-x-1/2",
            )}
            style={{ left: `${pct(t, data.trackMaxMin)}%` }}
          >
            {t}m
          </div>
        ))}
      </div>

      {/* Per-scenario tracks */}
      <div className="mt-4 rounded-md border border-line bg-ink-850/60 px-3.5 py-1">
        {data.scenarios.map((s, i) => (
          <ScenarioRow key={s.id} s={s} max={data.trackMaxMin} index={i} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-4 font-mono text-[8.5px] uppercase tracking-[0.12em] text-mist-600">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-pulse-400" /> CyberPredict alarm
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-warn-400" /> Baseline alarm
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-sm bg-safe-500/25" /> Lead time gained
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2 bg-crit-500" /> Attack onset
        </span>
      </div>
    </Panel>
  );
}
