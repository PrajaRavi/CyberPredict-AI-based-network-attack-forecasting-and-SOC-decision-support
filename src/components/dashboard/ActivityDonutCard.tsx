import { ChevronDown } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface VectorSegment {
  name: string;
  value: number;
  color: string;
  displayColor: string;
}

const VECTOR_DATA: VectorSegment[] = [
  { name: "DDoS Pattern", value: 32, color: "#10E5BE", displayColor: "bg-[#10E5BE]" },
  { name: "Brute Force", value: 25, color: "#FB7185", displayColor: "bg-[#FB7185]" },
  { name: "Port Scanning", value: 17, color: "#A855F7", displayColor: "bg-[#A855F7]" },
  { name: "Data Exfiltration", value: 16, color: "#38BDF8", displayColor: "bg-[#38BDF8]" },
  { name: "DNS Anomaly", value: 10, color: "#FBBF24", displayColor: "bg-[#FBBF24]" },
];

/**
 * ActivityDonutCard — responsive donut chart matching reference image:
 * Multi-color pastel arcs, center metric, and responsive legend list.
 */
export function ActivityDonutCard() {
  return (
    <section className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-6 shadow-[0_4px_24px_-4px_rgba(20,30,55,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(20,30,55,0.09)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 sm:pb-3">
        <h2 className="font-display text-[15px] sm:text-[17px] font-bold text-slate-900">
          Activity
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/80 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <span>Active watch</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>
      </div>

      {/* Donut Chart + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-1 py-2">
        {/* Donut with center text */}
        <div className="relative size-40 sm:size-48 shrink-0 flex items-center  justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0];
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 shadow-md text-xs font-bold text-slate-800">
                      {d.name}: {d.value}%
                    </div>
                  );
                }}
              />
              <Pie
                data={VECTOR_DATA}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {VECTOR_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered text in donut */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-lg sm:text-xl font-extrabold text-slate-900 leading-none">
              87 pts
            </span>
            <span className="mt-0.5 font-sans text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Peak Risk
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          {VECTOR_DATA.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-4 text-xs hover:text-slate-900"
            >
              <div className="flex items-center gap-2">
                <span className={`size-2 sm:size-2.5 rounded-full ${item.displayColor}`} />
                <span className="font-medium text-slate-600 text-[11.5px] sm:text-xs truncate max-w-[120px]">
                  {item.name}
                </span>
              </div>
              <span className="font-mono font-bold text-slate-800 tabular-nums text-[11px] sm:text-xs">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 text-[11px] sm:text-xs text-slate-500 font-medium flex items-center justify-between">
        <span className="truncate">Source Entropy: 3.42 bits</span>
        <span className="text-blue-700 font-semibold shrink-0">142 low-rep IPs</span>
      </div>
    </section>
  );
}
