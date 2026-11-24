import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../data/navigation";
import { cn } from "../../lib/utils";
import { CyberPredictLogo } from "./CyberPredictLogo";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-[250px] shrink-0 flex flex-col bg-white border-r border-slate-100/90 shadow-[2px_0_12px_rgba(100,50,150,0.02)] z-40 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-20 shrink-0 items-center px-5 border-b border-slate-100/80">
        <CyberPredictLogo />
      </div>

      {/* Main Navigation — 9 Distinct Operational Modules */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-medium transition-all duration-150",
                      isActive
                        ? "bg-[#7030A0] text-white shadow-sm font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={17}
                        className={cn(
                          "shrink-0 transition-colors",
                          isActive ? "text-white" : "text-slate-500 group-hover:text-slate-800"
                        )}
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      
    </aside>
  );
}
