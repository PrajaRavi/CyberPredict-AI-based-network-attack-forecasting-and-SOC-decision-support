import { Clock } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ForecastStatusData {
  status: string;
  tone: "safe" | "warn" | "crit";
  window: string;
  model: string;
  lastRun: string;
  nextRun: string;
}

const TONE_TEXT: Record<ForecastStatusData["tone"], string> = {
  safe: "text-safe-400",
  warn: "text-warn-400",
  crit: "text-crit-400",
};

const TONE_DOT: Record<ForecastStatusData["tone"], string> = {
  safe: "bg-safe-400",
  warn: "bg-warn-400",
  crit: "bg-crit-400",
};

/** Aggregate forecasting-engine status KPI (e.g. "Elevated Risk"). */
export function ForecastStatus({ status }: { status: ForecastStatusData }) {
  return (
    <article className="flex flex-col rounded-lg border border-line bg-ink-800/60 p-4 transition-colors duration-200 hover:border-line-bright">
      <header className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-mist-500">
          Forecast status
        </span>
        <Clock size={14} className="text-mist-500" aria-hidden />
      </header>

      <div className="mt-4 flex items-center gap-2.5">
        <span className="relative flex size-2 shrink-0">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 [animation-duration:2.4s]",
              TONE_DOT[status.tone],
            )}
          />
          <span className={cn("relative inline-flex size-2 rounded-full", TONE_DOT[status.tone])} />
        </span>
        <span className={cn("font-display text-[19px] font-semibold leading-none", TONE_TEXT[status.tone])}>
          {status.status}
        </span>
      </div>

      <dl className="mt-4 space-y-2 font-mono text-[10px]">
        <div className="flex items-baseline justify-between gap-3 border-b border-line/60 pb-2">
          <dt className="uppercase tracking-[0.14em] text-mist-600">Risk window</dt>
          <dd className="text-right text-mist-300">{status.window}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-b border-line/60 pb-2">
          <dt className="uppercase tracking-[0.14em] text-mist-600">Model</dt>
          <dd className="text-right text-mist-300">{status.model}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="uppercase tracking-[0.14em] text-mist-600">Next evaluation</dt>
          <dd className="text-right text-pulse-400">{status.nextRun}</dd>
        </div>
      </dl>

      <p className="mt-auto pt-3.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-mist-600">
        Last run {status.lastRun}
      </p>
    </article>
  );
}
