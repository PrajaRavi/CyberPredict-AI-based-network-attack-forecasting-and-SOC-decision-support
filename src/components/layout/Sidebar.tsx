import {
  Database,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../data/navigation";
import { cn } from "../../lib/utils";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

const SYSTEM_ROWS = [
  { icon: Settings, label: "Settings" },
  { icon: Database, label: "Data sources" },
  { icon: HelpCircle, label: "Documentation" },
];

export function Sidebar({ className, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-[270px] shrink-0 flex-col bg-white border-r border-slate-200/70 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-20 shrink-0 items-center gap-3.5 px-6 border-b border-slate-100">
        <div className="relative grid size-10 place-items-center rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20">
          <div className="grid size-full place-items-center rounded-[14px] bg-white">
            <div className="size-5 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center">
              <div className="size-2 rounded-full bg-white" />
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <div className="font-display text-[17px] font-extrabold tracking-tight text-slate-900 leading-none">
            CYBER<span className="text-blue-600">PREDICT</span>
          </div>
          <div className="mt-1 font-sans text-[11px] font-medium tracking-wide text-slate-600">
            Attack forecasting
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div>
          <p className="px-3 pb-2.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
            Operations
          </p>
          <ul className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[13.5px] font-semibold transition-all duration-200",
                        isActive
                          ? "bg-blue-50/80 text-blue-600 shadow-xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          aria-hidden
                          className={cn(
                            "absolute left-0 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-r-full bg-blue-600 transition-opacity",
                            isActive ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-xl transition-all duration-200",
                            isActive
                              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                              : "bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-700"
                          )}
                        >
                          <Icon size={17} strokeWidth={2.2} />
                        </div>
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold leading-tight text-white shadow-xs shadow-rose-500/30">
                            {item.badge.label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="px-3 pb-2.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
            System & Tools
          </p>
          <ul className="space-y-1.5">
            {SYSTEM_ROWS.map((row) => {
              const Icon = row.icon;
              return (
                <li key={row.label}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[13px] font-medium text-slate-500 transition-all duration-150 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                  >
                    <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-slate-100/60 text-slate-400">
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <span className="truncate">{row.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* AI Model Badge Card */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-white p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-600">
            <Sparkles size={16} className="shrink-0" />
            <span className="font-display text-[12px] font-bold uppercase tracking-wider">
              Ensemble AI v2.4
            </span>
          </div>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-500">
            Active multi-horizon neural forecasting running in real-time.
          </p>
          <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-slate-400 border-t border-blue-100/60 pt-2.5">
            <span>SOC Telemetry</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
          </div>
        </div>
      </nav>

      {/* Footer User & Status */}
      <div className="shrink-0 border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-slate-50">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-xs text-white shadow-xs">
            AR
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-bold text-slate-800 leading-tight">
              Aarav Raghavan
            </div>
            <div className="truncate text-[11px] text-slate-600 font-medium">
              SOC Lead Analyst
            </div>
          </div>
          <button
            type="button"
            title="Sign out"
            className="grid size-8 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
