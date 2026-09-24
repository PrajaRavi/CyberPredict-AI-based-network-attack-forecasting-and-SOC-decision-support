import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
}

/** Subtle pulsing placeholder block for scaffold previews. */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden className={cn("animate-shimmer rounded-[3px] bg-ink-700", className)} />;
}
