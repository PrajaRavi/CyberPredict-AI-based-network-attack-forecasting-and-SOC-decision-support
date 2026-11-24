import { Info } from "lucide-react";
import { cn } from "../../lib/utils";
import { StatusBadge } from "../ui/Badge";

export interface RiskWindowSegment {
  label: string;
  probability: number;
  inWindow: boolean;
}

export interface RiskWindowData {
  label: string;
  peakLikelihood: number;
  segments: readonly RiskWindowSegment[];
  note: string;
}

const toneFor = (p: number): "crit" | "warn" | "pulse" =>
  p >= 85 ? "crit" : p >= 70 ? "warn" : "pulse";

const TONE_BAR = {
  crit: "bg-linear-to-r from-rose-500 to-pink-500",
  warn: "bg-linear-to-r from-amber-500 to-orange-500",
  pulse: "bg-linear-to-r from-blue-500 to-indigo-500",
} as const;

export function RiskWindowCard({ data }: { data: RiskWindowData }) {
  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-6 shadow-[0_4px_24px_-4px_rgba(20,30,55,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(20,30,55,0.09)]">
      <div>
        <header className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-amber-500" />
            <h2 className="font-display text-[15px] sm:text-[17px] font-bold text-slate-900">
              Expected Risk Window
            </h2>
          </div>
          <StatusBadge tone="warn">High Likelihood</StatusBadge>
        </header>

        {/* Highlight Peak Box */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-linear-to-br from-amber-50/70 to-orange-50/40 p-3.5 sm:p-4">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Highest Likelihood Window
            </div>
            <div className="mt-1 font-display text-[18px] sm:text-[20px] font-extrabold leading-tight text-slate-900">
              {data.label}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Peak Probability
            </div>
            <div className="mt-1 font-mono text-lg sm:text-xl font-extrabold text-rose-600 tabular-nums">
              {data.peakLikelihood}%
            </div>
          </div>
        </div>

        {/* Segments */}
        <div className="mt-4 space-y-2">
          {data.segments.map((seg) => {
            const tone = toneFor(seg.probability);
            return (
              <div
                key={seg.label}
                className={cn(
                  "rounded-xl border p-2.5 transition-colors",
                  seg.inWindow
                    ? "border-rose-200 bg-rose-50/60 shadow-xs"
                    : "border-slate-100 bg-slate-50/60"
                )}
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider">
                  <span
                    className={cn(
                      "font-semibold",
                      seg.inWindow ? "text-rose-700 font-bold" : "text-slate-600"
                    )}
                  >
                    {seg.label}
                    {seg.inWindow && " · Active Window"}
                  </span>
                  <span className="font-bold text-slate-800">{seg.probability}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700 ease-out", TONE_BAR[tone])}
                    style={{ width: `${seg.probability}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 border-t border-slate-100 pt-3 flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
        <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
        {data.note}
      </p>
    </section>
  );
}
