import { Crosshair, TrendingUp } from "lucide-react";

export interface PredictionData {
  attackType: string;
  attackLabel: string;
  riskWindow: string;
  confidence?: number;
}

export function PredictionCard({ prediction }: { prediction: PredictionData }) {
  return (
    <article className="group relative flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#68a5fd] via-[#5493f7] to-[#3b7bf6] p-4 sm:p-5 lg:p-6 text-white shadow-[0_12px_28px_-6px_rgba(67,121,238,0.38)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_20px_36px_-6px_rgba(67,121,238,0.5)] cursor-pointer overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-xl transition-all duration-500 group-hover:scale-125" />

      {/* Header: Icon badge + Label */}
      <div>
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="grid size-10 sm:size-11 place-items-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-xs">
            <Crosshair size={20} className="sm:size-[22px]" strokeWidth={2.4} />
          </div>
          <span className="rounded-full bg-white/20 px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider backdrop-blur-md">
            AI Forecast
          </span>
        </div>

        <div className="mt-3.5 sm:mt-4">
          <span className="font-sans text-xs sm:text-[13px] font-medium text-white/85 tracking-wide">
            Predicted Attack Pattern
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-[24px] sm:text-[28px] lg:text-[32px] font-extrabold leading-tight tracking-tight text-white drop-shadow-xs truncate">
              {prediction.attackType}
            </span>
          </div>
          <div className="text-[11px] sm:text-xs text-white/85 line-clamp-1 mt-0.5">
            {prediction.attackLabel}
          </div>
        </div>
      </div>

      {/* Risk Window Box */}
      <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-2 rounded-2xl bg-white/15 px-3 sm:px-3.5 py-2 sm:py-2.5 backdrop-blur-xs border border-white/10">
        <span className="text-[10.5px] sm:text-[11px] font-medium text-white/80">Window</span>
        <span className="font-mono text-[11px] sm:text-xs font-bold text-white truncate">
          {prediction.riskWindow}
        </span>
      </div>

      {/* Footer Pill */}
      <div className="mt-3 sm:mt-3.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold backdrop-blur-md text-white shadow-2xs">
          <TrendingUp size={12} />
          <span className="truncate">+ {prediction.confidence ?? 94}% ↗ High confidence</span>
        </div>
      </div>
    </article>
  );
}
