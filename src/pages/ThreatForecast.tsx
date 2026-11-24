import { useState } from "react";
import {
  AlertTriangle,
  // Calendar,
  CheckCircle2,
  // Clock,
  Info,
  Lightbulb,
  // TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../components/ui/card";

// Base T1 to T20 Forecast Horizon Data
const HORIZON_DATA = [
  { t: "T1", histRisk: 28, histTraffic: 15, fcstRisk: null },
  { t: "T2", histRisk: 34, histTraffic: 18, fcstRisk: null },
  { t: "T3", histRisk: 42, histTraffic: 22, fcstRisk: null },
  { t: "T4", histRisk: 40, histTraffic: 21, fcstRisk: null },
  { t: "T5", histRisk: 38, histTraffic: 20, fcstRisk: null },
  { t: "T6", histRisk: 32, histTraffic: 18, fcstRisk: null },
  { t: "T7", histRisk: 42, histTraffic: 22, fcstRisk: null },
  { t: "T8", histRisk: 46, histTraffic: 24, fcstRisk: null },
  { t: "T9", histRisk: 44, histTraffic: 23, fcstRisk: null },
  { t: "T10", histRisk: 51, histTraffic: 28, fcstRisk: null },
  { t: "T11", histRisk: 50, histTraffic: 26, fcstRisk: 50 }, // FORECAST START boundary
  { t: "T12", histRisk: null, histTraffic: null, fcstRisk: 45 },
  { t: "T13", histRisk: null, histTraffic: null, fcstRisk: 44 },
  { t: "T14", histRisk: null, histTraffic: null, fcstRisk: 52 },
  { t: "T15", histRisk: null, histTraffic: null, fcstRisk: 68 }, // Peak 1
  { t: "T16", histRisk: null, histTraffic: null, fcstRisk: 62 },
  { t: "T17", histRisk: null, histTraffic: null, fcstRisk: 48 },
  { t: "T18", histRisk: null, histTraffic: null, fcstRisk: 54 },
  { t: "T19", histRisk: null, histTraffic: null, fcstRisk: 70 }, // Peak 2
  { t: "T20", histRisk: null, histTraffic: null, fcstRisk: 48 },
];

interface ForecastWindow {
  id: string;
  bucket: string;
  inspectorLabel: string;
  riskLevel: "Critical" | "Elevated" | "Normal";
  contributingSignals: string;
  status: "Critical" | "Watch" | "Stable";
  historicalContext: string;
  indicators: { name: string; val: string }[];
  miniData: { t: string; hist: number | null; proj: number | null }[];
  drivers: { label: string; pct: number }[];
}

const FORECAST_WINDOWS: ForecastWindow[] = [
  {
    id: "w1",
    bucket: "T11 – T12",
    inspectorLabel: "T12 (Initial Transition)",
    riskLevel: "Elevated",
    contributingSignals: "Rising Traffic Volume, Increased Connections",
    status: "Watch",
    historicalContext: "Rising traffic and initial connection ramp observed across internal gateways in T9–T10.",
    indicators: [
      { name: "Traffic Volume", val: "Elevated (+35%)" },
      { name: "Connection Frequency", val: "Moderate (+28%)" },
      { name: "Protocol Shift", val: "Slight (+12%)" },
    ],
    miniData: [
      { t: "T9", hist: 44, proj: null },
      { t: "T10", hist: 51, proj: null },
      { t: "T11", hist: 50, proj: 50 },
      { t: "T12", hist: null, proj: 45 },
      { t: "T13", hist: null, proj: 44 },
    ],
    drivers: [
      { label: "Packet Rate Variation", pct: 45 },
      { label: "Traffic Volume Deviation", pct: 68 },
      { label: "Connection Frequency", pct: 62 },
      { label: "Average Flow Duration", pct: 28 },
      { label: "Protocol Distribution Changes", pct: 30 },
    ],
  },
  {
    id: "w2",
    bucket: "T13 – T15",
    inspectorLabel: "T14 (Future Time Bucket)",
    riskLevel: "Critical",
    contributingSignals: "High Packet Rate, Protocol Shift",
    status: "Critical",
    historicalContext: "Rising traffic and more connections observed in T9–T10. Projected surge in packet transmission rate.",
    indicators: [
      { name: "Packet Rate", val: "High (+85%)" },
      { name: "Traffic Volume", val: "Elevated (+65%)" },
      { name: "Protocol Shift", val: "Notable (+52%)" },
    ],
    miniData: [
      { t: "T8", hist: 46, proj: null },
      { t: "T9", hist: 44, proj: null },
      { t: "T10", hist: 51, proj: null },
      { t: "T11", hist: 50, proj: 50 },
      { t: "T12", hist: null, proj: 58 },
    ],
    drivers: [
      { label: "Packet Rate Variation", pct: 75 },
      { label: "Traffic Volume Deviation", pct: 65 },
      { label: "Connection Frequency", pct: 45 },
      { label: "Average Flow Duration", pct: 35 },
      { label: "Protocol Distribution Changes", pct: 52 },
    ],
  },
  {
    id: "w3",
    bucket: "T16 – T17",
    inspectorLabel: "T16 (Post-Surge Dispersion)",
    riskLevel: "Elevated",
    contributingSignals: "Elevated Flow Duration, More Sessions",
    status: "Watch",
    historicalContext: "Sessions linger with extended connection hold times following previous packet velocity spike.",
    indicators: [
      { name: "Average Flow Duration", val: "Elevated (+42%)" },
      { name: "Concurrent Sessions", val: "High (+50%)" },
      { name: "Packet Rate", val: "Moderate (+25%)" },
    ],
    miniData: [
      { t: "T14", hist: null, proj: 52 },
      { t: "T15", hist: null, proj: 68 },
      { t: "T16", hist: null, proj: 62 },
      { t: "T17", hist: null, proj: 48 },
      { t: "T18", hist: null, proj: 54 },
    ],
    drivers: [
      { label: "Packet Rate Variation", pct: 40 },
      { label: "Traffic Volume Deviation", pct: 48 },
      { label: "Connection Frequency", pct: 55 },
      { label: "Average Flow Duration", pct: 72 },
      { label: "Protocol Distribution Changes", pct: 35 },
    ],
  },
  {
    id: "w4",
    bucket: "T18 – T19",
    inspectorLabel: "T19 (Secondary High Risk Peak)",
    riskLevel: "Critical",
    contributingSignals: "Traffic Spike, Suspicious Pattern",
    status: "Critical",
    historicalContext: "Recurrent coordinated request spike indicating multi-stage attack payload delivery window.",
    indicators: [
      { name: "Packet Rate", val: "Critical Peak (+95%)" },
      { name: "Traffic Volume", val: "Surge (+88%)" },
      { name: "Protocol Shift", val: "Severe (+74%)" },
    ],
    miniData: [
      { t: "T16", hist: null, proj: 62 },
      { t: "T17", hist: null, proj: 48 },
      { t: "T18", hist: null, proj: 54 },
      { t: "T19", hist: null, proj: 70 },
      { t: "T20", hist: null, proj: 48 },
    ],
    drivers: [
      { label: "Packet Rate Variation", pct: 90 },
      { label: "Traffic Volume Deviation", pct: 85 },
      { label: "Connection Frequency", pct: 60 },
      { label: "Average Flow Duration", pct: 50 },
      { label: "Protocol Distribution Changes", pct: 68 },
    ],
  },
  {
    id: "w5",
    bucket: "T20",
    inspectorLabel: "T20 (Stabilisation Boundary)",
    riskLevel: "Normal",
    contributingSignals: "Stabilising Traffic",
    status: "Stable",
    historicalContext: "Projected traffic normalization as synthetic attack patterns dissolve back to baseline levels.",
    indicators: [
      { name: "Packet Rate", val: "Normal (+4%)" },
      { name: "Traffic Volume", val: "Baseline (+2%)" },
      { name: "Protocol Shift", val: "Expected (-1%)" },
    ],
    miniData: [
      { t: "T18", hist: null, proj: 54 },
      { t: "T19", hist: null, proj: 70 },
      { t: "T20", hist: null, proj: 48 },
      { t: "T21", hist: null, proj: 36 },
      { t: "T22", hist: null, proj: 32 },
    ],
    drivers: [
      { label: "Packet Rate Variation", pct: 15 },
      { label: "Traffic Volume Deviation", pct: 18 },
      { label: "Connection Frequency", pct: 12 },
      { label: "Average Flow Duration", pct: 10 },
      { label: "Protocol Distribution Changes", pct: 8 },
    ],
  },
];

export default function ThreatForecastPage() {
  const [selectedWindowId, setSelectedWindowId] = useState("w2"); // Default T13–T15
  
  const selectedWindow = FORECAST_WINDOWS.find((w) => w.id === selectedWindowId) || FORECAST_WINDOWS[1];

  
  return (
    <div className="space-y-4">
  
      {/* 2. Top Card: Future Risk Horizon */}
      <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
            <h2 className="text-sm font-bold text-slate-900">Future Risk Horizon</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#7030A0]" />
              Historical Risk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              Historical Traffic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 border-b-2 border-dashed border-[#7030A0]" />
              Forecasted Risk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500" />
              High Risk Window
            </span>
          </div>
        </div>

        {/* Observation / Forecast Region Pills */}
        <div className="grid grid-cols-20 gap-0 text-center text-[10.5px] font-bold mb-2">
          <div className="col-span-11 bg-slate-100/60 rounded-l-lg py-1 text-slate-600 tracking-wider">
            HISTORICAL OBSERVATIONS
          </div>
          <div className="col-span-9 bg-purple-50/70 rounded-r-lg py-1 text-[#7030A0] tracking-wider relative">
            FUTURE FORECAST
            <span className="absolute -left-7 top-0.5 px-2 py-0.5 rounded-full bg-[#7030A0] text-white text-[9px] font-bold shadow-xs">
              FORECAST START
            </span>
          </div>
        </div>

        {/* Horizon Chart */}
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={HORIZON_DATA} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
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

              {/* Shaded Pink High Risk Windows */}
              <ReferenceArea
                x1="T14"
                x2="T16"
                y1={0}
                y2={100}
                fill="#F43F5E"
                fillOpacity={0.08}
              />
              <ReferenceArea
                x1="T18"
                x2="T20"
                y1={0}
                y2={100}
                fill="#F43F5E"
                fillOpacity={0.08}
              />

              {/* Vertical Forecast Start Line */}
              <ReferenceLine
                x="T11"
                stroke="#7030A0"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />

              {/* Historical Traffic (Teal with dots) */}
              <Line
                type="monotone"
                dataKey="histTraffic"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3, fill: "#10B981" }}
              />

              {/* Historical Risk (Purple with dots) */}
              <Line
                type="monotone"
                dataKey="histRisk"
                stroke="#7030A0"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#7030A0" }}
              />

              {/* Forecasted Risk (Dashed purple with dots) */}
              <Line
                type="monotone"
                dataKey="fcstRisk"
                stroke="#7030A0"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3.5, fill: "#7030A0" }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* High Risk Window Badges */}
          <div className="absolute top-2 left-[73%] -translate-x-1/2 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[9px] shadow-xs">
              High Risk Window
            </span>
          </div>

          <div className="absolute top-2 left-[92%] -translate-x-1/2 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[9px] shadow-xs">
              High Risk Window
            </span>
          </div>
        </div>
      </Card>

      {/* 3. Bottom Row: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Forecasted Risk Windows Table */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Forecasted Risk Windows</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 pb-2">
                    <th className="pb-2 font-semibold">Future Time Bucket</th>
                    <th className="pb-2 font-semibold">Illustrative Risk Level</th>
                    <th className="pb-2 font-semibold">Contributing Traffic Signals</th>
                    <th className="pb-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {FORECAST_WINDOWS.map((win) => {
                    const isSelected = selectedWindow.id === win.id;
                    const isCritical = win.riskLevel === "Critical";
                    const isElevated = win.riskLevel === "Elevated";

                    return (
                      <tr
                        key={win.id}
                        onClick={() => setSelectedWindowId(win.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-purple-50/80 font-medium" : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className={`py-2.5 font-bold font-mono ${isSelected ? "text-[#7030A0]" : "text-slate-900"}`}>
                          {win.bucket}
                        </td>
                        <td className="py-2.5 font-medium">
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${
                              isCritical ? "text-rose-600" : isElevated ? "text-purple-700" : "text-emerald-600"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                isCritical ? "bg-rose-500" : isElevated ? "bg-[#7030A0]" : "bg-emerald-500"
                              }`}
                            />
                            {win.riskLevel}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-500 max-w-[150px] truncate">{win.contributingSignals}</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              win.status === "Critical"
                                ? "bg-rose-50 text-rose-600"
                                : win.status === "Watch"
                                ? "bg-purple-50 text-[#7030A0]"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {win.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400">
            Click any row to inspect future interval risk parameters.
          </div>
        </Card>

        {/* Column 2: Why Is Future Risk Increasing? */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Why Is Future Risk Increasing?</h3>
            </div>

            <div className="space-y-3.5">
              {selectedWindow.drivers.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                    <span>{item.label}</span>
                    <span className="font-bold text-slate-900">{item.pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        selectedWindow.riskLevel === "Critical" ? "bg-rose-500" : "bg-[#7030A0]"
                      }`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5">
            <Lightbulb size={16} className="text-[#7030A0] shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-slate-600 leading-relaxed font-normal">
              Increased traffic variability and protocol shifts in recent history are key drivers of the projected risk rise for interval {selectedWindow.bucket}.
            </p>
          </div>
        </Card>

        {/* Column 3: Future Interval Inspector */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
                <h3 className="text-sm font-bold text-slate-900">Future Interval Inspector</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#7030A0] font-bold text-xs font-mono">
                {selectedWindow.inspectorLabel}
              </span>
            </div>

            {/* Illustrative Risk Alert Banner */}
            <div
              className={`my-3 p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold ${
                selectedWindow.riskLevel === "Critical"
                  ? "bg-rose-50 border-rose-200/60 text-rose-600"
                  : selectedWindow.riskLevel === "Elevated"
                  ? "bg-purple-50 border-purple-200/60 text-purple-700"
                  : "bg-emerald-50 border-emerald-200/60 text-emerald-700"
              }`}
            >
              {selectedWindow.riskLevel === "Normal" ? (
                <CheckCircle2 size={14} />
              ) : (
                <AlertTriangle size={14} />
              )}
              <span>Illustrative Risk: {selectedWindow.riskLevel}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Historical Context:</span>
                <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                  {selectedWindow.historicalContext}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 font-medium">Contributing Indicators:</span>
                <div className="space-y-1.5 mt-1 text-[11px] text-slate-600">
                  {selectedWindow.indicators.map((ind, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-[#7030A0]" />
                      <span>
                        {ind.name}: <strong className="text-slate-900">{ind.val}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="mt-3 h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedWindow.miniData}>
                  <Line type="monotone" dataKey="hist" stroke="#7030A0" strokeWidth={2} dot={{ r: 2 }} />
                  <Line
                    type="monotone"
                    dataKey="proj"
                    stroke={selectedWindow.riskLevel === "Critical" ? "#F43F5E" : "#7030A0"}
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-1.5 text-[10px] text-slate-400 leading-tight">
            <Info size={12} className="shrink-0 mt-0.5 text-slate-400" />
            <span>Forecasts represent future attack-positive time intervals within the analysed dataset, not guaranteed real-world attack onset times.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
