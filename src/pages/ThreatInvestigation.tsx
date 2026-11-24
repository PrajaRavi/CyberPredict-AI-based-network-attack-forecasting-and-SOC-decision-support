import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileSearch,
  Filter,
  Globe,
  Info,
  Monitor,
  Plus,
  Save,
  Search,
  Server,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Card } from "../components/ui/card";

const SPARK_1 = [{ v: 20 }, { v: 21 }, { v: 23 }, { v: 22 }, { v: 23 }, { v: 24 }];
const SPARK_2 = [{ v: 7 }, { v: 7.5 }, { v: 7 }, { v: 7.8 }, { v: 7.9 }, { v: 8 }];
const SPARK_3 = [{ v: 4 }, { v: 4.2 }, { v: 4.8 }, { v: 4.5 }, { v: 4.9 }, { v: 5 }];
const SPARK_4 = [{ v: 14 }, { v: 14.5 }, { v: 15 }, { v: 15.2 }, { v: 15.8 }, { v: 16 }];

export default function ThreatInvestigationPage() {
  const [selectedCase, setSelectedCase] = useState("INV-7842");
  const [analystNotes, setAnalystNotes] = useState(
    "Investigating repeated high connection attempts to external domain. Monitoring for further activity..."
  );

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SIMULATED ENVIRONMENT</span>
          </div>
          <span className="text-slate-300">|</span>
          <button className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium">
            <Filter size={13} className="text-slate-400" />
            <span>Filter</span>
          </button>
          <span className="text-slate-300">|</span>
          <button className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium">
            <Clock size={13} className="text-slate-400" />
            <span>Last 24 Hours ⌵</span>
          </button>
        </div>

        <button className="inline-flex items-center gap-1.5 rounded-xl bg-[#7030A0] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-800 transition-colors cursor-pointer">
          <Plus size={14} />
          <span>New Investigation</span>
        </button>
      </div>

      {/* 2. 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Investigations */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <FileSearch size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Total Investigations</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">24</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              +6%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_1}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Open Investigations */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Open Investigations</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">8</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              +1%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_2}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* High Priority */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">High Priority</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">5</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              +2%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_3}>
                <Line type="monotone" dataKey="v" stroke="#F43F5E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Resolved */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Resolved</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">16</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              +3%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_4}>
                <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 3. Main Section: Investigation Queue + Detail Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Investigation Queue (5 cols) */}
        <Card className="lg:col-span-5 p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Investigation Queue</h3>
            </div>
            <div className="relative w-36">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-2 text-[11px] placeholder:text-slate-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 pb-2">
                  <th className="pb-2 font-semibold">Investigation ID</th>
                  <th className="pb-2 font-semibold">Severity</th>
                  <th className="pb-2 font-semibold">Investigation Title</th>
                  <th className="pb-2 font-semibold">Endpoint</th>
                  <th className="pb-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr
                  onClick={() => setSelectedCase("INV-7842")}
                  className={`cursor-pointer transition-colors ${
                    selectedCase === "INV-7842" ? "bg-purple-50/70" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="py-2.5 font-mono font-bold text-[#7030A0]">INV-7842</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Critical
                    </span>
                  </td>
                  <td className="py-2.5 font-medium max-w-[140px] truncate">Unusual Connection Freq</td>
                  <td className="py-2.5 font-mono text-slate-600">192.168.1.45</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-[#7030A0]">
                      Open
                    </span>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedCase("INV-7841")}
                  className={`cursor-pointer transition-colors ${
                    selectedCase === "INV-7841" ? "bg-purple-50/70" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="py-2.5 font-mono font-bold text-slate-900">INV-7841</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-700">
                      <span className="size-1.5 rounded-full bg-[#7030A0]" />
                      Elevated
                    </span>
                  </td>
                  <td className="py-2.5 font-medium max-w-[140px] truncate">Abnormal Traffic Volume</td>
                  <td className="py-2.5 font-mono text-slate-600">10.0.2.18</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-[#7030A0]">
                      Open
                    </span>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedCase("INV-7840")}
                  className={`cursor-pointer transition-colors ${
                    selectedCase === "INV-7840" ? "bg-purple-50/70" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="py-2.5 font-mono font-bold text-slate-900">INV-7840</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-700">
                      <span className="size-1.5 rounded-full bg-[#7030A0]" />
                      Elevated
                    </span>
                  </td>
                  <td className="py-2.5 font-medium max-w-[140px] truncate">Suspicious Protocol Dist</td>
                  <td className="py-2.5 font-mono text-slate-600">172.16.4.12</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                      In Progress
                    </span>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedCase("INV-7839")}
                  className={`cursor-pointer transition-colors ${
                    selectedCase === "INV-7839" ? "bg-purple-50/70" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="py-2.5 font-mono font-bold text-slate-900">INV-7839</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Critical
                    </span>
                  </td>
                  <td className="py-2.5 font-medium max-w-[140px] truncate">Repeated Packet Rate Dev</td>
                  <td className="py-2.5 font-mono text-slate-600">192.168.1.77</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-[#7030A0]">
                      Open
                    </span>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedCase("INV-7838")}
                  className={`cursor-pointer transition-colors ${
                    selectedCase === "INV-7838" ? "bg-purple-50/70" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="py-2.5 font-mono font-bold text-slate-900">INV-7838</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Normal
                    </span>
                  </td>
                  <td className="py-2.5 font-medium max-w-[140px] truncate">Multiple Behavioural Anomalies</td>
                  <td className="py-2.5 font-mono text-slate-600">10.0.3.27</td>
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

        {/* Right: Case Detail & Analyst Workspace (7 cols) */}
        <Card className="lg:col-span-7 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl overflow-hidden">
          <div className="bg-[#5B21B6] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="font-bold text-sm tracking-wide">
              {selectedCase} | Unusual Connection Frequency
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10.5px]">
                Critical
              </span>
              <button className="px-2.5 py-0.5 rounded-lg bg-purple-900/60 text-white font-medium text-[10.5px] hover:bg-purple-900/90">
                Open ⌵
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* A. Summary & B. Endpoint Relationship */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">A. Investigation Summary</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Investigation ID:</span>
                    <span className="font-mono font-bold text-slate-800">INV-7842</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Severity:</span>
                    <span className="font-semibold text-rose-600 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-rose-500" /> Critical
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Source Endpoint:</span>
                    <span className="font-mono font-medium text-slate-800">192.168.1.45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Destination Endpoint:</span>
                    <span className="font-mono font-medium text-slate-800">8.8.8.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Protocol:</span>
                    <span className="font-mono font-bold text-slate-800">TCP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Detection Time:</span>
                    <span className="font-mono text-slate-600">17:42:18</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">B. Endpoint Relationship</h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-center">
                  <div className="flex flex-col items-center">
                    <div className="size-9 rounded-lg bg-purple-100 text-[#7030A0] flex items-center justify-center">
                      <Monitor size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-bold mt-1 text-slate-800">192.168.1.45</span>
                    <span className="text-[9px] text-slate-400">(Source)</span>
                  </div>

                  <div className="flex flex-col items-center px-1">
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-600 text-[8.5px] font-bold">
                      Suspicious Flow
                    </span>
                    <div className="w-12 h-0.5 bg-rose-400 my-1 relative">
                      <span className="absolute -right-1 -top-1 border-t-4 border-b-4 border-l-4 border-transparent border-l-rose-400" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="size-9 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                      <Server size={18} />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-slate-700">Gateway</span>
                  </div>

                  <div className="w-8 h-0.5 bg-slate-300 relative">
                    <span className="absolute -right-1 -top-1 border-t-4 border-b-4 border-l-4 border-transparent border-l-slate-400" />
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="size-9 rounded-lg bg-purple-100 text-[#7030A0] flex items-center justify-center">
                      <Globe size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-bold mt-1 text-slate-800">8.8.8.8</span>
                    <span className="text-[9px] text-slate-400">(Destination)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* C. Evidence Timeline */}
            <div className="pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-2">C. Evidence Timeline</h4>
              <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                <div className="space-y-1">
                  <div className="size-6 mx-auto rounded-full bg-purple-100 text-[#7030A0] flex items-center justify-center">
                    <Clock size={12} />
                  </div>
                  <div className="font-mono text-slate-500">17:31:00</div>
                  <div className="font-medium text-slate-700 leading-tight">Baseline Established</div>
                </div>
                <div className="space-y-1">
                  <div className="size-6 mx-auto rounded-full bg-purple-100 text-[#7030A0] flex items-center justify-center">
                    <Clock size={12} />
                  </div>
                  <div className="font-mono text-slate-500">17:36:20</div>
                  <div className="font-medium text-slate-700 leading-tight">Unusual Traffic</div>
                </div>
                <div className="space-y-1">
                  <div className="size-6 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <AlertTriangle size={12} />
                  </div>
                  <div className="font-mono text-slate-500">17:39:10</div>
                  <div className="font-semibold text-rose-600  leading-tight">Behaviour Deviation</div>
                </div>
                <div className="space-y-1">
                  <div className="size-6 mx-auto rounded-full bg-purple-100 text-[#7030A0] flex items-center justify-center">
                    <FileSearch size={12} />
                  </div>
                  <div className="font-mono text-slate-500">17:42:18</div>
                  <div className="font-medium text-slate-700 leading-tight">Investigation Opened</div>
                </div>
                <div className="space-y-1">
                  <div className="size-6 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <Clock size={12} />
                  </div>
                  <div className="font-mono text-slate-500">17:45:00</div>
                  <div className="font-medium text-slate-500 leading-tight">Review Pending</div>
                </div>
              </div>
            </div>

            {/* D. Traffic Evidence Table */}
            <div className="pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-2">D. Traffic Evidence</h4>
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-400 pb-1 border-b border-slate-100">
                    <th className="pb-1 font-semibold">Source IP</th>
                    <th className="pb-1 font-semibold">Destination IP</th>
                    <th className="pb-1 font-semibold">Protocol</th>
                    <th className="pb-1 font-semibold">Packet Count</th>
                    <th className="pb-1 font-semibold">Connection Freq</th>
                    <th className="pb-1 font-semibold text-right">Observed Dev</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  <tr>
                    <td className="py-1.5 font-mono">192.168.1.45</td>
                    <td className="py-1.5 font-mono">8.8.8.8</td>
                    <td className="py-1.5 font-mono font-medium">TCP</td>
                    <td className="py-1.5 font-mono">8,240</td>
                    <td className="py-1.5 font-mono">72/min</td>
                    <td className="py-1.5 font-bold text-rose-600 text-right">+210%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-mono">192.168.1.46</td>
                    <td className="py-1.5 font-mono">8.8.4.4</td>
                    <td className="py-1.5 font-mono font-medium">UDP</td>
                    <td className="py-1.5 font-mono">1,230</td>
                    <td className="py-1.5 font-mono">12/min</td>
                    <td className="py-1.5 font-bold text-amber-600 text-right">+80%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-mono">10.0.2.18</td>
                    <td className="py-1.5 font-mono">8.8.8.8</td>
                    <td className="py-1.5 font-mono font-medium">TCP</td>
                    <td className="py-1.5 font-mono">3,120</td>
                    <td className="py-1.5 font-mono">4.7 MB</td>
                    <td className="py-1.5 font-bold text-amber-600 text-right">+120%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* F. Analyst Workspace */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">F. Analyst Workspace</h4>
              <textarea
                value={analystNotes}
                onChange={(e) => setAnalystNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Assessment:</span>
                    <select className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800">
                      <option>Investigating</option>
                      <option>Confirmed Anomaly</option>
                      <option>False Positive</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Status:</span>
                    <select className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800">
                      <option>In Progress</option>
                      <option>Closed</option>
                      <option>Escalated</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    <Save size={13} />
                    <span>Save Notes</span>
                  </button>
                  <button className="flex items-center gap-1 rounded-xl bg-[#7030A0] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-800">
                    <CheckCircle2 size={13} />
                    <span>Mark as Reviewed</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Notice Footer */}
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-1.5 text-[10px] text-slate-400">
              <Info size={12} className="shrink-0 mt-0.5" />
              <span>Forecasts represent future attack-positive time intervals within the analysed dataset, not guaranteed real-world attack onset times.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
