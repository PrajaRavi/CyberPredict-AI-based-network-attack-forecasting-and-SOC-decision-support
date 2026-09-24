import { cn } from "../../utils/cn";
import { Skeleton } from "./Skeleton";

interface LoadingStateProps {
  label?: string;
  hint?: string;
  className?: string;
}

const CHART_BARS = [42, 66, 52, 78, 60, 88, 70, 96, 82, 58];

/**
 * Reusable loading surface — shimmer skeleton shaped like a real module
 * (KPI row + chart + queue rows) with an accessible live-region label.
 */
export function LoadingState({
  label = "Loading telemetry",
  hint = "Service layer · mock latency",
  className,
}: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className={cn("rounded-lg border border-line bg-ink-800/60 p-4", className)}>
      <div className="flex items-center gap-2.5 border-b border-line pb-3">
        <span className="relative flex size-1.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse-400 opacity-40 [animation-duration:2.2s]" />
          <span className="relative inline-flex size-1.5 rounded-full bg-pulse-400" />
        </span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-pulse-400">
          {label}…
        </span>
        <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-[0.14em] text-mist-600 sm:inline">
          {hint}
        </span>
      </div>

      {/* KPI skeleton row */}
      <div className="grid gap-4 pt-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2.5">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-2 w-24" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="mt-4 flex h-40 items-end gap-1.5 rounded-md border border-line bg-ink-850/60 p-4">
        {CHART_BARS.map((h, i) => (
          <div key={i} className="flex-1" style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}>
            <Skeleton className="h-full w-full rounded-t-[2px]" />
          </div>
        ))}
      </div>

      {/* Queue row skeletons */}
      <div className="mt-4 space-y-2.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-2 rounded-full" />
            <Skeleton className="h-2.5 flex-1" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        ))}
      </div>

      <span className="sr-only">{label}</span>
    </div>
  );
}
