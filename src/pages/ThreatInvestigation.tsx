import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
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
  X,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Card } from "../components/ui/card";

type TimeFilterOption = "Last 24 Hours" | "Last 6 Hours" | "Last 1 Hour";

const STATS_BY_TIME: Record<
  TimeFilterOption,
  {
    total: number;
    totalChange: string;
    open: number;
    openChange: string;
    highPriority: number;
    highChange: string;
    resolved: number;
    resolvedChange: string;
    spark1: { v: number }[];
    spark2: { v: number }[];
    spark3: { v: number }[];
    spark4: { v: number }[];
    allowedCaseIds: string[];
  }
> = {
  "Last 24 Hours": {
    total: 24,
    totalChange: "+6%",
    open: 8,
    openChange: "+1%",
    highPriority: 5,
    highChange: "+2%",
    resolved: 16,
    resolvedChange: "+3%",
    spark1: [{ v: 20 }, { v: 21 }, { v: 23 }, { v: 22 }, { v: 23 }, { v: 24 }],
    spark2: [{ v: 7 }, { v: 7.5 }, { v: 7 }, { v: 7.8 }, { v: 7.9 }, { v: 8 }],
    spark3: [{ v: 4 }, { v: 4.2 }, { v: 4.8 }, { v: 4.5 }, { v: 4.9 }, { v: 5 }],
    spark4: [{ v: 14 }, { v: 14.5 }, { v: 15 }, { v: 15.2 }, { v: 15.8 }, { v: 16 }],
    allowedCaseIds: [
      "INV-7842",
      "INV-7841",
      "INV-7840",
      "INV-7839",
      "INV-7838",
      "INV-7837",
      "INV-7836",
    ],
  },
  "Last 6 Hours": {
    total: 14,
    totalChange: "+12%",
    open: 5,
    openChange: "+4%",
    highPriority: 3,
    highChange: "+8%",
    resolved: 9,
    resolvedChange: "+15%",
    spark1: [{ v: 8 }, { v: 10 }, { v: 11 }, { v: 12 }, { v: 13 }, { v: 14 }],
    spark2: [{ v: 3 }, { v: 3.5 }, { v: 4 }, { v: 4 }, { v: 4.5 }, { v: 5 }],
    spark3: [{ v: 1 }, { v: 1.5 }, { v: 2 }, { v: 2.2 }, { v: 2.8 }, { v: 3 }],
    spark4: [{ v: 5 }, { v: 6 }, { v: 7 }, { v: 7.5 }, { v: 8 }, { v: 9 }],
    allowedCaseIds: [
      "INV-7842",
      "INV-7841",
      "INV-7840",
      "INV-7839",
      "INV-7838",
    ],
  },
  "Last 1 Hour": {
    total: 6,
    totalChange: "+25%",
    open: 3,
    openChange: "+18%",
    highPriority: 2,
    highChange: "+33%",
    resolved: 3,
    resolvedChange: "+10%",
    spark1: [{ v: 2 }, { v: 3 }, { v: 4 }, { v: 4 }, { v: 5 }, { v: 6 }],
    spark2: [{ v: 1 }, { v: 1.5 }, { v: 2 }, { v: 2.2 }, { v: 2.8 }, { v: 3 }],
    spark3: [{ v: 0.5 }, { v: 1 }, { v: 1.2 }, { v: 1.5 }, { v: 1.8 }, { v: 2 }],
    spark4: [{ v: 1 }, { v: 1.5 }, { v: 2 }, { v: 2.2 }, { v: 2.7 }, { v: 3 }],
    allowedCaseIds: [
      "INV-7842",
      "INV-7841",
      "INV-7840",
    ],
  },
};

interface EvidenceRow {
  srcIp: string;
  dstIp: string;
  protocol: string;
  packets: string;
  connFreq: string;
  observedDev: string;
  isHigh?: boolean;
}

interface TimelineItem {
  time: string;
  label: string;
  iconType: "clock" | "alert" | "search" | "check";
  highlight?: boolean;
}

