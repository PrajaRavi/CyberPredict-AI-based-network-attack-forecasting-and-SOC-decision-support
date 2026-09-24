import {
  Bell,
  ChevronDown,
  KeyRound,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoUrl from "../../assets/logo.svg";
import { MODULE_LIST } from "../../data/modules";
import { cn } from "../../utils/cn";

interface HeaderProps {
  onMenu: () => void;
}

const PROFILE_ITEMS = [
  { icon: UserRound, label: "Analyst profile" },
  { icon: SlidersHorizontal, label: "Preferences" },
  { icon: KeyRound, label: "API tokens" },
];

function relativeTime(then: Date, now: Date) {
  const s = Math.max(0, Math.floor((now.getTime() - then.getTime()) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export function Header({ onMenu }: HeaderProps) {
  const { pathname } = useLocation();
  const current = MODULE_LIST.find((m) => m.path === pathname);

  /* 1s tick — drives the clock and the relative "updated … ago" label. */
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* Simulated telemetry sync cadence — backend-driven once Phase 2 lands. */
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setLastUpdated(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 800);
  };

  /* Profile dropdown with outside-click + Escape dismissal. */
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

  const utcStamp = lastUpdated.toISOString().slice(11, 19);

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-ink-900/95 px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open navigation"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-ink-850 text-mist-400 transition-colors hover:border-line-bright hover:text-mist-100 lg:hidden"
      >
        <Menu size={16} />
      </button>

      {/* Brand — on desktop the sidebar rail carries the lockup */}
      <Link to="/dashboard" className="flex shrink-0 items-center gap-2.5 lg:hidden">
        <img src={logoUrl} alt="CyberPredict" className="size-7" />
        <span className="font-display text-[15px] font-bold leading-none tracking-tight text-mist-50">
          Cyber<span className="text-pulse-400">Predict</span>
        </span>
      </Link>

      {/* Current module context (desktop) */}
      <div className="hidden min-w-0 lg:block">
        <div className="truncate font-mono text-[9.5px] uppercase leading-tight tracking-[0.18em] text-mist-600">
          {current ? `Module ${current.code} · ${current.tagline}` : "Error surface"}
        </div>
        <div className="truncate font-display text-sm font-semibold leading-tight text-mist-50">
          {current?.title ?? "Signal lost"}
        </div>
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-2.5">
        {/* Global search (wired in Phase 2) */}
        <label className="hidden h-9 w-60 items-center gap-2 rounded-md border border-line bg-ink-850 px-3 transition-colors focus-within:border-pulse-500/50 xl:flex">
          <Search size={14} className="shrink-0 text-mist-500" />
          <input
            type="text"
            placeholder="Search telemetry, alerts, models…"
            className="w-full bg-transparent text-[12.5px] text-mist-100 placeholder:text-mist-600 focus:outline-none"
          />
          <kbd className="shrink-0 rounded border border-line-bright bg-ink-800 px-1.5 py-0.5 font-mono text-[9px] text-mist-500">
            ⌘K
          </kbd>
        </label>

        {/* System status */}
        <div
          className="hidden h-9 shrink-0 items-center gap-2.5 rounded-md border border-safe-500/25 bg-safe-500/8 px-3 md:flex"
          title="All platform subsystems reporting healthy"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe-400 opacity-40 [animation-duration:2.4s]" />
            <span className="relative inline-flex size-1.5 rounded-full bg-safe-400" />
          </span>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em]">
            <span className="text-mist-500">System status</span>
            <span className="text-safe-400"> · Operational</span>
          </span>
        </div>

        {/* Last updated + manual refresh */}
        <div className="hidden h-9 shrink-0 items-center gap-2.5 rounded-md border border-line bg-ink-850 px-3 md:flex">
          <button
            type="button"
            onClick={refresh}
            aria-label="Refresh telemetry now"
            title="Refresh telemetry now"
            className="grid size-5 place-items-center rounded text-mist-500 transition-colors hover:text-pulse-400"
          >
            <RefreshCw size={13} className={cn(refreshing && "animate-spin text-pulse-400")} />
          </button>
          <div className="leading-tight">
            <div className="font-mono text-[10.5px] tabular-nums text-mist-300">
              {utcStamp} UTC
            </div>
            <div className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-mist-600">
              Updated {relativeTime(lastUpdated, now)}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <Link
          to="/alerts"
          aria-label="Notifications — 12 active alerts"
          title="12 active alerts — open queue"
          className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-ink-850 text-mist-400 transition-colors hover:border-line-bright hover:text-mist-100"
        >
          <Bell size={15} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-crit-500" />
        </Link>

        <div className="hidden h-6 w-px shrink-0 bg-line md:block" />

        {/* Profile */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2.5 rounded-md border border-line bg-ink-850 py-1 pl-1.5 pr-2 transition-colors hover:border-line-bright"
          >
            <span className="grid size-7 place-items-center rounded-[5px] border border-signal-500/30 bg-signal-500/15 font-mono text-[10px] font-medium text-signal-400">
              AR
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[12px] font-medium text-mist-100">A. Raghavan</span>
              <span className="block font-mono text-[8.5px] uppercase tracking-[0.16em] text-mist-600">
                SOC analyst · Tier 2
              </span>
            </span>
            <ChevronDown
              size={13}
              className={cn("text-mist-500 transition-transform duration-200", profileOpen && "rotate-180")}
            />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right animate-enter rounded-md border border-line bg-ink-800 p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.75)]"
            >
              <div className="border-b border-line px-2.5 pb-2.5 pt-1.5">
                <div className="text-[12.5px] font-medium text-mist-100">Aarav Raghavan</div>
                <div className="mt-0.5 font-mono text-[9.5px] text-mist-600">
                  a.raghavan@cyberpredict.in
                </div>
              </div>
              <div className="pt-1.5">
                {PROFILE_ITEMS.map(({ icon: ItemIcon, label }) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    title={`${label} — wired in a later phase`}
                    className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-[12.5px] text-mist-300 transition-colors hover:bg-white/4 hover:text-mist-50"
                  >
                    <ItemIcon size={14} className="shrink-0 text-mist-500" />
                    {label}
                  </button>
                ))}
              </div>
              <div className="my-1.5 h-px bg-line" />
              <button
                type="button"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                title="Sign out — auth lands with the backend"
                className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-[12.5px] text-crit-400 transition-colors hover:bg-crit-500/10"
              >
                <LogOut size={14} className="shrink-0" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
