import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Database,
  Filter,
  Info,
  Layers,
  Monitor,
  RefreshCw,
  RotateCcw,
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

// Protocol and KPI statistics by time filter
const STATS_BY_TIME = {
  "Last 24 Hours": {
    packets: "12.4 M",
    packetsChange: "8%",
    packetsIsUp: true,
    data: "2.8 GB",
    dataChange: "12%",
    dataIsUp: true,
    tcp: "68.7%",
    tcpChange: "3%",
    tcpIsUp: false,
    udp: "31.3%",
    udpChange: "7%",
    udpIsUp: true,
    sparkPackets: [{ v: 40 }, { v: 45 }, { v: 42 }, { v: 50 }, { v: 52 }, { v: 58 }],
    sparkData: [{ v: 2.1 }, { v: 2.3 }, { v: 2.2 }, { v: 2.5 }, { v: 2.7 }, { v: 2.8 }],
    sparkTcp: [{ v: 72 }, { v: 71 }, { v: 70 }, { v: 69 }, { v: 70 }, { v: 68.7 }],
    sparkUdp: [{ v: 28 }, { v: 29 }, { v: 30 }, { v: 31 }, { v: 30 }, { v: 31.3 }],
    protocols: [
      { name: "TCP", value: 68.7, color: "#7030A0" },
      { name: "UDP", value: 24.1, color: "#10B981" },
      { name: "ICMP", value: 4.3, color: "#F59E0B" },
      { name: "Other", value: 2.9, color: "#94A3B8" },
    ],
  },
  "Last 6 Hours": {
    packets: "3.6 M",
    packetsChange: "14%",
    packetsIsUp: true,
    data: "840 MB",
    dataChange: "18%",
    dataIsUp: true,
    tcp: "72.4%",
    tcpChange: "5%",
    tcpIsUp: true,
    udp: "27.6%",
    udpChange: "4%",
    udpIsUp: false,
    sparkPackets: [{ v: 12 }, { v: 15 }, { v: 18 }, { v: 22 }, { v: 26 }, { v: 30 }],
    sparkData: [{ v: 0.4 }, { v: 0.5 }, { v: 0.6 }, { v: 0.7 }, { v: 0.8 }, { v: 0.84 }],
    sparkTcp: [{ v: 68 }, { v: 69 }, { v: 70 }, { v: 71 }, { v: 72 }, { v: 72.4 }],
    sparkUdp: [{ v: 32 }, { v: 31 }, { v: 30 }, { v: 29 }, { v: 28 }, { v: 27.6 }],
    protocols: [
      { name: "TCP", value: 72.4, color: "#7030A0" },
      { name: "UDP", value: 21.0, color: "#10B981" },
      { name: "ICMP", value: 4.5, color: "#F59E0B" },
      { name: "Other", value: 2.1, color: "#94A3B8" },
    ],
  },
  "Last 1 Hour": {
    packets: "620 K",
    packetsChange: "26%",
    packetsIsUp: true,
    data: "165 MB",
    dataChange: "32%",
    dataIsUp: true,
    tcp: "76.1%",
    tcpChange: "8%",
    tcpIsUp: true,
    udp: "23.9%",
    udpChange: "6%",
    udpIsUp: false,
    sparkPackets: [{ v: 3 }, { v: 5 }, { v: 7 }, { v: 8 }, { v: 10 }, { v: 12 }],
    sparkData: [{ v: 0.08 }, { v: 0.1 }, { v: 0.12 }, { v: 0.14 }, { v: 0.15 }, { v: 0.165 }],
    sparkTcp: [{ v: 70 }, { v: 72 }, { v: 73 }, { v: 74 }, { v: 75 }, { v: 76.1 }],
    sparkUdp: [{ v: 30 }, { v: 28 }, { v: 27 }, { v: 26 }, { v: 25 }, { v: 23.9 }],
    protocols: [
      { name: "TCP", value: 76.1, color: "#7030A0" },
      { name: "UDP", value: 18.2, color: "#10B981" },
      { name: "ICMP", value: 3.8, color: "#F59E0B" },
      { name: "Other", value: 1.9, color: "#94A3B8" },
    ],
  },
};

