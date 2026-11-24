import { ArrowUpRight, Globe, KeyRound, ScanSearch, Server, ShieldAlert, Waves, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAlerts } from "../../context/AlertContext";

interface IncidentRow {
  id: string;
  receiver: string;
  sub: string;
  type: string;
  date: string;
  score: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  icon: typeof ShieldAlert;
  iconBg: string;
  iconColor: string;
}

export function RecentIncidentsTable() {
  const [tab, setTab] = useState<"recently" | "critical">("recently");
  const { alerts, hasCriticalOrHigh } = useAlerts();

  const incidentRows: IncidentRow[] = useMemo(() => {
    return alerts.map((a) => {
      let icon = ShieldAlert;
      let iconBg = "bg-rose-50 border border-rose-100";
      let iconColor = "text-rose-600";
      let score = 55;

      if (a.severity === "CRITICAL") {
        icon = ShieldAlert;
        iconBg = "bg-rose-50 border border-rose-100";
        iconColor = "text-rose-600";
        score = 96;
      } else if (a.severity === "HIGH") {
        icon = Zap;
        iconBg = "bg-amber-50 border border-amber-100";
        iconColor = "text-amber-600";
        score = 84;
      } else if (a.severity === "MEDIUM") {
        if (a.vector.toLowerCase().includes("dns")) {
          icon = Globe;
          iconBg = "bg-purple-50 border border-purple-100";
          iconColor = "text-purple-600";
          score = 64;
        } else if (a.vector.toLowerCase().includes("brute")) {
          icon = KeyRound;
          iconBg = "bg-amber-50 border border-amber-100";
          iconColor = "text-amber-600";
          score = 62;
        } else if (a.vector.toLowerCase().includes("scan")) {
          icon = ScanSearch;
          iconBg = "bg-indigo-50 border border-indigo-100";
          iconColor = "text-indigo-600";
          score = 58;
        } else {
          icon = Waves;
          iconBg = "bg-blue-50 border border-blue-100";
          iconColor = "text-blue-600";
          score = 52;
        }
      } else {
        icon = Server;
        iconBg = "bg-emerald-50 border border-emerald-100";
        iconColor = "text-emerald-600";
        score = 24;
      }

      return {
        id: a.id,
        receiver: a.target.split(" ")[0] || a.target,
        sub: a.source,
        type: a.vector,
        date: a.timestamp.split(" ")[0] || a.timestamp,
        score,
        severity: a.severity,
        icon,
        iconBg,
        iconColor,
      };
    });
  }, [alerts]);

  const displayedRows = useMemo(() => {
    if (tab === "critical") {
      return incidentRows.filter((r) => r.severity === "CRITICAL" || r.severity === "HIGH");
    }
    return incidentRows.slice(0, 5);
  }, [incidentRows, tab]);

  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-6 shadow-[0_4px_24px_-4px_rgba(20,30,55,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(20,30,55,0.09)]">
      {/* Header with tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-[15px] sm:text-[17px] font-bold text-slate-900">
            Transaction history
          </h2>
          {hasCriticalOrHigh && (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 animate-pulse">
              Critical Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab("recently")}
            className={cn(
              "px-2.5 sm:px-3 py-1 rounded-full transition-colors cursor-pointer text-[11px] sm:text-xs",
              tab === "recently"
                ? "text-blue-600 bg-blue-50 font-bold"
                : "text-slate-600 hover:text-slate-800"
            )}
          >
            Recently
          </button>
          <button
            type="button"
            onClick={() => setTab("critical")}
            className={cn(
              "px-2.5 sm:px-3 py-1 rounded-full transition-colors cursor-pointer text-[11px] sm:text-xs",
              tab === "critical"
                ? "text-blue-600 bg-blue-50 font-bold"
                : "text-slate-600 hover:text-slate-800"
            )}
          >
            Critical
          </button>
          <Link
            to="/alerts"
            className="px-2.5 sm:px-3 py-1 text-slate-600 hover:text-slate-800 transition-colors text-[11px] sm:text-xs"
          >
            More
          </Link>
        </div>
      </div>

      {/* Table rows */}
      <div className="overflow-x-auto -mx-1 sm:mx-0">
        {displayedRows.length > 0 ? (
          <table className="w-full text-left text-xs min-w-[460px] sm:min-w-0">
            <thead>
              <tr className="border-b border-slate-100 text-slate-600 font-semibold font-mono text-[9.5px] sm:text-[10px] uppercase tracking-wider">
                <th className="py-2.5 sm:py-3 font-medium">Receiver / Asset</th>
                <th className="py-2.5 sm:py-3 font-medium">Type</th>
                <th className="py-2.5 sm:py-3 font-medium">Date</th>
                <th className="py-2.5 sm:py-3 font-medium text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {displayedRows.map((item) => {
                const Icon = item.icon;
                return (
                  <tr
                    key={item.id}
                    className="group transition-colors duration-150 hover:bg-slate-50/70 cursor-pointer"
                  >
                    <td className="py-3 pr-2 sm:pr-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div
                          className={cn(
                            "grid size-8 sm:size-9 shrink-0 place-items-center rounded-xl sm:rounded-2xl shadow-2xs transition-transform group-hover:scale-105",
                            item.iconBg
                          )}
                        >
                          <Icon size={16} className={item.iconColor} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-[11.5px] sm:text-xs truncate max-w-[130px] sm:max-w-none">
                            {item.receiver}
                          </div>
                          <div className="font-mono text-[10px] sm:text-[10.5px] text-slate-500 font-medium truncate">
                            {item.sub}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span>{item.type}</span>
                        {item.severity === "CRITICAL" && (
                          <span className="size-1.5 rounded-full bg-rose-600 animate-ping" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 sm:px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 pl-2 sm:pl-3 text-right">
                      <div className="inline-flex items-center gap-1 font-mono text-xs font-bold text-slate-800">
                        <span
                          className={cn(
                            item.score >= 85
                              ? "text-rose-600"
                              : item.score >= 70
                              ? "text-amber-600"
                              : "text-emerald-600"
                          )}
                        >
                          {item.score}
                        </span>
                        <span className="text-slate-400">/100</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center">
            <p className="text-xs font-medium text-slate-500">
              No critical incidents active — queue contains low and medium telemetry only.
            </p>
          </div>
        )}
      </div>

      {/* Footer link to view full queue */}
      <div className="pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          {tab === "critical"
            ? `${displayedRows.length} critical incidents`
            : `Showing recent 5 of ${alerts.length} events`}
        </span>
        <Link
          to="/alerts"
          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors group cursor-pointer"
        >
          <span>View all in Alerts queue</span>
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}
