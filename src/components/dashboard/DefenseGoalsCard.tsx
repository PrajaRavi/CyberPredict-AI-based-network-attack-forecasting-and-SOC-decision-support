import { Plus, Shield, Sliders, Waves } from "lucide-react";

interface DefenseGoal {
  id: string;
  title: string;
  current: string;
  target: string;
  percentage: number;
  icon: typeof Shield;
  color: string;
}

const GOALS: DefenseGoal[] = [
  {
    id: "g1",
    title: "Edge Rate Limiting",
    current: "3,850 pps",
    target: "5,000 pps",
    percentage: 77,
    icon: Shield,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "g2",
    title: "Upstream Scrubbing",
    current: "850 MB/s",
    target: "1,000 MB/s",
    percentage: 85,
    icon: Waves,
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "g3",
    title: "Bastion Step-up MFA",
    current: "12 hosts",
    target: "12 secured",
    percentage: 100,
    icon: Sliders,
    color: "from-emerald-400 to-teal-500",
  },
];

export function DefenseGoalsCard() {
  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-6 shadow-[0_4px_24px_-4px_rgba(20,30,55,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(20,30,55,0.09)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h2 className="font-display text-[15px] sm:text-[17px] font-bold text-slate-900">
          My Goals
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-white shadow-xs shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={13} strokeWidth={2.5} />
          <span>Add Goals</span>
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-3.5 py-2">
        {GOALS.map((goal) => {
          const Icon = goal.icon;
          const totalSegments = 8;
          const activeSegments = Math.round((goal.percentage / 100) * totalSegments);

          return (
            <div
              key={goal.id}
              className="group flex flex-col gap-2 rounded-2xl p-2 sm:p-2.5 transition-colors hover:bg-slate-50/80"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl sm:rounded-2xl bg-slate-100 text-slate-600 shadow-2xs group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Icon size={16} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 text-[11.5px] sm:text-xs truncate">
                      {goal.title}
                    </div>
                    <div className="font-mono text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                      {goal.current} / {goal.target}
                    </div>
                  </div>
                </div>

                <div className="font-mono font-bold text-[11px] sm:text-xs text-slate-800 shrink-0">
                  {goal.percentage}%
                </div>
              </div>

              {/* Segmented bar indicator */}
              <div className="grid grid-cols-8 gap-1 pt-0.5">
                {Array.from({ length: totalSegments }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-colors duration-300 ${
                      idx < activeSegments
                        ? "bg-blue-600 shadow-2xs"
                        : "bg-slate-200/80"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-100 pt-3 text-[11px] sm:text-xs text-slate-500 font-medium flex items-center justify-between">
        <span>3 mitigations active</span>
        <span className="font-semibold text-emerald-600">100% Coverage</span>
      </div>
    </section>
  );
}
