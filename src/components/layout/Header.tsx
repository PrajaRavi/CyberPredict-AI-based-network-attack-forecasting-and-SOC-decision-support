import {
  Bell,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MODULES } from "../../data/modules";
import { useAlerts } from "../../context/AlertContext";

interface HeaderProps {
  onMenu: () => void;
}

export function Header({ onMenu }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const { hasCriticalOrHigh, criticalCount, totalCount } = useAlerts();

  // Match current active module meta
  const currentPath = location.pathname;
  const isInvestigation = currentPath === "/investigation";
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
        {/* Search Input — Pill container (hidden on /investigation per user request) */}
        {!isInvestigation && (
          <div className="relative">
            
            {/* Mobile search toggle button */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Toggle search"
              className="sm:hidden grid size-9 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-xs active:scale-95 cursor-pointer"
            >
              {mobileSearchOpen ? <X size={15} /> : <Search size={15} />}
            </button>

            
          </div>
        )}

        {/* Notification Bell with Badge */}
        <Link
          to="/alerts"
          aria-label={`${criticalCount > 0 ? criticalCount : totalCount} notifications`}
          className={`relative grid size-9 place-items-center rounded-full border bg-white transition-all cursor-pointer active:scale-95 ${
            hasCriticalOrHigh
              ? "border-rose-300 text-rose-600 ring-2 ring-rose-200 animate-pulse"
              : "border-slate-200/70 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Bell size={16} />
          <span
            className={`absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full font-mono text-[9px] font-bold text-white shadow-xs ${
              hasCriticalOrHigh ? "bg-rose-600 animate-bounce" : "bg-purple-600"
            }`}
          >
            {hasCriticalOrHigh ? criticalCount : 3}
          </span>
        </Link>

       
        {/* User Avatar with Profile Popup Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAvatarMenuOpen((v) => !v)}
            aria-label="User profile menu"
            aria-expanded={avatarMenuOpen}
            className="relative size-8 sm:size-9 rounded-full overflow-hidden ring-2 ring-purple-100 hover:ring-purple-300 transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7030A0] flex items-center justify-center active:scale-95"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
              alt="Harsh Purohit"
              className="size-full object-cover"
            />
          </button>

          {avatarMenuOpen && (
            <>
              {/* Backdrop for outside click */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAvatarMenuOpen(false)}
              />

              {/* Popup Menu */}
              <div className="absolute right-0 top-11 z-50 w-64 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                {/* User Info */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="relative size-10 rounded-full overflow-hidden ring-2 ring-purple-100 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
                      alt="Harsh Purohit"
                      className="size-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">John Doe</h4>
                    <p className="text-[11px] text-slate-500 truncate">johndoe@cyberpredict.io</p>
                    <span className="inline-block mt-1 text-[9.5px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md">
                      Lead SOC Analyst
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarMenuOpen(false);
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer group"
                  >
                    <LogOut size={14} className="text-rose-500 group-hover:text-rose-600 transition-colors" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
