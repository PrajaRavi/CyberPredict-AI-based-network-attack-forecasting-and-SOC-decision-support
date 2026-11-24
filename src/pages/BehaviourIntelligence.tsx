import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  Database,
  Info,
  Lightbulb,
  Maximize2,
  PieChart as PieIcon,
  Search,
  Share2,
  X,
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

// Data by Time Range for Network Behaviour Analysis
const BEHAVIOUR_BY_RANGE = {
  "24h": [
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
  ],
  "6h": [
    { time: "13:00", observed: 45, baseline: 44, deviation: null },
    { time: "14:00", observed: 48, baseline: 44, deviation: null },
    { time: "15:00", observed: 50, baseline: 45, deviation: null },
    { time: "16:00", observed: 54, baseline: 45, deviation: null },
    { time: "17:00", observed: 56, baseline: 46, deviation: null },
    { time: "18:00", observed: 58, baseline: 46, deviation: null },
    { time: "19:00", observed: 72, baseline: 45, deviation: 72 },
    { time: "19:30", observed: 82, baseline: 46, deviation: 82 },
    { time: "20:00", observed: 85, baseline: 46, deviation: 85 },
    { time: "20:30", observed: 74, baseline: 45, deviation: 74 },
    { time: "21:00", observed: 68, baseline: 44, deviation: 68 },
  ],
  "1h": [
    { time: "17:00", observed: 52, baseline: 46, deviation: null },
    { time: "17:10", observed: 54, baseline: 46, deviation: null },
    { time: "17:20", observed: 58, baseline: 46, deviation: null },
    { time: "17:30", observed: 65, baseline: 46, deviation: 65 },
    { time: "17:35", observed: 78, baseline: 46, deviation: 78 },
    { time: "17:40", observed: 88, baseline: 47, deviation: 88 },
    { time: "17:45", observed: 82, baseline: 47, deviation: 82 },
    { time: "17:50", observed: 70, baseline: 46, deviation: 70 },
    { time: "17:55", observed: 60, baseline: 46, deviation: null },
  ],
};

// Historical Comparison Grouped Bar Data
const HISTORICAL_COMPARE_BY_RANGE = {
  "24h": [
    { metric: "Traffic Volume", prev: 32.1, curr: 36.4, change: "+13%", unit: "GB" },
    { metric: "Packet Rate", prev: 720, curr: 842, change: "+17%", unit: "/s" },
    { metric: "Connection Freq.", prev: 10.8, curr: 12.6, change: "+17%", unit: "k/min" },
    { metric: "Avg Flow Duration", prev: 7.3, curr: 8.4, change: "+14%", unit: "m" },
  ],
  "6h": [
    { metric: "Traffic Volume", prev: 8.2, curr: 9.8, change: "+20%", unit: "GB" },
    { metric: "Packet Rate", prev: 760, curr: 890, change: "+17%", unit: "/s" },
    { metric: "Connection Freq.", prev: 11.2, curr: 13.5, change: "+21%", unit: "k/min" },
    { metric: "Avg Flow Duration", prev: 7.8, curr: 8.9, change: "+14%", unit: "m" },
  ],
  "1h": [
    { metric: "Traffic Volume", prev: 1.4, curr: 1.8, change: "+28%", unit: "GB" },
    { metric: "Packet Rate", prev: 810, curr: 980, change: "+21%", unit: "/s" },
    { metric: "Connection Freq.", prev: 12.0, curr: 15.2, change: "+27%", unit: "k/min" },
    { metric: "Avg Flow Duration", prev: 8.0, curr: 9.6, change: "+20%", unit: "m" },
  ],
};

// Sparkline Fixtures
const SPARK_1 = [{ v: 700 }, { v: 750 }, { v: 780 }, { v: 810 }, { v: 820 }, { v: 842.6 }];
const SPARK_2 = [{ v: 22 }, { v: 24 }, { v: 23 }, { v: 26 }, { v: 27 }, { v: 28.4 }];
const SPARK_3 = [{ v: 10 }, { v: 10.5 }, { v: 11.2 }, { v: 11.8 }, { v: 12.1 }, { v: 12.6 }];
const SPARK_4 = [{ v: 9.5 }, { v: 9.2 }, { v: 9.0 }, { v: 8.8 }, { v: 8.5 }, { v: 8.4 }];
const SPARK_5 = [{ v: 66 }, { v: 67 }, { v: 67.5 }, { v: 68 }, { v: 68.2 }, { v: 68.7 }];

interface AnomalyRow {
  id: string;
  indicator: string;
  observed: string;
  baseline: string;
  deviation: string;
  severity: "Critical" | "Warning" | "Info";
  time: string;
}

