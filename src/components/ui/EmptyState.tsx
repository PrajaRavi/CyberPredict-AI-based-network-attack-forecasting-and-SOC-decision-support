import { Radar, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Reusable empty surface for queues, tables and filtered views. */
export function EmptyState({ icon: Icon = Radar, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-line bg-ink-800/60 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="grid size-11 place-items-center rounded-md border border-line-bright bg-ink-850 text-mist-500">
        <Icon size={20} strokeWidth={1.75} aria-hidden />
      </div>
      <div className="font-display text-[15px] font-semibold text-mist-100">{title}</div>
      {description && (
        <p className="max-w-sm text-[12.5px] leading-relaxed text-mist-500">{description}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
