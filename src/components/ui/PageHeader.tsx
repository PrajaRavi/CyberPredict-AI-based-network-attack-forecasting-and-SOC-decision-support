import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  icon: LucideIcon;
  /** Eyebrow line, e.g. "Module SOC-01 · Command overview". */
  eyebrow: string;
  title: string;
  description: string;
  /** Right-aligned meta (status badges, phase chips). */
  aside?: ReactNode;
}

export function PageHeader({ icon: Icon, eyebrow, title, description, aside }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:gap-4 pb-1 sm:pb-2 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        <div className="grid size-10 sm:size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 hover:scale-105">
          <Icon size={20} className="sm:size-[22px]" strokeWidth={2.2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider text-blue-600 truncate">
              {eyebrow}
            </span>
          </div>
          <h1 className="font-display text-[22px] sm:text-[26px] lg:text-[28px] font-extrabold leading-tight tracking-tight text-slate-900 truncate">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-xs sm:text-[13.5px] leading-relaxed text-slate-500 font-normal">
            {description}
          </p>
        </div>
      </div>
      {aside && <div className="shrink-0 flex items-center gap-2 pt-1 md:pt-0">{aside}</div>}
    </header>
  );
}
