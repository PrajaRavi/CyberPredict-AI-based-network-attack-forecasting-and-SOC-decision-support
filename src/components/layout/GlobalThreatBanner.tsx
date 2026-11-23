import { AlertTriangle, ArrowRight, ShieldAlert, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAlerts } from "../../context/AlertContext";
import { cn } from "../../lib/utils";

export function GlobalThreatBanner() {
  const { hasCriticalOrHigh, criticalCount, highCount, isBannerDismissed, dismissBanner } =
    useAlerts();
  const location = useLocation();

  if (!hasCriticalOrHigh || isBannerDismissed) {
    return null;
  }

  const isAlertsPage = location.pathname === "/alerts";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="relative z-40 w-full overflow-hidden border-b border-rose-500/40 bg-linear-to-r from-rose-950 via-rose-900 to-red-950 px-3.5 py-2.5 sm:px-6 sm:py-3 text-white shadow-lg shadow-rose-950/30"
    >
      {/* Background ambient pulse glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 top-0 h-full bg-linear-to-r from-transparent via-rose-500/20 to-transparent animate-pulse"
      />

      <div className="relative mx-auto flex max-w-[1520px] flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Left: Icon + Message */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <div className="relative grid size-8 sm:size-9 shrink-0 place-items-center rounded-xl bg-rose-600/90 text-white shadow-md shadow-rose-600/40 border border-rose-400/40">
            <ShieldAlert size={18} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-rose-500" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-rose-500/30 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-rose-200 border border-rose-400/30">
                CRITICAL THREAT ALERT
              </span>
              <span className="font-display text-xs sm:text-sm font-bold tracking-tight text-white">
                Active High-Severity Security Incident Detected
              </span>
            </div>
            <p className="mt-0.5 text-[11px] sm:text-xs text-rose-200/90 truncate">
              {criticalCount > 0 && `${criticalCount} Critical `}
              {criticalCount > 0 && highCount > 0 && "& "}
              {highCount > 0 && `${highCount} High `}
              priority incident{criticalCount + highCount > 1 ? "s" : ""} requiring immediate SOC analyst review.
            </p>
          </div>
        </div>

        {/* Right: Action button & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          {!isAlertsPage && (
            <Link
              to="/alerts"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 sm:px-3.5 py-1.5 font-sans text-xs font-bold text-rose-900 shadow-xs hover:bg-rose-50 transition-colors cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>View Alert Queue</span>
              <ArrowRight size={13} />
            </Link>
          )}

          <button
            type="button"
            onClick={dismissBanner}
            aria-label="Dismiss warning banner"
            className="grid size-7 sm:size-8 place-items-center rounded-lg text-rose-300 hover:bg-rose-800/60 hover:text-white transition-colors cursor-pointer"
            title="Dismiss banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
