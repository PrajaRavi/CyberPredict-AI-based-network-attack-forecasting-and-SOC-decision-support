import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Database,
  Filter,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Search,
  Server,
  Share2,
  TrendingUp,
  X,
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

// Dynamic Live Activity datasets for different time intervals
const LIVE_DATA_BY_RANGE: Record<
  string,
  {
    data: Array<{ time: string; incoming: number; outgoing: number }>;
    peak: { time: string; label: string };
    kpis: {
      incoming: string;
      incomingChange: string;
      outgoing: string;
      outgoingChange: string;
      throughput: string;
      throughputChange: string;
      conns: string;
      connsChange: string;
    };
    sparks: {
      inc: { v: number }[];
      out: { v: number }[];
      through: { v: number }[];
      conns: { v: number }[];
    };
  }
> = {
  "1 min": {
    data: [
      { time: "17:41:00", incoming: 62, outgoing: 28 },
      { time: "17:41:10", incoming: 66, outgoing: 30 },
      { time: "17:41:20", incoming: 71, outgoing: 34 },
      { time: "17:41:30", incoming: 74, outgoing: 38 },
      { time: "17:41:40", incoming: 78.6, outgoing: 44 },
      { time: "17:41:50", incoming: 75, outgoing: 40 },
      { time: "17:42:00", incoming: 68, outgoing: 36 },
      { time: "17:42:10", incoming: 72, outgoing: 39 },
      { time: "17:42:18", incoming: 76, outgoing: 41 },
    ],
    peak: { time: "17:41:40", label: "78.6k pkt/s" },
    kpis: {
      incoming: "78.6k / s",
      incomingChange: "+18%",
      outgoing: "44.2k / s",
      outgoingChange: "+14%",
      throughput: "712 MB/s",
      throughputChange: "+16%",
      conns: "254k",
      connsChange: "+9%",
    },
    sparks: {
      inc: [{ v: 62 }, { v: 66 }, { v: 71 }, { v: 74 }, { v: 78.6 }, { v: 76 }],
      out: [{ v: 28 }, { v: 30 }, { v: 34 }, { v: 38 }, { v: 44 }, { v: 41 }],
      through: [{ v: 620 }, { v: 645 }, { v: 670 }, { v: 690 }, { v: 712 }, { v: 705 }],
      conns: [{ v: 235 }, { v: 240 }, { v: 246 }, { v: 250 }, { v: 254 }, { v: 252 }],
    },
  },
  "5 min": {
    data: [
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
      { time: "17:42", incoming: 72.4, outgoing: 42 },
      { time: "17:42:30", incoming: 68, outgoing: 38 },
    ],
    peak: { time: "17:42", label: "72.4k pkt/s" },
    kpis: {
      incoming: "72.4k / s",
      incomingChange: "+12%",
      outgoing: "54.8k / s",
      outgoingChange: "+8%",
      throughput: "678 MB/s",
      throughputChange: "+11%",
      conns: "241k",
      connsChange: "+6%",
    },
    sparks: {
      inc: [{ v: 50 }, { v: 58 }, { v: 62 }, { v: 55 }, { v: 68 }, { v: 72.4 }],
      out: [{ v: 30 }, { v: 35 }, { v: 32 }, { v: 38 }, { v: 42 }, { v: 54.8 }],
      through: [{ v: 500 }, { v: 550 }, { v: 580 }, { v: 610 }, { v: 640 }, { v: 678 }],
      conns: [{ v: 210 }, { v: 218 }, { v: 225 }, { v: 230 }, { v: 236 }, { v: 241 }],
    },
  },
  "15 min": {
    data: [
      { time: "17:28", incoming: 48, outgoing: 22 },
      { time: "17:30", incoming: 52, outgoing: 24 },
      { time: "17:32", incoming: 56, outgoing: 26 },
      { time: "17:34", incoming: 64, outgoing: 30 },
      { time: "17:36", incoming: 76, outgoing: 38 },
      { time: "17:38", incoming: 84.1, outgoing: 48 },
      { time: "17:40", incoming: 70, outgoing: 36 },
      { time: "17:42", incoming: 72.4, outgoing: 42 },
      { time: "17:44", incoming: 66, outgoing: 35 },
    ],
    peak: { time: "17:38", label: "84.1k pkt/s" },
    kpis: {
      incoming: "64.8k / s",
      incomingChange: "+15%",
      outgoing: "48.2k / s",
      outgoingChange: "+10%",
      throughput: "612 MB/s",
      throughputChange: "+13%",
      conns: "228k",
      connsChange: "+7%",
    },
    sparks: {
      inc: [{ v: 48 }, { v: 56 }, { v: 76 }, { v: 84.1 }, { v: 70 }, { v: 66 }],
      out: [{ v: 22 }, { v: 26 }, { v: 38 }, { v: 48 }, { v: 36 }, { v: 35 }],
      through: [{ v: 480 }, { v: 530 }, { v: 650 }, { v: 720 }, { v: 640 }, { v: 612 }],
      conns: [{ v: 195 }, { v: 205 }, { v: 220 }, { v: 238 }, { v: 230 }, { v: 228 }],
    },
  },
  "1 hour": {
    data: [
      { time: "16:45", incoming: 42, outgoing: 20 },
      { time: "16:55", incoming: 46, outgoing: 22 },
      { time: "17:05", incoming: 54, outgoing: 25 },
      { time: "17:15", incoming: 68, outgoing: 32 },
      { time: "17:25", incoming: 91.8, outgoing: 52 },
      { time: "17:35", incoming: 75, outgoing: 38 },
      { time: "17:45", incoming: 68, outgoing: 35 },
    ],
    peak: { time: "17:25", label: "91.8k pkt/s" },
    kpis: {
      incoming: "58.1k / s",
      incomingChange: "+22%",
      outgoing: "41.5k / s",
      outgoingChange: "+14%",
      throughput: "540 MB/s",
      throughputChange: "+18%",
      conns: "215k",
      connsChange: "+11%",
    },
    sparks: {
      inc: [{ v: 42 }, { v: 46 }, { v: 54 }, { v: 68 }, { v: 91.8 }, { v: 68 }],
      out: [{ v: 20 }, { v: 22 }, { v: 25 }, { v: 32 }, { v: 52 }, { v: 35 }],
      through: [{ v: 420 }, { v: 460 }, { v: 510 }, { v: 620 }, { v: 780 }, { v: 540 }],
      conns: [{ v: 180 }, { v: 188 }, { v: 198 }, { v: 212 }, { v: 245 }, { v: 215 }],
    },
  },
};

