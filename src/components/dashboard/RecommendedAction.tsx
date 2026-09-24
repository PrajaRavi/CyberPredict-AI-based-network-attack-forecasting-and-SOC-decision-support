import { Check, Info, ShieldCheck, Sparkles, Undo2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { StatusBadge } from "../ui/Badge";

export interface RecommendedActionData {
  headline: string;
  rationale: string;
  steps: readonly string[];
  approvalNote: string;
}

type Decision = "idle" | "approved" | "dismissed";

/**
 * Analyst-facing guidance card. Every action is explicitly pending human
 * approval — UI state only, no backend or automation behind it.
 */
export function RecommendedAction({ action }: { action: RecommendedActionData }) {
  const [decision, setDecision] = useState<Decision>("idle");

  return (
    <section className="flex flex-col rounded-lg border border-line bg-ink-800/60">
      <header className="flex min-h-11 items-center gap-2.5 border-b border-line px-4 py-2">
        <span aria-hidden className="size-1.5 shrink-0 rounded-xs bg-pulse-500/80" />
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-mist-400">
          Recommended action
        </h2>
        <div className="ml-auto">
          {decision === "idle" && <StatusBadge tone="warn">Awaiting approval</StatusBadge>}
          {decision === "approved" && (
            <StatusBadge tone="safe" pulse>Queued for sign-off</StatusBadge>
          )}
          {decision === "dismissed" && <StatusBadge tone="neutral">Dismissed</StatusBadge>}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-3.5 p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-8 shrink-0 place-items-center rounded-md border border-pulse-500/30 bg-pulse-500/10 text-pulse-400">
            <Sparkles size={15} aria-hidden />
          </div>
          <div>
            <p className="text-[14px] font-semibold leading-snug text-mist-50">{action.headline}</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-mist-500">{action.rationale}</p>
          </div>
        </div>

        <ol className="space-y-1.5 rounded-md border border-line bg-ink-850/70 p-3">
          {action.steps.map((step, i) => (
            <li key={step} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-mist-300">
              <span className="mt-px shrink-0 font-mono text-[9.5px] tabular-nums text-pulse-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="flex items-start gap-2 rounded-md border border-warn-500/20 bg-warn-500/6 px-3 py-2.5">
          <Info size={13} className="mt-0.5 shrink-0 text-warn-400" aria-hidden />
          <p className="text-[11px] leading-relaxed text-mist-400">{action.approvalNote}</p>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-1">
          {decision === "idle" ? (
            <>
              <button
                type="button"
                onClick={() => setDecision("approved")}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-pulse-500/40 bg-pulse-500/15 px-3 py-2 text-[12.5px] font-medium text-pulse-300 transition-colors duration-150 hover:bg-pulse-500/25"
              >
                <Check size={14} aria-hidden /> Approve for review
              </button>
              <button
                type="button"
                onClick={() => setDecision("dismissed")}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-3 py-2 text-[12.5px] font-medium text-mist-400 transition-colors duration-150 hover:border-line-bright hover:text-mist-100"
              >
                <X size={14} aria-hidden /> Dismiss
              </button>
            </>
          ) : (
            <>
              <div
                className={cn(
                  "flex flex-1 items-center gap-2 rounded-md border px-3 py-2 text-[11.5px] leading-snug",
                  decision === "approved"
                    ? "border-safe-500/25 bg-safe-500/8 text-safe-400"
                    : "border-line bg-ink-850 text-mist-400",
                )}
              >
                {decision === "approved" ? (
                  <ShieldCheck size={14} className="shrink-0" aria-hidden />
                ) : (
                  <X size={14} className="shrink-0" aria-hidden />
                )}
                {decision === "approved"
                  ? "Queued for SOC lead sign-off — no automated action taken."
                  : "Recommendation dismissed by analyst."}
              </div>
              <button
                type="button"
                onClick={() => setDecision("idle")}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-line px-3 py-2 text-[12px] text-mist-400 transition-colors duration-150 hover:border-line-bright hover:text-mist-100"
              >
                <Undo2 size={13} aria-hidden /> Undo
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
