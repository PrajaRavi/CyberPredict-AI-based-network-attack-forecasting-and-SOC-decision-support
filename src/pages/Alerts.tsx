import { BellRing, Radar } from "lucide-react";
import { useMemo, useState } from "react";
import { AlertCard, type AlertSeverity } from "../components/alerts/AlertCard";
import { StatusBadge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";
import { alerts } from "../data/mockAlerts.js";
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
  const [filter, setFilter] = useState<SeverityFilter>("ALL");

  const counts = useMemo(() => {
    const c: Record<SeverityFilter, number> = { ALL: alerts.length, CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    for (const a of alerts) c[a.severity] += 1;
    return c;
  }, []);

  const visible = filter === "ALL" ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BellRing}
        eyebrow="Module ALR-05 · Incident queue"
        title="Alerts"
        description="Severity-ranked incident queue with model-assisted triage. Every response step remains with the analyst."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="crit" pulse>
              {counts.CRITICAL + counts.HIGH} High+ Active
            </StatusBadge>
            <StatusBadge tone="neutral">Analyst Mode</StatusBadge>
          </div>
        }
      />

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
                  sev === "CRITICAL" && active && "animate-pulse"
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
          <p className="text-sm font-semibold text-slate-600">No alerts at this severity — the queue is clear.</p>
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
