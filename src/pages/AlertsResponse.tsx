import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Info,
  Search,
  ShieldAlert,
  X,
  Zap,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Card } from "../components/ui/card";
import { useAlerts } from "../context/AlertContext";

const SPARK_1 = [{ v: 135 }, { v: 132 }, { v: 130 }, { v: 131 }, { v: 129 }, { v: 128 }];
const SPARK_2 = [{ v: 18 }, { v: 19 }, { v: 20 }, { v: 21 }, { v: 22 }, { v: 23 }];
const SPARK_3 = [{ v: 38 }, { v: 37 }, { v: 36 }, { v: 35 }, { v: 34 }, { v: 34 }];
const SPARK_4 = [{ v: 62 }, { v: 65 }, { v: 67 }, { v: 68 }, { v: 70 }, { v: 71 }];

const MINI_ALERT_CHART = [
  { t: "1", hist: 30, curr: 30 },
  { t: "2", hist: 32, curr: 35 },
  { t: "3", hist: 31, curr: 45 },
  { t: "4", hist: 33, curr: 85 }, // Spike
  { t: "5", hist: 30, curr: 60 },
];

export default function AlertsResponsePage() {
  const { activateCriticalAlert } = useAlerts();
  const [activeTab, setActiveTab] = useState("All Alerts (128)");
  const [selectedAlert, setSelectedAlert] = useState("ALT-7842");
  const [criticalNotifications, setCriticalNotifications] = useState<
    Array<{
      id: string;
      severity: string;
      title: string;
      source: string;
      indicator: string;
      timestamp: string;
      status: string;
    }>
  >([]);

  const handleActivate = () => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const injected = activateCriticalAlert();
    const newAlert = {
      id: injected.id,
      severity: "Critical",
      title: "Volumetric DDoS Threat Forecast",
      source: "192.168.1.45",
      indicator: "Packet Rate ↑ (+210%)",
      timestamp,
      status: "Open",
    };
    setCriticalNotifications((prev) => [newAlert, ...prev]);
    setSelectedAlert(injected.id);
  };

  const filterTabs = [
    "All Alerts (128)",
    "Critical (23)",
    "Elevated (41)",
    "Informational (64)",
    "Open (60)",
    "Acknowledged (38)",
    "Resolved (30)",
  ];

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer">
            <Clock size={13} className="text-slate-400" />
            <span>Last 24 Hours</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer">
            <span>All Severities</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer">
            <span>All Statuses</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Activate Button — just left of Export button */}
          <button
            type="button"
            onClick={handleActivate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-xs shadow-md shadow-rose-500/25 hover:from-rose-500 hover:to-red-500 active:scale-95 transition-all cursor-pointer"
            title="Inject Critical Alert Notification"
          >
            <Zap size={13} className="fill-white animate-pulse" />
            <span>Activate</span>
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer text-xs">
            <Download size={13} className="text-slate-500" />
            <span>Export ⌵</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Alerts */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Info size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Total Alerts</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {128 + criticalNotifications.length}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowDownRight size={13} />
              6%
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

        {/* Critical Alerts */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Critical Alerts</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {23 + criticalNotifications.length}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              8%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_2}>
                <Line type="monotone" dataKey="v" stroke="#F43F5E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Under Investigation */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <Search size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Under Investigation</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">34</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowDownRight size={13} />
              3%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARK_3}>
                <Line type="monotone" dataKey="v" stroke="#7030A0" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Resolved Alerts */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Resolved Alerts</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">71</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              5%
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

      {/* 3. Middle Section: Alert Management Queue + Alert Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Alert Queue (7 cols) */}
        <Card className="lg:col-span-7 p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
            <h3 className="text-sm font-bold text-slate-900">Alert Management Queue</h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-slate-100">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#7030A0] text-white font-semibold shadow-xs"
                    : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 pb-2">
                  <th className="pb-2 font-semibold">Alert ID</th>
                  <th className="pb-2 font-semibold">Severity</th>
                  <th className="pb-2 font-semibold">Alert Title</th>
                  <th className="pb-2 font-semibold">Source Endpoint</th>
                  <th className="pb-2 font-semibold">Indicator</th>
                  <th className="pb-2 font-semibold">Timestamp</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {/* Dynamically Injected Critical Notifications */}
                {criticalNotifications.map((crit) => (
                  <tr
                    key={crit.id}
                    onClick={() => setSelectedAlert(crit.id)}
                    className={`cursor-pointer transition-colors bg-rose-50/80 border-l-4 border-rose-500 ${
                      selectedAlert === crit.id ? "bg-rose-100/90" : "hover:bg-rose-100/60"
                    }`}
                  >
                    <td className="py-2.5 font-mono font-bold text-rose-950 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-rose-600 animate-ping" />
                      {crit.id}
                    </td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                        <span className="size-1.5 rounded-full bg-rose-500" />
                        Critical
                      </span>
                    </td>
                    <td className="py-2.5 font-medium text-rose-950">{crit.title}</td>
                    <td className="py-2.5 font-mono text-slate-600">{crit.source}</td>
                    <td className="py-2.5 text-rose-700 font-semibold">{crit.indicator}</td>
                    <td className="py-2.5 font-mono text-slate-500">{crit.timestamp}</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700 animate-pulse">
                        {crit.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button className="px-2 py-0.5 rounded text-[10px] font-semibold text-white bg-rose-600 hover:bg-rose-700">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                <tr
                  onClick={() => setSelectedAlert("ALT-7842")}
                  className={`cursor-pointer transition-colors ${
                    selectedAlert === "ALT-7842" ? "bg-purple-50/70" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="py-2.5 font-mono font-bold text-slate-900">ALT-7842</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Critical
                    </span>
                  </td>
                  <td className="py-2.5 font-medium">Unusual Packet Rate</td>
                  <td className="py-2.5 font-mono text-slate-600">192.168.1.45</td>
                  <td className="py-2.5 text-slate-500">Packet Rate ↑</td>
                  <td className="py-2.5 font-mono text-slate-500">17:42:18</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-[#7030A0]">
                      Open
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button className="px-2 py-0.5 rounded text-[10px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100">
                      View
                    </button>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedAlert("ALT-7841")}
                  className={`cursor-pointer transition-colors ${
                    selectedAlert === "ALT-7841" ? "bg-purple-50/70" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="py-2.5 font-mono font-bold text-slate-900">ALT-7841</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-700">
                      <span className="size-1.5 rounded-full bg-[#7030A0]" />
                      Elevated
                    </span>
                  </td>
                  <td className="py-2.5 font-medium">Abnormal Traffic Volume</td>
                  <td className="py-2.5 font-mono text-slate-600">10.0.2.18</td>
                  <td className="py-2.5 text-slate-500">Traffic ↑</td>
                  <td className="py-2.5 font-mono text-slate-500">17:40:32</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-[#7030A0]">
                      Open
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button className="px-2 py-0.5 rounded text-[10px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100">
                      View
                    </button>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedAlert("ALT-7840")}
                  className={`cursor-pointer transition-colors ${
                    selectedAlert === "ALT-7840" ? "bg-purple-50/70" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="py-2.5 font-mono font-bold text-slate-900">ALT-7840</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-700">
                      <span className="size-1.5 rounded-full bg-[#7030A0]" />
                      Elevated
                    </span>
                  </td>
                  <td className="py-2.5 font-medium">High Connection Frequency</td>
                  <td className="py-2.5 font-mono text-slate-600">172.16.4.12</td>
                  <td className="py-2.5 text-slate-500">Connections ↑</td>
                  <td className="py-2.5 font-mono text-slate-500">17:38:20</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 text-cyan-700">
                      Investigating
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button className="px-2 py-0.5 rounded text-[10px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100">
                      View
                    </button>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedAlert("ALT-7839")}
                  className={`cursor-pointer transition-colors ${
                    selectedAlert === "ALT-7839" ? "bg-purple-50/70" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="py-2.5 font-mono font-bold text-slate-900">ALT-7839</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Info
                    </span>
                  </td>
                  <td className="py-2.5 font-medium">Unexpected Protocol Distribution</td>
                  <td className="py-2.5 font-mono text-slate-600">192.168.1.77</td>
                  <td className="py-2.5 text-slate-500">TCP/UDP Mix</td>
                  <td className="py-2.5 font-mono text-slate-500">17:35:11</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700">
                      Acknowledged
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button className="px-2 py-0.5 rounded text-[10px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100">
                      View
                    </button>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedAlert("ALT-7838")}
                  className={`cursor-pointer transition-colors ${
                    selectedAlert === "ALT-7838" ? "bg-purple-50/70" : "hover:bg-slate-50/60"
                  }`}
                >
                  <td className="py-2.5 font-mono font-bold text-slate-900">ALT-7838</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Critical
                    </span>
                  </td>
                  <td className="py-2.5 font-medium">Multiple Behavioural Deviations</td>
                  <td className="py-2.5 font-mono text-slate-600">10.0.3.27</td>
                  <td className="py-2.5 text-slate-500">Behaviour ↑</td>
                  <td className="py-2.5 font-mono text-slate-500">17:32:45</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-[#7030A0]">
                      Open
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button className="px-2 py-0.5 rounded text-[10px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right: Alert Details (5 cols) */}
        <Card className="lg:col-span-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl overflow-hidden">
          <div className="bg-[#5B21B6] text-white px-5 py-3 flex items-center justify-between">
            <h3 className="font-bold text-sm">Alert Details — {selectedAlert}</h3>
            <button className="text-white/80 hover:text-white">
              <X size={15} />
            </button>
          </div>

          <div className="p-4 space-y-3.5 text-xs">
            <div className="pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Alert Overview</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                <div>
                  <span className="text-slate-400">Alert ID: </span>
                  <span className="font-mono font-bold text-slate-800">ALT-7842</span>
                </div>
                <div>
                  <span className="text-slate-400">First Observed: </span>
                  <span className="font-mono text-slate-700">17:42:18</span>
                </div>
                <div>
                  <span className="text-slate-400">Severity: </span>
                  <span className="font-semibold text-rose-600">● Critical</span>
                </div>
                <div>
                  <span className="text-slate-400">Source Endpoint: </span>
                  <span className="font-mono text-slate-700">192.168.1.45</span>
                </div>
                <div>
                  <span className="text-slate-400">Title: </span>
                  <span className="font-medium text-slate-800">Unusual Packet Rate</span>
                </div>
                <div>
                  <span className="text-slate-400">Destination Endpoint: </span>
                  <span className="font-mono text-slate-700">8.8.8.8</span>
                </div>
                <div>
                  <span className="text-slate-400">Protocol: </span>
                  <span className="font-mono font-semibold text-slate-700">TCP</span>
                </div>
                <div>
                  <span className="text-slate-400">Status: </span>
                  <span className="font-semibold text-[#7030A0]">Open</span>
                </div>
              </div>
            </div>

            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900">Supporting Indicators</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-[#7030A0]" /> Historical
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-rose-500" /> Current
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="space-y-1.5">
                  {[
                    { label: "Packet Rate Deviation", val: "92%" },
                    { label: "Traffic Volume Variation", val: "78%" },
                    { label: "Connection Frequency", val: "71%" },
                    { label: "Flow Duration", val: "49%" },
                    { label: "Protocol Distribution", val: "63%" },
                  ].map((ind) => (
                    <div key={ind.label} className="space-y-0.5">
                      <div className="flex justify-between text-[10.5px]">
                        <span className="text-slate-500">{ind.label}</span>
                        <span className="font-bold text-slate-800">{ind.val}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7030A0] rounded-full" style={{ width: ind.val }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MINI_ALERT_CHART}>
                      <Line type="monotone" dataKey="hist" stroke="#7030A0" strokeWidth={1.8} dot={false} />
                      <Line type="monotone" dataKey="curr" stroke="#F43F5E" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Event Timeline</h4>
              <div className="grid grid-cols-5 gap-1 text-center text-[9.5px]">
                <div>
                  <div className="size-4 mx-auto rounded-full bg-purple-100 text-[#7030A0] flex items-center justify-center font-bold">✓</div>
                  <div className="mt-1 font-medium text-slate-700">Baseline</div>
                  <div className="font-mono text-slate-400">16:20</div>
                </div>
                <div>
                  <div className="size-4 mx-auto rounded-full bg-purple-100 text-[#7030A0] flex items-center justify-center font-bold">✓</div>
                  <div className="mt-1 font-medium text-slate-700">Unusual</div>
                  <div className="font-mono text-slate-400">17:10</div>
                </div>
                <div>
                  <div className="size-4 mx-auto rounded-full bg-purple-100 text-[#7030A0] flex items-center justify-center font-bold">✓</div>
                  <div className="mt-1 font-medium text-slate-700">Generated</div>
                  <div className="font-mono text-slate-400">17:42</div>
                </div>
                <div>
                  <div className="size-4 mx-auto rounded-full bg-purple-100 text-[#7030A0] flex items-center justify-center font-bold">✓</div>
                  <div className="mt-1 font-medium text-slate-700">Ack'd</div>
                  <div className="font-mono text-slate-400">17:43</div>
                </div>
                <div>
                  <div className="size-4 mx-auto rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">!</div>
                  <div className="mt-1 font-semibold text-rose-600">Investigating</div>
                  <div className="font-mono text-slate-400">—</div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">Recommended Analyst Actions</h4>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                <li>Review supporting traffic evidence.</li>
                <li>Inspect related endpoints.</li>
                <li>Compare with historical behaviour.</li>
                <li>Escalate if suspicious activity persists.</li>
              </ul>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-400 flex items-start gap-1">
              <Info size={12} className="shrink-0 mt-0.5" />
              <span>Note: Alerts are based on simulated network behaviour and represent illustrative data.</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Bottom Row: Response Workflow + Recent Alert Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Response Workflow (7 cols) */}
        <Card className="lg:col-span-7 p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Response Workflow</h3>
            </div>

            <div className="flex items-center justify-between max-w-lg mx-auto py-2">
              <div className="flex flex-col items-center">
                <div className="size-9 rounded-full bg-purple-100 text-[#7030A0] flex items-center justify-center font-bold">
                  <ShieldAlert size={18} />
                </div>
                <span className="text-xs font-semibold text-slate-800 mt-1.5">New</span>
              </div>
              <div className="flex-1 h-0.5 bg-purple-200 mx-2" />

              <div className="flex flex-col items-center">
                <div className="size-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 size={18} />
                </div>
                <span className="text-xs font-semibold text-slate-800 mt-1.5">Acknowledged</span>
              </div>
              <div className="flex-1 h-0.5 bg-purple-200 mx-2" />

              <div className="flex flex-col items-center">
                <div className="size-9 rounded-full bg-purple-100 text-[#7030A0] flex items-center justify-center font-bold">
                  <Search size={18} />
                </div>
                <span className="text-xs font-semibold text-slate-800 mt-1.5">Under Investigation</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200 mx-2" />

              <div className="flex flex-col items-center">
                <div className="size-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 size={18} />
                </div>
                <span className="text-xs font-semibold text-slate-800 mt-1.5">Resolved</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 mt-4 text-xs">
            <button className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50/50 px-3 py-1.5 font-semibold text-[#7030A0] hover:bg-purple-100">
              <CheckCircle2 size={13} />
              <span>Acknowledge Alert</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">
              <Search size={13} />
              <span>Start Investigation</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">
              <FileText size={13} />
              <span>Add Analyst Note</span>
            </button>
            <button className="ml-auto flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 font-semibold text-white hover:bg-emerald-700">
              <CheckCircle2 size={13} />
              <span>Mark as Resolved</span>
            </button>
          </div>
        </Card>

        {/* Right: Recent Alert Activity (5 cols) */}
        <Card className="lg:col-span-5 p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
            <h3 className="text-sm font-bold text-slate-900">Recent Alert Activity</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="font-mono text-slate-400 font-medium shrink-0 pt-0.5">17:43</span>
              <div className="size-2 rounded-full bg-[#7030A0] mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">Alert ALT-7842 acknowledged</p>
                <span className="text-[11px] text-slate-500">by Harsh Purohit</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="font-mono text-slate-400 font-medium shrink-0 pt-0.5">17:41</span>
              <div className="size-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">Investigation started</p>
                <span className="text-[11px] text-[#7030A0] font-mono">(Ref: INV-7842)</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="font-mono text-slate-400 font-medium shrink-0 pt-0.5">17:38</span>
              <div className="size-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">Analyst note added:</p>
                <span className="text-[11px] text-slate-500 italic">'Checking related endpoints'</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="font-mono text-slate-400 font-medium shrink-0 pt-0.5">17:35</span>
              <div className="size-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800">Alert marked as resolved</p>
                <span className="text-[11px] text-slate-500">Normal traffic baseline restored</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