// Timeline datasets by time filter
const TIMELINE_BY_TIME: Record<string, Array<{ time: string; incoming: number; outgoing: number }>> = {
  "Last 24 Hours": [
    { time: "00:00", incoming: 48, outgoing: 24 },
    { time: "04:00", incoming: 42, outgoing: 22 },
    { time: "08:00", incoming: 65, outgoing: 38 },
    { time: "12:00", incoming: 78, outgoing: 48 },
    { time: "16:00", incoming: 72, outgoing: 42 },
    { time: "20:00", incoming: 82, outgoing: 52 },
  ],
  "Last 6 Hours": [
    { time: "12:00", incoming: 60, outgoing: 32 },
    { time: "13:00", incoming: 68, outgoing: 38 },
    { time: "14:00", incoming: 75, outgoing: 42 },
    { time: "15:00", incoming: 84, outgoing: 51 },
    { time: "16:00", incoming: 72, outgoing: 42 },
    { time: "17:45", incoming: 88, outgoing: 54 },
  ],
  "Last 1 Hour": [
    { time: "16:45", incoming: 70, outgoing: 38 },
    { time: "17:00", incoming: 74, outgoing: 42 },
    { time: "17:15", incoming: 82, outgoing: 49 },
    { time: "17:30", incoming: 86, outgoing: 52 },
    { time: "17:45", incoming: 91, outgoing: 56 },
  ],
};

// Hourly intensity bar data by time filter
const INTENSITY_BY_TIME: Record<string, Array<{ hour: string; val: number }>> = {
  "Last 24 Hours": [
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
  ],
  "Last 6 Hours": [
    { hour: "12h", val: 68 },
    { hour: "13h", val: 72 },
    { hour: "14h", val: 85 },
    { hour: "15h", val: 94 },
    { hour: "16h", val: 88 },
    { hour: "17h", val: 96 },
  ],
  "Last 1 Hour": [
    { hour: "17:00", val: 74 },
    { hour: "17:10", val: 79 },
    { hour: "17:20", val: 86 },
    { hour: "17:30", val: 92 },
    { hour: "17:40", val: 96 },
  ],
};

// Node metadata for the Endpoint Inspector
const NODE_METADATA: Record<
  string,
  {
    role: string;
    status: string;
    statusColor: string;
    conns: number;
    incoming: string;
    outgoing: string;
    protocols: string;
    eventNotice: string;
    isSuspicious: boolean;
  }
> = {
  "192.168.1.45": {
    role: "Workstation-042 · Engineering",
    status: "Suspicious",
    statusColor: "text-rose-600 bg-rose-50",
    conns: 24,
    incoming: "12.4 MB",
    outgoing: "8.7 MB",
    protocols: "TCP, UDP",
    eventNotice: "Suspicious behaviour detected (High volume spike)",
    isSuspicious: true,
  },
  "10.0.2.18": {
    role: "Database Cluster · Production",
    status: "Normal",
    statusColor: "text-emerald-600 bg-emerald-50",
    conns: 118,
    incoming: "48.2 MB",
    outgoing: "142.6 MB",
    protocols: "TCP (PostgreSQL)",
    eventNotice: "Nominal operational query activity",
    isSuspicious: false,
  },
  "172.16.4.12": {
    role: "Edge Proxy Gateway",
    status: "Normal",
    statusColor: "text-emerald-600 bg-emerald-50",
    conns: 340,
    incoming: "312.4 MB",
    outgoing: "298.1 MB",
    protocols: "TCP, UDP, GRE",
    eventNotice: "Perimeter ingress rate within nominal limits",
    isSuspicious: false,
  },
  "10.0.3.27": {
    role: "Internal Service · Reporting",
    status: "Investigating",
    statusColor: "text-purple-700 bg-purple-50",
    conns: 45,
    incoming: "8.9 MB",
    outgoing: "6.2 MB",
    protocols: "TCP, HTTP",
    eventNotice: "Abnormal connection frequency deviation",
    isSuspicious: true,
  },
  "42.112.5.99": {
    role: "External Ingress IP",
    status: "Critical",
    statusColor: "text-rose-700 bg-rose-100",
    conns: 512,
    incoming: "1.2 MB",
    outgoing: "88.4 MB",
    protocols: "TCP (SYN Burst)",
    eventNotice: "Volumetric DDoS probing pattern detected",
    isSuspicious: true,
  },
};

