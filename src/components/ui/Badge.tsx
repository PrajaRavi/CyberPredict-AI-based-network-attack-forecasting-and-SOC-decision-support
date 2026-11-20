import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600 text-white shadow-2xs hover:bg-blue-700",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
        destructive:
          "border-transparent bg-rose-500 text-white shadow-2xs hover:bg-rose-600",
        outline: "text-slate-700 border-slate-200",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        gradient:
          "border-transparent bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-2xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export type BadgeTone = "safe" | "warn" | "crit" | "pulse" | "neutral" | "brand" | "purple";

const TONES: Record<BadgeTone, string> = {
  safe: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warn: "border-amber-200 bg-amber-50 text-amber-700",
  crit: "border-rose-200 bg-rose-50 text-rose-700",
  pulse: "border-cyan-200 bg-cyan-50 text-cyan-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
  brand: "border-blue-200 bg-blue-50 text-blue-700",
  purple: "border-purple-200 bg-purple-50 text-purple-700",
};

export interface StatusBadgeProps {
  tone?: BadgeTone;
  pulse?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function StatusBadge({
  tone = "neutral",
  pulse = false,
  className,
  children,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.08em] shadow-2xs",
        TONES[tone],
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full bg-current",
          pulse && "animate-pulse"
        )}
      />
      {children}
    </span>
  );
}

export function ThreatChip() {
  return (
    <div
      className="hidden h-9 items-center gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 md:inline-flex shadow-2xs"
      title="Aggregate threat condition derived from alert volume and forecast probability"
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60 [animation-duration:2.4s]" />
        <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
      </span>
      <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-amber-700">
        Threatcon 3 · Elevated
      </span>
    </div>
  );
}

export { badgeVariants };
