import { Flame, TrendingDown } from "lucide-react";

export interface ForecastStatusData {
  status: string;
  tone: "safe" | "warn" | "crit";
  window: string;
  model: string;
  lastRun: string;
  nextRun: string;
}

export function ForecastStatus({ status }: { status: ForecastStatusData }) {
  return (
    <article className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#ff7e95] via-[#fb6380] to-[#e84666] p-4 sm:p-5 lg:p-6 text-white shadow-[0_12px_28px_-6px_rgba(251,99,128,0.38)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_20px_36px_-6px_rgba(251,99,128,0.5)] cursor-pointer overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-xl transition-all duration-500 group-hover:scale-125" />

      {/* Header: Icon badge + Status pill */}
      <div>
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="grid size-10 sm:size-11 place-items-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-xs">
            <Flame size={20} className="sm:size-[22px]" strokeWidth={2.4} />
          </div>
          <span className="rounded-full bg-white/20 px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider backdrop-blur-md">
            Active Watch
          </span>
        </div>

        <div className="mt-3.5 sm:mt-4">
          <span className="font-sans text-xs sm:text-[13px] font-medium text-white/85 tracking-wide">
            Threat Posture Status
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-[22px] sm:text-[26px] lg:text-[30px] font-extrabold leading-tight tracking-tight text-white drop-shadow-xs truncate">
              {status.status}
            </span>
          </div>
        </div>
      </div>

      {/* Key model telemetry */}
      <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-2 border-t border-white/15 pt-2 text-[11px] sm:text-xs text-white/90">
        <span className="font-medium truncate">{status.model}</span>
        <span className="font-mono text-[10px] sm:text-[11px] text-white/80 shrink-0">Refreshed {status.lastRun}</span>
      </div>

      {/* Footer Pill */}
      <div className="mt-3 sm:mt-3.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold backdrop-blur-md text-white shadow-2xs">
          <TrendingDown size={12} />
          <span className="truncate">Next eval {status.nextRun} ↘ Active</span>
        </div>
      </div>
    </article>
  );
}
