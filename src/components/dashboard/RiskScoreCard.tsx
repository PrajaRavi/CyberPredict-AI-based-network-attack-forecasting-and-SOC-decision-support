import { ShieldCheck, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";
import type { RiskLevel } from "./RiskLevelBadge";

export interface RiskScoreData {
  value: number;
  max: number;
  level: RiskLevel;
  delta: number;
  deltaWindow: string;
  trend: string;
  baseline: number;
  caption: string;
}

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RiskScoreCard({ score }: { score: RiskScoreData }) {
  const pct = Math.min(1, Math.max(0, score.value / score.max));
  const rising = score.delta >= 0;

  return (
    <article className="group relative flex flex-col justify-between rounded-3xl bg-linear-to-br from-[#10e5be] via-[#0ccda9] to-[#05b293] p-4 sm:p-5 lg:p-6 text-white shadow-[0_12px_28px_-6px_rgba(16,229,190,0.38)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_20px_36px_-6px_rgba(16,229,190,0.5)] cursor-pointer overflow-hidden">
      {/* Ambient decorative glow inside card */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-xl transition-all duration-500 group-hover:scale-125" />

      {/* Header: Icon badge + Title */}
      <div>
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="grid size-10 sm:size-11 place-items-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-xs">
            <ShieldCheck size={20} className="sm:size-[22px]" strokeWidth={2.4} />
          </div>
          <span className="rounded-full bg-white/20 px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider backdrop-blur-md">
            {score.level}
          </span>
        </div>

        <div className="mt-3.5 sm:mt-4">
          <span className="font-sans text-xs sm:text-[13px] font-medium text-white/85 tracking-wide">
            Composite Risk Score
          </span>
          <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-display text-[28px] sm:text-[32px] lg:text-[36px] font-extrabold leading-none tracking-tight text-white drop-shadow-xs">
              {score.value}
            </span>
            <span className="font-mono text-xs sm:text-sm font-semibold text-white/75">
              / {score.max} pts
            </span>
          </div>
        </div>
      </div>

      {/* Middle circular mini gauge */}
      <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-2 pt-1 border-t border-white/15">
        <span className="text-[11px] sm:text-xs text-white/90 font-medium truncate">
          Baseline {score.baseline} · {score.trend}
        </span>
        <div className="relative size-10 sm:size-12 shrink-0">
          <svg viewBox="0 0 72 72" className="size-full -rotate-90">
            <circle
              cx="36"
              cy="36"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="5"
            />
            <circle
              cx="36"
              cy="36"
              r={RADIUS}
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - pct)}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center font-mono text-[9.5px] sm:text-[10px] font-bold text-white">
            {Math.round(pct * 100)}%
          </div>
        </div>
      </div>

      {/* Footer Pill */}
      <div className="mt-3 sm:mt-3.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold backdrop-blur-md text-white shadow-2xs">
          <TrendingUp size={12} className={cn(!rising && "rotate-180")} />
          <span className="truncate">
            {rising ? "+" : ""}
            {score.delta}% than last hour
          </span>
        </div>
      </div>
    </article>
  );
}
