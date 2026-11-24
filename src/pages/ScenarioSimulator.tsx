import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Database,
  Info,
  Lightbulb,
  Loader2,
  Play,
  RotateCcw,
  Save,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../components/ui/card";

// Baseline curves (T1 to T10)
const BASELINE_CHART_DATA = [
  { t: "T1", pktRate: 50, volume: 38, connFreq: 28, flowDur: 30 },
  { t: "T2", pktRate: 54, volume: 40, connFreq: 30, flowDur: 32 },
  { t: "T3", pktRate: 52, volume: 42, connFreq: 32, flowDur: 34 },
  { t: "T4", pktRate: 48, volume: 39, connFreq: 29, flowDur: 31 },
  { t: "T5", pktRate: 55, volume: 45, connFreq: 34, flowDur: 35 },
  { t: "T6", pktRate: 53, volume: 43, connFreq: 33, flowDur: 33 },
  { t: "T7", pktRate: 50, volume: 40, connFreq: 30, flowDur: 30 },
  { t: "T8", pktRate: 58, volume: 48, connFreq: 38, flowDur: 36 },
  { t: "T9", pktRate: 54, volume: 44, connFreq: 35, flowDur: 34 },
  { t: "T10", pktRate: 52, volume: 42, connFreq: 32, flowDur: 32 },
];