// Monitoring History Data by Range
const HISTORY_DATA_BY_RANGE: Record<
  string,
  Array<{ time: string; incoming: number; outgoing: number }>
> = {
  "1h": [
    { time: "16:45", incoming: 65, outgoing: 30 },
    { time: "17:00", incoming: 70, outgoing: 34 },
    { time: "17:15", incoming: 68, outgoing: 32 },
    { time: "17:30", incoming: 72, outgoing: 36 },
    { time: "17:45", incoming: 76, outgoing: 39 },
  ],
  "6h": [
    { time: "12:00", incoming: 48, outgoing: 24 },
    { time: "13:30", incoming: 55, outgoing: 28 },
    { time: "15:00", incoming: 62, outgoing: 31 },
    { time: "16:30", incoming: 71, outgoing: 36 },
    { time: "17:45", incoming: 76, outgoing: 39 },
  ],
  "24h": [
    { time: "Yesterday", incoming: 38, outgoing: 19 },
    { time: "22:00", incoming: 28, outgoing: 14 },
    { time: "04:00", incoming: 18, outgoing: 9 },
    { time: "10:00", incoming: 58, outgoing: 28 },
    { time: "14:00", incoming: 66, outgoing: 33 },
    { time: "17:45", incoming: 76, outgoing: 39 },
  ],
};

