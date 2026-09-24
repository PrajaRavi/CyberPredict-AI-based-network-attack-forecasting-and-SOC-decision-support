import { cn } from "../../utils/cn";

export interface AlarmTimeData {
  id: string;
  label: string;
  value: number;
  unit: string;
  tone: "pulse" | "warn";
  note: string;
  /** Upper bound of the comparison scale, in minutes. */
  scaleMax: number;
}

const TONE = {
  pulse: { text: "text-pulse-400", bar: "bg-pulse-500", border: "border-pulse-500/25" },
  warn: { text: "text-warn-400", bar: "bg-warn-500", border: "border-warn-500/25" },
} as const;

/** Mean alarm time (from attack onset) for one system, on a shared scale. */
export function AlarmTimeCard({ data }: { data: AlarmTimeData }) {
  const tone = TONE[data.tone];
  const width = Math.min(100, (data.value / data.scaleMax) * 100);

  return (
    <article
      className={cn(
        "flex flex-1 flex-col rounded-lg border bg-ink-800/60 p-4 transition-colors duration-200 hover:border-line-bright",
        tone.border,
      )}
    >
      <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist-600">{data.label}</div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <span className={cn("font-display text-[30px] font-bold leading-none tabular-nums", tone.text)}>
          {data.value.toFixed(1)}
        </span>
        <span className="font-mono text-[10px] text-mist-500">{data.unit}</span>
      </div>
      <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-ink-700">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", tone.bar)}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-mist-600">
        Scale 0–{data.scaleMax} min
      </div>
      <p className="mt-auto pt-3 text-[11px] leading-relaxed text-mist-500">{data.note}</p>
    </article>
  );
}