interface CaseItem {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  title: string;
  endpoint: string;
  firstObserved: string;
  analyst: string;
  status: "Open" | "In Progress" | "Resolved";
  destEndpoint: string;
  protocol: string;
  detectionTime: string;
  assessment: string;
  notes: string;
  timeline: TimelineItem[];
  evidence: EvidenceRow[];
}

const INITIAL_CASES: CaseItem[] = [
  {
    id: "INV-7842",
    severity: "Critical",
    title: "Unusual Connection Frequency",
    endpoint: "192.168.1.45",
    firstObserved: "17:42:18",
    analyst: "HP",
    status: "Open",
    destEndpoint: "8.8.8.8",
    protocol: "TCP",
    detectionTime: "17:42:18",
    assessment: "Investigating",
    notes: "Investigating repeated high connection attempts to external domain. Monitoring for further activity...",
    timeline: [
      { time: "17:31:00", label: "Baseline Established", iconType: "clock" },
      { time: "17:36:20", label: "Unusual Traffic Observed", iconType: "clock" },
      { time: "17:39:10", label: "Behavioural Deviation Identified", iconType: "alert", highlight: true },
      { time: "17:42:18", label: "Investigation Opened", iconType: "search" },
      { time: "17:45:00", label: "Analyst Review Pending", iconType: "clock" },
    ],
    evidence: [
      { srcIp: "192.168.1.45", dstIp: "8.8.8.8", protocol: "TCP", packets: "8,240", connFreq: "72/min", observedDev: "+210%", isHigh: true },
      { srcIp: "192.168.1.46", dstIp: "8.8.4.4", protocol: "UDP", packets: "1,230", connFreq: "12/min", observedDev: "+80%" },
      { srcIp: "10.0.2.18", dstIp: "8.8.8.8", protocol: "TCP", packets: "3,120", connFreq: "4.7 MB", observedDev: "+120%" },
    ],
  },
  {
    id: "INV-7841",
    severity: "High",
    title: "Abnormal Traffic Volume",
    endpoint: "10.0.2.18",
    firstObserved: "17:38:50",
    analyst: "RG",
    status: "Open",
    destEndpoint: "172.217.16.206",
    protocol: "TCP",
    detectionTime: "17:38:50",
    assessment: "Investigating",
    notes: "High egress data transfer detected over short 10-minute window. Destination verified as external cloud CDN.",
    timeline: [
      { time: "17:20:00", label: "Baseline Egress Verified", iconType: "clock" },
      { time: "17:29:15", label: "Traffic Volume Spike +140%", iconType: "alert", highlight: true },
      { time: "17:34:00", label: "Heuristic Anomaly Flagged", iconType: "search" },
      { time: "17:38:50", label: "Case Automatically Opened", iconType: "search" },
      { time: "17:41:00", label: "Under Egress Audit", iconType: "clock" },
    ],
    evidence: [
      { srcIp: "10.0.2.18", dstIp: "172.217.16.206", protocol: "TCP", packets: "14,500", connFreq: "95/min", observedDev: "+165%", isHigh: true },
      { srcIp: "10.0.2.19", dstIp: "172.217.16.206", protocol: "TCP", packets: "2,400", connFreq: "20/min", observedDev: "+35%" },
    ],
  },
  {
    id: "INV-7840",
    severity: "Medium",
    title: "Suspicious Protocol Distribution",
    endpoint: "172.16.4.12",
    firstObserved: "17:35:12",
    analyst: "SG",
    status: "In Progress",
    destEndpoint: "104.244.42.1",
    protocol: "UDP",
    detectionTime: "17:35:12",
    assessment: "Investigating",
    notes: "Out-of-band UDP datagram burst on non-standard ephemeral ports. Host firewall rules being verified.",
    timeline: [
      { time: "17:15:00", label: "Routine Port Scan Pass", iconType: "clock" },
      { time: "17:28:40", label: "Unregistered Port Syn/Ack", iconType: "alert", highlight: true },
      { time: "17:32:00", label: "Protocol Ratio Shift", iconType: "search" },
      { time: "17:35:12", label: "Analyst Assigned (SG)", iconType: "clock" },
      { time: "17:40:00", label: "Firewall Trace In-flight", iconType: "clock" },
    ],
    evidence: [
      { srcIp: "172.16.4.12", dstIp: "104.244.42.1", protocol: "UDP", packets: "6,800", connFreq: "54/min", observedDev: "+145%", isHigh: true },
      { srcIp: "172.16.4.12", dstIp: "1.1.1.1", protocol: "DNS/UDP", packets: "4,100", connFreq: "45/min", observedDev: "+90%" },
    ],
  },
  {
    id: "INV-7839",
    severity: "Critical",
    title: "Repeated Packet Rate Deviation",
    endpoint: "192.168.1.77",
    firstObserved: "16:32:20",
    analyst: "DN",
    status: "Open",
    destEndpoint: "45.33.32.156",
    protocol: "TCP",
    detectionTime: "16:32:20",
    assessment: "Confirmed Anomaly",
    notes: "Sustained high packet transmission rates exceeding 3x the daily mean. Potential distributed scan participant.",
    timeline: [
      { time: "16:10:00", label: "Baseline Transmission Range", iconType: "clock" },
      { time: "16:22:15", label: "Rate Acceleration > 2,000 p/s", iconType: "alert", highlight: true },
      { time: "16:27:00", label: "Cross-Subnet Alert Trigger", iconType: "search" },
      { time: "16:32:20", label: "Prioritized Critical Queue", iconType: "search" },
      { time: "16:35:00", label: "Host Quarantined in Sandbox", iconType: "clock" },
    ],
    evidence: [
      { srcIp: "192.168.1.77", dstIp: "45.33.32.156", protocol: "TCP", packets: "28,400", connFreq: "180/min", observedDev: "+290%", isHigh: true },
      { srcIp: "192.168.1.77", dstIp: "192.168.1.1", protocol: "TCP", packets: "5,600", connFreq: "40/min", observedDev: "+65%" },
    ],
  },
  {
    id: "INV-7838",
    severity: "Low",
    title: "Multiple Behavioural Anomalies",
    endpoint: "10.0.3.27",
    firstObserved: "15:28:55",
    analyst: "TP",
    status: "Resolved",
    destEndpoint: "10.0.3.1",
    protocol: "TCP",
    detectionTime: "15:28:55",
    assessment: "False Positive",
    notes: "Scheduled backup script executed outside regular window. Validated with systems administrator. No risk.",
    timeline: [
      { time: "15:05:00", label: "Baseline Snapshot", iconType: "clock" },
      { time: "15:18:00", label: "Backup Initiated", iconType: "clock" },
      { time: "15:25:00", label: "Volume Threshold Exceeded", iconType: "alert" },
      { time: "15:28:55", label: "Case Opened", iconType: "search" },
      { time: "15:35:00", label: "Admin Authorized / Closed", iconType: "check", highlight: true },
    ],
    evidence: [
      { srcIp: "10.0.3.27", dstIp: "10.0.3.1", protocol: "TCP", packets: "9,100", connFreq: "25/min", observedDev: "+15%" },
      { srcIp: "10.0.3.27", dstIp: "10.0.3.50", protocol: "SMB", packets: "18,200", connFreq: "30/min", observedDev: "+20%" },
    ],
  },
  {
    id: "INV-7837",
    severity: "High",
    title: "External Beaconing Sequence",
    endpoint: "10.0.1.14",
    firstObserved: "11:12:08",
    analyst: "HP",
    status: "In Progress",
    destEndpoint: "185.220.101.5",
    protocol: "HTTPS",
    detectionTime: "11:12:08",
    assessment: "Investigating",
    notes: "Periodic keep-alive packets matching known C2 beacon jitter interval. TLS SNI inspection underway.",
    timeline: [
      { time: "11:00:00", label: "Periodic Pulse Began", iconType: "clock" },
      { time: "11:08:20", label: "Fixed Cadence 120s Detected", iconType: "alert", highlight: true },
      { time: "11:12:08", label: "Automated Ticket Dispatched", iconType: "search" },
      { time: "11:15:00", label: "Certificate Fingerprinting", iconType: "clock" },
    ],
    evidence: [
      { srcIp: "10.0.1.14", dstIp: "185.220.101.5", protocol: "HTTPS", packets: "3,890", connFreq: "30/min", observedDev: "+110%", isHigh: true },
      { srcIp: "10.0.1.14", dstIp: "1.1.1.1", protocol: "DNS", packets: "820", connFreq: "15/min", observedDev: "+40%" },
    ],
  },
  {
    id: "INV-7836",
    severity: "Critical",
    title: "Distributed SYN Flood Pulse",
    endpoint: "192.168.1.105",
    firstObserved: "08:45:10",
    analyst: "RG",
    status: "Resolved",
    destEndpoint: "203.0.113.195",
    protocol: "TCP",
    detectionTime: "08:45:10",
    assessment: "Confirmed Anomaly",
    notes: "Inbound SYN packet burst mitigated at upstream perimeter firewall. Signature rules added to rate limiter.",
    timeline: [
      { time: "08:35:00", label: "Initial SYN Surge", iconType: "clock" },
      { time: "08:40:15", label: "Half-Open Connection Saturation", iconType: "alert", highlight: true },
      { time: "08:45:10", label: "Incident Escalated to Tier 2", iconType: "search" },
      { time: "08:55:00", label: "Null Route Applied / Mitigated", iconType: "check", highlight: true },
    ],
    evidence: [
      { srcIp: "192.168.1.105", dstIp: "203.0.113.195", protocol: "TCP", packets: "52,000", connFreq: "450/min", observedDev: "+320%", isHigh: true },
      { srcIp: "192.168.1.106", dstIp: "203.0.113.195", protocol: "TCP", packets: "38,200", connFreq: "310/min", observedDev: "+240%", isHigh: true },
    ],
  },
];