// Complete Network Event Stream Records
const ALL_EVENTS = [
  {
    id: "EVT-101",
    time: "17:42:12",
    src: "192.168.1.45",
    dst: "10.0.2.18",
    proto: "TCP",
    desc: "Increased connection rate",
    severity: "Critical",
    status: "Investigating",
  },
  {
    id: "EVT-102",
    time: "17:42:10",
    src: "10.0.3.27",
    dst: "172.16.4.12",
    proto: "UDP",
    desc: "Unusual packet pattern",
    severity: "High",
    status: "Open",
  },
  {
    id: "EVT-103",
    time: "17:42:08",
    src: "192.168.1.12",
    dst: "10.0.1.8",
    proto: "TCP",
    desc: "Suspicious external access",
    severity: "Medium",
    status: "Open",
  },
  {
    id: "EVT-104",
    time: "17:42:05",
    src: "10.0.2.33",
    dst: "192.168.1.20",
    proto: "ICMP",
    desc: "Ping sweep detected",
    severity: "Low",
    status: "Resolved",
  },
  {
    id: "EVT-105",
    time: "17:42:03",
    src: "192.168.1.77",
    dst: "10.0.4.15",
    proto: "TCP",
    desc: "Normal traffic pattern",
    severity: "Low",
    status: "Resolved",
  },
  {
    id: "EVT-106",
    time: "17:41:55",
    src: "172.16.88.41",
    dst: "10.0.4.12",
    proto: "TCP",
    desc: "High ingress burst on 443",
    severity: "Critical",
    status: "Open",
  },
  {
    id: "EVT-107",
    time: "17:41:40",
    src: "10.99.2.17",
    dst: "192.168.10.5",
    proto: "UDP",
    desc: "DNS query volume deviation",
    severity: "Medium",
    status: "Investigating",
  },
  {
    id: "EVT-108",
    time: "17:41:22",
    src: "192.168.1.104",
    dst: "8.8.8.8",
    proto: "TCP",
    desc: "Outbound TLS session surge",
    severity: "Low",
    status: "Resolved",
  },
];

