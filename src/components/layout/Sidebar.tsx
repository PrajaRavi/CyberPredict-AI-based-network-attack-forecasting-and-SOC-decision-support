import { Database, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import logoUrl from "../../assets/logo.svg";
import { NAV_ITEMS } from "../../data/navigation";
import { cn } from "../../utils/cn";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

const SYSTEM_ROWS = [
  { icon: Database, label: "Data sources" },
  { icon: Settings, label: "Configuration" },
];

export function Sidebar({ className, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-[268px] shrink-0 flex-col border-r border-line bg-ink-900",
        className,
      )}
    >
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-4">
        <img src={logoUrl} alt="CyberPredict" className="size-8" />
        <div className="min-w-0">
          <div className="font-display text-[15px] font-bold leading-tight tracking-tight text-mist-50">
            Cyber<span className="text-pulse-400">Predict</span>
          </div>
          <div className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-mist-600">
           Attack forecasting
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-2.5 pb-2 font-mono text-[9.5px] font-medium uppercase tracking-[0.2em] text-mist-600">
          Operations
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-2.5 rounded-md border px-2.5 py-2 text-[13px] font-medium transition-colors duration-150",
                      isActive
                        ? "border-pulse-500/20 bg-pulse-500/8 text-pulse-300"
                        : "border-transparent text-mist-400 hover:bg-white/3 hover:text-mist-100",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-0 top-1/2 h-5 w-2 -translate-y-1/2 rounded-full bg-pulse-400 transition-opacity",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <Icon
                        size={16}
                        strokeWidth={1.9}
                        className={cn(
                          "shrink-0 transition-colors",
                          isActive ? "text-pulse-400" : "text-mist-500 group-hover:text-mist-300",
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto rounded border border-crit-500/25 bg-crit-500/15 px-1.5 py-0.5 font-mono text-[9.5px] font-medium leading-none text-crit-400">
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

        <p className="px-2.5 pb-2 pt-6 font-mono text-[9.5px] font-medium uppercase tracking-[0.2em] text-mist-600">
          System
        </p>
        <ul className="space-y-0.5">
          {SYSTEM_ROWS.map((row) => {
            const Icon = row.icon;
            return (
              <li key={row.label}>
                <button
                  type="button"
                  title="Planned for a later phase"
                  className="flex w-full cursor-default items-center gap-2.5 rounded-md border border-transparent px-2.5 py-2 text-[13px] font-medium text-mist-500 transition-colors duration-150 hover:bg-white/2 hover:text-mist-300"
                >
                  <Icon size={16} strokeWidth={1.9} className="shrink-0 text-mist-600" />
                  <span className="truncate">{row.label}</span>
                  <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.14em] text-mist-600">
                    Soon
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* System status footer */}
      <div className="shrink-0 space-y-2 border-t border-line px-4 py-3.5">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-safe-500" />
          <span className="text-mist-400">Model core v2.4.1</span>
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.14em] text-safe-500/90">
            Nominal
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-pulse-500 [animation-delay:0.6s]" />
          <span className="text-mist-400">Telemetry feed</span>
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.14em] text-pulse-500/90">
            Stubbed
          </span>
        </div>
        <div className="border-t border-line/70 pt-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-mist-600">
          CyberPredict v0.1.0 · foundation build
        </div>
      </div>
    </aside>
  );
}
