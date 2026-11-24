import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Clock,
  Database,
  Filter,
  Info,
  Lightbulb,
  Maximize2,
  PieChart as PieIcon,
  Search,
  Share2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../components/ui/card";

// 24h Network Behaviour Analysis with 2 red deviation spikes
const BEHAVIOUR_DATA = [
  { time: "00:00", observed: 35, baseline: 36, deviation: null },
  { time: "02:00", observed: 32, baseline: 34, deviation: null },
  { time: "04:00", observed: 42, baseline: 38, deviation: null },
  { time: "06:00", observed: 48, baseline: 42, deviation: null },
  { time: "08:00", observed: 75, baseline: 46, deviation: 75 }, // Deviation start
  { time: "09:00", observed: 88, baseline: 48, deviation: 88 }, // Peak 1
  { time: "10:00", observed: 72, baseline: 46, deviation: 72 },
  { time: "12:00", observed: 52, baseline: 45, deviation: null },
  { time: "14:00", observed: 48, baseline: 44, deviation: null },
  { time: "16:00", observed: 54, baseline: 45, deviation: null },
  { time: "18:00", observed: 58, baseline: 46, deviation: null },
  { time: "19:00", observed: 72, baseline: 45, deviation: 72 }, // Deviation 2 start
  { time: "20:00", observed: 85, baseline: 46, deviation: 85 }, // Peak 2
  { time: "21:00", observed: 68, baseline: 44, deviation: 68 },
  { time: "22:00", observed: 52, baseline: 42, deviation: null },
  { time: "24:00", observed: 45, baseline: 38, deviation: null },
];

// Historical comparison grouped bar data
const HISTORICAL_COMPARE_DATA = [
  { metric: "Traffic Volume", prev: 32.1, curr: 36.4, change: "+13%", unit: "GB" },
  { metric: "Packet Rate", prev: 720, curr: 842, change: "+17%", unit: "/s" },
  { metric: "Connection Freq.", prev: 10.8, curr: 12.6, change: "+17%", unit: "k/min" },
  { metric: "Avg Flow Duration", prev: 7.3, curr: 8.4, change: "+14%", unit: "m" },
];

const SPARK_1 = [{ v: 700 }, { v: 750 }, { v: 780 }, { v: 810 }, { v: 820 }, { v: 842.6 }];
const SPARK_2 = [{ v: 22 }, { v: 24 }, { v: 23 }, { v: 26 }, { v: 27 }, { v: 28.4 }];
const SPARK_3 = [{ v: 10 }, { v: 10.5 }, { v: 11.2 }, { v: 11.8 }, { v: 12.1 }, { v: 12.6 }];
const SPARK_4 = [{ v: 9.5 }, { v: 9.2 }, { v: 9.0 }, { v: 8.8 }, { v: 8.5 }, { v: 8.4 }];
const SPARK_5 = [{ v: 66 }, { v: 67 }, { v: 67.5 }, { v: 68 }, { v: 68.2 }, { v: 68.7 }];

