import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Edit3,
  FileSearch,
  Info,
  RotateCcw,
  Search,
  Shield,
  X,
  Zap,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Card } from "../components/ui/card";
import { useAlerts } from "../context/AlertContext";

// Time-based KPI metrics and sparklines
const STATS_BY_TIME = {
  "Last 24 Hours": {
    total: 128,
    totalChange: "6%",
    totalIsUp: false,
    critical: 23,
    criticalChange: "8%",
    criticalIsUp: true,
    investigating: 34,
    investigatingChange: "3%",
    investigatingIsUp: false,
    resolved: 71,
    resolvedChange: "5%",
    resolvedIsUp: true,
    spark1: [{ v: 135 }, { v: 132 }, { v: 130 }, { v: 131 }, { v: 129 }, { v: 128 }],
    spark2: [{ v: 18 }, { v: 19 }, { v: 20 }, { v: 21 }, { v: 22 }, { v: 23 }],
    spark3: [{ v: 38 }, { v: 37 }, { v: 36 }, { v: 35 }, { v: 34 }, { v: 34 }],
    spark4: [{ v: 62 }, { v: 65 }, { v: 67 }, { v: 68 }, { v: 70 }, { v: 71 }],
    miniChart: [
      { t: "1", hist: 30, curr: 30 },
      { t: "2", hist: 32, curr: 35 },
      { t: "3", hist: 31, curr: 45 },
      { t: "4", hist: 33, curr: 85 },
      { t: "5", hist: 30, curr: 60 },
    ],
  },
  "Last 6 Hours": {
    total: 46,
    totalChange: "12%",
    totalIsUp: true,
    critical: 12,
    criticalChange: "15%",
    criticalIsUp: true,
    investigating: 15,
    investigatingChange: "5%",
    investigatingIsUp: true,
    resolved: 19,
    resolvedChange: "8%",
    resolvedIsUp: true,
    spark1: [{ v: 38 }, { v: 40 }, { v: 42 }, { v: 43 }, { v: 45 }, { v: 46 }],
    spark2: [{ v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 11 }, { v: 12 }],
    spark3: [{ v: 10 }, { v: 12 }, { v: 13 }, { v: 14 }, { v: 14 }, { v: 15 }],
    spark4: [{ v: 12 }, { v: 14 }, { v: 15 }, { v: 17 }, { v: 18 }, { v: 19 }],
    miniChart: [
      { t: "1", hist: 28, curr: 32 },
      { t: "2", hist: 30, curr: 40 },
      { t: "3", hist: 32, curr: 65 },
      { t: "4", hist: 31, curr: 92 },
      { t: "5", hist: 29, curr: 75 },
    ],
  },
  "Last 1 Hour": {
    total: 16,
    totalChange: "25%",
    totalIsUp: true,
    critical: 5,
    criticalChange: "30%",
    criticalIsUp: true,
    investigating: 6,
    investigatingChange: "10%",
    investigatingIsUp: true,
    resolved: 5,
    resolvedChange: "4%",
    resolvedIsUp: true,
    spark1: [{ v: 8 }, { v: 10 }, { v: 12 }, { v: 14 }, { v: 15 }, { v: 16 }],
    spark2: [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 4 }, { v: 5 }],
    spark3: [{ v: 3 }, { v: 4 }, { v: 4 }, { v: 5 }, { v: 5 }, { v: 6 }],
    spark4: [{ v: 2 }, { v: 3 }, { v: 3 }, { v: 4 }, { v: 4 }, { v: 5 }],
    miniChart: [
      { t: "1", hist: 25, curr: 35 },
      { t: "2", hist: 26, curr: 55 },
      { t: "3", hist: 28, curr: 82 },
      { t: "4", hist: 29, curr: 98 },
      { t: "5", hist: 27, curr: 84 },
    ],
  },
};

export interface AlertRecord {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  title: string;
  src: string;
  dst: string;
  proto: string;
  indicator: string;
  time: string;
  status: "Open" | "Acknowledged" | "Investigating" | "Resolved";
  rateDev: string;
  volVar: string;
  connFreq: string;
  flowDur: string;
  protoDist: string;
  minAgo: number;
}

