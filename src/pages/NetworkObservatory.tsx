import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Database,
  Filter,
  Info,
  Layers,
  Monitor,
  RefreshCw,
  Search,
  Server,
  Share2,
  ShieldAlert,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../components/ui/card";

// Donut protocol data
const PROTOCOL_DATA = [
  { name: "TCP", value: 68.7, color: "#7030A0" },
  { name: "UDP", value: 24.1, color: "#10B981" },
  { name: "ICMP", value: 4.3, color: "#F59E0B" },
  { name: "Other", value: 2.9, color: "#94A3B8" },
];

// 24h Traffic volume timeline data
const TIMELINE_DATA = [
  { time: "00:00", incoming: 48, outgoing: 24 },
  { time: "04:00", incoming: 42, outgoing: 22 },
  { time: "08:00", incoming: 65, outgoing: 38 },
  { time: "12:00", incoming: 78, outgoing: 48 },
  { time: "16:00", incoming: 72, outgoing: 42 },
  { time: "20:00", incoming: 82, outgoing: 52 },
];

// Traffic Intensity Hourly Bar Data
const INTENSITY_DATA = [
  { hour: "00h", val: 32 },
  { hour: "02h", val: 28 },
  { hour: "04h", val: 35 },
  { hour: "06h", val: 45 },
  { hour: "08h", val: 62 },
  { hour: "10h", val: 78 },
  { hour: "12h", val: 88 },
  { hour: "14h", val: 92 },
  { hour: "16h", val: 84 },
  { hour: "18h", val: 70 },
  { hour: "20h", val: 65 },
  { hour: "22h", val: 58 },
  { hour: "24h", val: 52 },
];

const SPARK_PACKETS = [{ v: 40 }, { v: 45 }, { v: 42 }, { v: 50 }, { v: 52 }, { v: 58 }];
const SPARK_DATA = [{ v: 2.1 }, { v: 2.3 }, { v: 2.2 }, { v: 2.5 }, { v: 2.7 }, { v: 2.8 }];
const SPARK_TCP = [{ v: 72 }, { v: 71 }, { v: 70 }, { v: 69 }, { v: 70 }, { v: 68.7 }];
const SPARK_UDP = [{ v: 28 }, { v: 29 }, { v: 30 }, { v: 31 }, { v: 30 }, { v: 31.3 }];

