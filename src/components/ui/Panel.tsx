import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PanelProps {
  /** Mono uppercase header label or title. */
  title: string;
  /** Optional secondary marker rendered as `// code`. */
  code?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  reactive?: boolean;
}

/** Standard premium bordered surface with subtle top highlight and reactive hover. */
export function Panel({
  title,
  code,
  actions,
  children,
  className,
  bodyClassName,
  reactive = true,
}: PanelProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white shadow-[0_4px_24px_-4px_rgba(20,30,55,0.05)] overflow-hidden",
        reactive && "transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(20,30,55,0.09)] hover:border-slate-300/80",
        className
      )}
    >
      <header className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-100 bg-linear-to-r from-slate-50/80 via-white to-slate-50/40 px-5 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          />
          <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-slate-800 truncate">
            {title}
          </h2>
          {code && (
            <span className="hidden font-mono text-[11px] text-slate-600 sm:inline truncate">
              {"//"} {code}
            </span>
          )}
        </div>
        {actions && <div className="ml-auto flex items-center gap-2 shrink-0">{actions}</div>}
      </header>
      <div className={cn("p-5 sm:p-6", bodyClassName)}>{children}</div>
    </section>
  );
}
