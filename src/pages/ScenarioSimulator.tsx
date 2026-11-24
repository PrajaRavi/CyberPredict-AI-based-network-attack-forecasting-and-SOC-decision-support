import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Database,
  Info,
  Lightbulb,
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

// Modified Scenario curves (Elevated with red/pink threat fill)
const MODIFIED_CHART_DATA = [
  { t: "T1", pktRate: 62, volume: 50, connFreq: 38, flowDur: 40, surgeFill: 62 },
  { t: "T2", pktRate: 70, volume: 58, connFreq: 44, flowDur: 46, surgeFill: 70 },
  { t: "T3", pktRate: 75, volume: 65, connFreq: 48, flowDur: 50, surgeFill: 75 },
  { t: "T4", pktRate: 74, volume: 64, connFreq: 47, flowDur: 49, surgeFill: 74 },
  { t: "T5", pktRate: 80, volume: 72, connFreq: 54, flowDur: 55, surgeFill: 80 },
  { t: "T6", pktRate: 85, volume: 78, connFreq: 60, flowDur: 62, surgeFill: 85 },
  { t: "T7", pktRate: 88, volume: 82, connFreq: 64, flowDur: 66, surgeFill: 88 },
  { t: "T8", pktRate: 92, volume: 86, connFreq: 68, flowDur: 70, surgeFill: 92 },
  { t: "T9", pktRate: 89, volume: 83, connFreq: 65, flowDur: 68, surgeFill: 89 },
  { t: "T10", pktRate: 85, volume: 80, connFreq: 62, flowDur: 65, surgeFill: 85 },
];

export default function ScenarioSimulatorPage() {
  const [selectedPreset, setSelectedPreset] = useState("Traffic Surge");
  const [packetMultiplier, setPacketMultiplier] = useState(50);
  const [volumeMultiplier, setVolumeMultiplier] = useState(60);
  const [connMultiplier, setConnMultiplier] = useState(45);
  const [flowMultiplier, setFlowMultiplier] = useState(30);

  const presets = [
    { title: "Normal Network Activity", desc: "Stable and expected traffic.", icon: Activity },
    { title: "Traffic Surge", desc: "Increased network traffic.", icon: TrendingUp },
    { title: "Unusual Connection Frequency", desc: "More connections than usual.", icon: Share2 },
    { title: "Suspicious Packet Pattern", desc: "Unusual packet behaviour.", icon: AlertTriangle },
    { title: "Combined Behavioural Anomaly", desc: "Multiple indicators active.", icon: Sparkles },
  ];

  const handleReset = () => {
    setPacketMultiplier(0);
    setVolumeMultiplier(0);
    setConnMultiplier(0);
    setFlowMultiplier(0);
    setSelectedPreset("Normal Network Activity");
  };

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer">
            <span>Scenario: {selectedPreset}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
          >
            <RotateCcw size={13} className="text-slate-500" />
            <span>Reset Scenario</span>
          </button>
        </div>

        <button className="inline-flex items-center gap-1.5 rounded-xl bg-[#7030A0] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-800 transition-colors cursor-pointer">
          <Play size={13} fill="#FFFFFF" />
          <span>Run Simulation ⌵</span>
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
                onClick={() => {
                  setSelectedPreset(preset.title);
                  if (preset.title === "Traffic Surge") {
                    setPacketMultiplier(50);
                    setVolumeMultiplier(60);
                    setConnMultiplier(45);
                    setFlowMultiplier(30);
                  } else if (preset.title === "Normal Network Activity") {
                    setPacketMultiplier(0);
                    setVolumeMultiplier(0);
                    setConnMultiplier(0);
                    setFlowMultiplier(0);
                  }
                }}
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
                onChange={(e) => setPacketMultiplier(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#7030A0]"
              />
              <span className="text-[10px] text-slate-400">Baseline: 500 p/s</span>
            </div>

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
                onChange={(e) => setVolumeMultiplier(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#7030A0]"
              />
              <span className="text-[10px] text-slate-400">Baseline: 2.0 GB</span>
            </div>

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
                onChange={(e) => setConnMultiplier(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#7030A0]"
              />
              <span className="text-[10px] text-slate-400">Baseline: 1,034 / min</span>
            </div>

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
                onChange={(e) => setFlowMultiplier(Number(e.target.value))}
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
                <div className="text-2xl font-extrabold text-[#7030A0] mt-0.5">64 / 100</div>
                <span className="inline-flex mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#7030A0]">
                  Elevated
                </span>
              </div>

              <div className="border-l border-slate-200/80 pl-4">
                <span className="text-xs text-slate-400 font-medium">Risk Difference</span>
                <div className="text-2xl font-extrabold text-rose-600 mt-0.5 flex items-center gap-1">
                  <AlertTriangle size={18} />
                  +36
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-center text-xs font-semibold text-[#7030A0] flex items-center justify-center gap-1.5">
            <Info size={14} />
            <span>Scenario Classification: Elevated Risk</span>
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
              <AreaChart data={MODIFIED_CHART_DATA}>
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
                { label: "Packet Rate Variation", val: "+50%" },
                { label: "Traffic Volume Deviation", val: "+60%" },
                { label: "Connection Frequency", val: "+45%" },
                { label: "Flow Duration", val: "+30%" },
                { label: "Protocol Distribution", val: "+20%" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7030A0] rounded-full"
                      style={{ width: item.val.replace("+", "") }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5 text-xs text-slate-600">
            <Lightbulb size={16} className="text-[#7030A0] shrink-0 mt-0.5" />
            <span>Increased traffic rate and connection frequency are the primary drivers of higher risk in this scenario.</span>
          </div>
        </Card>

        {/* Right: Scenario Summary */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Scenario Summary</h3>
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
                <span className="font-medium text-slate-700">Packet Rate: +50%, Volume: +60%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Simulated Condition:</span>
                <span className="font-bold text-[#7030A0]">64 / 100 (Elevated)</span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="font-bold text-slate-800">Key Insight</div>
              <p className="mt-0.5 text-slate-600">Significant increase in network risk due to traffic surge.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-4 text-xs">
            <button className="flex items-center gap-1.5 rounded-xl bg-[#7030A0] px-4 py-2 font-semibold text-white shadow-xs hover:bg-purple-800">
              <Save size={13} />
              <span>Save Scenario</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-medium text-slate-700 hover:bg-slate-50"
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
