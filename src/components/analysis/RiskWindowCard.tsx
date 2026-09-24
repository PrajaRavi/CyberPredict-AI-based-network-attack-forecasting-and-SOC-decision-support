import { Info } from "lucide-react";
import { cn } from "../../utils/cn";
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

const TONE_TEXT = {
  crit: "text-crit-400",
  warn: "text-warn-400",
  pulse: "text-pulse-400",
} as const;

const TONE_BAR = {
  crit: "bg-crit-500",
  warn: "bg-warn-500",
  pulse: "bg-pulse-500",
} as const;

/**
 * Expected risk window — likelihood by upcoming time segment, with the
 * model's expected window highlighted. Likelihood only, never certainty.
 */
export function RiskWindowCard({ data }: { data: RiskWindowData }) {
  return (
    <section className="flex h-full flex-col rounded-lg border border-line bg-ink-800/60">
      <header className="flex min-h-11 items-center gap-2.5 border-b border-line px-4 py-2">
        <span aria-hidden className="size-1.5 shrink-0 rounded-xs bg-pulse-500/80" />
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-mist-400">
          Expected risk window
        </h2>
        <div className="ml-auto">
          <StatusBadge tone="warn">High likelihood</StatusBadge>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-warn-500/25 bg-warn-500/[0.07] px-3.5 py-3">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600">
              Highest likelihood
            </div>
            <div className="mt-1 font-display text-[20px] font-bold leading-none text-warn-400">
              {data.label}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600">
              Peak likelihood
            </div>
            <div className="mt-1 font-mono text-[18px] font-semibold leading-none tabular-nums text-crit-400">
              {data.peakLikelihood}%
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {data.segments.map((seg) => {
            const tone = toneFor(seg.probability);
            return (
              <div
                key={seg.label}
                className={cn(
                  "rounded-md border px-3 py-2",
                  seg.inWindow ? "border-crit-500/30 bg-crit-500/6" : "border-line/60 bg-ink-850/50",
                )}
              >
                <div className="flex items-center justify-between gap-3 font-mono text-[9.5px] uppercase tracking-[0.14em]">
                  <span className={seg.inWindow ? "font-medium text-crit-400" : "text-mist-500"}>
                    {seg.label}
                    {seg.inWindow && " · expected window"}
                  </span>
                  <span className={cn("tabular-nums", TONE_TEXT[tone])}>{seg.probability}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-700">
                  <div
                    className={cn("h-full rounded-full transition-[width] duration-500 ease-out", TONE_BAR[tone])}
                    style={{ width: `${seg.probability}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-auto flex items-start gap-2 text-[11px] leading-relaxed text-mist-600">
          <Info size={12} className="mt-0.5 shrink-0" aria-hidden />
          {data.note}
        </p>
      </div>
    </section>
  );
}