export default function BehaviourIntelligencePage() {
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer">
            <Clock size={13} className="text-slate-400" />
            <span>Last 24 Hours</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer">
            <span>All Network Segments</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer">
            <Filter size={13} className="text-slate-500" />
            <span>Filter</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 text-[11px]">
          <Info size={13} />
          <span>SIMULATED DATA — Demonstration Environment</span>
        </div>
      </div>

      {/* 2. Top 5 KPI Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Packet Rate */}
        <Card className="p-3.5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Activity size={16} />
              </div>
              <span className="text-[11px] font-medium text-slate-500">Packet Rate</span>
            </div>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-600">
              <ArrowUpRight size={11} />
              +12%
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">842.6 p/s</div>
          <div className="h-6 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_1}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={1.8} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Traffic Volume */}
        <Card className="p-3.5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Database size={16} />
              </div>
              <span className="text-[11px] font-medium text-slate-500">Traffic Volume</span>
            </div>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-600">
              <ArrowUpRight size={11} />
              +8%
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">28.4 GB</div>
          <div className="h-6 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_2}>
                <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={1.8} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Connection Frequency */}
        <Card className="p-3.5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Share2 size={16} />
              </div>
              <span className="text-[11px] font-medium text-slate-500">Connection Frequency</span>
            </div>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-600">
              <ArrowUpRight size={11} />
              +15%
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">12.6 k/min</div>
          <div className="h-6 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_3}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={1.8} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Average Flow Duration */}
        <Card className="p-3.5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Clock size={16} />
              </div>
              <span className="text-[11px] font-medium text-slate-500">Avg Flow Duration</span>
            </div>
            <span className="inline-flex items-center text-[10px] font-bold text-rose-600">
              <ArrowDownRight size={11} />
              -6%
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">8m 24s</div>
          <div className="h-6 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_4}>
                <Line type="monotone" dataKey="v" stroke="#F43F5E" strokeWidth={1.8} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Protocol Distribution */}
        <Card className="p-3.5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <PieIcon size={16} />
              </div>
              <span className="text-[11px] font-medium text-slate-500">Protocol Distribution</span>
            </div>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-600">
              <ArrowUpRight size={11} />
              +1%
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">68.7% TCP</div>
          <div className="h-6 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_5}>
                <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={1.8} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 3. Middle Row: Network Behaviour Analysis (70%) + Risk Contribution (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Network Behaviour Analysis */}
        <Card className="lg:col-span-2 p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
                <h3 className="text-sm font-bold text-slate-900">Network Behaviour Analysis</h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#7030A0]" />
                  Observed Behaviour
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 border-b-2 border-dashed border-slate-400" />
                  Historical Baseline
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-rose-500" />
                  Deviations
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100/70 p-0.5 rounded-lg text-xs">
                {["1h", "6h", "24h"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      timeRange === range
                        ? "bg-[#7030A0] text-white font-semibold"
                        : "text-slate-600"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <Maximize2 size={14} />
              </button>
            </div>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={BEHAVIOUR_DATA} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="roseDeviationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(v) => (v === 0 ? "0" : `${v}k`)}
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />

                {/* Shaded Red Deviation Area */}
                <Area
                  type="monotone"
                  dataKey="deviation"
                  stroke="none"
                  fillOpacity={1}
                  fill="url(#roseDeviationGrad)"
                />

                {/* Historical baseline dashed */}
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#94A3B8"
                  strokeDasharray="4 4"
                  strokeWidth={1.8}
                  dot={false}
                />

                {/* Observed behaviour */}
                <Line
                  type="monotone"
                  dataKey="observed"
                  stroke="#7030A0"
                  strokeWidth={2.5}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Peak Deviation 1 Warning Pin (09:00) */}
            <div className="absolute top-7 left-[38%] -translate-x-1/2 flex flex-col items-center pointer-events-none">
              <div className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs animate-bounce">
                !
              </div>
            </div>

            {/* Peak Deviation 2 Warning Pin (20:00) */}
            <div className="absolute top-[34px] left-[78%] -translate-x-1/2 flex flex-col items-center pointer-events-none">
              <div className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs animate-bounce">
                !
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Risk Contribution */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Risk Contribution</h3>
            </div>

            <div className="space-y-3">
              {[
                { label: "Connection Frequency Deviation", val: 32 },
                { label: "Traffic Volume Deviation", val: 28 },
                { label: "Packet Rate Deviation", val: 24 },
                { label: "Flow Duration Variation", val: 10 },
                { label: "Protocol Distribution Changes", val: 6 },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.val}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#7030A0]"
                      style={{ width: `${item.val * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Behavioural Risk</span>
            <span className="text-base font-extrabold text-[#7030A0] flex items-center gap-1">
              68.7 / 100
              <ArrowUpRight size={15} />
            </span>
          </div>
        </Card>
      </div>

      {/* 4. Bottom Row: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Behavioural Deviations Table */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Behavioural Deviations</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="hover:text-slate-800 cursor-pointer">All Severities ⌵</span>
              <span>·</span>
              <span className="hover:text-slate-800 cursor-pointer">All Indicators ⌵</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 pb-1.5">
                  <th className="pb-1.5 font-semibold">ID</th>
                  <th className="pb-1.5 font-semibold">Indicator</th>
                  <th className="pb-1.5 font-semibold">Observed</th>
                  <th className="pb-1.5 font-semibold">Baseline</th>
                  <th className="pb-1.5 font-semibold">Deviation</th>
                  <th className="pb-1.5 font-semibold">Severity</th>
                  <th className="pb-1.5 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-2 font-mono text-slate-800 font-bold">AN-7842</td>
                  <td className="py-2">Connection Freq.</td>
                  <td className="py-2 font-mono">18.7 k/min</td>
                  <td className="py-2 font-mono text-slate-400">12.1 k/min</td>
                  <td className="py-2 font-semibold text-rose-600">+55%</td>
                  <td className="py-2">
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Critical
                    </span>
                  </td>
                  <td className="py-2 font-mono text-slate-500 text-right">20:42</td>
                </tr>

                <tr className="hover:bg-slate-50/60">
                  <td className="py-2 font-mono text-slate-800 font-bold">AN-7841</td>
                  <td className="py-2">Packet Rate</td>
                  <td className="py-2 font-mono">1.2 k/s</td>
                  <td className="py-2 font-mono text-slate-400">860 /s</td>
                  <td className="py-2 font-semibold text-amber-600">+40%</td>
                  <td className="py-2">
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      Warning
                    </span>
                  </td>
                  <td className="py-2 font-mono text-slate-500 text-right">19:37</td>
                </tr>

                <tr className="hover:bg-slate-50/60">
                  <td className="py-2 font-mono text-slate-800 font-bold">AN-7840</td>
                  <td className="py-2">Traffic Volume</td>
                  <td className="py-2 font-mono">42.6 GB</td>
                  <td className="py-2 font-mono text-slate-400">34.1 GB</td>
                  <td className="py-2 font-semibold text-amber-600">+25%</td>
                  <td className="py-2">
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      Warning
                    </span>
                  </td>
                  <td className="py-2 font-mono text-slate-500 text-right">18:15</td>
                </tr>

                <tr className="hover:bg-slate-50/60">
                  <td className="py-2 font-mono text-slate-800 font-bold">AN-7839</td>
                  <td className="py-2">Flow Duration</td>
                  <td className="py-2 font-mono">14m 12s</td>
                  <td className="py-2 font-mono text-slate-400">9m 30s</td>
                  <td className="py-2 font-semibold text-rose-600">+50%</td>
                  <td className="py-2">
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Critical
                    </span>
                  </td>
                  <td className="py-2 font-mono text-slate-500 text-right">16:50</td>
                </tr>

                <tr className="hover:bg-slate-50/60">
                  <td className="py-2 font-mono text-slate-800 font-bold">AN-7838</td>
                  <td className="py-2">Protocol Change</td>
                  <td className="py-2 font-mono">72% TCP</td>
                  <td className="py-2 font-mono text-slate-400">65% TCP</td>
                  <td className="py-2 font-semibold text-emerald-600">+11%</td>
                  <td className="py-2">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Info
                    </span>
                  </td>
                  <td className="py-2 font-mono text-slate-500 text-right">15:20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Column 2: Historical Comparison Grouped Bar Chart */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 size={15} className="text-[#7030A0]" />
                <h3 className="text-sm font-bold text-slate-900">Historical Comparison</h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-purple-200" />
                  Previous Period
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-[#7030A0]" />
                  Current Period
                </span>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HISTORICAL_COMPARE_DATA} margin={{ top: 15, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="metric" tick={{ fontSize: 9.5, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9.5, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Bar dataKey="prev" fill="#E9D5FF" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="curr" fill="#7030A0" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center pt-2 border-t border-slate-50 text-[10px]">
            {HISTORICAL_COMPARE_DATA.map((d) => (
              <div key={d.metric}>
                <div className="font-bold text-emerald-600">↑ {d.change}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Column 3: Why Is Network Risk Changing? Insight Box */}
        <Card className="p-5 bg-linear-to-br from-purple-50/60 via-indigo-50/30 to-white border border-purple-100/80 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="size-7 rounded-lg bg-purple-100 text-[#7030A0] flex items-center justify-center">
                <Lightbulb size={16} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Why Is Network Risk Changing?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Connection frequency has increased compared with the selected historical baseline. Combined with elevated packet activity, this creates a behavioural deviation that deserves further investigation.
            </p>

            <div className="mt-4 space-y-1.5 text-xs border-t border-purple-100/60 pt-3">
              <div className="font-semibold text-slate-700">Key Indicators:</div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Connection Freq.</span>
                <span className="font-bold text-slate-900">12.6 k/min <span className="text-emerald-600 font-semibold">(+17%)</span></span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Packet Rate</span>
                <span className="font-bold text-slate-900">842 /s <span className="text-emerald-600 font-semibold">(+17%)</span></span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/investigation"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-purple-300 bg-white py-2 text-xs font-semibold text-[#7030A0] hover:bg-purple-50 transition-colors shadow-xs"
            >
              <Search size={13} />
              <span>Investigate Further →</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
