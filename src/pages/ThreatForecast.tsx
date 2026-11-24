import { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Info,
  Lightbulb,
  TrendingUp,
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

// T1 to T20 Forecast Horizon Data
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

const MINI_INSPECTOR_DATA = [
  { t: "T8", hist: 46, proj: null },
  { t: "T9", hist: 44, proj: null },
  { t: "T10", hist: 51, proj: null },
  { t: "T11", hist: 50, proj: 50 },
  { t: "T12", hist: null, proj: 58 },
];

export default function ThreatForecastPage() {
  const [selectedBucket, setSelectedBucket] = useState("T14");

  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700 font-medium">
            <Clock size={13} className="text-slate-400" />
            <span>Historical Lookback: 15 Time Buckets</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700 font-medium">
            <Calendar size={13} className="text-slate-400" />
            <span>Forecast Horizon: 10 Future Buckets</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700 font-medium">
            <TrendingUp size={13} className="text-slate-400" />
            <span>Analysis Mode: Temporal Forecasting</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 text-[11px]">
          <Info size={13} />
          <span>DEMO MODE — ILLUSTRATIVE FORECAST</span>
        </div>
      </div>

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
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
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
                <tr
                  onClick={() => setSelectedBucket("T11 – T12")}
                  className="hover:bg-slate-50/60 cursor-pointer"
                >
                  <td className="py-2.5 font-bold font-mono text-slate-900">T11 – T12</td>
                  <td className="py-2.5 font-medium">
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-700">
                      <span className="size-1.5 rounded-full bg-[#7030A0]" />
                      Elevated
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">Rising Traffic Volume, Increased Connections</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-[#7030A0]">
                      Watch
                    </span>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedBucket("T14")}
                  className="hover:bg-slate-50/60 cursor-pointer"
                >
                  <td className="py-2.5 font-bold font-mono text-slate-900">T13 – T15</td>
                  <td className="py-2.5 font-medium">
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Critical
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">High Packet Rate, Protocol Shift</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600">
                      Critical
                    </span>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedBucket("T16 – T17")}
                  className="hover:bg-slate-50/60 cursor-pointer"
                >
                  <td className="py-2.5 font-bold font-mono text-slate-900">T16 – T17</td>
                  <td className="py-2.5 font-medium">
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-700">
                      <span className="size-1.5 rounded-full bg-[#7030A0]" />
                      Elevated
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">Elevated Flow Duration, More Sessions</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-[#7030A0]">
                      Watch
                    </span>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedBucket("T18 – T19")}
                  className="hover:bg-slate-50/60 cursor-pointer"
                >
                  <td className="py-2.5 font-bold font-mono text-slate-900">T18 – T19</td>
                  <td className="py-2.5 font-medium">
                    <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      Critical
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">Traffic Spike, Suspicious Pattern</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600">
                      Critical
                    </span>
                  </td>
                </tr>

                <tr
                  onClick={() => setSelectedBucket("T20")}
                  className="hover:bg-slate-50/60 cursor-pointer"
                >
                  <td className="py-2.5 font-bold font-mono text-slate-900">T20</td>
                  <td className="py-2.5 font-medium">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Normal
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">Stabilising Traffic</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                      Stable
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
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
              {[
                { label: "Packet Rate Variation", w: "75%" },
                { label: "Traffic Volume Deviation", w: "65%" },
                { label: "Connection Frequency", w: "45%" },
                { label: "Average Flow Duration", w: "35%" },
                { label: "Protocol Distribution Changes", w: "52%" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="text-xs text-slate-600 font-medium">{item.label}</div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-[#7030A0]" style={{ width: item.w }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5">
            <Lightbulb size={16} className="text-[#7030A0] shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-slate-600 leading-relaxed font-normal">
              Increased traffic variability and protocol shifts in recent history are key drivers of the projected risk rise.
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
                {selectedBucket} (Future Time Bucket)
              </span>
            </div>

            {/* Illustrative Risk Alert Banner */}
            <div className="my-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600">
              <AlertTriangle size={14} />
              <span>Illustrative Risk: Critical</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Historical Context:</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  Rising traffic and more connections observed in T9–T10.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 font-medium">Contributing Indicators:</span>
                <div className="space-y-1 mt-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#7030A0]" />
                    <span>Packet Rate: <strong className="text-slate-900">High</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#7030A0]" />
                    <span>Traffic Volume: <strong className="text-slate-900">Elevated</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#7030A0]" />
                    <span>Protocol Shift: <strong className="text-slate-900">Notable</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="mt-3 h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MINI_INSPECTOR_DATA}>
                  <Line type="monotone" dataKey="hist" stroke="#7030A0" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="proj" stroke="#7030A0" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
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
