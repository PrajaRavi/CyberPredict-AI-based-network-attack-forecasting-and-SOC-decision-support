import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Database,
  Layers,
  Pause,
  Play,
  Server,
  Share2,
  TrendingUp,
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

// Live network activity chart data (17:37 to 17:42)
const LIVE_ACTIVITY_DATA = [
  { time: "17:37", incoming: 62, outgoing: 26 },
  { time: "17:37:30", incoming: 58, outgoing: 28 },
  { time: "17:38", incoming: 70, outgoing: 35 },
  { time: "17:38:30", incoming: 68, outgoing: 34 },
  { time: "17:39", incoming: 60, outgoing: 27 },
  { time: "17:39:30", incoming: 65, outgoing: 32 },
  { time: "17:40", incoming: 68, outgoing: 31 },
  { time: "17:40:30", incoming: 62, outgoing: 29 },
  { time: "17:41", incoming: 65, outgoing: 36 },
  { time: "17:41:30", incoming: 60, outgoing: 30 },
  { time: "17:42", incoming: 72.4, outgoing: 42 }, // Peak point
  { time: "17:42:30", incoming: 68, outgoing: 38 },
];

const MONITORING_HISTORY_DATA = [
  { time: "16:45", incoming: 65, outgoing: 30 },
  { time: "17:00", incoming: 70, outgoing: 34 },
  { time: "17:15", incoming: 68, outgoing: 32 },
  { time: "17:30", incoming: 72, outgoing: 36 },
];

const SPARK_INC = [{ v: 50 }, { v: 58 }, { v: 62 }, { v: 55 }, { v: 68 }, { v: 72.4 }];
const SPARK_OUT = [{ v: 30 }, { v: 35 }, { v: 32 }, { v: 38 }, { v: 42 }, { v: 54.8 }];
const SPARK_THROUGH = [{ v: 500 }, { v: 550 }, { v: 580 }, { v: 610 }, { v: 640 }, { v: 678 }];
const SPARK_CONNS = [{ v: 210 }, { v: 218 }, { v: 225 }, { v: 230 }, { v: 236 }, { v: 241 }];

