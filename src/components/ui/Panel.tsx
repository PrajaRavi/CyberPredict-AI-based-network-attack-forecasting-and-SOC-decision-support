import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface PanelProps {
  /** Mono uppercase header label. */
  title: string;
  /** Optional secondary marker rendered as `// code`. */
  code?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Standard bordered surface used across every module. */
export function Panel({ title, code, actions, children, className, bodyClassName }: PanelProps) {
  return (
    <section className={cn("rounded-lg border border-line bg-ink-800/60", className)}>
      <header className="flex min-h-11 items-center gap-2.5 border-b border-line px-4 py-2">
        <span aria-hidden className="size-1.5 shrink-0 rounded-xs bg-pulse-500/80" />
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-mist-400">
          {title}
        </h2>
        {code && (
          <span className="hidden font-mono text-[10px] tracking-wider text-mist-600 sm:inline">
            {"//"} {code}
          </span>
        )}
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </header>
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}