export default function NetworkObservatoryPage() {
  const [selectedNode, setSelectedNode] = useState("192.168.1.45");

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer">
            <span>Last 24 Hours</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer">
            <Filter size={13} className="text-slate-500" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer">
            <RefreshCw size={13} className="text-slate-500" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 text-[11px]">
          <Info size={13} />
          <span>SIMULATED DATA — Demonstration Environment</span>
        </div>
      </div>

      {/* 2. Top Row: Interactive Network Topology (70%) + Endpoint Inspector (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Network Topology */}
        <Card className="lg:col-span-2 p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2 z-10">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h2 className="text-sm font-bold text-slate-900">Network Topology</h2>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#7030A0]" />
                Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Normal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-rose-500" />
                Suspicious
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-slate-400" />
                Inactive
              </span>
              <button
                onClick={() => setSelectedNode("192.168.1.45")}
                className="text-[11px] text-[#7030A0] hover:underline font-semibold ml-2 cursor-pointer"
              >
                Reset View
              </button>
            </div>
          </div>

          {/* Topology Interactive SVG Canvas */}
          <div className="relative w-full h-72 sm:h-80 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden">
            {/* World map faint dots backdrop */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#94a3b8_1px,transparent_1px)] bg-size-[16px_16px]" />

            <svg viewBox="0 0 650 320" className="w-full h-full">
              {/* Connecting Curving Links */}
              <path d="M 120 70 Q 200 120 325 160" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M 105 180 Q 200 170 325 160" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M 185 140 Q 255 150 325 160" fill="none" stroke="#7030A0" strokeWidth="2.5" />
              <path d="M 195 240 Q 260 200 325 160" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M 150 220 Q 237 190 325 160" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M 325 160 Q 375 130 425 110" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M 325 160 Q 420 165 470 170" fill="none" stroke="#10B981" strokeWidth="1.5" />
              <path d="M 325 160 Q 450 140 500 130" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M 325 160 Q 480 200 525 220" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />

              {/* Central Network Gateway Node */}
              <g transform="translate(325, 160)">
                <circle r="26" fill="#7030A0" className="drop-shadow-md" />
                <circle r="30" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
                <Server x="-10" y="-10" size={20} color="#FFFFFF" />
                <text y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">
                  Network Gateway
                </text>
              </g>

              {/* Node 1: Normal Workstation */}
              <g transform="translate(120, 70)">
                <circle r="15" fill="#10B981" />
                <Monitor x="-7" y="-7" size={14} color="#FFFFFF" />
              </g>

              {/* Node 2: Normal Workstation */}
              <g transform="translate(105, 180)">
                <circle r="15" fill="#10B981" />
                <Monitor x="-7" y="-7" size={14} color="#FFFFFF" />
              </g>

              {/* Node 3: Normal Workstation */}
              <g transform="translate(195, 240)">
                <circle r="15" fill="#10B981" />
                <Monitor x="-7" y="-7" size={14} color="#FFFFFF" />
              </g>

              {/* Node 4: Inactive Server */}
              <g transform="translate(150, 220)">
                <circle r="15" fill="#94A3B8" />
                <Server x="-7" y="-7" size={14} color="#FFFFFF" />
              </g>

              {/* Node: SELECTED with pulse rings and callout pill */}
              <g
                transform="translate(185, 140)"
                className="cursor-pointer"
                onClick={() => setSelectedNode("192.168.1.45")}
              >
                <circle r="20" fill="#7030A0" className="drop-shadow-md" />
                <circle r="26" fill="none" stroke="#7030A0" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                <Monitor x="-9" y="-9" size={18} color="#FFFFFF" />

                {/* Selected Tooltip Pill above */}
                <g transform="translate(0, -32)">
                  <rect x="-48" y="-12" width="96" height="22" rx="6" fill="#FFFFFF" stroke="#E2E8F0" className="drop-shadow-xs" />
                  <text y="2" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#7030A0">
                    {selectedNode}
                  </text>
                  <text y="14" textAnchor="middle" fontSize="7.5" fill="#64748B">
                    High Traffic
                  </text>
                </g>
              </g>

              {/* Suspicious Threat Node */}
              <g transform="translate(425, 110)">
                <circle r="18" fill="#F43F5E" className="drop-shadow-md" />
                <circle r="24" fill="none" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" />
                <ShieldAlert x="-8" y="-8" size={16} color="#FFFFFF" />
              </g>

              {/* Right side workstations */}
              <g transform="translate(470, 170)">
                <circle r="15" fill="#10B981" />
                <Monitor x="-7" y="-7" size={14} color="#FFFFFF" />
              </g>
              <g transform="translate(500, 130)">
                <circle r="15" fill="#10B981" />
                <Monitor x="-7" y="-7" size={14} color="#FFFFFF" />
              </g>
              <g transform="translate(525, 220)">
                <circle r="15" fill="#94A3B8" />
                <Server x="-7" y="-7" size={14} color="#FFFFFF" />
              </g>
            </svg>
          </div>
        </Card>

        {/* Right: Endpoint Inspector */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Endpoint Inspector</h3>
              <button className="text-slate-400 hover:text-slate-600">
                <X size={15} />
              </button>
            </div>

            {/* Target Header */}
            <div className="flex items-center gap-3 my-4">
              <div className="size-11 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Monitor size={22} />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 leading-tight">{selectedNode}</div>
                <div className="text-xs text-slate-500">Workstation-042</div>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10.5px]">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>

            {/* Metrics Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Connection Count</span>
                <span className="font-bold text-slate-800">24</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="text-emerald-500">→</span> Incoming Traffic
                </span>
                <span className="font-bold text-slate-800">12.4 MB</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="text-[#7030A0]">→</span> Outgoing Traffic
                </span>
                <span className="font-bold text-slate-800">8.7 MB</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Protocols</span>
                <span className="font-bold text-slate-800">TCP, UDP</span>
              </div>
            </div>

            {/* Associated Events Rose Alert Box */}
            <div className="mt-4 p-3 rounded-xl bg-rose-50/80 border border-rose-100 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-700">
                <AlertTriangle size={13} />
                <span>Associated Events</span>
              </div>
              <p className="mt-1 text-[11px] text-rose-600 font-medium">
                Suspicious behaviour detected (High volume)
              </p>
              <span className="text-[10px] text-rose-400">2m ago</span>
            </div>
          </div>

          <button className="mt-4 w-full py-2 rounded-xl border border-purple-200 text-[#7030A0] bg-purple-50/50 hover:bg-purple-100 text-xs font-semibold transition-colors cursor-pointer text-center">
            View Details →
          </button>
        </Card>
      </div>

      {/* 3. Middle Metric Cards (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Packets */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Layers size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Total Packets</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">12.4 M</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              8%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_PACKETS}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Total Data Transferred */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Database size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Total Data Transferred</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">2.8 GB</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              12%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_DATA}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* TCP Traffic */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <RefreshCw size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">TCP Traffic</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">68.7%</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              <ArrowDownRight size={13} />
              -2%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_TCP}>
                <Line type="monotone" dataKey="v" stroke="#F43F5E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* UDP Traffic */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Share2 size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">UDP Traffic</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">31.3%</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              +2%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_UDP}>
                <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 4. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Traffic Volume Timeline */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Traffic Volume Timeline</h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-[#7030A0]" />
                Incoming
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Outgoing
              </span>
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TIMELINE_DATA}>
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
        </Card>

        {/* Chart 2: Protocol Distribution Donut */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
            <h3 className="text-sm font-bold text-slate-900">Protocol Distribution</h3>
          </div>
          <div className="h-44 w-full flex items-center justify-between">
            <div className="h-full w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PROTOCOL_DATA}
                    innerRadius={42}
                    outerRadius={62}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PROTOCOL_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-1.5 text-xs">
              {PROTOCOL_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Chart 3: Traffic Intensity */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Traffic Intensity</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Hourly Peak</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INTENSITY_DATA} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="hour" tick={{ fontSize: 9.5, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis
                  ticks={[0, 50, 100]}
                  tickFormatter={(v) => (v === 100 ? "High" : v === 50 ? "Med" : "Low")}
                  tick={{ fontSize: 9.5, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="val" fill="#7030A0" radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 5. Bottom: Flow Explorer */}
      <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
            <h3 className="text-sm font-bold text-slate-900">Flow Explorer</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search flows..."
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-3 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50">
              <span>All Protocols</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50">
              <span>All Statuses</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11.5px]">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 pb-2">
                <th className="pb-2 w-8">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="pb-2 font-semibold">Source IP</th>
                <th className="pb-2 font-semibold">Destination IP</th>
                <th className="pb-2 font-semibold">Protocol</th>
                <th className="pb-2 font-semibold">Packets</th>
                <th className="pb-2 font-semibold">Bytes</th>
                <th className="pb-2 font-semibold">Duration</th>
                <th className="pb-2 font-semibold text-right">Activity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              <tr className="hover:bg-slate-50/60">
                <td className="py-2.5">
                  <input type="checkbox" className="rounded border-slate-300" />
                </td>
                <td className="py-2.5 font-mono font-bold text-slate-900">192.168.1.45</td>
                <td className="py-2.5 font-mono text-slate-600">10.0.2.18</td>
                <td className="py-2.5 font-mono font-semibold">TCP</td>
                <td className="py-2.5 font-mono">12,450</td>
                <td className="py-2.5 font-mono">842 MB</td>
                <td className="py-2.5 font-mono text-slate-500">12m 34s</td>
                <td className="py-2.5 text-right">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Normal
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/60">
                <td className="py-2.5">
                  <input type="checkbox" className="rounded border-slate-300" />
                </td>
                <td className="py-2.5 font-mono font-bold text-slate-900">192.168.1.23</td>
                <td className="py-2.5 font-mono text-slate-600">172.16.4.12</td>
                <td className="py-2.5 font-mono font-semibold">UDP</td>
                <td className="py-2.5 font-mono">8,732</td>
                <td className="py-2.5 font-mono">621 MB</td>
                <td className="py-2.5 font-mono text-slate-500">8m 12s</td>
                <td className="py-2.5 text-right">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Normal
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/60">
                <td className="py-2.5">
                  <input type="checkbox" className="rounded border-slate-300" />
                </td>
                <td className="py-2.5 font-mono font-bold text-slate-900">10.0.3.27</td>
                <td className="py-2.5 font-mono text-slate-600">192.168.1.77</td>
                <td className="py-2.5 font-mono font-semibold">TCP</td>
                <td className="py-2.5 font-mono">6,221</td>
                <td className="py-2.5 font-mono">443 MB</td>
                <td className="py-2.5 font-mono text-slate-500">6m 50s</td>
                <td className="py-2.5 text-right">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Investigating
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-3 flex items-center justify-end gap-1 text-xs">
          <button className="px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50">&lt;</button>
          <button className="px-2.5 py-1 rounded bg-[#7030A0] text-white font-semibold">1</button>
          <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-50">2</button>
          <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-50">3</button>
          <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50">&gt;</button>
        </div>
      </Card>
    </div>
  );
}