export default function LiveMonitoringPage() {
  const [timeRange, setTimeRange] = useState("1 min");
  const [historyRange, setHistoryRange] = useState("1h");
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SIMULATED MONITORING</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <div>
            <span className="text-slate-400">Source: </span>
            <span className="font-medium text-slate-700">Demo Network Environment</span>
          </div>
          <span className="text-slate-300 hidden md:inline">|</span>
          <div className="flex items-center gap-1">
            <Clock size={13} className="text-slate-400" />
            <span className="text-slate-400">Last Data: </span>
            <span className="font-mono font-medium text-slate-700">17:42:18</span>
          </div>
          <span className="text-slate-300 hidden md:inline">|</span>
          <div>
            <span className="text-slate-400">Session: </span>
            <span className="font-mono font-medium text-slate-700">00:14:32</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-emerald-600">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span>Processing: Normal</span>
        </div>
      </div>

      {/* 2. Top Card: Live Network Activity Area Chart */}
      <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Live Network Activity
              </h2>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#7030A0]" />
                Incoming Traffic
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Outgoing Traffic
              </span>
            </div>
          </div>

          {/* Time range pills */}
          <div className="flex items-center gap-1 bg-slate-100/70 p-0.5 rounded-lg text-xs">
            {["1 min", "5 min", "15 min", "1 hour"].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeRange(tab)}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  timeRange === tab
                    ? "bg-[#7030A0] text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dual line area chart with peak indicator */}
        <div className="h-56 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={LIVE_ACTIVITY_DATA} margin={{ top: 20, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="liveIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7030A0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7030A0" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="liveOutgoing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v) => (v === 0 ? "0" : `${v}k`)}
                tick={{ fontSize: 11, fill: "#94A3B8" }}
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
              <ReferenceLine
                x="17:42"
                stroke="#7030A0"
                strokeDasharray="3 3"
                label={{
                  value: "72.4k pkt/s",
                  position: "top",
                  fill: "#7030A0",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
              <Area
                type="monotone"
                dataKey="incoming"
                stroke="#7030A0"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#liveIncoming)"
              />
              <Area
                type="monotone"
                dataKey="outgoing"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#liveOutgoing)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 3. 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Incoming Packets */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Layers size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Incoming Packets</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">72.4k / s</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              12%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_INC}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Outgoing Packets */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Outgoing Packets</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">54.8k / s</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              8%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_OUT}>
                <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Data Throughput */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Database size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Data Throughput</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">678 MB/s</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              11%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_THROUGH}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Active Connections */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Share2 size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Active Connections</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">241k</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              6%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_CONNS}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 4. Middle Row: Event Stream Table + Monitoring History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Network Event Stream (2 cols on lg) */}
        <Card className="lg:col-span-2 p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Network Event Stream</h3>
            </div>
            <button className="text-xs font-semibold text-[#7030A0] hover:text-purple-800 transition-colors">
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11.5px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 pb-2">
                  <th className="pb-2 font-semibold">Time</th>
                  <th className="pb-2 font-semibold">Source IP</th>
                  <th className="pb-2 font-semibold">Destination IP</th>
                  <th className="pb-2 font-semibold">Protocol</th>
                  <th className="pb-2 font-semibold">Description</th>
                  <th className="pb-2 font-semibold">Severity</th>
                  <th className="pb-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 font-mono text-slate-500">17:42:12</td>
                  <td className="py-2.5 font-mono text-slate-800">192.168.1.45</td>
                  <td className="py-2.5 font-mono text-slate-500">10.0.2.18</td>
                  <td className="py-2.5 font-mono font-medium">TCP</td>
                  <td className="py-2.5 font-medium">Increased connection rate</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                      <span className="size-1.5 rounded-full bg-rose-600" />
                      Critical
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-[#7030A0]">
                      Investigating
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 font-mono text-slate-500">17:42:10</td>
                  <td className="py-2.5 font-mono text-slate-800">10.0.3.27</td>
                  <td className="py-2.5 font-mono text-slate-500">172.16.4.12</td>
                  <td className="py-2.5 font-mono font-medium">UDP</td>
                  <td className="py-2.5 font-medium">Unusual packet pattern</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      Warning
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-[#7030A0]">
                      Open
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 font-mono text-slate-500">17:42:08</td>
                  <td className="py-2.5 font-mono text-slate-800">192.168.1.12</td>
                  <td className="py-2.5 font-mono text-slate-500">10.0.1.8</td>
                  <td className="py-2.5 font-mono font-medium">TCP</td>
                  <td className="py-2.5 font-medium">Suspicious external access</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      Warning
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-[#7030A0]">
                      Open
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 font-mono text-slate-500">17:42:05</td>
                  <td className="py-2.5 font-mono text-slate-800">10.0.2.33</td>
                  <td className="py-2.5 font-mono text-slate-500">192.168.1.20</td>
                  <td className="py-2.5 font-mono font-medium">ICMP</td>
                  <td className="py-2.5 font-medium">Ping sweep detected</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Info
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                      Resolved
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60">
                  <td className="py-2.5 font-mono text-slate-500">17:42:03</td>
                  <td className="py-2.5 font-mono text-slate-800">192.168.1.77</td>
                  <td className="py-2.5 font-mono text-slate-500">10.0.4.15</td>
                  <td className="py-2.5 font-mono font-medium">TCP</td>
                  <td className="py-2.5 font-medium">Normal traffic pattern</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Info
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                      Resolved
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right: Monitoring History */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
                <h3 className="text-sm font-bold text-slate-900">Monitoring History</h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-100/70 p-0.5 rounded-lg text-xs">
                {["1h", "6h", "24h"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setHistoryRange(range)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      historyRange === range
                        ? "bg-[#7030A0] text-white font-semibold"
                        : "text-slate-600"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 mb-2">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-[#7030A0]" />
                Incoming
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Outgoing
              </span>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONITORING_HISTORY_DATA}>
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
                  <Line type="monotone" dataKey="incoming" stroke="#7030A0" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="outgoing" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* 5. Bottom Bar: Simulated Source Status & Actions */}
      <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Left Source Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="size-9 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center shrink-0">
            <Server size={18} />
          </div>
          <div>
            <span className="text-slate-400">Source Identifier</span>
            <div className="font-bold text-slate-800">Demo-Network-01</div>
          </div>
          <div className="hidden sm:block border-l border-slate-100 pl-4">
            <span className="text-slate-400">Source Type</span>
            <div className="font-medium text-slate-700">Corporate Network</div>
          </div>
          <div className="hidden md:block border-l border-slate-100 pl-4">
            <span className="text-slate-400">Status</span>
            <div className="flex items-center gap-1 font-semibold text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Active
            </div>
          </div>
          <div className="hidden lg:block border-l border-slate-100 pl-4">
            <span className="text-slate-400">Last Event</span>
            <div className="font-medium text-slate-700">17:42:18 — Normal Traffic</div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#7030A0] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-800 transition-colors cursor-pointer"
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            <span>{isPaused ? "Resume Simulation" : "Pause Simulation"}</span>
          </button>

          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search IP..."
              className="h-8 w-32 rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
