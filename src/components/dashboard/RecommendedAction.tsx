import { Check, Info, ShieldCheck, Sparkles, Undo2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { StatusBadge } from "../ui/Badge";

export interface RecommendedActionData {
  headline: string;
  rationale: string;
  steps: readonly string[];
  approvalNote: string;
}

type Decision = "idle" | "approved" | "dismissed";

/**
 * Analyst-facing guidance card — redesign with modern light theme,
 * gradient accents, numbered step pills, and reactive hover.
 */
export function RecommendedAction({ action }: { action: RecommendedActionData }) {
  const [decision, setDecision] = useState<Decision>("idle");

  return (
    <section className="flex flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(20,30,55,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(20,30,55,0.09)]">
      <div>
        <header className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-blue-600" />
            <h2 className="font-display text-[15px] font-bold text-slate-900 uppercase tracking-wider">
              Recommended Action
            </h2>
          </div>
          <div>
            {decision === "idle" && <StatusBadge tone="warn">Awaiting review</StatusBadge>}
            {decision === "approved" && (
              <StatusBadge tone="safe" pulse>
                Queued for sign-off
              </StatusBadge>
            )}
            {decision === "dismissed" && <StatusBadge tone="neutral">Dismissed</StatusBadge>}
          </div>
        </header>

        <div className="mt-4 flex items-start gap-3.5">
          <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xs">
            <Sparkles size={18} aria-hidden />
          </div>
          <div>
            <p className="text-[14.5px] font-bold leading-snug text-slate-900">{action.headline}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{action.rationale}</p>
          </div>
        </div>

        <ol className="mt-4 space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
          {action.steps.map((step, i) => (
            <li key={step} className="flex items-start gap-2.5 text-xs font-medium leading-relaxed text-slate-700">
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50/60 px-3 py-2 text-[11.5px] text-amber-800">
          <Info size={14} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
          <p className="leading-relaxed">{action.approvalNote}</p>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4 flex items-center gap-2">
        {decision === "idle" ? (
          <>
            <button
              type="button"
              onClick={() => setDecision("approved")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs shadow-blue-500/25 hover:bg-blue-700 active:scale-98 transition-all cursor-pointer"
            >
              <Check size={14} strokeWidth={2.4} aria-hidden /> Approve for Review
            </button>
            <button
              type="button"
              onClick={() => setDecision("dismissed")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
            >
              <X size={14} aria-hidden /> Dismiss
            </button>
          </>
        ) : (
          <div className="flex w-full items-center justify-between gap-2">
            <div
              className={cn(
                "flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium",
                decision === "approved"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              )}
            >
              {decision === "approved" ? (
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <X size={16} className="text-slate-400 shrink-0" />
              )}
              <span className="truncate">
                {decision === "approved"
                  ? "Queued for SOC lead review."
                  : "Recommendation dismissed."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDecision("idle")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Undo2 size={13} /> Undo
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