// Complete flows dataset
const ALL_FLOWS = [
  {
    id: "FL-1",
    src: "192.168.1.45",
    dst: "10.0.2.18",
    proto: "TCP",
    packets: "12,450",
    bytes: "842 MB",
    duration: "12m 34s",
    status: "Normal",
  },
  {
    id: "FL-2",
    src: "192.168.1.23",
    dst: "172.16.4.12",
    proto: "UDP",
    packets: "8,732",
    bytes: "621 MB",
    duration: "8m 12s",
    status: "Normal",
  },
  {
    id: "FL-3",
    src: "10.0.3.27",
    dst: "192.168.1.77",
    proto: "TCP",
    packets: "6,221",
    bytes: "443 MB",
    duration: "6m 50s",
    status: "Investigating",
  },
  {
    id: "FL-4",
    src: "172.16.88.41",
    dst: "10.0.4.12",
    proto: "TCP",
    packets: "38,500",
    bytes: "1.8 GB",
    duration: "2m 15s",
    status: "Critical",
  },
  {
    id: "FL-5",
    src: "10.99.2.17",
    dst: "10.0.2.53",
    proto: "UDP",
    packets: "4,120",
    bytes: "185 MB",
    duration: "15m 20s",
    status: "Normal",
  },
  {
    id: "FL-6",
    src: "192.168.1.104",
    dst: "8.8.8.8",
    proto: "ICMP",
    packets: "1,250",
    bytes: "48 MB",
    duration: "4m 10s",
    status: "Normal",
  },
  {
    id: "FL-7",
    src: "10.0.2.18",
    dst: "192.168.1.12",
    proto: "TCP",
    packets: "9,840",
    bytes: "512 MB",
    duration: "9m 45s",
    status: "Normal",
  },
];

