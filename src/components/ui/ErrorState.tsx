import { RefreshCw, TriangleAlert } from "lucide-react";
import { cn } from "../../utils/cn";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/** Reusable failure surface with an optional retry affordance. */
export function ErrorState({
  title = "Telemetry unavailable",
  message = "The service layer could not be reached. Check the connection and retry — no data was lost.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-crit-500/25 bg-crit-500/[0.04] px-6 py-14 text-center",
        className,
      )}
    >
      <div className="grid size-11 place-items-center rounded-md border border-crit-500/30 bg-crit-500/10 text-crit-400">
        <TriangleAlert size={20} strokeWidth={1.75} aria-hidden />
      </div>
      <div className="font-display text-[15px] font-semibold text-mist-50">{title}</div>
      <p className="max-w-sm text-[12.5px] leading-relaxed text-mist-500">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-2 rounded-md border border-pulse-500/40 bg-pulse-500/10 px-3.5 py-2 text-[12.5px] font-medium text-pulse-300 transition-colors duration-150 hover:bg-pulse-500/20"
        >
          <RefreshCw size={13} aria-hidden /> Retry request
        </button>
      )}
    </div>
  );
}