const ALL_ANOMALIES: AnomalyRow[] = [
  { id: "AN-7842", indicator: "Connection Freq.", observed: "18.7 k/min", baseline: "12.1 k/min", deviation: "+55%", severity: "Critical", time: "20:42" },
  { id: "AN-7841", indicator: "Packet Rate", observed: "1.2 k/s", baseline: "860 /s", deviation: "+40%", severity: "Warning", time: "19:37" },
  { id: "AN-7840", indicator: "Traffic Volume", observed: "42.6 GB", baseline: "34.1 GB", deviation: "+25%", severity: "Warning", time: "18:15" },
  { id: "AN-7839", indicator: "Flow Duration", observed: "14m 12s", baseline: "9m 30s", deviation: "+50%", severity: "Critical", time: "16:50" },
  { id: "AN-7838", indicator: "Protocol Change", observed: "72% TCP", baseline: "65% TCP", deviation: "+11%", severity: "Info", time: "15:20" },
  { id: "AN-7837", indicator: "Packet Rate", observed: "1.4 k/s", baseline: "850 /s", deviation: "+65%", severity: "Critical", time: "14:10" },
  { id: "AN-7836", indicator: "Traffic Volume", observed: "38.2 GB", baseline: "33.0 GB", deviation: "+16%", severity: "Info", time: "12:45" },
];

