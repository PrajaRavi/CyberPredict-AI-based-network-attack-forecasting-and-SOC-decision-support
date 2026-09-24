interface ConfidenceCardProps {
  /** Model confidence, 0–100. */
  confidence: number;
  caption?: string;
}

/** Prediction-confidence KPI with a calibrated 0–100 bar. */
export function ConfidenceCard({
  confidence,
  caption = "High-confidence band · ensemble agreement",
}: ConfidenceCardProps) {
  const value = Math.min(100, Math.max(0, confidence));

  return (
    <article className="flex flex-col rounded-lg border border-line bg-ink-800/60 p-4 transition-colors duration-200 hover:border-line-bright">
      <header className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-mist-500">
          Prediction confidence
        </span>
        <span className="rounded border border-line-bright bg-ink-750/60 px-1.5 py-0.5 font-mono text-[9px] tabular-nums text-mist-400">
          {value}/100
        </span>
      </header>

      <div className="mt-4 flex items-end gap-1">
        <span className="font-display text-[26px] font-bold leading-none tabular-nums text-mist-50">
          {value}
        </span>
        <span className="pb-0.5 font-mono text-[11px] text-mist-500">%</span>
      </div>

      <div className="mt-3.5">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-ink-700">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-pulse-500 shadow-[0_0_12px_rgba(28,197,234,0.45)] transition-[width] duration-700 ease-out"
            style={{ width: `${value}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[8.5px] uppercase tracking-wider text-mist-600">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <p className="mt-auto pt-3.5 text-[11.5px] leading-relaxed text-mist-500">{caption}</p>
    </article>
  );
}
