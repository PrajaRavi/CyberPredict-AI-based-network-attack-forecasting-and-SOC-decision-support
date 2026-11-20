import { cn } from "../../lib/utils";

export interface ConfusionData {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  totalWindows: string;
}

const fmt = (n: number) => n.toLocaleString("en-US");

const CELL_TONE = {
  safe: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warn: "border-amber-200 bg-amber-50 text-amber-800",
  crit: "border-rose-200 bg-rose-50 text-rose-800",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
} as const;

function Cell({ tone, value, label }: { tone: keyof typeof CELL_TONE; value: number; label: string }) {
  return (
    <div className={cn("rounded-2xl border p-3 text-center transition-all duration-200 hover:shadow-xs", CELL_TONE[tone])}>
      <div className="font-display text-lg font-bold tabular-nums">{fmt(value)}</div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-wider font-semibold opacity-75">{label}</div>
    </div>
  );
}

export function ConfusionMatrix({ data }: { data: ConfusionData }) {
  const far = ((data.fp / (data.fp + data.tn)) * 100).toFixed(1);

  return (
    <div>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] gap-2">
        <div />
        <div className="pb-1 text-center font-mono text-[10px] uppercase font-bold text-slate-400">
          Predicted attack
        </div>
        <div className="pb-1 text-center font-mono text-[10px] uppercase font-bold text-slate-400">
          Predicted normal
        </div>

        <div className="flex rotate-180 items-center justify-center pr-1 font-mono text-[10px] uppercase font-bold text-slate-400 [writing-mode:vertical-rl]">
          Actual attack
        </div>
        <Cell tone="safe" value={data.tp} label="True positive" />
        <Cell tone="crit" value={data.fn} label="False negative" />

        <div className="flex rotate-180 items-center justify-center pr-1 font-mono text-[10px] uppercase font-bold text-slate-400 [writing-mode:vertical-rl]">
          Actual normal
        </div>
        <Cell tone="warn" value={data.fp} label="False positive" />
        <Cell tone="neutral" value={data.tn} label="True negative" />
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs font-medium">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">False alarm rate · FP/(FP+TN)</span>
          <span className="font-mono font-bold text-amber-600">{far}%</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Evaluation windows</span>
          <span className="font-mono font-bold text-slate-800">{data.totalWindows}</span>
        </div>
      </div>
    </div>
  );
}
