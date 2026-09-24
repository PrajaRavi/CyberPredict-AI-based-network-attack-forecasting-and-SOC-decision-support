import { ArrowRight, Radar } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
      <div className="grid size-12 place-items-center rounded-md border border-crit-500/30 bg-crit-500/10 text-crit-400">
        <Radar size={22} strokeWidth={1.75} aria-hidden />
      </div>
      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.24em] text-crit-400">
        Err_route_not_found · 404
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-mist-50">
        Signal lost
      </h1>
      <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-mist-400">
        The requested vector doesn't exist on this grid. Verify the route or fall back to the
        command overview.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-pulse-500/40 bg-pulse-500/10 px-4 py-2 text-[13px] font-medium text-pulse-300 transition-colors hover:border-pulse-500/60 hover:bg-pulse-500/15"
      >
        Return to Dashboard
        <ArrowRight size={14} aria-hidden />
      </Link>
    </div>
  );
}
