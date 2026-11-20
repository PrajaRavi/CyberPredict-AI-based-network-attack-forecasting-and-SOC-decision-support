import { cn } from "../../lib/utils";

export interface AlarmTimeData {
  id: string;
  label: string;
  value: number;
  unit: string;
  tone: "pulse" | "warn";
  note: string;
  scaleMax: number;
}

const TONE = {
  pulse: {
    text: "text-blue-600",
    bar: "bg-linear-to-r from-blue-500 to-indigo-600",
    border: "border-blue-100",
    bg: "bg-linear-to-br from-blue-50/40 to-white",
  },
  warn: {
    text: "text-amber-600",
    bar: "bg-linear-to-r from-amber-500 to-orange-500",
    border: "border-amber-100",
    bg: "bg-linear-to-br from-amber-50/40 to-white",
  },
} as const;

export function AlarmTimeCard({ data }: { data: AlarmTimeData }) {
  const tone = TONE[data.tone];
  const width = Math.min(100, (data.value / data.scaleMax) * 100);

  return (
    <article
      className={cn(
        "flex flex-1 flex-col justify-between rounded-2xl border p-4 sm:p-5 shadow-[0_2px_12px_rgba(20,30,55,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-4px_rgba(20,30,55,0.08)]",
        tone.border,
        tone.bg
      )}
    >
      <div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {data.label}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={cn("font-display text-[28px] sm:text-[32px] font-extrabold leading-none tabular-nums", tone.text)}>
            {data.value.toFixed(1)}
          </span>
          <span className="font-sans text-xs font-semibold text-slate-500">{data.unit}</span>
        </div>
        <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn("h-full rounded-full transition-all duration-700 ease-out", tone.bar)}
            style={{ width: `${width}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[9px] text-slate-400 font-medium">
          <span>0 min</span>
          <span>Scale 0–{data.scaleMax} min</span>
        </div>
      </div>
      <p className="mt-3 border-t border-slate-100 pt-2.5 text-xs leading-relaxed text-slate-500">
        {data.note}
      </p>
    </article>
  );
}
