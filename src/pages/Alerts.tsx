import { AlertTriangle, BellRing, CheckCircle2, Radar, RotateCcw, ShieldAlert, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { AlertCard, type AlertSeverity } from "../components/alerts/AlertCard";
import { StatusBadge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";
import { useAlerts } from "../context/AlertContext";
import { cn } from "../lib/utils";

type SeverityFilter = "ALL" | AlertSeverity;

const FILTER_META: Record<SeverityFilter, { label: string; dot: string; activeClass: string }> = {
  ALL: {
    label: "All",
    dot: "bg-slate-400",
    activeClass: "bg-blue-600 text-white shadow-xs shadow-blue-500/25 border-transparent",
  },
  CRITICAL: {
    label: "Critical",
    dot: "bg-rose-500",
    activeClass: "bg-rose-600 text-white shadow-xs shadow-rose-500/25 border-transparent",
  },
  HIGH: {
    label: "High",
    dot: "bg-rose-400",
    activeClass: "bg-rose-500 text-white shadow-xs shadow-rose-500/25 border-transparent",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-amber-500",
    activeClass: "bg-amber-500 text-white shadow-xs shadow-amber-500/25 border-transparent",
  },
  LOW: {
    label: "Low",
    dot: "bg-emerald-500",
    activeClass: "bg-emerald-600 text-white shadow-xs shadow-emerald-500/25 border-transparent",
  },
};

const FILTER_ORDER: SeverityFilter[] = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function AlertsPage() {
  const {
    alerts,
    hasCriticalOrHigh,
    criticalCount,
    highCount,
    activateCriticalAlert,
    resetToBaseline,
  } = useAlerts();

  const [filter, setFilter] = useState<SeverityFilter>("ALL");
  const [lastActivatedId, setLastActivatedId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<SeverityFilter, number> = {
      ALL: alerts.length,
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };
    for (const a of alerts) c[a.severity] += 1;
    return c;
  }, [alerts]);

  const visible = filter === "ALL" ? alerts : alerts.filter((a) => a.severity === filter);

  const handleActivate = () => {
    const newAlert = activateCriticalAlert();
    setLastActivatedId(newAlert.id);
    // If user was on LOW or MEDIUM filter, switch to ALL so the critical alert is immediately visible
    if (filter === "LOW" || filter === "MEDIUM") {
      setFilter("ALL");
    }
  };

  const handleReset = () => {
    resetToBaseline();
    setLastActivatedId(null);
    setFilter("ALL");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BellRing}
        eyebrow="Module ALR-05 · Incident queue"
        title="Alerts"
        description="Severity-ranked incident queue with model-assisted triage. Every response step remains with the analyst."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            {/* Activate Button */}
            <button
              type="button"
              onClick={handleActivate}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-rose-600 via-rose-500 to-red-600 px-4 py-2 font-display text-xs font-bold text-white shadow-md shadow-rose-500/25 hover:from-rose-500 hover:to-red-500 active:scale-95 transition-all cursor-pointer"
              title="Inject a new high-priority Critical notification"
            >
              <Zap size={15} className="fill-white animate-pulse" />
              <span>Activate</span>
            </button>

            {/* Reset to Baseline Button */}
            {hasCriticalOrHigh && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 font-sans text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer active:scale-95"
                title="Reset alert queue to initial low/medium baseline"
              >
                <RotateCcw size={13} />
                <span>Reset to Low/Medium</span>
              </button>
            )}

            <StatusBadge tone={hasCriticalOrHigh ? "crit" : "safe"} pulse={hasCriticalOrHigh}>
              {hasCriticalOrHigh
                ? `${criticalCount + highCount} High+ Active`
                : "Nominal · Low/Med Only"}
            </StatusBadge>
            <StatusBadge tone="neutral">Analyst Mode</StatusBadge>
          </div>
        }
      />

      {/* Interactive Simulation Status / Action Banner */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3.5 rounded-2xl border p-4 transition-all duration-300",
          hasCriticalOrHigh
            ? "border-rose-200 bg-linear-to-r from-rose-50/80 via-red-50/50 to-orange-50/30 shadow-xs"
            : "border-slate-200/80 bg-white/80"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-xl",
              hasCriticalOrHigh
                ? "bg-rose-500 text-white shadow-xs shadow-rose-500/30"
                : "bg-slate-100 text-slate-500"
            )}
          >
            {hasCriticalOrHigh ? (
              <ShieldAlert size={18} className="animate-pulse" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xs sm:text-sm font-bold text-slate-900">
                {hasCriticalOrHigh
                  ? "CRITICAL THREAT ACTIVE — Dashboard Alert Triggered"
                  : "Baseline Queue: Low & Medium Alerts Active"}
              </span>
              {lastActivatedId && (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700 animate-pulse">
                  + {lastActivatedId} Injected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {hasCriticalOrHigh
                ? `The whole dashboard is now in High Threat warning mode. ${criticalCount} Critical & ${highCount} High alerts active.`
                : "Click the 'Activate' button above to simulate an incoming Critical threat notification and trigger dashboard-wide warnings."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={handleActivate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 font-sans text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-colors cursor-pointer active:scale-95"
          >
            <Zap size={13} className="fill-white" />
            <span>+ Add Critical Alert</span>
          </button>
        </div>
      </div>

      {/* Severity filter pills */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Severity filter">
        {FILTER_ORDER.map((sev) => {
          const meta = FILTER_META[sev];
          const active = filter === sev;
          return (
            <button
              key={sev}
              type="button"
              onClick={() => setFilter(sev)}
              aria-pressed={active}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 font-sans text-xs font-bold transition-all duration-150 cursor-pointer shadow-2xs",
                active
                  ? meta.activeClass
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  meta.dot,
                  (sev === "CRITICAL" || sev === "HIGH") && active && "animate-pulse"
                )}
              />
              {meta.label}
              <span className="tabular-nums opacity-80 font-mono text-[11px]">{counts[sev]}</span>
            </button>
          );
        })}
        <span className="ml-auto hidden font-mono text-xs text-slate-400 sm:inline font-medium">
          Newest first · {visible.length} displayed
        </span>
      </div>

      {/* Alert Cards List */}
      {visible.length > 0 ? (
        <div className="space-y-4">
          {visible.map((alert, i) => (
            <AlertCard key={alert.id} alert={alert} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <Radar size={28} className="text-slate-300" aria-hidden />
          <p className="text-sm font-semibold text-slate-600">
            No alerts at this severity — the queue is clear.
          </p>
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Show All Alerts
          </button>
        </div>
      )}

      <p className="border-t border-slate-200 pt-4 font-sans text-xs text-slate-400">
        Decision support only — CyberPredict never executes automated blocking or destructive actions.
      </p>
    </div>
  );
}
