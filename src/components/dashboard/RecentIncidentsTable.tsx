import { ArrowUpRight, Globe, KeyRound, Server, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

interface IncidentRow {
  id: string;
  receiver: string;
  sub: string;
  type: string;
  date: string;
  score: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  icon: typeof ShieldAlert;
  iconBg: string;
  iconColor: string;
}

const INCIDENTS: IncidentRow[] = [
  {
    id: "ALR-7041",
    receiver: "Edge Gateway 01",
    sub: "10.0.4.12:443",
    type: "DDoS SYN Flood",
    date: "14:02 UTC",
    score: 96,
    severity: "CRITICAL",
    icon: ShieldAlert,
    iconBg: "bg-rose-50 border border-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: "ALR-7040",
    receiver: "Auth Bastion Host",
    sub: "10.0.1.9:22",
    type: "SSH Brute Force",
    date: "14:01 UTC",
    score: 88,
    severity: "HIGH",
    icon: KeyRound,
    iconBg: "bg-amber-50 border border-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: "ALR-7038",
    receiver: "Core API Cluster",
    sub: "10.0.4.8:8080",
    type: "HTTP Flood Burst",
    date: "13:58 UTC",
    score: 82,
    severity: "HIGH",
    icon: Server,
    iconBg: "bg-blue-50 border border-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "ALR-7034",
    receiver: "Internal DNS Resolver",
    sub: "10.0.2.53:53",
    type: "DNS Tunnel Probe",
    date: "13:38 UTC",
    score: 64,
    severity: "MEDIUM",
    icon: Globe,
    iconBg: "bg-purple-50 border border-purple-100",
    iconColor: "text-purple-600",
  },
];

export function RecentIncidentsTable() {
  const [tab, setTab] = useState<"recently" | "critical">("recently");

  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-6 shadow-[0_4px_24px_-4px_rgba(20,30,55,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(20,30,55,0.09)]">
      {/* Header with tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-100">
        <h2 className="font-display text-[15px] sm:text-[17px] font-bold text-slate-900">
          Transaction history
        </h2>

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
            {INCIDENTS.map((item) => {
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

                  <td className="py-3 pr-2 sm:pr-3 font-medium text-slate-600">
                    <span className="rounded-md sm:rounded-lg bg-slate-100/80 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10.5px] sm:text-[11px] font-medium text-slate-700 whitespace-nowrap">
                      {item.type}
                    </span>
                  </td>

                  <td className="py-3 pr-2 sm:pr-3 font-medium text-slate-500 whitespace-nowrap text-[11px] sm:text-xs">
                    {item.date}
                  </td>

                  <td className="py-3 text-right font-display text-xs sm:text-[13px] font-bold text-slate-900 whitespace-nowrap">
                    <span
                      className={
                        item.severity === "CRITICAL"
                          ? "text-rose-600 font-extrabold"
                          : "text-amber-600 font-extrabold"
                      }
                    >
                      {item.score}% Risk
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] sm:text-xs text-slate-600">
        <span className="truncate">Latest 4 telemetry events</span>
        <Link
          to="/alerts"
          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 shrink-0"
        >
          View 12 alerts <ArrowUpRight size={13} />
        </Link>
      </div>
    </section>
  );
}