const INITIAL_ALERTS: AlertRecord[] = [
  {
    id: "ALT-7842",
    severity: "Critical",
    title: "Unusual Packet Rate",
    src: "192.168.1.45",
    dst: "8.8.8.8",
    proto: "TCP",
    indicator: "Packet Rate ↑",
    time: "17:42:18",
    status: "Open",
    rateDev: "92%",
    volVar: "78%",
    connFreq: "71%",
    flowDur: "49%",
    protoDist: "63%",
    minAgo: 8,
  },
  {
    id: "ALT-7841",
    severity: "High",
    title: "Abnormal Traffic Volume",
    src: "10.0.2.18",
    dst: "8.8.8.8",
    proto: "TCP",
    indicator: "Traffic ↑",
    time: "17:40:32",
    status: "Open",
    rateDev: "68%",
    volVar: "84%",
    connFreq: "52%",
    flowDur: "60%",
    protoDist: "45%",
    minAgo: 10,
  },
  {
    id: "ALT-7840",
    severity: "Medium",
    title: "High Connection Frequency",
    src: "172.16.4.12",
    dst: "8.8.8.8",
    proto: "TCP",
    indicator: "Connections ↑",
    time: "17:38:20",
    status: "Investigating",
    rateDev: "54%",
    volVar: "45%",
    connFreq: "88%",
    flowDur: "40%",
    protoDist: "50%",
    minAgo: 12,
  },
  {
    id: "ALT-7839",
    severity: "Low",
    title: "Unexpected Protocol Distribution",
    src: "192.168.1.77",
    dst: "8.8.8.8",
    proto: "TCP/UDP",
    indicator: "TCP/UDP Mix",
    time: "17:35:11",
    status: "Acknowledged",
    rateDev: "35%",
    volVar: "30%",
    connFreq: "40%",
    flowDur: "32%",
    protoDist: "78%",
    minAgo: 15,
  },
  {
    id: "ALT-7838",
    severity: "Critical",
    title: "Multiple Behavioural Deviations",
    src: "10.0.3.27",
    dst: "8.8.8.8",
    proto: "TCP",
    indicator: "Behaviour ↑",
    time: "17:32:45",
    status: "Open",
    rateDev: "88%",
    volVar: "76%",
    connFreq: "68%",
    flowDur: "72%",
    protoDist: "65%",
    minAgo: 18,
  },
  {
    id: "ALT-7837",
    severity: "Low",
    title: "Collector Queue Telemetry Fluctuation",
    src: "10.99.2.17",
    dst: "10.0.2.53",
    proto: "UDP",
    indicator: "Telemetry ↑",
    time: "15:28:10",
    status: "Resolved",
    rateDev: "20%",
    volVar: "25%",
    connFreq: "18%",
    flowDur: "22%",
    protoDist: "30%",
    minAgo: 140,
  },
  {
    id: "ALT-7836",
    severity: "High",
    title: "Repeated SSH Authentication Probes",
    src: "192.168.1.104",
    dst: "10.0.1.9",
    proto: "TCP",
    indicator: "Auth Failures ↑",
    time: "13:21:04",
    status: "Resolved",
    rateDev: "62%",
    volVar: "40%",
    connFreq: "74%",
    flowDur: "45%",
    protoDist: "55%",
    minAgo: 260,
  },
];

interface ActivityLogItem {
  id: string;
  time: string;
  text: string;
  type: "status" | "investigation" | "note" | "resolved";
}

const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  { id: "1", time: "17:43", text: "Alert ALT-7842 acknowledged by Harsh Purohit", type: "status" },
  { id: "2", time: "17:41", text: "Investigation started (Ref: INV-7842)", type: "investigation" },
  { id: "3", time: "17:38", text: "Analyst note added: 'Checking related endpoints'", type: "note" },
  { id: "4", time: "17:35", text: "Alert marked as resolved", type: "resolved" },
];

