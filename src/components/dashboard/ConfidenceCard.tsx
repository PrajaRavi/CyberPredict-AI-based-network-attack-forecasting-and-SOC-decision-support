import { Gauge, TrendingUp } from "lucide-react";

interface ConfidenceCardProps {
  confidence: number;
  caption?: string;
}

export function ConfidenceCard({
  confidence,
  // caption = "Ensemble neural agreement",
}: ConfidenceCardProps) {
  const value = Math.min(100, Math.max(0, confidence));

  return (
    <article className="group relative flex flex-col justify-between rounded-3xl bg-linear-to-br from-[#b388ff] via-[#9d68fe] to-[#8042f8] p-4 sm:p-5 lg:p-6 text-white shadow-[0_12px_28px_-6px_rgba(157,104,254,0.38)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_20px_36px_-6px_rgba(157,104,254,0.5)] cursor-pointer overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-xl transition-all duration-500 group-hover:scale-125" />

      {/* Header: Icon badge + Confidence ratio */}
      <div>
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="grid size-10 sm:size-11 place-items-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-xs">
            <Gauge size={20} className="sm:size-[22px]" strokeWidth={2.4} />
          </div>
          <span className="rounded-full bg-white/20 px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider backdrop-blur-md">
            Calibrated
          </span>
        </div>

        <div className="mt-3.5 sm:mt-4">
          <span className="font-sans text-xs sm:text-[13px] font-medium text-white/85 tracking-wide">
            Model Confidence
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-display text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold leading-none tracking-tight text-white drop-shadow-xs">
              {value}
            </span>
            <span className="font-mono text-base sm:text-xl font-bold text-white/80">%</span>
            <span className="ml-auto font-mono text-[10px] sm:text-[11px] text-white/70">
              {value}/100 band
            </span>
          </div>
        </div>
      </div>

      {/* Calibrated progress bar */}
      <div className="mt-2.5 sm:mt-3">
        <div className="relative h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white transition-[width] duration-700 ease-out shadow-xs"
            style={{ width: `${value}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[9px] text-white/70">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Footer Pill */}
      <div className="mt-3 sm:mt-3.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold backdrop-blur-md text-white shadow-2xs">
          <TrendingUp size={12} />
          <span className="truncate">+ 15% ↗ High agreement</span>
        </div>
      </div>
    </article>
  );
}
