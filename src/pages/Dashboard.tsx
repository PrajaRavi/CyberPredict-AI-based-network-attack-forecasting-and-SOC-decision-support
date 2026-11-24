import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Lightbulb,
  Network,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../components/ui/card";
import { useAlerts } from "../context/AlertContext";

// 24-hour timeline data matching Image 5
const TIMELINE_DATA = [
  { time: "12:00", observed: 35, projected: null },
  { time: "13:00", observed: 37, projected: null },
  { time: "14:00", observed: 52, projected: null },
  { time: "15:00", observed: 48, projected: null },
  { time: "16:00", observed: 62, projected: null },
  { time: "17:00", observed: 58, projected: null },
  { time: "18:00", observed: 55, projected: 55 }, // Now transition
  { time: "19:00", observed: null, projected: 68 },
  { time: "20:00", observed: null, projected: 75 },
  { time: "21:00", observed: null, projected: 70 },
  { time: "22:00", observed: null, projected: 82 },
  { time: "23:00", observed: null, projected: 86 },
];

// Sparkline fixtures
const SPARK_TRAFFIC = [{ v: 40 }, { v: 45 }, { v: 38 }, { v: 52 }, { v: 48 }, { v: 42 }];
const SPARK_CONNECTIONS = [{ v: 50 }, { v: 48 }, { v: 53 }, { v: 47 }, { v: 46 }, { v: 44 }];
const SPARK_SUSPICIOUS = [{ v: 20 }, { v: 22 }, { v: 26 }, { v: 35 }, { v: 42 }, { v: 47 }];
const SPARK_FORECAST = [{ v: 80 }, { v: 76 }, { v: 78 }, { v: 74 }, { v: 75 }, { v: 72 }];

const SPARK_DEVIATION_1 = [{ v: 20 }, { v: 30 }, { v: 25 }, { v: 40 }, { v: 35 }, { v: 48 }];
const SPARK_DEVIATION_2 = [{ v: 15 }, { v: 22 }, { v: 18 }, { v: 28 }, { v: 25 }, { v: 32 }];
const SPARK_DEVIATION_3 = [{ v: 18 }, { v: 25 }, { v: 22 }, { v: 33 }, { v: 30 }, { v: 38 }];

