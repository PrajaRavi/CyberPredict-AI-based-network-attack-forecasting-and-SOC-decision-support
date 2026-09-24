import { BellRing, Radar } from "lucide-react";
import { useMemo, useState } from "react";
import { AlertCard, type AlertSeverity } from "../components/alerts/AlertCard";
import { StatusBadge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";
import { alerts } from "../data/mockAlerts.js";
import { cn } from "../utils/cn";

type SeverityFilter = "ALL" | AlertSeverity;

const FILTER_META: Record<SeverityFilter, { label: string; dot: string; active: string }> = {
  ALL: { label: "All", dot: "bg-mist-500", active: "border-line-bright bg-ink-750/70 text-mist-100" },
  CRITICAL: { label: "Critical", dot: "bg-crit-400", active: "border-crit-500/40 bg-crit-500/10 text-crit-400" },
  HIGH: { label: "High", dot: "bg-crit-500", active: "border-crit-500/40 bg-crit-500/10 text-crit-400" },
  MEDIUM: { label: "Medium", dot: "bg-warn-400", active: "border-warn-500/40 bg-warn-500/10 text-warn-400" },
  LOW: { label: "Low", dot: "bg-safe-400", active: "border-safe-500/40 bg-safe-500/10 text-safe-400" },
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
    <div className="space-y-5">
      <PageHeader
        icon={BellRing}
        eyebrow="Module ALR-05 · Incident queue"
        title="Alerts"
        description="Severity-ranked incident queue with model-assisted triage. Alerts are decision support — every response step stays with the analyst."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="crit" pulse>
              {counts.CRITICAL + counts.HIGH} high+ active
            </StatusBadge>
            <StatusBadge tone="neutral">Manual mode</StatusBadge>
          </div>
        }
      />

      {/* Severity filters */}
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
                "inline-flex h-9 items-center gap-2 rounded-md border px-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] transition-colors duration-150",
                active ? meta.active : "border-line text-mist-400 hover:border-line-bright hover:text-mist-100",
              )}
            >
              <span className={cn("size-1.5 rounded-full", meta.dot, sev === "CRITICAL" && active && "animate-pulse")} />
              {meta.label}
              <span className="tabular-nums opacity-70">{counts[sev]}</span>
            </button>
          );
        })}
        <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.14em] text-mist-600 sm:inline">
          Newest first · {visible.length} shown
        </span>
      </div>

      {/* Alert list */}
      {visible.length > 0 ? (
        <div className="space-y-3.5">
          {visible.map((alert, i) => (
            <AlertCard key={alert.id} alert={alert} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-line bg-ink-800/60 px-4 py-16 text-center">
          <Radar size={22} className="text-mist-600" aria-hidden />
          <p className="text-[13px] text-mist-400">No alerts at this severity — the queue is clear here.</p>
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className="rounded-md border border-pulse-500/40 bg-pulse-500/10 px-3 py-1.5 text-[12px] font-medium text-pulse-300 transition-colors hover:bg-pulse-500/20"
          >
            Show all alerts
          </button>
        </div>
      )}

      <p className="border-t border-line/70 pt-4 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-mist-600">
        Decision support only — CyberPredict never executes automatic blocking or destructive actions.
      </p>
    </div>
  );
}