export default function BehaviourIntelligencePage() {
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h">("24h");
  const [severityFilter, _] = useState("All");
  const [searchAnomaly, setSearchAnomaly] = useState("");
  const [selectedAnomalyId, setSelectedAnomalyId] = useState("AN-7842");

  // Filtered anomalies table
  const filteredAnomalies = useMemo(() => {
    return ALL_ANOMALIES.filter((a) => {
      const matchSearch =
        searchAnomaly === "" ||
        a.id.toLowerCase().includes(searchAnomaly.toLowerCase()) ||
        a.indicator.toLowerCase().includes(searchAnomaly.toLowerCase()) ||
        a.severity.toLowerCase().includes(searchAnomaly.toLowerCase()) ||
        a.time.includes(searchAnomaly);

      const matchSeverity =
        severityFilter === "All" || a.severity.toLowerCase() === severityFilter.toLowerCase();

      return matchSearch && matchSeverity;
    });
  }, [searchAnomaly, severityFilter]);

  const activeBehaviourData = BEHAVIOUR_BY_RANGE[timeRange];
  const activeHistoricalData = HISTORICAL_COMPARE_BY_RANGE[timeRange];

  // Dynamic KPI stats based on time range
  const kpiStats = useMemo(() => {
    if (timeRange === "1h") {
      return {
        pktRate: "980.2 p/s",
        trafficVol: "1.8 GB",
        connFreq: "15.2 k/min",
        flowDur: "9m 36s",
        protoDist: "71.4% TCP",
        riskScore: "74.2 / 100",
      };
    }
    if (timeRange === "6h") {
      return {
        pktRate: "890.4 p/s",
        trafficVol: "9.8 GB",
        connFreq: "13.5 k/min",
        flowDur: "8m 50s",
        protoDist: "69.8% TCP",
        riskScore: "71.0 / 100",
      };
    }
    return {
      pktRate: "842.6 p/s",
      trafficVol: "28.4 GB",
      connFreq: "12.6 k/min",
      flowDur: "8m 24s",
      protoDist: "68.7% TCP",
      riskScore: "68.7 / 100",
    };
  }, [timeRange]);

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100/70 p-0.5 rounded-lg text-xs">
            {(["1h", "6h", "24h"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  timeRange === range
                    ? "bg-[#7030A0] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {range === "24h" ? "Last 24 Hours" : range === "6h" ? "Last 6 Hours" : "Last 1 Hour"}
              </button>
            ))}
          </div>

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
          <div className="text-lg font-bold text-slate-900 mt-2">{kpiStats.pktRate}</div>
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
          <div className="text-lg font-bold text-slate-900 mt-2">{kpiStats.trafficVol}</div>
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
          <div className="text-lg font-bold text-slate-900 mt-2">{kpiStats.connFreq}</div>
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
          <div className="text-lg font-bold text-slate-900 mt-2">{kpiStats.flowDur}</div>
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
          <div className="text-lg font-bold text-slate-900 mt-2">{kpiStats.protoDist}</div>
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
                {(["1h", "6h", "24h"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      timeRange === range
                        ? "bg-[#7030A0] text-white font-semibold"
                        : "text-slate-600 hover:text-slate-900"
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
              <AreaChart
                key={timeRange}
                data={activeBehaviourData}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              >
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

            {/* Peak Deviation Warning Pins */}
            {timeRange === "24h" && (
              <>
                <div className="absolute top-7 left-[38%] -translate-x-1/2 flex flex-col items-center pointer-events-none">
                  <div className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs animate-bounce">
                    !
                  </div>
                </div>
                <div className="absolute top-[34px] left-[78%] -translate-x-1/2 flex flex-col items-center pointer-events-none">
                  <div className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs animate-bounce">
                    !
                  </div>
                </div>
              </>
            )}
            {timeRange === "6h" && (
              <div className="absolute top-7 left-[75%] -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <div className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs animate-bounce">
                  !
                </div>
              </div>
            )}
            {timeRange === "1h" && (
              <div className="absolute top-6 left-[62%] -translate-x-1/2 flex flex-col items-center pointer-events-none">
                <div className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs animate-bounce">
                  !
                </div>
              </div>
            )}
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
                { label: "Connection Frequency Deviation", val: timeRange === "1h" ? 38 : 32 },
                { label: "Traffic Volume Deviation", val: timeRange === "1h" ? 30 : 28 },
                { label: "Packet Rate Deviation", val: timeRange === "1h" ? 22 : 24 },
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
                      className="h-full rounded-full bg-[#7030A0] transition-all duration-300"
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
              {kpiStats.riskScore}
              <ArrowUpRight size={15} />
            </span>
          </div>
        </Card>
      </div>

      {/* 4. Bottom Row: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Behavioural Deviations Table */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Behavioural Deviations</h3>
              <div className="relative w-36">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchAnomaly}
                  onChange={(e) => setSearchAnomaly(e.target.value)}
                  placeholder="Filter..."
                  className="h-6 w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-6 text-[10.5px] placeholder:text-slate-400 focus:bg-white focus:outline-none"
                />
                {searchAnomaly && (
                  <button
                    onClick={() => setSearchAnomaly("")}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={10} />
                  </button>
                )}
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
                  {filteredAnomalies.map((a) => {
                    const isSelected = selectedAnomalyId === a.id;
                    return (
                      <tr
                        key={a.id}
                        onClick={() => setSelectedAnomalyId(a.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-purple-50/70 font-medium" : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className="py-2 font-mono text-slate-800 font-bold">{a.id}</td>
                        <td className="py-2">{a.indicator}</td>
                        <td className="py-2 font-mono">{a.observed}</td>
                        <td className="py-2 font-mono text-slate-400">{a.baseline}</td>
                        <td
                          className={`py-2 font-semibold ${
                            a.severity === "Critical"
                              ? "text-rose-600"
                              : a.severity === "Warning"
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {a.deviation}
                        </td>
                        <td className="py-2">
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${
                              a.severity === "Critical"
                                ? "text-rose-600"
                                : a.severity === "Warning"
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                a.severity === "Critical"
                                  ? "bg-rose-500"
                                  : a.severity === "Warning"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                            {a.severity}
                          </span>
                        </td>
                        <td className="py-2 font-mono text-slate-500 text-right">{a.time}</td>
                      </tr>
                    );
                  })}
                  {filteredAnomalies.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-5 text-center text-slate-400">
                        No behavioural deviations match the search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 text-[10.5px] text-slate-400 flex items-center justify-between border-t border-slate-50">
            <span>Showing {filteredAnomalies.length} deviations</span>
            <span className="font-mono text-purple-700">Selected: {selectedAnomalyId}</span>
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
                <BarChart
                  key={timeRange}
                  data={activeHistoricalData}
                  margin={{ top: 15, right: 5, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="metric" tick={{ fontSize: 9.5, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9.5, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "10px",
                      border: "1px solid #E2E8F0",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="prev" fill="#E9D5FF" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="curr" fill="#7030A0" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center pt-2 border-t border-slate-50 text-[10px]">
            {activeHistoricalData.map((d) => (
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
              Connection frequency has increased compared with the selected {timeRange} baseline. Combined with elevated packet activity, this creates a behavioural deviation that deserves further investigation.
            </p>

            <div className="mt-4 space-y-1.5 text-xs border-t border-purple-100/60 pt-3">
              <div className="font-semibold text-slate-700">Key Indicators:</div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Connection Freq.</span>
                <span className="font-bold text-slate-900">
                  {kpiStats.connFreq} <span className="text-emerald-600 font-semibold">(+17%)</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Packet Rate</span>
                <span className="font-bold text-slate-900">
                  {kpiStats.pktRate} <span className="text-emerald-600 font-semibold">(+17%)</span>
                </span>
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
