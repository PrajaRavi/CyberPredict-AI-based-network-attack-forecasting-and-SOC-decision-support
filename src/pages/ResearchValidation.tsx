import {
  AlertTriangle,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  ExternalLink,
  FlaskConical,
  Info,
  Lightbulb,
  Settings,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";
import { Card } from "../components/ui/card";

export default function ResearchValidationPage() {
  return (
    <div className="space-y-4">
      {/* 1. Context Sub-Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-[0_1px_6px_rgba(100,50,150,0.02)]">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 font-semibold text-[#7030A0]">
          <FlaskConical size={13} />
          <span>RESEARCH WORKSPACE</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-emerald-600">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Research Environment: Simulated</span>
        </div>
      </div>

      {/* 2. Research Overview Hero Card */}
      <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Research Overview</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              CyberPredict: AI-Based Network Attack Forecasting from Network Traffic Data
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-normal">
              Investigating whether temporal AI can use historical network traffic behaviour to forecast future attack-positive time intervals more effectively than a baseline detector using the same traffic.
            </p>
          </div>

          <div className="lg:col-span-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
              <Shield size={16} className="text-[#7030A0] mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">Research Domain</div>
              <div className="font-bold text-slate-800 text-[11px] leading-tight mt-0.5">
                Cybersecurity & Temporal AI
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
              <Cpu size={16} className="text-[#7030A0] mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">Research Focus</div>
              <div className="font-bold text-slate-800 text-[11px] leading-tight mt-0.5">
                Attack-Positive Forecasting
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
              <Database size={16} className="text-[#7030A0] mx-auto mb-1" />
              <div className="text-[10px] text-slate-400">Data Source</div>
              <div className="font-bold text-slate-800 text-[11px] leading-tight mt-0.5">
                CSE-CIC-IDS2018
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Second Row: Dataset Explorer + Data Processing Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Dataset Explorer */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Dataset Explorer</h3>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
              <div className="size-11 rounded-xl bg-purple-50 text-[#7030A0] flex items-center justify-center shrink-0">
                <Database size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">CSE-CIC-IDS2018</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Communications Security Establishment (CSE) and Canadian Institute for Cybersecurity (CIC), University of New Brunswick.
                </p>
                <a
                  href="https://www.unb.ca/cic/datasets/ids-2018.html"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#7030A0] hover:underline"
                >
                  <ExternalLink size={11} />
                  <span>https://www.unb.ca/cic/datasets/ids-2018.html</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
              <div>
                <span className="font-bold text-slate-700">Dataset Highlights</span>
                <ul className="mt-1 space-y-1 text-slate-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    <span className="size-1 rounded-full bg-[#7030A0]" />
                    Network Traffic Characteristics
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="size-1 rounded-full bg-[#7030A0]" />
                    Available Flow-level Information
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="size-1 rounded-full bg-[#7030A0]" />
                    Attack-labelled Traffic
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="size-1 rounded-full bg-[#7030A0]" />
                    Data Collection Period
                  </li>
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-700">Key Traffic Features</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {[
                    "Source IP",
                    "Destination IP",
                    "Protocol",
                    "Packet Count",
                    "Flow Duration",
                    "Traffic Volume",
                    "Packet Rate",
                    "Attack Label",
                  ].map((feat) => (
                    <span
                      key={feat}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Data Processing Pipeline */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Data Processing Pipeline</h3>
            </div>

            {/* Pipeline Horizontal Flow Diagram */}
            <div className="grid grid-cols-7 gap-1 text-center py-2 items-center">
              {[
                { label: "Raw Network Traffic", icon: Database },
                { label: "Data Cleaning", icon: Sparkles },
                { label: "Feature Preparation", icon: Settings },
                { label: "Chronological Splitting", icon: Calendar },
                { label: "Temporal Window Gen", icon: Clock },
                { label: "Model Training", icon: Brain },
                { label: "Future Interval Eval", icon: Target },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex flex-col items-center">
                    <div className="size-8 rounded-lg bg-purple-50 text-[#7030A0] flex items-center justify-center">
                      <Icon size={14} />
                    </div>
                    <span className="text-[9.5px] font-semibold text-slate-700 mt-1 leading-tight">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-slate-600 flex items-start gap-2">
            <Info size={14} className="text-[#7030A0] shrink-0 mt-0.5" />
            <span>Chronological splitting is used to preserve temporal ordering and prevent information leakage from future data into training.</span>
          </div>
        </Card>
      </div>

      {/* 4. Third Row: Temporal Forecasting Framework + Model Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Temporal Forecasting Framework */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Temporal Forecasting Framework</h3>
            </div>

            <div className="flex items-center justify-between text-xs pb-2">
              <div>
                <span className="text-slate-400">Historical Lookback</span>
                <div className="font-bold text-slate-800">L = 15 Time Buckets</div>
              </div>
              <div className="text-center">
                <span className="px-2.5 py-0.5 rounded-full bg-[#7030A0] text-white text-[10px] font-bold">
                  Forecast Boundary
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Future Forecast Horizon</span>
                <div className="font-bold text-slate-800">H = 10 Time Buckets</div>
              </div>
            </div>

            <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-1.5 text-[10px] font-bold">
                <span className="text-purple-700">PAST OBSERVATIONS</span>
                <span className="text-rose-600">FUTURE INTERVALS</span>
              </div>

              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center justify-between flex-1 gap-1">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <span key={i} className="size-2 rounded-full bg-[#7030A0]" />
                  ))}
                </div>
                <div className="h-5 w-0.5 border-r border-dashed border-slate-400 mx-2" />
                <div className="flex items-center justify-between flex-1 gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className="size-2 rounded-full bg-rose-500" />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-1 text-[9.5px] text-slate-400">
                <span>15 Historical Buckets</span>
                <span>10 Future Buckets</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-slate-600 flex items-start gap-2">
            <Info size={14} className="text-[#7030A0] shrink-0 mt-0.5" />
            <span>The forecasting target is whether future time buckets contain attack-positive network traffic, not the exact real-world moment an attack begins.</span>
          </div>
        </Card>

        {/* Right: Model Evaluation */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
              <h3 className="text-sm font-bold text-slate-900">Model Evaluation</h3>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#7030A0] mb-3">
              <Clock size={13} />
              <span>Pending experimental validation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10.5px]">Precision</span>
                  <div className="font-extrabold text-slate-700 text-lg mt-0.5">—</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10.5px]">Recall</span>
                  <div className="font-extrabold text-slate-700 text-lg mt-0.5">—</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10.5px]">F1-Score</span>
                  <div className="font-extrabold text-slate-700 text-lg mt-0.5">—</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10.5px]">PR-AUC</span>
                  <div className="font-extrabold text-slate-700 text-lg mt-0.5">—</div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-800">Methodology Comparison</span>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Temporal forecasting approach</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Baseline detector using the same traffic</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Chronological evaluation</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Leakage prevention</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 5. Bottom Row: Scope & Limitations + What CyberPredict Investigates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Research Scope & Limitations */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
            <h3 className="text-sm font-bold text-slate-900">Research Scope & Limitations</h3>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-purple-100 text-[#7030A0] flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>

            <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li>Dataset-based evaluation does not guarantee real-world attack forecasting performance.</li>
              <li>Forecasted attack-positive intervals do not establish exact attack onset times.</li>
              <li>Dataset characteristics may differ from live operational networks.</li>
              <li>Model performance must be established through completed experimental evaluation.</li>
              <li>The current frontend demonstration uses illustrative data and is not connected to a validated model.</li>
            </ol>
          </div>
        </Card>

        {/* Right: What CyberPredict Investigates */}
        <Card className="p-5 bg-white border border-slate-100 shadow-[0_2px_12px_rgba(100,50,150,0.03)] rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-3.5 bg-[#7030A0] rounded-full inline-block" />
            <h3 className="text-sm font-bold text-slate-900">What CyberPredict Investigates</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs">
              <Clock size={16} className="text-[#7030A0] mb-1.5" />
              <div className="font-bold text-slate-900">Temporal Perspective</div>
              <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                Investigating future attack-positive intervals rather than relying only on classification of observed traffic.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs">
              <Shield size={16} className="text-[#7030A0] mb-1.5" />
              <div className="font-bold text-slate-900">Leakage-Aware Evaluation</div>
              <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                Preserving chronological ordering and preventing future information from leaking into model development.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs">
              <Lightbulb size={16} className="text-[#7030A0] mb-1.5" />
              <div className="font-bold text-slate-900">Interpretable Analysis</div>
              <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                Connecting forecasted risk windows with understandable network traffic indicators.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