export default function LiveMonitoringPage() {
  const [timeRange, setTimeRange] = useState("5 min");
  const [historyRange, setHistoryRange] = useState("1h");
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  // Get active dataset according to selected time range
  const currentRangeData = LIVE_DATA_BY_RANGE[timeRange] || LIVE_DATA_BY_RANGE["5 min"];
  const currentHistoryData = HISTORY_DATA_BY_RANGE[historyRange] || HISTORY_DATA_BY_RANGE["1h"];

  // Filter Network Event Stream table
  const filteredEvents = useMemo(() => {
    return ALL_EVENTS.filter((evt) => {
      const matchesSeverity =
        severityFilter === "All" || evt.severity.toLowerCase() === severityFilter.toLowerCase();
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        evt.src.toLowerCase().includes(query) ||
        evt.dst.toLowerCase().includes(query) ||
        evt.desc.toLowerCase().includes(query) ||
        evt.proto.toLowerCase().includes(query) ||
        evt.severity.toLowerCase().includes(query) ||
        evt.status.toLowerCase().includes(query);
      return matchesSeverity && matchesSearch;
    });
  }, [searchTerm, severityFilter]);

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span
              className={`size-2 rounded-full ${
                isPaused ? "bg-amber-500" : "bg-emerald-500 animate-pulse"
              }`}
            />
            <span>{isPaused ? "SIMULATION PAUSED" : "SIMULATED MONITORING"}</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <div>
            <span className="text-slate-400">Source: </span>
            <span className="font-medium text-slate-700">Demo Network Environment</span>
          </div>
          <span className="text-slate-300 hidden md:inline">|</span>
          <div className="flex items-center gap-1">
            <Clock size={13} className="text-slate-400" />
            <span className="text-slate-400">Time Window: </span>
            <span className="font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
              {timeRange}
            </span>
          </div>
          <span className="text-slate-300 hidden md:inline">|</span>
          <div>
            <span className="text-slate-400">Session: </span>
            <span className="font-mono font-medium text-slate-700">00:14:32</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isPaused
                ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
            <span>{isPaused ? "Resume Stream" : "Live Streaming"}</span>
          </button>
          <div className="flex items-center gap-1.5 font-medium text-emerald-600">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Normal</span>
          </div>
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

          {/* Time range selector buttons that dynamically update the graph */}
          <div className="flex items-center gap-1 bg-slate-100/70 p-0.5 rounded-lg text-xs">
            {["1 min", "5 min", "15 min", "1 hour"].map((tab) => (
              <button
                key={tab}
                type="button"
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

        {/* Dual line area chart reacting to selected timeRange */}
        <div className="h-56 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              key={timeRange}
              data={currentRangeData.data}
              margin={{ top: 20, right: 15, left: -20, bottom: 0 }}
            >
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
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
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
                x={currentRangeData.peak.time}
                stroke="#7030A0"
                strokeDasharray="3 3"
                label={{
                  value: currentRangeData.peak.label,
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

      {/* 3. 4 Metric Cards reacting dynamically to timeRange */}
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {currentRangeData.kpis.incoming}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              {currentRangeData.kpis.incomingChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentRangeData.sparks.inc}>
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {currentRangeData.kpis.outgoing}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              {currentRangeData.kpis.outgoingChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentRangeData.sparks.out}>
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {currentRangeData.kpis.throughput}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              {currentRangeData.kpis.throughputChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentRangeData.sparks.through}>
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {currentRangeData.kpis.conns}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              {currentRangeData.kpis.connsChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentRangeData.sparks.conns}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 4. Middle Row: Event Stream Table + Monitoring History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Network Event Stream (2 cols on lg) with Live Search and Severity Filters */}
        <Card className="lg:col-span-2 p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Network Event Stream</h3>
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {filteredEvents.length} events
              </span>
            </div>

            {/* Filter pills & search input */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Severity filter buttons */}
              <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg text-xs">
                {["All", "Critical", "High", "Medium", "Low"].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      severityFilter === sev
                        ? "bg-[#7030A0] text-white font-semibold shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              {/* Live search input */}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search IP, protocol, event..."
                  className="h-8 w-44 sm:w-52 rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-7 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
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
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 font-mono text-slate-500">{evt.time}</td>
                      <td className="py-2.5 font-mono font-bold text-slate-800">{evt.src}</td>
                      <td className="py-2.5 font-mono text-slate-500">{evt.dst}</td>
                      <td className="py-2.5 font-mono font-medium">{evt.proto}</td>
                      <td className="py-2.5 font-medium">{evt.desc}</td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
                            evt.severity === "Critical"
                              ? "text-rose-600"
                              : evt.severity === "High"
                              ? "text-orange-600"
                              : evt.severity === "Medium"
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              evt.severity === "Critical"
                                ? "bg-rose-600"
                                : evt.severity === "High"
                                ? "bg-orange-500"
                                : evt.severity === "Medium"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          {evt.severity}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            evt.status === "Resolved"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-purple-50 text-[#7030A0]"
                          }`}
                        >
                          {evt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-1.5">
                        <Filter size={18} className="text-slate-300" />
                        <span>No network events match your filter criteria</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTerm("");
                            setSeverityFilter("All");
                          }}
                          className="mt-1 text-xs text-purple-700 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <RotateCcw size={11} /> Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right: Monitoring History with dynamic 1h / 6h / 24h range */}
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
                    type="button"
                    onClick={() => setHistoryRange(range)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      historyRange === range
                        ? "bg-[#7030A0] text-white font-semibold shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
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
                <LineChart key={historyRange} data={currentHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                  />
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
                      borderRadius: "10px",
                      border: "1px solid #E2E8F0",
                      fontSize: "11px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="incoming"
                    stroke="#7030A0"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#7030A0" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="outgoing"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#10B981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
            <span>Range: {historyRange}</span>
            <span className="font-mono text-purple-700 font-semibold">
              Avg: {historyRange === "1h" ? "71k/s" : historyRange === "6h" ? "62k/s" : "47k/s"}
            </span>
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
              <span className={`size-1.5 rounded-full ${isPaused ? "bg-amber-500" : "bg-emerald-500"}`} />
              {isPaused ? "Paused" : "Active"}
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
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#7030A0] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-800 transition-colors cursor-pointer"
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            <span>{isPaused ? "Resume Simulation" : "Pause Simulation"}</span>
          </button>

          <div className="relative hidden sm:block">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by IP..."
              className="h-8 w-36 rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