export default function AlertsResponsePage() {
  const { activateCriticalAlert } = useAlerts();
  const [alertsList, setAlertsList] = useState<AlertRecord[]>(INITIAL_ALERTS);
  const [timeRange, setTimeRange] = useState<"Last 24 Hours" | "Last 6 Hours" | "Last 1 Hour">("Last 24 Hours");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);

  // Expandable Severities filter
  const [selectedSeverity, setSelectedSeverity] = useState<"All Severities" | "Critical" | "High" | "Medium" | "Low">("All Severities");
  const [severityDropdownOpen, setSeverityDropdownOpen] = useState(false);

  // Expandable Statuses filter
  const [selectedStatus, setSelectedStatus] = useState<"All Statuses" | "Open" | "Acknowledged" | "Investigating" | "Resolved">("All Statuses");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Pill tab filter
  const [activeTab, setActiveTab] = useState("All Alerts");
  const [selectedAlert, setSelectedAlert] = useState("ALT-7842");
  const [searchQuery, setSearchQuery] = useState("");

  // Workflow activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);
  const [workflowActionNotice, setWorkflowActionNotice] = useState<string | null>(null);

  // Note dialog state
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");

  // Activate handler
  const handleActivate = () => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const injected = activateCriticalAlert();
    const newAlert: AlertRecord = {
      id: injected.id,
      severity: "Critical",
      title: "Volumetric DDoS Threat Forecast",
      src: "192.168.1.45",
      dst: "8.8.8.8",
      proto: "TCP",
      indicator: "Packet Rate ↑ (+210%)",
      time: timestamp,
      status: "Open",
      rateDev: "96%",
      volVar: "88%",
      connFreq: "84%",
      flowDur: "65%",
      protoDist: "75%",
      minAgo: 1,
    };

    setAlertsList((prev) => [newAlert, ...prev]);
    setSelectedAlert(injected.id);

    // Append to activity log
    const nowTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    setActivityLogs((prev) => [
      { id: String(Date.now()), time: nowTime, text: `Critical Alert ${injected.id} activated in simulated session`, type: "status" },
      ...prev,
    ]);
  };

  // Workflow Action Handlers
  const handleUpdateStatus = (newStatus: "Open" | "Acknowledged" | "Investigating" | "Resolved", actionLabel: string, type: ActivityLogItem["type"]) => {
    setAlertsList((prev) =>
      prev.map((a) => (a.id === selectedAlert ? { ...a, status: newStatus } : a))
    );

    const nowTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    const logText =
      newStatus === "Acknowledged"
        ? `Alert ${selectedAlert} acknowledged by Analyst`
        : newStatus === "Investigating"
        ? `Investigation started for ${selectedAlert} (Ref: INV-${selectedAlert.replace("ALT-", "")})`
        : newStatus === "Resolved"
        ? `Alert ${selectedAlert} marked as resolved`
        : `Alert ${selectedAlert} reopened as New`;

    setActivityLogs((prev) => [{ id: String(Date.now()), time: nowTime, text: logText, type }, ...prev]);

    setWorkflowActionNotice(`${actionLabel} — Status: ${newStatus}`);
    setTimeout(() => setWorkflowActionNotice(null), 2500);
  };

  const handleSaveAnalystNote = () => {
    if (!newNoteText.trim()) return;
    const nowTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    setActivityLogs((prev) => [
      {
        id: String(Date.now()),
        time: nowTime,
        text: `Analyst note added for ${selectedAlert}: '${newNoteText.trim()}'`,
        type: "note",
      },
      ...prev,
    ]);
    setNewNoteText("");
    setShowNoteInput(false);
    setWorkflowActionNotice("Analyst note saved successfully");
    setTimeout(() => setWorkflowActionNotice(null), 2500);
  };

  const filterTabs = [
    "All Alerts",
    "Critical",
    "High",
    "Medium",
    "Low",
    "Open",
    "Acknowledged",
    "Resolved",
  ];

  // Active time statistics
  const currentStats = STATS_BY_TIME[timeRange];

  // Combined alert list filtered by chosen time interval
  const timeFilteredAlerts = useMemo(() => {
    if (timeRange === "Last 1 Hour") {
      return alertsList.filter((a) => a.minAgo <= 60);
    }
    if (timeRange === "Last 6 Hours") {
      return alertsList.filter((a) => a.minAgo <= 360);
    }
    return alertsList;
  }, [alertsList, timeRange]);

  // Dynamically filtered alerts based on dropdowns, tabs, and searchQuery
  const filteredAlerts = useMemo(() => {
    return timeFilteredAlerts.filter((item) => {
      // 1. Severity Dropdown
      const matchesSeverity =
        selectedSeverity === "All Severities" || item.severity === selectedSeverity;

      // 2. Status Dropdown
      const matchesStatus =
        selectedStatus === "All Statuses" || item.status === selectedStatus;

      // 3. Tab filter
      let matchesTab = true;
      if (activeTab === "Critical") matchesTab = item.severity === "Critical";
      else if (activeTab === "High") matchesTab = item.severity === "High";
      else if (activeTab === "Medium") matchesTab = item.severity === "Medium";
      else if (activeTab === "Low") matchesTab = item.severity === "Low";
      else if (activeTab === "Open") matchesTab = item.status === "Open";
      else if (activeTab === "Acknowledged") matchesTab = item.status === "Acknowledged";
      else if (activeTab === "Resolved") matchesTab = item.status === "Resolved";

      // 4. Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.src.toLowerCase().includes(q) ||
        item.dst.toLowerCase().includes(q) ||
        item.proto.toLowerCase().includes(q) ||
        item.indicator.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q);

      return matchesSeverity && matchesStatus && matchesTab && matchesSearch;
    });
  }, [timeFilteredAlerts, selectedSeverity, selectedStatus, activeTab, searchQuery]);

  // Current selected alert details
  const activeAlertDetail = useMemo(() => {
    return alertsList.find((a) => a.id === selectedAlert) || alertsList[0] || INITIAL_ALERTS[0];
  }, [alertsList, selectedAlert]);

  // Helper for workflow step progression
  const getWorkflowStepIndex = (status: AlertRecord["status"]) => {
    switch (status) {
      case "Open":
        return 1;
      case "Acknowledged":
        return 2;
      case "Investigating":
        return 3;
      case "Resolved":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getWorkflowStepIndex(activeAlertDetail.status);

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setTimeDropdownOpen((v) => !v);
                setSeverityDropdownOpen(false);
                setStatusDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <Clock size={13} className="text-[#7030A0]" />
              <span className="font-semibold text-slate-900">{timeRange}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {timeDropdownOpen && (
              <div className="absolute left-0 top-9 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                {(["Last 24 Hours", "Last 6 Hours", "Last 1 Hour"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTimeRange(t);
                      setTimeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      timeRange === t ? "bg-purple-50 text-[#7030A0] font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Expandable Severities Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setSeverityDropdownOpen((v) => !v);
                setTimeDropdownOpen(false);
                setStatusDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors ${
                selectedSeverity !== "All Severities"
                  ? "bg-purple-50 border-purple-200 text-[#7030A0] font-semibold"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{selectedSeverity}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {severityDropdownOpen && (
              <div className="absolute left-0 top-9 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                {(["All Severities", "Critical", "High", "Medium", "Low"] as const).map((sev) => {
                  const isSel = selectedSeverity === sev;
                  return (
                    <button
                      key={sev}
                      onClick={() => {
                        setSelectedSeverity(sev);
                        setSeverityDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isSel ? "bg-purple-50 text-[#7030A0] font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {sev === "Critical" && <span className="size-1.5 rounded-full bg-rose-500" />}
                        {sev === "High" && <span className="size-1.5 rounded-full bg-orange-500" />}
                        {sev === "Medium" && <span className="size-1.5 rounded-full bg-amber-500" />}
                        {sev === "Low" && <span className="size-1.5 rounded-full bg-emerald-500" />}
                        {sev}
                      </span>
                      {isSel && <Check size={12} className="text-[#7030A0]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Expandable Statuses Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setStatusDropdownOpen((v) => !v);
                setTimeDropdownOpen(false);
                setSeverityDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors ${
                selectedStatus !== "All Statuses"
                  ? "bg-purple-50 border-purple-200 text-[#7030A0] font-semibold"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>{selectedStatus}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {statusDropdownOpen && (
              <div className="absolute left-0 top-9 z-30 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                {(["All Statuses", "Open", "Acknowledged", "Investigating", "Resolved"] as const).map((st) => {
                  const isSel = selectedStatus === st;
                  return (
                    <button
                      key={st}
                      onClick={() => {
                        setSelectedStatus(st);
                        setStatusDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isSel ? "bg-purple-50 text-[#7030A0] font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`size-1.5 rounded-full ${
                            st === "Open"
                              ? "bg-purple-500"
                              : st === "Acknowledged"
                              ? "bg-amber-500"
                              : st === "Investigating"
                              ? "bg-blue-500"
                              : st === "Resolved"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {st}
                      </span>
                      {isSel && <Check size={12} className="text-[#7030A0]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setTimeRange("Last 24 Hours");
              setSelectedSeverity("All Severities");
              setSelectedStatus("All Statuses");
              setActiveTab("All Alerts");
              setSearchQuery("");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
          >
            <RotateCcw size={13} className="text-slate-500" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Activate Critical Alert Button */}
          <button
            type="button"
            onClick={handleActivate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors cursor-pointer active:scale-95 animate-pulse"
          >
            <Zap size={14} fill="#FFFFFF" />
            <span>Activate</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const rows = alertsList.map((a) => `${a.id},${a.severity},${a.title},${a.status}`).join("\n");
              const blob = new Blob([`ID,Severity,Title,Status\n${rows}`], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `alerts_${timeRange.replace(/\s+/g, "_")}.csv`;
              link.click();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download size={13} className="text-slate-500" />
            <span>Export ⌵</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 cards) - Dynamically reacts to timeRange */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Alerts */}
        <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Total Alerts</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {currentStats.total + (alertsList.length - INITIAL_ALERTS.length)}
                </div>
              </div>
            </div>
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                currentStats.totalIsUp ? "text-emerald-600 bg-emerald-50" : "text-slate-600 bg-slate-50"
              }`}
            >
              {currentStats.totalIsUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {currentStats.totalChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeRange} data={currentStats.spark1}>
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
                  {currentStats.critical + (alertsList.length - INITIAL_ALERTS.length)}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              {currentStats.criticalChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeRange} data={currentStats.spark2}>
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">{currentStats.investigating}</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {currentStats.investigatingIsUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {currentStats.investigatingChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeRange} data={currentStats.spark3}>
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">{currentStats.resolved}</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              {currentStats.resolvedChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeRange} data={currentStats.spark4}>
                <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 3. Main Area: Alert Management Queue (Left 60%) + Alert Details (Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Alert Queue & Workflow */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card: Alert Management Queue */}
          <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
                <h3 className="text-sm font-bold text-slate-900">Alert Management Queue</h3>
                <span className="text-[11px] font-mono text-slate-400">({filteredAlerts.length})</span>
              </div>

              {/* Table search input */}
              <div className="relative w-48">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search alerts or IP..."
                  className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-6 text-[11px] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs Row */}
            <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-slate-100 text-[11px]">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#7030A0] text-white font-semibold shadow-xs"
                      : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 pb-2">
                    <th className="pb-2 font-semibold">Alert ID</th>
                    <th className="pb-2 font-semibold">Severity</th>
                    <th className="pb-2 font-semibold">Alert Title</th>
                    <th className="pb-2 font-semibold">Source</th>
                    <th className="pb-2 font-semibold">Indicator</th>
                    <th className="pb-2 font-semibold">Timestamp</th>
                    <th className="pb-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {filteredAlerts.map((alert) => {
                    const isSelected = selectedAlert === alert.id;
                    const isCritical = alert.severity === "Critical";
                    const isHigh = alert.severity === "High";
                    const isMedium = alert.severity === "Medium";

                    return (
                      <tr
                        key={alert.id}
                        onClick={() => setSelectedAlert(alert.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-purple-50/80 font-medium" : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className={`py-2.5 font-mono font-bold ${isSelected ? "text-[#7030A0]" : "text-slate-900"}`}>
                          {alert.id}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${
                              isCritical
                                ? "text-rose-600"
                                : isHigh
                                ? "text-orange-600"
                                : isMedium
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                isCritical
                                  ? "bg-rose-500 animate-pulse"
                                  : isHigh
                                  ? "bg-orange-500"
                                  : isMedium
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                            {alert.severity}
                          </span>
                        </td>
                        <td className="py-2.5 font-medium max-w-[130px] truncate">{alert.title}</td>
                        <td className="py-2.5 font-mono text-slate-600">{alert.src}</td>
                        <td className="py-2.5 text-slate-500">{alert.indicator}</td>
                        <td className="py-2.5 font-mono text-slate-500">{alert.time}</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              alert.status === "Open"
                                ? "bg-purple-100 text-[#7030A0]"
                                : alert.status === "Investigating"
                                ? "bg-blue-50 text-blue-700"
                                : alert.status === "Acknowledged"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {alert.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAlerts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400">
                        No alerts match the criteria for {timeRange}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Showing {filteredAlerts.length} alerts for {timeRange}</span>
              <span className="font-mono text-purple-700">Selected: {activeAlertDetail.id}</span>
            </div>
          </Card>

          {/* Bottom Cards: Response Workflow + Recent Alert Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card: Response Workflow (Fully Functional) */}
            <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
                    <h4 className="text-xs font-bold text-slate-900">Response Workflow</h4>
                  </div>
                  {workflowActionNotice && (
                    <span className="text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full animate-fade-in">
                      ✓ {workflowActionNotice}
                    </span>
                  )}
                </div>

                {/* 4 Interactive Workflow Progression Steps with Connectors */}
                <div className="flex items-center justify-between py-2 text-[10px]">
                  {/* Step 1: New */}
                  <div
                    onClick={() => handleUpdateStatus("Open", "Reopened", "status")}
                    className="flex flex-col items-center cursor-pointer group flex-1"
                  >
                    <div
                      className={`size-8 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= 1
                          ? "bg-[#7030A0] text-white shadow-xs"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Shield size={14} />
                    </div>
                    <span className="font-bold text-slate-800 mt-1">New</span>
                  </div>

                  <div className={`h-0.5 flex-1 transition-all ${currentStep >= 2 ? "bg-[#7030A0]" : "bg-slate-200"}`} />

                  {/* Step 2: Acknowledged */}
                  <div
                    onClick={() => handleUpdateStatus("Acknowledged", "Acknowledged Alert", "status")}
                    className="flex flex-col items-center cursor-pointer group flex-1"
                  >
                    <div
                      className={`size-8 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= 2
                          ? "bg-[#7030A0] text-white shadow-xs"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Check size={14} />
                    </div>
                    <span className={`mt-1 ${currentStep >= 2 ? "font-bold text-slate-800" : "text-slate-500 font-medium"}`}>
                      Acknowledged
                    </span>
                  </div>

                  <div className={`h-0.5 flex-1 transition-all ${currentStep >= 3 ? "bg-[#7030A0]" : "bg-slate-200"}`} />

                  {/* Step 3: Under Investigation */}
                  <div
                    onClick={() => handleUpdateStatus("Investigating", "Started Investigation", "investigation")}
                    className="flex flex-col items-center cursor-pointer group flex-1"
                  >
                    <div
                      className={`size-8 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= 3
                          ? "bg-[#7030A0] text-white shadow-xs"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <FileSearch size={14} />
                    </div>
                    <span className={`mt-1 ${currentStep >= 3 ? "font-bold text-slate-800" : "text-slate-500 font-medium"}`}>
                      Investigating
                    </span>
                  </div>

                  <div className={`h-0.5 flex-1 transition-all ${currentStep >= 4 ? "bg-emerald-500" : "bg-slate-200"}`} />

                  {/* Step 4: Resolved */}
                  <div
                    onClick={() => handleUpdateStatus("Resolved", "Resolved Threat", "resolved")}
                    className="flex flex-col items-center cursor-pointer group flex-1"
                  >
                    <div
                      className={`size-8 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= 4
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <CheckCircle2 size={14} />
                    </div>
                    <span className={`mt-1 ${currentStep >= 4 ? "font-bold text-emerald-700" : "text-slate-500 font-medium"}`}>
                      Resolved
                    </span>
                  </div>
                </div>

                {/* Inline Analyst Note input if active */}
                {showNoteInput && (
                  <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveAnalystNote()}
                      placeholder="Add analyst note..."
                      className="flex-1 text-[11px] bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveAnalystNote}
                      className="px-2.5 py-1 bg-[#7030A0] text-white rounded-lg text-[10.5px] font-semibold hover:bg-purple-800"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNoteInput(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* 4 Working Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-3 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("Acknowledged", "Acknowledged Alert", "status")}
                  className={`rounded-lg px-2 py-1.5 text-[10.5px] font-semibold transition-all cursor-pointer ${
                    activeAlertDetail.status === "Acknowledged"
                      ? "bg-amber-100 text-amber-800 border border-amber-300 shadow-xs"
                      : "bg-[#7030A0] text-white hover:bg-purple-800"
                  }`}
                >
                  ✓ Acknowledge
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus("Investigating", "Started Investigation", "investigation")}
                  className={`rounded-lg border px-2 py-1.5 text-[10.5px] font-semibold transition-all cursor-pointer ${
                    activeAlertDetail.status === "Investigating"
                      ? "bg-blue-100 text-blue-800 border-blue-300"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Start Investigation
                </button>

                <button
                  type="button"
                  onClick={() => setShowNoteInput((v) => !v)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Edit3 size={11} />
                  <span>Add Note</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus("Resolved", "Marked as Resolved", "resolved")}
                  className={`rounded-lg px-2 py-1.5 text-[10.5px] font-semibold transition-all cursor-pointer ${
                    activeAlertDetail.status === "Resolved"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  ✓ Resolve
                </button>
              </div>
            </Card>

            {/* Card: Recent Alert Activity (Real-time Timeline) */}
            <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
                  <h4 className="text-xs font-bold text-slate-900">Recent Alert Activity</h4>
                </div>

                <div className="space-y-2.5 text-xs max-h-36 overflow-y-auto pr-1">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2">
                      <span
                        className={`size-1.5 rounded-full mt-1.5 shrink-0 ${
                          log.type === "resolved"
                            ? "bg-emerald-600"
                            : log.type === "investigation"
                            ? "bg-blue-600"
                            : log.type === "note"
                            ? "bg-amber-500"
                            : "bg-[#7030A0]"
                        }`}
                      />
                      <div className="leading-tight">
                        <div className="font-medium text-slate-800">{log.text}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 mt-2 flex justify-between">
                <span>Active Target: {activeAlertDetail.id}</span>
                <span className="font-semibold text-purple-700">Status: {activeAlertDetail.status}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Alert Details Workspace */}
        <div className="lg:col-span-5">
          <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
                <h3 className="text-sm font-bold text-slate-900">Alert Details — {activeAlertDetail.id}</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                  activeAlertDetail.severity === "Critical"
                    ? "bg-rose-100 text-rose-700"
                    : activeAlertDetail.severity === "High"
                    ? "bg-orange-100 text-orange-700"
                    : activeAlertDetail.severity === "Medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {activeAlertDetail.severity}
              </span>
            </div>

            {/* Alert Overview */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Alert Overview</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Alert ID:</span>
                  <div className="font-mono font-bold text-slate-800">{activeAlertDetail.id}</div>
                </div>
                <div>
                  <span className="text-slate-400">First Observed:</span>
                  <div className="font-mono text-slate-800">{activeAlertDetail.time}</div>
                </div>
                <div>
                  <span className="text-slate-400">Source Endpoint:</span>
                  <div className="font-mono text-slate-800">{activeAlertDetail.src}</div>
                </div>
                <div>
                  <span className="text-slate-400">Destination Endpoint:</span>
                  <div className="font-mono text-slate-800">{activeAlertDetail.dst}</div>
                </div>
                <div>
                  <span className="text-slate-400">Protocol:</span>
                  <div className="font-mono font-semibold text-slate-800">{activeAlertDetail.proto}</div>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <div className="font-semibold text-purple-700">{activeAlertDetail.status}</div>
                </div>
              </div>
            </div>

            {/* Supporting Indicators */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Supporting Indicators ({timeRange})</h4>
              <div className="space-y-2">
                {[
                  { label: "Packet Rate Deviation", val: activeAlertDetail.rateDev },
                  { label: "Traffic Volume Variation", val: activeAlertDetail.volVar },
                  { label: "Connection Frequency", val: activeAlertDetail.connFreq },
                  { label: "Flow Duration", val: activeAlertDetail.flowDur },
                  { label: "Protocol Distribution", val: activeAlertDetail.protoDist },
                ].map((ind) => (
                  <div key={ind.label} className="space-y-0.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600">{ind.label}</span>
                      <span className="font-bold text-slate-900">{ind.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7030A0] rounded-full transition-all duration-300"
                        style={{ width: ind.val }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Sparkline mini comparison */}
              <div className="mt-3 h-16 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart key={timeRange} data={currentStats.miniChart}>
                    <Line type="monotone" dataKey="hist" stroke="#94A3B8" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="curr" stroke="#F43F5E" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommended Analyst Actions */}
            <div className="pt-2 border-t border-slate-100 text-xs">
              <h4 className="font-bold text-slate-900 mb-1.5">Recommended Analyst Actions</h4>
              <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                <li>Review supporting traffic evidence for {activeAlertDetail.src}.</li>
                <li>Inspect related endpoints in Network Observatory.</li>
                <li>Compare with baseline behaviour in Behaviour Intelligence.</li>
                <li>Escalate if anomalous rate continues into future windows.</li>
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2 text-[10px] text-slate-500">
              <Info size={13} className="shrink-0 mt-0.5 text-[#7030A0]" />
              <span>Alerts are generated based on simulated network behaviour and represent illustrative threat data.</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
