import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  icon: LucideIcon;
  /** Mono eyebrow line, e.g. "Module SOC-01 · Command overview". */
  eyebrow: string;
  title: string;
  description: string;
  /** Right-aligned meta (status badges, phase chips). */
  aside?: ReactNode;
}

export function PageHeader({ icon: Icon, eyebrow, title, description, aside }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-md border border-line-bright bg-ink-800 text-pulse-400 shadow-[0_0_28px_-8px_rgba(28,197,234,0.45)]">
          <Icon size={20} strokeWidth={1.75} aria-hidden />
        </div>
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-pulse-500/90">
            {eyebrow}
          </p>
          <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight tracking-tight text-mist-50">
            {title}
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-mist-400">{description}</p>
        </div>
      </div>
      {aside && <div className="shrink-0 md:pt-1.5">{aside}</div>}
    </header>
  );
}
