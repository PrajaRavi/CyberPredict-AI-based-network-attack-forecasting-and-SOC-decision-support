import {
  Bell,
  Calendar,
  ChevronDown,
  KeyRound,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

interface HeaderProps {
  onMenu: () => void;
}

const PROFILE_ITEMS = [
  { icon: UserRound, label: "Analyst profile" },
  { icon: SlidersHorizontal, label: "Preferences" },
  { icon: KeyRound, label: "API tokens" },
];

export function Header({ onMenu }: HeaderProps) {
  /* 1s clock tick */
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* Telemetry refresh */
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 800);
  };

  /* Mobile search expanded state */
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  /* Profile dropdown */
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e: PointerEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="relative z-30 flex h-16 sm:h-20 shrink-0 items-center justify-between gap-2 sm:gap-4 bg-white/90 px-3.5 sm:px-6 lg:px-8 backdrop-blur-md border-b border-slate-200/70">
      {/* Left: Mobile Menu Trigger + Welcoming Greeting (Always Visible & Responsive) */}
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5 flex-1 max-w-[55%] sm:max-w-none">
        {/* Mobile Hamburger Drawer Toggle */}
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="inline-flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer lg:hidden active:scale-95"
        >
          <Menu size={18} />
        </button>

        {/* Welcome message with fluid responsive typography and truncation protection */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-sans text-[11px] sm:text-[13px] text-slate-500 font-medium truncate">
              Hi Aarav Raghavan,
            </span>
          </div>
          <p className="font-display text-[15px] sm:text-[18px] lg:text-[20px] font-bold tracking-tight text-slate-900 leading-tight truncate">
            Welcome back!
          </p>
        </div>
      </div>

      {/* Right: Actions (Date Badge, Search Pill, Bell, Profile) */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
        {/* Date pill badge (hidden on mobile, shown on md+) */}
        <div className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 shadow-2xs text-xs font-semibold text-slate-700">
          <Calendar size={13} className="text-slate-400" />
          <span className="whitespace-nowrap">{formattedDate}</span>
        </div>

        {/* Search Input — Responsive pill container */}
        <div className="relative">
          {/* Desktop / Tablet Search Box */}
          <div className="hidden sm:block relative w-36 md:w-52 lg:w-64">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Type to search..."
              className="h-9 sm:h-10 w-full rounded-full border border-slate-200/80 bg-slate-50/80 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Mobile search toggle button (visible on xs only) */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Toggle search"
            className="sm:hidden grid size-9 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-2xs active:scale-95 cursor-pointer"
          >
            {mobileSearchOpen ? <X size={15} /> : <Search size={15} />}
          </button>

          {/* Mobile search dropdown bar */}
          {mobileSearchOpen && (
            <div className="absolute right-0 top-11 z-50 w-72 animate-enter rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 sm:hidden">
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search telemetry, alerts..."
                  className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sync / Refresh Button (Tablet / Desktop) */}
        <button
          type="button"
          onClick={refresh}
          title="Refresh telemetry"
          className="hidden md:grid size-9 sm:size-10 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-blue-600 transition-all cursor-pointer active:scale-95"
        >
          <RefreshCw
            size={15}
            className={cn("transition-transform duration-500", refreshing && "animate-spin text-blue-600")}
          />
        </button>

        {/* Notification Bell (Matches reference image) */}
        <Link
          to="/alerts"
          aria-label="12 active alerts"
          className="relative grid size-9 sm:size-10 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer active:scale-95"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </Link>

        {/* Profile Pill Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="flex items-center gap-1.5 sm:gap-2.5 rounded-full border border-slate-200/80 bg-white p-1 sm:pl-1 sm:pr-3 shadow-2xs hover:bg-slate-50/80 transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="grid size-7 sm:size-8 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-[11px] sm:text-xs text-white shadow-2xs">
              AR
            </div>
            <span className="hidden sm:inline-block font-display text-xs sm:text-[13px] font-bold text-slate-800 whitespace-nowrap">
              Aarav Raghavan
            </span>
            <ChevronDown
              size={13}
              className={cn(
                "hidden sm:inline-block text-slate-400 transition-transform duration-200",
                profileOpen && "rotate-180"
              )}
            />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-56 sm:w-60 origin-top-right animate-enter rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-900/10"
            >
              <div className="border-b border-slate-100 px-3 pb-2.5 pt-1.5">
                <div className="font-bold text-xs sm:text-sm text-slate-900">Aarav Raghavan</div>
                <div className="text-[10.5px] sm:text-[11px] text-slate-500 truncate">a.raghavan@cyberpredict.in</div>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9.5px] font-semibold text-blue-700">
                  SOC Tier-2 Lead
                </span>
              </div>
              <div className="pt-1.5">
                {PROFILE_ITEMS.map(({ icon: ItemIcon, label }) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                  >
                    <ItemIcon size={14} className="text-slate-400" />
                    {label}
                  </button>
                ))}
              </div>
              <div className="my-1.5 h-px bg-slate-100" />
              <button
                type="button"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
