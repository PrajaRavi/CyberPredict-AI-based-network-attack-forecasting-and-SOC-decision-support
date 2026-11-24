import {
  Bell,
  Info,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MODULES } from "../../data/modules";

interface HeaderProps {
  onMenu: () => void;
}

export function Header({ onMenu }: HeaderProps) {
  const location = useLocation();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Match current active module meta
  const currentPath = location.pathname;
  const currentModule =
    Object.values(MODULES).find(
      (m) =>
        m.path === currentPath ||
        (currentPath === "/traffic" && m.id === "monitoring") ||
        (currentPath === "/risk-analysis" && m.id === "behaviour") ||
        (currentPath === "/model-performance" && m.id === "research")
    ) || MODULES.dashboard;

  return (
    <header className="relative z-30 flex h-20 shrink-0 items-center justify-between gap-3 bg-white/95 px-4 sm:px-6 lg:px-8 border-b border-slate-100 shadow-[0_1px_4px_rgba(100,50,150,0.02)] backdrop-blur-md">
      {/* Left: Mobile hamburger + Page Title & Tagline */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer lg:hidden active:scale-95"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <h1 className="font-sans text-[20px] sm:text-[22px] font-bold tracking-tight text-slate-900 leading-tight truncate">
            {currentModule.title}
          </h1>
          <p className="font-sans text-[11.5px] sm:text-[12px] text-slate-500 font-normal leading-tight mt-0.5 truncate">
            {currentModule.tagline}
          </p>
        </div>
      </div>

      {/* Right: Search, Notification Bell, DEMO MODE chip, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 ml-auto">
        {/* Search Input — Pill container */}
        <div className="relative">
          <div className="hidden sm:block relative w-44 md:w-56 lg:w-64">
            <Search
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={currentModule.searchPlaceholder || "Search across network..."}
              className="h-9 w-full rounded-full border border-slate-200/80 bg-slate-50/70 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 focus:outline-none"
            />
          </div>

          {/* Mobile search toggle button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Toggle search"
            className="sm:hidden grid size-9 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-xs active:scale-95 cursor-pointer"
          >
            {mobileSearchOpen ? <X size={15} /> : <Search size={15} />}
          </button>

          {mobileSearchOpen && (
            <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:hidden">
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  autoFocus
                  placeholder={currentModule.searchPlaceholder}
                  className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell with Badge */}
        <Link
          to="/alerts"
          aria-label="3 notifications"
          className="relative grid size-9 place-items-center rounded-full border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
        >
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 font-mono text-[9px] font-bold text-white shadow-xs">
            3
          </span>
        </Link>

        {/* DEMO MODE ⓘ Pill Button */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EDE9FE] px-3 py-1.5 text-[11px] font-semibold text-[#7030A0] border border-purple-200/60 transition-colors">
          <span>DEMO MODE</span>
          <Info size={13} className="shrink-0" />
        </div>

        {/* User Avatar */}
        <div className="relative size-8 sm:size-9 rounded-full overflow-hidden ring-2 ring-purple-100 shadow-xs cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
            alt="SOC Analyst"
            className="size-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
