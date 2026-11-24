import {
  ArrowRight,
  Check,
  Globe,
  KeyRound,
  Radar,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
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
  status?: "Open" | "Acknowledged" | "Resolved" | "Investigating";
  title?: string;
  protocol?: string;
  indicator?: string;
  deviation?: string;
}

const SEV: Record<AlertSeverity, { border: string; bar: string; badgeTone: "crit" | "warn" | "safe" }> = {
  LOW: { border: "border-emerald-200/80 hover:border-emerald-300", bar: "bg-emerald-500", badgeTone: "safe" },
  MEDIUM: { border: "border-amber-200/80 hover:border-amber-300", bar: "bg-amber-500", badgeTone: "warn" },
  HIGH: { border: "border-rose-200/80 hover:border-rose-300", bar: "bg-rose-500", badgeTone: "crit" },
  CRITICAL: { border: "border-rose-300 hover:border-rose-400 shadow-rose-500/5", bar: "bg-rose-600 animate-pulse", badgeTone: "crit" },
};

const VECTOR_ICONS: Record<string, { icon: LucideIcon; bg: string; color: string }> = {
  "DDoS forecast": { icon: ShieldAlert, bg: "bg-rose-50", color: "text-rose-600" },
  "DDoS pattern": { icon: ShieldAlert, bg: "bg-rose-50", color: "text-rose-600" },
  Flood: { icon: Waves, bg: "bg-blue-50", color: "text-blue-600" },
  Volume: { icon: Zap, bg: "bg-amber-50", color: "text-amber-600" },
  "Risk index": { icon: Radar, bg: "bg-rose-50", color: "text-rose-600" },
  Scan: { icon: ScanSearch, bg: "bg-purple-50", color: "text-purple-600" },
  Behaviour: { icon: Waves, bg: "bg-indigo-50", color: "text-indigo-600" },
  DNS: { icon: Globe, bg: "bg-cyan-50", color: "text-cyan-600" },
  "Brute force": { icon: KeyRound, bg: "bg-amber-50", color: "text-amber-600" },
  "Protocol mix": { icon: ScanSearch, bg: "bg-slate-100", color: "text-slate-600" },
  Telemetry: { icon: Radar, bg: "bg-slate-100", color: "text-slate-600" },
  "Risk window": { icon: ShieldAlert, bg: "bg-rose-50", color: "text-rose-600" },
};

export function AlertCard({ alert, index = 0 }: { alert: AlertItem; index?: number }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const sev = SEV[alert.severity];
  const vectorMeta = VECTOR_ICONS[alert.vector] ?? { icon: ShieldAlert, bg: "bg-slate-100", color: "text-slate-600" };
  const VectorIcon = vectorMeta.icon;

  return (
    <article
      className={cn(
        "animate-enter group overflow-hidden rounded-3xl border bg-white shadow-[0_2px_12px_rgba(20,30,55,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-6px_rgba(20,30,55,0.09)]",
        sev.border
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex">
        {/* Severity indicator stripe */}
        <div className={cn("w-1.5 shrink-0", sev.bar)} aria-hidden />

        <div className="min-w-0 flex-1 p-4 sm:p-5">
          {/* Header row: Badges + Timestamp */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <div className={cn("grid size-7 place-items-center rounded-xl", vectorMeta.bg, vectorMeta.color)}>
              <VectorIcon size={14} strokeWidth={2.4} />
            </div>
            <RiskLevelBadge level={alert.severity as RiskLevel} size="sm" />
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700">
              {alert.vector}
            </span>
            {acknowledged && (
              <StatusBadge tone="safe">
                <span className="inline-flex items-center gap-1">
                  <Check size={11} /> Acknowledged
                </span>
              </StatusBadge>
            )}
            <span className="ml-auto font-mono text-[11px] font-medium text-slate-400">
              {alert.id} · {alert.timestamp} UTC
            </span>
          </div>

          {/* Alert Message */}
          <h3 className="mt-1 font-display text-[15px] sm:text-[16px] font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors">
            {alert.message}
          </h3>

          {/* Source -> Target Route */}
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-slate-500">
            <span className="font-semibold text-slate-700 bg-slate-100/70 px-2 py-0.5 rounded-md">
              {alert.source}
            </span>
            <ArrowRight size={12} className="text-slate-400" />
            <span className="font-semibold text-slate-700 bg-slate-100/70 px-2 py-0.5 rounded-md">
              {alert.target}
            </span>
          </div>

          {/* Recommended Action Box */}
          <div className="mt-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 sm:p-3.5">
            <div className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
              Recommended Action
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-700 font-medium">{alert.recommendedAction}</p>
          </div>

          {/* Footer: Actions */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setAcknowledged((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs",
                acknowledged
                  ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  : "bg-blue-600 text-white shadow-blue-500/25 hover:bg-blue-700"
              )}
            >
              {acknowledged ? (
                "Unacknowledge"
              ) : (
                <>
                  <ShieldCheck size={14} /> Acknowledge Alert
                </>
              )}
            </button>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              Human review required · No automatic blocking
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