export default function NetworkObservatoryPage() {
  const [selectedNode, setSelectedNode] = useState("192.168.1.45");
  const [timeFilter, setTimeFilter] = useState<"Last 24 Hours" | "Last 6 Hours" | "Last 1 Hour">("Last 24 Hours");
  const [searchFlow, setSearchFlow] = useState("");
  const [selectedProto, setSelectedProto] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const currentStats = STATS_BY_TIME[timeFilter] || STATS_BY_TIME["Last 24 Hours"];
  const activeTimeline = TIMELINE_BY_TIME[timeFilter] || TIMELINE_BY_TIME["Last 24 Hours"];
  const activeIntensity = INTENSITY_BY_TIME[timeFilter] || INTENSITY_BY_TIME["Last 24 Hours"];
  const currentNodeMeta = NODE_METADATA[selectedNode] || NODE_METADATA["192.168.1.45"];

  // Filter flows table dynamically
  const filteredFlows = useMemo(() => {
    return ALL_FLOWS.filter((fl) => {
      const matchProto = selectedProto === "All" || fl.proto.toLowerCase() === selectedProto.toLowerCase();
      const matchStatus = selectedStatus === "All" || fl.status.toLowerCase() === selectedStatus.toLowerCase();
      const q = searchFlow.toLowerCase().trim();
      const matchSearch =
        !q ||
        fl.src.toLowerCase().includes(q) ||
        fl.dst.toLowerCase().includes(q) ||
        fl.proto.toLowerCase().includes(q) ||
        fl.status.toLowerCase().includes(q);
      return matchProto && matchStatus && matchSearch;
    });
  }, [searchFlow, selectedProto, selectedStatus]);

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range selector dropdown / buttons */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg text-xs">
            {(["Last 24 Hours", "Last 6 Hours", "Last 1 Hour"] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  timeFilter === tf
                    ? "bg-[#7030A0] text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setTimeFilter("Last 24 Hours");
              setSelectedNode("192.168.1.45");
              setSearchFlow("");
              setSelectedProto("All");
              setSelectedStatus("All");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer text-xs"
          >
            <RefreshCw size={13} className="text-slate-500" />
            <span>Reset View</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 text-[11px]">
          <Info size={13} />
          <span>Active Window: {timeFilter} · Selected: {selectedNode}</span>
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

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#7030A0]" />
                Selected: <strong className="text-slate-900 font-mono">{selectedNode}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Normal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-rose-500" />
                Suspicious
              </span>
              <button
                type="button"
                onClick={() => setSelectedNode("192.168.1.45")}
                className="text-[11px] text-[#7030A0] hover:underline font-semibold ml-2 cursor-pointer"
              >
                Reset Selection
              </button>
            </div>
          </div>

          {/* Topology Interactive SVG Canvas */}
          <div className="relative w-full h-72 sm:h-80 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#94a3b8_1px,transparent_1px)] bg-size-[16px_16px]" />

            <svg viewBox="0 0 650 320" className="w-full h-full select-none">
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
              <g
                transform="translate(325, 160)"
                className="cursor-pointer"
                onClick={() => setSelectedNode("172.16.4.12")}
              >
                <circle r="26" fill="#7030A0" className="drop-shadow-md hover:scale-105 transition-transform" />
                <circle r="30" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
                <Server x="-10" y="-10" size={20} color="#FFFFFF" />
                <text y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">
                  Gateway (172.16.4.12)
                </text>
              </g>

              {/* Node 1: Normal Workstation */}
              <g
                transform="translate(120, 70)"
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedNode("10.0.2.18")}
              >
                <circle r="15" fill="#10B981" />
                <Monitor x="-7" y="-7" size={14} color="#FFFFFF" />
              </g>

              {/* Node 2: Normal Workstation */}
              <g
                transform="translate(105, 180)"
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedNode("10.0.3.27")}
              >
                <circle r="15" fill="#10B981" />
                <Monitor x="-7" y="-7" size={14} color="#FFFFFF" />
              </g>

              {/* Node 3: Normal Workstation */}
              <g
                transform="translate(195, 240)"
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedNode("192.168.1.45")}
              >
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

                <g transform="translate(0, -32)">
                  <rect x="-48" y="-12" width="96" height="22" rx="6" fill="#FFFFFF" stroke="#E2E8F0" className="drop-shadow-xs" />
                  <text y="2" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#7030A0">
                    {selectedNode}
                  </text>
                  <text y="14" textAnchor="middle" fontSize="7.5" fill="#64748B">
                    Selected Node
                  </text>
                </g>
              </g>

              {/* Suspicious Threat Node */}
              <g
                transform="translate(425, 110)"
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedNode("42.112.5.99")}
              >
                <circle r="18" fill="#F43F5E" className="drop-shadow-md" />
                <circle r="24" fill="none" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" />
                <ShieldAlert x="-8" y="-8" size={16} color="#FFFFFF" />
              </g>

              {/* Right side workstations */}
              <g transform="translate(470, 170)" className="cursor-pointer hover:opacity-80" onClick={() => setSelectedNode("10.0.2.18")}>
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

        {/* Right: Endpoint Inspector responding dynamically to selectedNode */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Endpoint Inspector</h3>
              <button
                type="button"
                onClick={() => setSelectedNode("192.168.1.45")}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            </div>

            {/* Target Header */}
            <div className="flex items-center gap-3 my-4">
              <div className="size-11 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Monitor size={22} />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 leading-tight font-mono">{selectedNode}</div>
                <div className="text-xs text-slate-500">{currentNodeMeta.role}</div>
              </div>
              <span className={`ml-auto inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10.5px] ${currentNodeMeta.statusColor}`}>
                <span className="size-1.5 rounded-full bg-current" />
                {currentNodeMeta.status}
              </span>
            </div>

            {/* Metrics Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Connection Count</span>
                <span className="font-bold text-slate-800">{currentNodeMeta.conns}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="text-emerald-500">→</span> Incoming Traffic
                </span>
                <span className="font-bold text-slate-800">{currentNodeMeta.incoming}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="text-[#7030A0]">→</span> Outgoing Traffic
                </span>
                <span className="font-bold text-slate-800">{currentNodeMeta.outgoing}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Protocols</span>
                <span className="font-bold text-slate-800">{currentNodeMeta.protocols}</span>
              </div>
            </div>

            {/* Associated Events Alert Box */}
            <div
              className={`mt-4 p-3 rounded-xl border text-xs ${
                currentNodeMeta.isSuspicious
                  ? "bg-rose-50/80 border-rose-100"
                  : "bg-emerald-50/70 border-emerald-100"
              }`}
            >
              <div
                className={`flex items-center gap-1.5 font-bold ${
                  currentNodeMeta.isSuspicious ? "text-rose-700" : "text-emerald-700"
                }`}
              >
                <AlertTriangle size={13} />
                <span>Associated Events</span>
              </div>
              <p
                className={`mt-1 text-[11px] font-medium ${
                  currentNodeMeta.isSuspicious ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {currentNodeMeta.eventNotice}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5 inline-block">Just now</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[11px]">ID: EP-{selectedNode.slice(-3)}</span>
            <button
              type="button"
              onClick={() => setSearchFlow(selectedNode)}
              className="text-[#7030A0] hover:underline font-semibold text-xs"
            >
              Filter in Flow Explorer →
            </button>
          </div>
        </Card>
      </div>

      {/* 3. Middle Metric Cards (4 cards) - Dynamically reacts to timeFilter */}
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">{currentStats.packets}</div>
              </div>
            </div>
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                currentStats.packetsIsUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
              }`}
            >
              {currentStats.packetsIsUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {currentStats.packetsChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeFilter} data={currentStats.sparkPackets}>
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">{currentStats.data}</div>
              </div>
            </div>
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                currentStats.dataIsUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
              }`}
            >
              {currentStats.dataIsUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {currentStats.dataChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeFilter} data={currentStats.sparkData}>
                <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* TCP Traffic */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Server size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">TCP Traffic</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{currentStats.tcp}</div>
              </div>
            </div>
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                currentStats.tcpIsUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
              }`}
            >
              {currentStats.tcpIsUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {currentStats.tcpChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeFilter} data={currentStats.sparkTcp}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* UDP Traffic */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Share2 size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">UDP Traffic</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{currentStats.udp}</div>
              </div>
            </div>
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                currentStats.udpIsUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
              }`}
            >
              {currentStats.udpIsUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {currentStats.udpChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeFilter} data={currentStats.sparkUdp}>
                <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 4. Charts Row: Donut + Timeline + Hourly Intensity Bar reacting to timeFilter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Chart 1: Donut Protocol Mix */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
            <h3 className="text-sm font-bold text-slate-900">Protocol Distribution ({timeFilter})</h3>
          </div>

          <div className="relative h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart key={timeFilter}>
                <Pie
                  data={currentStats.protocols}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {currentStats.protocols.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900">{currentStats.tcp}</span>
              <span className="text-[10px] text-slate-400 font-medium">TCP Traffic</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-50">
            {currentStats.protocols.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </span>
                <span className="font-bold text-slate-900">{p.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Chart 2: Traffic Volume Timeline reacting to timeFilter */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
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
              <LineChart key={timeFilter} data={activeTimeline}>
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
                <Line type="monotone" dataKey="incoming" stroke="#7030A0" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="outgoing" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 text-right pt-2 border-t border-slate-50">
            Window: <span className="text-purple-700 font-semibold">{timeFilter}</span>
          </div>
        </Card>

        {/* Chart 3: Hourly Traffic Intensity Bar reacting to timeFilter */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Traffic Intensity</h3>
            </div>
            <span className="text-xs text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded">
              Hourly
            </span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart key={timeFilter} data={activeIntensity} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
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
          <div className="text-[11px] text-slate-400 text-right pt-2 border-t border-slate-50">
            Peak Intensity: <span className="text-purple-700 font-semibold">96 / 100</span>
          </div>
        </Card>
      </div>

      {/* 5. Bottom: Flow Explorer with Functional Search & Filter */}
      <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
            <h3 className="text-sm font-bold text-slate-900">Flow Explorer</h3>
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              {filteredFlows.length} flows
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFlow}
                onChange={(e) => setSearchFlow(e.target.value)}
                placeholder="Search flows by IP, proto..."
                className="h-8 w-48 rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-7 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-500"
              />
              {searchFlow && (
                <button
                  type="button"
                  onClick={() => setSearchFlow("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Protocol Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              {["All", "TCP", "UDP", "ICMP"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedProto(p)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedProto === p ? "bg-[#7030A0] text-white font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              {["All", "Normal", "Investigating", "Critical"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedStatus === st ? "bg-[#7030A0] text-white font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11.5px]">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 pb-2">
                <th className="pb-2 font-semibold">Flow ID</th>
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
              {filteredFlows.length > 0 ? (
                filteredFlows.map((fl) => (
                  <tr
                    key={fl.id}
                    onClick={() => setSelectedNode(fl.src)}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 font-mono text-purple-700 font-bold">{fl.id}</td>
                    <td className="py-2.5 font-mono font-bold text-slate-900">{fl.src}</td>
                    <td className="py-2.5 font-mono text-slate-600">{fl.dst}</td>
                    <td className="py-2.5 font-mono font-semibold">{fl.proto}</td>
                    <td className="py-2.5 font-mono">{fl.packets}</td>
                    <td className="py-2.5 font-mono">{fl.bytes}</td>
                    <td className="py-2.5 font-mono text-slate-500">{fl.duration}</td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 font-semibold ${
                          fl.status === "Critical"
                            ? "text-rose-600"
                            : fl.status === "Investigating"
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            fl.status === "Critical"
                              ? "bg-rose-600"
                              : fl.status === "Investigating"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                        />
                        {fl.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-1.5">
                      <Filter size={18} className="text-slate-300" />
                      <span>No network flows match your search or filter</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchFlow("");
                          setSelectedProto("All");
                          setSelectedStatus("All");
                        }}
                        className="mt-1 text-xs text-purple-700 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <RotateCcw size={11} /> Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
