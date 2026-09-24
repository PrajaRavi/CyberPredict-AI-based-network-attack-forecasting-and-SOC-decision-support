import { Crosshair } from "lucide-react";

export interface PredictionData {
  attackType: string;
  attackLabel: string;
  riskWindow: string;
}

/** Primary model prediction KPI — forecasting language only, never confirmation. */
export function PredictionCard({ prediction }: { prediction: PredictionData }) {
  return (
    <article className="flex flex-col rounded-lg border border-line bg-ink-800/60 p-4 transition-colors duration-200 hover:border-line-bright">
      <header className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-mist-500">
          Predicted attack
        </span>
        <Crosshair size={14} className="text-mist-500" aria-hidden />
      </header>

      <div className="mt-4">
        <div className="font-display text-[26px] font-bold leading-none tracking-tight text-mist-50">
          {prediction.attackType}
        </div>
        <div className="mt-1.5 text-[12px] leading-snug text-mist-400">{prediction.attackLabel}</div>
      </div>

      <div className="mt-auto pt-4">
        <div className="rounded-md border border-line bg-ink-850/70 px-3 py-2.5">
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600">
            Expected risk window
          </div>
          <div className="mt-1 font-mono text-[12px] font-medium text-warn-400">
            {prediction.riskWindow}
          </div>
        </div>
        <p className="pt-2.5 text-[11px] leading-relaxed text-mist-600">
          Probabilistic forecast — not a confirmed event.
        </p>
      </div>
    </article>
  );
}
