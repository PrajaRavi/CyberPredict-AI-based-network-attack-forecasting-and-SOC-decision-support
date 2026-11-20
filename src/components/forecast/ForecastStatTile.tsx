import {
  Clock,
  Crosshair,
  Flame,
  Gauge,
  ShieldAlert,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface ForecastStat {
  id: string;
  label: string;
  value: string;
  sub: string;
  tone: "mist" | "crit" | "warn" | "pulse" | "safe";
}

const STAT_META: Record<string, { icon: LucideIcon; iconBg: string; iconColor: string; valueColor: string }> = {
  "risk-score": {
    icon: ShieldAlert,
    iconBg: "bg-rose-50 border-rose-100",
    iconColor: "text-rose-600",
    valueColor: "text-rose-600",
  },
  "attack-type": {
    icon: Crosshair,
    iconBg: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-600",
    valueColor: "text-slate-900",
  },
  confidence: {
    icon: Gauge,
    iconBg: "bg-indigo-50 border-indigo-100",
    iconColor: "text-indigo-600",
    valueColor: "text-blue-600",
  },
  status: {
    icon: Flame,
    iconBg: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-600",
    valueColor: "text-amber-600",
  },
  window: {
    icon: Clock,
    iconBg: "bg-purple-50 border-purple-100",
    iconColor: "text-purple-600",
    valueColor: "text-purple-600",
  },
  trend: {
    icon: TrendingUp,
    iconBg: "bg-rose-50 border-rose-100",
    iconColor: "text-rose-600",
    valueColor: "text-rose-600",
  },
  flows: {
    icon: Crosshair,
    iconBg: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-600",
    valueColor: "text-slate-900",
  },
  anomalous: {
    icon: ShieldAlert,
    iconBg: "bg-rose-50 border-rose-100",
    iconColor: "text-rose-600",
    valueColor: "text-rose-600",
  },
  "top-protocol": {
    icon: Gauge,
    iconBg: "bg-cyan-50 border-cyan-100",
    iconColor: "text-cyan-600",
    valueColor: "text-blue-600",
  },
  "peak-rate": {
    icon: TrendingUp,
    iconBg: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-600",
    valueColor: "text-amber-600",
  },
};

/** Compact KPI tile with meaningful icons, color background, and reactive hover. */
export function ForecastStatTile({ stat, index = 0 }: { stat: ForecastStat; index?: number }) {
  const meta = STAT_META[stat.id] ?? {
    icon: Gauge,
    iconBg: "bg-slate-100 border-slate-200",
    iconColor: "text-slate-600",
    valueColor: "text-slate-900",
  };
  const Icon = meta.icon;

  return (
    <article
      className="animate-enter group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_10px_rgba(20,30,55,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_-4px_rgba(20,30,55,0.08)] hover:border-slate-300 cursor-pointer overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {stat.label}
        </span>
        <div
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-xl border shadow-2xs transition-transform duration-200 group-hover:scale-105",
            meta.iconBg,
            meta.iconColor
          )}
        >
          <Icon size={15} strokeWidth={2.4} />
        </div>
      </div>

      <div className="mt-3">
        <div
          className={cn(
            "font-display text-[22px] font-extrabold leading-tight tracking-tight drop-shadow-2xs",
            meta.valueColor
          )}
          title={stat.value}
        >
          {stat.value}
        </div>
        <div className="mt-1 font-sans text-xs font-medium text-slate-400">
          {stat.sub}
        </div>
      </div>
    </article>
  );
}