export default function ScenarioSimulatorPage() {
  const [selectedPreset, setSelectedPreset] = useState("Traffic Surge");
  const [packetMultiplier, setPacketMultiplier] = useState(50);
  const [volumeMultiplier, setVolumeMultiplier] = useState(60);
  const [connMultiplier, setConnMultiplier] = useState(45);
  const [flowMultiplier, setFlowMultiplier] = useState(30);
  const [isSimulating, setIsSimulating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

  const presets = [
    {
      title: "Normal Network Activity",
      desc: "Stable and expected traffic.",
      icon: Activity,
      pkt: 0,
      vol: 0,
      conn: 0,
      flow: 0,
    },
    {
      title: "Traffic Surge",
      desc: "Increased network traffic.",
      icon: TrendingUp,
      pkt: 50,
      vol: 60,
      conn: 45,
      flow: 30,
    },
    {
      title: "Unusual Connection Frequency",
      desc: "More connections than usual.",
      icon: Share2,
      pkt: 25,
      vol: 20,
      conn: 85,
      flow: 15,
    },
    {
      title: "Suspicious Packet Pattern",
      desc: "Unusual packet behaviour.",
      icon: AlertTriangle,
      pkt: 80,
      vol: 35,
      conn: 30,
      flow: 70,
    },
    {
      title: "Combined Behavioural Anomaly",
      desc: "Multiple indicators active.",
      icon: Sparkles,
      pkt: 75,
      vol: 80,
      conn: 70,
      flow: 65,
    },
  ];

  const handleSelectPreset = (p: (typeof presets)[number]) => {
    setSelectedPreset(p.title);
    setPacketMultiplier(p.pkt);
    setVolumeMultiplier(p.vol);
    setConnMultiplier(p.conn);
    setFlowMultiplier(p.flow);
  };

  const handleReset = () => {
    setPacketMultiplier(0);
    setVolumeMultiplier(0);
    setConnMultiplier(0);
    setFlowMultiplier(0);
    setSelectedPreset("Normal Network Activity");
  };

  // Run simulation animation
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      // Slight variation simulation effect
      setPacketMultiplier((v) => Math.min(100, Math.max(0, v + Math.floor(Math.random() * 5) - 2)));
      setVolumeMultiplier((v) => Math.min(100, Math.max(0, v + Math.floor(Math.random() * 5) - 2)));
    }, 700);
  };

  const handleSaveScenario = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Dynamically calculated risk
  const modifiedRisk = useMemo(() => {
    const raw = 28 + (packetMultiplier * 0.3 + volumeMultiplier * 0.25 + connMultiplier * 0.3 + flowMultiplier * 0.15);
    return Math.min(99, Math.round(raw));
  }, [packetMultiplier, volumeMultiplier, connMultiplier, flowMultiplier]);

  const riskDiff = modifiedRisk - 28;

  const classification = useMemo(() => {
    if (modifiedRisk > 75) return { label: "Critical Risk", color: "text-rose-600 bg-rose-50 border-rose-200" };
    if (modifiedRisk >= 40) return { label: "Elevated Risk", color: "text-[#7030A0] bg-purple-50 border-purple-200" };
    return { label: "Normal Risk", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  }, [modifiedRisk]);

  // Dynamically scaled modified chart curve
  const modifiedChartData = useMemo(() => {
    return BASELINE_CHART_DATA.map((item) => {
      const pkt = Math.min(100, Math.round(item.pktRate * (1 + packetMultiplier / 100)));
      const vol = Math.min(100, Math.round(item.volume * (1 + volumeMultiplier / 100)));
      const conn = Math.min(100, Math.round(item.connFreq * (1 + connMultiplier / 100)));
      const flow = Math.min(100, Math.round(item.flowDur * (1 + flowMultiplier / 100)));

      return {
        t: item.t,
        pktRate: pkt,
        volume: vol,
        connFreq: conn,
        flowDur: flow,
        surgeFill: pkt,
      };
    });
  }, [packetMultiplier, volumeMultiplier, connMultiplier, flowMultiplier]);

  const protocolDistPct = Math.round((packetMultiplier + connMultiplier) / 4);

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex items-center gap-2">
          {/* Scenario Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPresetDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
            >
              <span>Scenario: {selectedPreset}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {presetDropdownOpen && (
              <div className="absolute left-0 top-9 z-30 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                {presets.map((p) => (
                  <button
                    key={p.title}
                    onClick={() => {
                      handleSelectPreset(p);
                      setPresetDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedPreset === p.title ? "bg-purple-50 text-[#7030A0] font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer active:scale-95"
          >
            <RotateCcw size={13} className="text-slate-500" />
            <span>Reset Scenario</span>
          </button>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#7030A0] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-800 transition-colors cursor-pointer active:scale-95 disabled:opacity-75"
        >
          {isSimulating ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Play size={13} fill="#FFFFFF" />
              <span>Run Simulation ⌵</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Scenario Presets Row */}
      <Card className="p-4 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
          <h3 className="text-sm font-bold text-slate-900">Scenario Presets</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {presets.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedPreset === preset.title;
            return (
              <div
                key={preset.title}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? "border-[#7030A0] bg-purple-50/50 shadow-xs ring-1 ring-[#7030A0]"
                    : "border-slate-200/80 bg-white hover:bg-slate-50/60"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 size-4 rounded-full bg-[#7030A0] text-white flex items-center justify-center text-[10px]">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
                <div className="size-8 rounded-lg bg-purple-50 text-[#7030A0] flex items-center justify-center mb-2">
                  <Icon size={16} />
                </div>
                <div className="font-bold text-xs text-slate-900 leading-tight">{preset.title}</div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{preset.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Middle Row: Network Traffic Controls + Scenario Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Network Traffic Controls */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
            <h3 className="text-sm font-bold text-slate-900">Network Traffic Controls</h3>
          </div>

          <div className="space-y-4">
            {/* Packet Rate */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Activity size={14} className="text-[#7030A0]" />
                  Packet Rate
                </span>
                <span className="font-bold text-slate-900">
                  {500 + Math.round((500 * packetMultiplier) / 100)} p/s{" "}
                  <span className="text-rose-600 font-semibold">(↑ +{packetMultiplier}%)</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={packetMultiplier}
                onChange={(e) => {
                  setPacketMultiplier(Number(e.target.value));
                  setSelectedPreset("Custom Controls");
                }}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#7030A0]"
              />
              <span className="text-[10px] text-slate-400">Baseline: 500 p/s</span>
            </div>

            {/* Traffic Volume */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Database size={14} className="text-[#7030A0]" />
                  Traffic Volume
                </span>
                <span className="font-bold text-slate-900">
                  {(2.0 + (2.0 * volumeMultiplier) / 100).toFixed(1)} GB{" "}
                  <span className="text-rose-600 font-semibold">(↑ +{volumeMultiplier}%)</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeMultiplier}
                onChange={(e) => {
                  setVolumeMultiplier(Number(e.target.value));
                  setSelectedPreset("Custom Controls");
                }}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#7030A0]"
              />
              <span className="text-[10px] text-slate-400">Baseline: 2.0 GB</span>
            </div>

            {/* Connection Frequency */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Share2 size={14} className="text-[#7030A0]" />
                  Connection Frequency
                </span>
                <span className="font-bold text-slate-900">
                  {1034 + Math.round((1034 * connMultiplier) / 100)} / min{" "}
                  <span className="text-rose-600 font-semibold">(↑ +{connMultiplier}%)</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={connMultiplier}
                onChange={(e) => {
                  setConnMultiplier(Number(e.target.value));
                  setSelectedPreset("Custom Controls");
                }}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#7030A0]"
              />
              <span className="text-[10px] text-slate-400">Baseline: 1,034 / min</span>
            </div>

            {/* Average Flow Duration */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Clock size={14} className="text-[#7030A0]" />
                  Average Flow Duration
                </span>
                <span className="font-bold text-slate-900">
                  {(11.5 + (11.5 * flowMultiplier) / 100).toFixed(1)} min{" "}
                  <span className="text-rose-600 font-semibold">(↑ +{flowMultiplier}%)</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={flowMultiplier}
                onChange={(e) => {
                  setFlowMultiplier(Number(e.target.value));
                  setSelectedPreset("Custom Controls");
                }}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#7030A0]"
              />
              <span className="text-[10px] text-slate-400">Baseline: 11.5 min</span>
            </div>
          </div>
        </Card>

        {/* Right: Scenario Risk Analysis */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Scenario Risk Analysis</h3>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-medium">Baseline Risk</span>
                <div className="text-2xl font-extrabold text-slate-800 mt-0.5">28 / 100</div>
                <span className="inline-flex mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Normal
                </span>
              </div>

              <div className="text-slate-300">
                <ArrowRight size={22} />
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Modified Scenario Risk</span>
                <div className="text-2xl font-extrabold text-[#7030A0] mt-0.5">{modifiedRisk} / 100</div>
                <span
                  className={`inline-flex mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    modifiedRisk > 75
                      ? "bg-rose-100 text-rose-700"
                      : modifiedRisk >= 40
                      ? "bg-purple-100 text-[#7030A0]"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {modifiedRisk > 75 ? "Critical" : modifiedRisk >= 40 ? "Elevated" : "Normal"}
                </span>
              </div>

              <div className="border-l border-slate-200/80 pl-4">
                <span className="text-xs text-slate-400 font-medium">Risk Difference</span>
                <div
                  className={`text-2xl font-extrabold mt-0.5 flex items-center gap-1 ${
                    riskDiff > 0 ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {riskDiff > 0 ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                  {riskDiff >= 0 ? `+${riskDiff}` : riskDiff}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`mt-4 p-2.5 rounded-xl border text-center text-xs font-semibold flex items-center justify-center gap-1.5 ${classification.color}`}
          >
            <Info size={14} />
            <span>Scenario Classification: {classification.label}</span>
          </div>
        </Card>
      </div>

      {/* 4. Comparison Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
        {/* Chart 1: Baseline Network Behaviour */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h3 className="text-xs font-bold text-slate-900">Baseline Network Behaviour</h3>
            <div className="flex items-center gap-3 text-[10.5px] text-slate-500">
              <span>● Packet Rate</span>
              <span>● Traffic Volume</span>
              <span>-- Conn Freq</span>
              <span>-- Flow Dur</span>
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BASELINE_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
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
                <Line type="monotone" dataKey="pktRate" stroke="#7030A0" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="volume" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="connFreq" stroke="#6366F1" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="flowDur" stroke="#06B6D4" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Modified Scenario Behaviour */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h3 className="text-xs font-bold text-slate-900">Modified Scenario Behaviour</h3>
            <div className="flex items-center gap-3 text-[10.5px] text-slate-500">
              <span>● Packet Rate</span>
              <span>● Traffic Volume</span>
              <span>-- Conn Freq</span>
              <span>-- Flow Dur</span>
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={modifiedChartData}>
                <defs>
                  <linearGradient id="surgeArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
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
                <Area type="monotone" dataKey="surgeFill" stroke="none" fill="url(#surgeArea)" />
                <Line type="monotone" dataKey="pktRate" stroke="#E11D48" strokeWidth={2.5} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="volume" stroke="#059669" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="connFreq" stroke="#6366F1" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="flowDur" stroke="#06B6D4" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 5. Bottom Row: What Changed in This Scenario? + Scenario Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: What Changed in This Scenario? */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">What Changed in This Scenario?</h3>
            </div>

            <div className="space-y-3">
              {[
                { label: "Packet Rate Variation", val: `+${packetMultiplier}%`, pct: packetMultiplier },
                { label: "Traffic Volume Deviation", val: `+${volumeMultiplier}%`, pct: volumeMultiplier },
                { label: "Connection Frequency", val: `+${connMultiplier}%`, pct: connMultiplier },
                { label: "Flow Duration", val: `+${flowMultiplier}%`, pct: flowMultiplier },
                { label: "Protocol Distribution", val: `+${protocolDistPct}%`, pct: protocolDistPct },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7030A0] rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, item.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5 text-xs text-slate-600">
            <Lightbulb size={16} className="text-[#7030A0] shrink-0 mt-0.5" />
            <span>
              {packetMultiplier > 50 || connMultiplier > 50
                ? "Increased packet rate and connection frequency are the primary drivers of higher risk in this scenario."
                : "Parameters remain close to normal operational baselines with low forecasted risk impact."}
            </span>
          </div>
        </Card>

        {/* Right: Scenario Summary */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
                <h3 className="text-sm font-bold text-slate-900">Scenario Summary</h3>
              </div>
              {saveSuccess && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Check size={12} /> Scenario Saved!
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Selected Scenario:</span>
                <span className="font-bold text-slate-800">{selectedPreset}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Baseline Condition:</span>
                <span className="font-semibold text-emerald-600">28 / 100 (Normal)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Parameters Modified:</span>
                <span className="font-medium text-slate-700">
                  Packet: +{packetMultiplier}%, Volume: +{volumeMultiplier}%, Conn: +{connMultiplier}%
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Simulated Condition:</span>
                <span className="font-bold text-[#7030A0]">
                  {modifiedRisk} / 100 ({classification.label.replace(" Risk", "")})
                </span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="font-bold text-slate-800">Key Insight</div>
              <p className="mt-0.5 text-slate-600">
                {riskDiff > 25
                  ? `Significant increase (+${riskDiff}) in network risk due to ${selectedPreset.toLowerCase()}.`
                  : "Modest variation within acceptable enterprise network thresholds."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-4 text-xs">
            <button
              onClick={handleSaveScenario}
              className="flex items-center gap-1.5 rounded-xl bg-[#7030A0] px-4 py-2 font-semibold text-white shadow-xs hover:bg-purple-800 transition-colors cursor-pointer active:scale-95"
            >
              <Save size={13} />
              <span>Save Scenario</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer active:scale-95"
            >
              <RotateCcw size={13} />
              <span>Reset Controls</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Bottom Notice */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <Info size={13} />
        <span>Illustrative scenario assessment — not a trained-model prediction.</span>
      </div>
    </div>
  );
}