export default function DashboardPage() {
  const { hasCriticalOrHigh, alerts } = useAlerts();

  const riskScore = hasCriticalOrHigh ? 92 : 68;
  const gaugePercent = riskScore / 100;

  // Top 4 priority alerts from alert context
  const priorityAlerts = alerts.slice(0, 4);
  return (
    <div className="space-y-5">
      {/* 1. Top Section: Predictive Risk Overview */}
      <Card className="p-6 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Gauge and metric summary */}
          <div className="lg:w-80 shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Predictive Risk Overview
              </h2>
            </div>

            <div className="flex items-center gap-6">
              {/* Semi-circle Gauge */}
              <div className="relative w-36 h-24 flex flex-col items-center justify-end">
                <svg viewBox="0 0 120 70" className="w-full h-full overflow-visible">
                  {/* Gauge background track */}
                  <path
                    d="M 10 65 A 50 50 0 0 1 110 65"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Gauge active arc */}
                  <path
                    d="M 10 65 A 50 50 0 0 1 110 65"
                    fill="none"
                    stroke={hasCriticalOrHigh ? "url(#roseGaugeGrad)" : "url(#purpleGaugeGrad)"}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="157"
                    strokeDashoffset={157 * (1 - gaugePercent)}
                  />
                  <defs>
                    <linearGradient id="purpleGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#7030A0" />
                    </linearGradient>
                    <linearGradient id="roseGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F43F5E" />
                      <stop offset="100%" stopColor="#BE123C" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl font-extrabold text-slate-900">{riskScore}</span>
                    <span className="text-xs font-semibold text-slate-400">/ 100</span>
                  </div>
                  <span className="text-[10.5px] font-medium text-slate-500">Current Risk Score</span>
                </div>
              </div>

              {/* Status & Change indicator */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                  <ArrowUpRight size={13} />
                  <span>{hasCriticalOrHigh ? "+28%" : "+12%"}</span>
                  <span className="text-slate-400 font-normal">vs. prev hour</span>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                    hasCriticalOrHigh
                      ? "bg-rose-100 text-rose-700 border-rose-300 animate-pulse"
                      : "bg-rose-50 text-rose-600 border-rose-200/50"
                  }`}
                >
                  <AlertTriangle size={12} />
                  <span>{hasCriticalOrHigh ? "Critical Risk Spike" : "Elevated Risk"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Spline Area Chart */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-5 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#7030A0]" />
                  Observed Risk
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 border-b-2 border-dashed border-[#8B5CF6]" />
                  Projected Risk
                </span>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 border border-rose-100">
                <span>Risk Trend</span>
                <ArrowUpRight size={12} />
                <span>Increasing</span>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TIMELINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="observedArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7030A0" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#7030A0" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="projectedArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      fontSize: "12px",
                    }}
                  />
                  {/* Vertical line for NOW at 18:00 */}
                  <ReferenceLine
                    x="18:00"
                    stroke="#7030A0"
                    strokeDasharray="4 4"
                    label={{
                      value: "Now",
                      position: "top",
                      fill: "#FFFFFF",
                      fontSize: 10,
                      fontWeight: 600,
                      className: "fill-white",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="observed"
                    stroke="#7030A0"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#observedArea)"
                  />
                  <Area
                    type="monotone"
                    dataKey="projected"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#projectedArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Middle Row: 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Network Traffic */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Network size={20} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Network Traffic</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">842 GB/h</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowDownRight size={13} />
              8%
            </span>
          </div>
          <div className="h-9 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_TRAFFIC}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Card 2: Active Connections */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Active Connections</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">247K</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowDownRight size={13} />
              6%
            </span>
          </div>
          <div className="h-9 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_CONNECTIONS}>
                <Line type="monotone" dataKey="v" stroke="#6366F1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Card 3: Suspicious Events */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Suspicious Events</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">47</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              18%
            </span>
          </div>
          <div className="h-9 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPARK_SUSPICIOUS}>
                <defs>
                  <linearGradient id="sparkRose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#F43F5E" strokeWidth={2} fill="url(#sparkRose)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Card 4: Forecast Risk */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Forecast Risk</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">72 / 100</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowDownRight size={13} />
              5%
            </span>
          </div>
          <div className="h-9 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_FORECAST}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 3. Bottom Row: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Behaviour Intelligence */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Behaviour Intelligence</h3>
            </div>
            <Link
              to="/behaviour"
              className="text-xs font-semibold text-[#7030A0] hover:text-purple-800 transition-colors inline-flex items-center gap-1"
            >
              View Details →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 divide-x divide-slate-100">
            {/* Packet Rate Deviation */}
            <div className="pr-2">
              <div className="text-[11px] font-medium text-slate-500 leading-tight">
                Packet Rate Deviation
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">+42%</div>
              <div className="h-8 w-full my-1.5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SPARK_DEVIATION_1}>
                    <defs>
                      <linearGradient id="purpleGradDev1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7030A0" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#7030A0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={1.8} fill="url(#purpleGradDev1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Higher than baseline</span>
            </div>

            {/* Traffic Volume Deviation */}
            <div className="px-2">
              <div className="text-[11px] font-medium text-slate-500 leading-tight">
                Traffic Volume Deviation
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">+28%</div>
              <div className="h-8 w-full my-1.5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SPARK_DEVIATION_2}>
                    <defs>
                      <linearGradient id="purpleGradDev2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7030A0" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#7030A0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={1.8} fill="url(#purpleGradDev2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Above expected range</span>
            </div>

            {/* Connection Frequency Deviation */}
            <div className="pl-2">
              <div className="text-[11px] font-medium text-slate-500 leading-tight">
                Connection Freq Deviation
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">+35%</div>
              <div className="h-8 w-full my-1.5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SPARK_DEVIATION_3}>
                    <defs>
                      <linearGradient id="purpleGradDev3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7030A0" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#7030A0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={1.8} fill="url(#purpleGradDev3)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Elevated activity</span>
            </div>
          </div>
        </Card>

        {/* Column 2: Priority Alerts */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Priority Alerts</h3>
            </div>
            <Link
              to="/alerts"
              className="text-xs font-semibold text-[#7030A0] hover:text-purple-800 transition-colors inline-flex items-center gap-1"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11.5px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 pb-2 font-medium">
                  <th className="pb-2 font-semibold">Event</th>
                  <th className="pb-2 font-semibold">Severity</th>
                  <th className="pb-2 font-semibold">Time</th>
                  <th className="pb-2 font-semibold">Endpoint</th>
                  <th className="pb-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {priorityAlerts.map((a) => {
                  const isCrit = a.severity === "CRITICAL";
                  const isElev = a.severity === "HIGH";
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 font-medium flex items-center gap-1.5">
                        <span
                          className={`size-1.5 rounded-full ${
                            isCrit ? "bg-rose-500 animate-pulse" : isElev ? "bg-[#7030A0]" : "bg-emerald-500"
                          }`}
                        />
                        <Link to="/alerts" className="hover:text-[#7030A0] transition-colors truncate max-w-[120px]">
                          {a.title || a.vector}
                        </Link>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            isCrit
                              ? "bg-rose-50 text-rose-600"
                              : isElev
                              ? "bg-purple-50 text-[#7030A0]"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {a.severity}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-500 font-mono">{a.timestamp}</td>
                      <td className="py-2.5 font-mono text-slate-600">{a.source || a.target}</td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            a.status === "Open"
                              ? "bg-purple-50 text-[#7030A0]"
                              : a.status === "Investigating"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Column 3: Intelligence Insight */}
        <Card className="p-5 bg-linear-to-br from-purple-50/60 via-indigo-50/30 to-white border border-purple-100/80 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="size-7 rounded-lg bg-purple-100 text-[#7030A0] flex items-center justify-center">
                <Lightbulb size={16} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Intelligence Insight</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              A 42% increase in packet rate deviation is correlating with a rising risk score, potentially indicating reconnaissance activity.
            </p>
          </div>

          <div className="pt-4 flex items-end justify-between">
            <Link
              to="/forecast"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-purple-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#7030A0] hover:bg-purple-50 transition-colors shadow-xs"
            >
              View Analysis →
            </Link>

            {/* Stylized bar chart illustration at bottom-right */}
            <div className="flex items-end gap-1 opacity-80">
              <span className="w-2 h-4 rounded-t bg-purple-200" />
              <span className="w-2 h-6 rounded-t bg-purple-300" />
              <span className="w-2 h-9 rounded-t bg-purple-400" />
              <span className="w-2 h-12 rounded-t bg-[#7030A0]" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
