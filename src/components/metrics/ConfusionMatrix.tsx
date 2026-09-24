import { cn } from "../../utils/cn";

export interface ConfusionData {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  totalWindows: string;
}

const fmt = (n: number) => n.toLocaleString("en-US");

const CELL_TONE = {
  safe: "border-safe-500/30 bg-safe-500/[0.08] text-safe-400",
  warn: "border-warn-500/30 bg-warn-500/[0.08] text-warn-400",
  crit: "border-crit-500/30 bg-crit-500/[0.08] text-crit-400",
  neutral: "border-line bg-ink-850/70 text-mist-300",
} as const;

function Cell({ tone, value, label }: { tone: keyof typeof CELL_TONE; value: number; label: string }) {
  return (
    <div className={cn("rounded-md border px-2 py-3 text-center transition-colors duration-200 hover:brightness-125", CELL_TONE[tone])}>
      <div className="font-mono text-[17px] font-semibold leading-none tabular-nums">{fmt(value)}</div>
      <div className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-mist-600">{label}</div>
    </div>
  );
}

/** 2×2 confusion matrix with derived false-alarm rate. */
export function ConfusionMatrix({ data }: { data: ConfusionData }) {
  const far = ((data.fp / (data.fp + data.tn)) * 100).toFixed(1);

  return (
    <div>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] gap-1.5">
        <div />
        <div className="pb-1 text-center font-mono text-[8.5px] uppercase tracking-[0.12em] text-mist-600">
          Predicted attack
        </div>
        <div className="pb-1 text-center font-mono text-[8.5px] uppercase tracking-[0.12em] text-mist-600">
          Predicted normal
        </div>

        <div className="flex rotate-180 items-center justify-center pr-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-mist-600 [writing-mode:vertical-rl]">
          Actual attack
        </div>
        <Cell tone="safe" value={data.tp} label="True positive" />
        <Cell tone="crit" value={data.fn} label="False negative" />

        <div className="flex rotate-180 items-center justify-center pr-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-mist-600 [writing-mode:vertical-rl]">
          Actual normal
        </div>
        <Cell tone="warn" value={data.fp} label="False positive" />
        <Cell tone="neutral" value={data.tn} label="True negative" />
      </div>

      <div className="mt-3.5 space-y-1.5 border-t border-line/60 pt-3 font-mono text-[10px]">
        <div className="flex items-center justify-between gap-3">
          <span className="uppercase tracking-[0.12em] text-mist-600">False alarm rate · FP/(FP+TN)</span>
          <span className="tabular-nums text-warn-400">{far}%</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="uppercase tracking-[0.12em] text-mist-600">Evaluation windows</span>
          <span className="tabular-nums text-mist-300">{data.totalWindows}</span>
        </div>
      </div>
    </div>
  );
}