export default function ThreatInvestigationPage() {
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState("INV-7842");
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>("Last 24 Hours");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const currentStat = STATS_BY_TIME[timeFilter] || STATS_BY_TIME["Last 24 Hours"];

  // Cases filtered by active time range (always includes newly created cases)
  const timeFilteredCases = useMemo(() => {
    return cases.filter((c) => {
      const isAllowed = currentStat.allowedCaseIds.includes(c.id);
      const isNewlyCreated = !INITIAL_CASES.some((ic) => ic.id === c.id);
      return isAllowed || isNewlyCreated;
    });
  }, [cases, currentStat]);

  // Cases filtered by search and severity within active time range
  const filteredCases = useMemo(() => {
    return timeFilteredCases.filter((c) => {
      const matchSearch =
        searchTerm === "" ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.analyst.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.status.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSeverity =
        severityFilter === "All" || c.severity.toLowerCase() === severityFilter.toLowerCase();

      return matchSearch && matchSeverity;
    });
  }, [timeFilteredCases, searchTerm, severityFilter]);

  // Selected case item (falls back smoothly when switching time filter)
  const selectedCase = useMemo(() => {
    return (
      filteredCases.find((c) => c.id === selectedCaseId) ||
      timeFilteredCases.find((c) => c.id === selectedCaseId) ||
      filteredCases[0] ||
      timeFilteredCases[0] ||
      cases[0]
    );
  }, [filteredCases, timeFilteredCases, cases, selectedCaseId]);

  // Handle case notes edit
  const handleUpdateNotes = (text: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === selectedCase.id ? { ...c, notes: text } : c))
    );
  };

  // Handle assessment change
  const handleAssessmentChange = (val: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === selectedCase.id ? { ...c, assessment: val } : c))
    );
  };

  // Handle status change
  const handleStatusChange = (val: "Open" | "In Progress" | "Resolved") => {
    setCases((prev) =>
      prev.map((c) => (c.id === selectedCase.id ? { ...c, status: val } : c))
    );
  };

  // Save Notes action
  const handleSaveNotes = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  // Mark as reviewed
  const handleMarkAsReviewed = () => {
    setCases((prev) =>
      prev.map((c) => (c.id === selectedCase.id ? { ...c, status: "Resolved" } : c))
    );
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  // Create new investigation
  const handleCreateNew = () => {
    const newId = `INV-${Math.floor(7850 + Math.random() * 100)}`;
    const newCase: CaseItem = {
      id: newId,
      severity: "Critical",
      title: "Active Anomaly Investigation",
      endpoint: "192.168.1.99",
      firstObserved: "17:46:00",
      analyst: "YOU",
      status: "Open",
      destEndpoint: "142.250.190.46",
      protocol: "TCP",
      detectionTime: "17:46:00",
      assessment: "Investigating",
      notes: "Manual investigation started by security analyst for suspicious network activity.",
      timeline: [
        { time: "17:45:00", label: "Trigger Incident Detected", iconType: "alert", highlight: true },
        { time: "17:46:00", label: "Investigation Created", iconType: "search" },
      ],
      evidence: [
        { srcIp: "192.168.1.99", dstIp: "142.250.190.46", protocol: "TCP", packets: "5,400", connFreq: "60/min", observedDev: "+180%", isHigh: true },
      ],
    };

    setCases((prev) => [newCase, ...prev]);
    setSelectedCaseId(newId);
  };

  // Reactive metric counts combining time-bucket baselines + live user changes
  const isInitialCaseInBucket = (id: string) => currentStat.allowedCaseIds.includes(id);
  const addedCases = cases.filter((c) => !INITIAL_CASES.some((ic) => ic.id === c.id));
  const initialBucketCases = INITIAL_CASES.filter((c) => isInitialCaseInBucket(c.id));
  const currentBucketCases = cases.filter((c) => isInitialCaseInBucket(c.id));

  const totalCount = currentStat.total + addedCases.length;
  const openCount = Math.max(
    0,
    currentStat.open +
      (currentBucketCases.filter((c) => c.status === "Open").length -
        initialBucketCases.filter((c) => c.status === "Open").length) +
      addedCases.filter((c) => c.status === "Open").length
  );
  const highPriorityCount = Math.max(
    0,
    currentStat.highPriority +
      (currentBucketCases.filter((c) => c.severity === "Critical" || c.severity === "High").length -
        initialBucketCases.filter((c) => c.severity === "Critical" || c.severity === "High").length) +
      addedCases.filter((c) => c.severity === "Critical" || c.severity === "High").length
  );
  const resolvedCount = Math.max(
    0,
    currentStat.resolved +
      (currentBucketCases.filter((c) => c.status === "Resolved").length -
        initialBucketCases.filter((c) => c.status === "Resolved").length) +
      addedCases.filter((c) => c.status === "Resolved").length
  );

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SIMULATED ENVIRONMENT</span>
          </div>

          <span className="text-slate-300">|</span>

          {/* Severity Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setFilterDropdownOpen((v) => !v);
                setTimeDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-medium px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Filter size={13} className="text-[#7030A0]" />
              <span>Filter: {severityFilter === "All" ? "All Severities" : severityFilter}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {filterDropdownOpen && (
              <div className="absolute left-0 top-8 z-30 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                {["All", "Critical", "High", "Medium", "Low"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => {
                      setSeverityFilter(sev);
                      setFilterDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      severityFilter === sev ? "bg-purple-50 text-[#7030A0] font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {sev === "Critical" && <span className="size-1.5 rounded-full bg-rose-500" />}
                      {sev === "High" && <span className="size-1.5 rounded-full bg-orange-500" />}
                      {sev === "Medium" && <span className="size-1.5 rounded-full bg-amber-500" />}
                      {sev === "Low" && <span className="size-1.5 rounded-full bg-emerald-500" />}
                      {sev === "All" ? "All Severities" : sev}
                    </span>
                    {severityFilter === sev && <Check size={12} className="text-[#7030A0]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-slate-300">|</span>

          {/* Time Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setTimeDropdownOpen((v) => !v);
                setFilterDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-medium px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Clock size={13} className="text-[#7030A0]" />
              <span className="font-semibold text-slate-800">{timeFilter}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {timeDropdownOpen && (
              <div className="absolute left-0 top-8 z-30 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                {(["Last 24 Hours", "Last 6 Hours", "Last 1 Hour"] as TimeFilterOption[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTimeFilter(t);
                      setTimeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      timeFilter === t ? "bg-purple-50 text-[#7030A0] font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{t}</span>
                    {timeFilter === t && <Check size={12} className="text-[#7030A0]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#7030A0] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-800 transition-colors cursor-pointer active:scale-95"
        >
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">{totalCount}</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              {currentStat.totalChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeFilter} data={currentStat.spark1}>
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">{openCount}</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              {currentStat.openChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeFilter} data={currentStat.spark2}>
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">{highPriorityCount}</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              {currentStat.highChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeFilter} data={currentStat.spark3}>
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
                <div className="text-xl font-bold text-slate-900 mt-0.5">{resolvedCount}</div>
              </div>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} />
              {currentStat.resolvedChange}
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key={timeFilter} data={currentStat.spark4}>
                <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 3. Main Section: Investigation Queue + Detail Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Investigation Queue (5 cols) */}
        <Card className="lg:col-span-5 p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
                <h3 className="text-sm font-bold text-slate-900">Investigation Queue</h3>
                <span className="text-[11px] font-mono font-semibold text-slate-400">({filteredCases.length})</span>
              </div>
              <div className="relative w-44">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search investigations..."
                  className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-7 text-[11px] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-400 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={11} />
                  </button>
                )}
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
                  {filteredCases.map((c) => {
                    const isSelected = selectedCase.id === c.id;
                    const isCritical = c.severity === "Critical";
                    const isHigh = c.severity === "High";
                    const isMedium = c.severity === "Medium";

                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCaseId(c.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-purple-50/80 font-medium" : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className={`py-2.5 font-mono font-bold ${isSelected ? "text-[#7030A0]" : "text-slate-900"}`}>
                          {c.id}
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
                                  ? "bg-rose-500"
                                  : isHigh
                                  ? "bg-orange-500"
                                  : isMedium
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                            {c.severity}
                          </span>
                        </td>
                        <td className="py-2.5 font-medium max-w-[130px] truncate">{c.title}</td>
                        <td className="py-2.5 font-mono text-slate-600">{c.endpoint}</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              c.status === "Open"
                                ? "bg-purple-100 text-[#7030A0]"
                                : c.status === "In Progress"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredCases.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No investigations match the current filter or search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Showing {filteredCases.length} of {timeFilteredCases.length} records ({timeFilter})</span>
            <span className="font-mono text-purple-700">Selected: {selectedCase.id}</span>
          </div>
        </Card>

        {/* Right: Case Detail & Analyst Workspace (7 cols) */}
        <Card className="lg:col-span-7 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl overflow-hidden flex flex-col justify-between">
          <div>
            {/* Dark Purple Header */}
            <div className="bg-[#5B21B6] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="font-bold text-sm tracking-wide flex items-center gap-2">
                <span>{selectedCase.id}</span>
                <span>|</span>
                <span className="font-medium text-purple-100">{selectedCase.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-white font-bold text-[10.5px] ${
                    selectedCase.severity === "Critical"
                      ? "bg-rose-500"
                      : selectedCase.severity === "High"
                      ? "bg-orange-500"
                      : selectedCase.severity === "Medium"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                >
                  {selectedCase.severity}
                </span>
                <select
                  value={selectedCase.status}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  className="px-2.5 py-0.5 rounded-lg bg-purple-900/80 text-white font-medium text-[10.5px] hover:bg-purple-900 border border-purple-400/40 focus:outline-none cursor-pointer"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
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
                      <span className="font-mono font-bold text-[#7030A0]">{selectedCase.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Severity:</span>
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          selectedCase.severity === "Critical"
                            ? "text-rose-600"
                            : selectedCase.severity === "High"
                            ? "text-orange-600"
                            : selectedCase.severity === "Medium"
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            selectedCase.severity === "Critical"
                              ? "bg-rose-500"
                              : selectedCase.severity === "High"
                              ? "bg-orange-500"
                              : selectedCase.severity === "Medium"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                        />
                        {selectedCase.severity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Source Endpoint:</span>
                      <span className="font-mono font-medium text-slate-800">{selectedCase.endpoint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Destination Endpoint:</span>
                      <span className="font-mono font-medium text-slate-800">{selectedCase.destEndpoint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Protocol:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedCase.protocol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Detection Time:</span>
                      <span className="font-mono text-slate-600">{selectedCase.detectionTime}</span>
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
                      <span className="text-[10px] font-mono font-bold mt-1 text-slate-800">{selectedCase.endpoint}</span>
                      <span className="text-[9px] text-slate-400">(Source)</span>
                    </div>

                    <div className="flex flex-col items-center px-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold ${
                          selectedCase.severity === "Critical"
                            ? "bg-rose-100 text-rose-600"
                            : selectedCase.severity === "High"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-purple-100 text-[#7030A0]"
                        }`}
                      >
                        {selectedCase.severity === "Critical" || selectedCase.severity === "High"
                          ? "Suspicious Flow"
                          : "Monitored Flow"}
                      </span>
                      <div
                        className={`w-12 h-0.5 my-1 relative ${
                          selectedCase.severity === "Critical"
                            ? "bg-rose-400"
                            : selectedCase.severity === "High"
                            ? "bg-orange-400"
                            : "bg-[#7030A0]"
                        }`}
                      >
                        <span
                          className={`absolute -right-1 -top-1 border-t-4 border-b-4 border-l-4 border-transparent ${
                            selectedCase.severity === "Critical"
                              ? "border-l-rose-400"
                              : selectedCase.severity === "High"
                              ? "border-l-orange-400"
                              : "border-l-[#7030A0]"
                          }`}
                        />
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
                      <span className="text-[10px] font-mono font-bold mt-1 text-slate-800">{selectedCase.destEndpoint}</span>
                      <span className="text-[9px] text-slate-400">(Destination)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* C. Evidence Timeline */}
              <div className="pb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-2">C. Evidence Timeline</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-center text-[10px]">
                  {selectedCase.timeline.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div
                        className={`size-6 mx-auto rounded-full flex items-center justify-center ${
                          item.highlight
                            ? "bg-rose-100 text-rose-600 font-bold ring-2 ring-rose-200"
                            : item.iconType === "check"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-purple-100 text-[#7030A0]"
                        }`}
                      >
                        {item.iconType === "alert" ? (
                          <AlertTriangle size={12} />
                        ) : item.iconType === "search" ? (
                          <FileSearch size={12} />
                        ) : item.iconType === "check" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                      </div>
                      <div className="font-mono text-slate-500">{item.time}</div>
                      <div className={`leading-tight ${item.highlight ? "font-semibold text-rose-600" : "font-medium text-slate-700"}`}>
                        {item.label}
                      </div>
                    </div>
                  ))}
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
                    {selectedCase.evidence.map((ev, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-1.5 font-mono">{ev.srcIp}</td>
                        <td className="py-1.5 font-mono">{ev.dstIp}</td>
                        <td className="py-1.5 font-mono font-medium">{ev.protocol}</td>
                        <td className="py-1.5 font-mono">{ev.packets}</td>
                        <td className="py-1.5 font-mono">{ev.connFreq}</td>
                        <td
                          className={`py-1.5 font-bold text-right ${
                            ev.isHigh ? "text-rose-600" : "text-amber-600"
                          }`}
                        >
                          {ev.observedDev}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* F. Analyst Workspace */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900">F. Analyst Workspace</h4>
                  {savedNotification && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Check size={12} /> Changes Saved Successfully
                    </span>
                  )}
                </div>
                <textarea
                  value={selectedCase.notes}
                  onChange={(e) => handleUpdateNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-purple-500"
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Assessment:</span>
                      <select
                        value={selectedCase.assessment}
                        onChange={(e) => handleAssessmentChange(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none"
                      >
                        <option value="Investigating">Investigating</option>
                        <option value="Confirmed Anomaly">Confirmed Anomaly</option>
                        <option value="False Positive">False Positive</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Status:</span>
                      <select
                        value={selectedCase.status}
                        onChange={(e) => handleStatusChange(e.target.value as any)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveNotes}
                      className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer active:scale-95"
                    >
                      <Save size={13} />
                      <span>Save Notes</span>
                    </button>
                    <button
                      onClick={handleMarkAsReviewed}
                      className="flex items-center gap-1 rounded-xl bg-[#7030A0] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-800 transition-colors cursor-pointer active:scale-95"
                    >
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
          </div>
        </Card>
      </div>
    </div>
  );
}
