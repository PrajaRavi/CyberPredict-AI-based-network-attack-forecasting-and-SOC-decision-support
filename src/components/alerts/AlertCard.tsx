import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { RiskLevelBadge, type RiskLevel } from "../dashboard/RiskLevelBadge";
import { StatusBadge } from "../ui/Badge";

export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AlertItem {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  vector: string;
  message: string;
  recommendedAction: string;
  source: string;
  target: string;
}

const SEV: Record<AlertSeverity, { border: string; bar: string; pulse: boolean }> = {
  LOW: { border: "border-safe-500/25", bar: "bg-safe-500", pulse: false },
  MEDIUM: { border: "border-warn-500/25", bar: "bg-warn-500", pulse: false },
  HIGH: { border: "border-crit-500/30", bar: "bg-crit-500", pulse: false },
  CRITICAL: { border: "border-crit-500/50", bar: "bg-crit-400", pulse: true },
};

/**
 * One alert in the incident queue. Read-only decision support: the only
 * interaction is acknowledgement — no blocking or destructive actions.
 */
export function AlertCard({ alert, index = 0 }: { alert: AlertItem; index?: number }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const sev = SEV[alert.severity];

  return (
    <article
      className={cn(
        "animate-enter overflow-hidden rounded-lg border bg-ink-800/60 transition-colors duration-200 hover:border-line-bright",
        sev.border,
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex">
        {/* Severity stripe */}
        <div className={cn("w-1 shrink-0", sev.bar, sev.pulse && "animate-pulse")} aria-hidden />

        <div className="min-w-0 flex-1 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <RiskLevelBadge level={alert.severity as RiskLevel} size="sm" />
            <span className="rounded border border-line-bright bg-ink-750/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mist-400">
              {alert.vector}
            </span>
            {acknowledged && (
              <StatusBadge tone="safe">
                <span className="inline-flex items-center gap-1">
                  <Check size={10} aria-hidden /> Acknowledged
                </span>
              </StatusBadge>
            )}
            <span className="ml-auto font-mono text-[10px] tabular-nums text-mist-600">
              {alert.id} · {alert.timestamp} UTC
            </span>
          </div>

          <h3 className="mt-2.5 text-[14.5px] font-semibold leading-snug text-mist-50">{alert.message}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10.5px] text-mist-500">
            <span className="text-mist-300">{alert.source}</span>
            <ArrowRight size={11} className="text-mist-600" aria-hidden />
            <span className="text-mist-300">{alert.target}</span>
          </div>

          <div className="mt-3 rounded-md border border-line bg-ink-850/70 px-3 py-2.5">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600">
              Recommended action
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-mist-300">{alert.recommendedAction}</p>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setAcknowledged((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11.5px] font-medium transition-colors duration-150",
                acknowledged
                  ? "border-line text-mist-400 hover:border-line-bright hover:text-mist-100"
                  : "border-pulse-500/40 bg-pulse-500/10 text-pulse-300 hover:bg-pulse-500/20",
              )}
            >
              {acknowledged ? (
                "Unacknowledge"
              ) : (
                <>
                  <ShieldCheck size={13} aria-hidden /> Acknowledge
                </>
              )}
            </button>
            <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.14em] text-mist-600">
              Human review required · no automated blocking
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
