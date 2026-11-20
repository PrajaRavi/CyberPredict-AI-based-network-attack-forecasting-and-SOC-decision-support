import { Info, LayoutDashboard, Radar } from "lucide-react";
import { ActivityDonutCard } from "../components/dashboard/ActivityDonutCard";
import { ConfidenceCard } from "../components/dashboard/ConfidenceCard";
import { DefenseGoalsCard } from "../components/dashboard/DefenseGoalsCard";
import { ForecastStatus } from "../components/dashboard/ForecastStatus";
import { PredictionCard } from "../components/dashboard/PredictionCard";
import { RecentIncidentsTable } from "../components/dashboard/RecentIncidentsTable";
import { RecommendedAction } from "../components/dashboard/RecommendedAction";
import { RiskFactorCard } from "../components/dashboard/RiskFactorCard";
import { RiskLevelBadge } from "../components/dashboard/RiskLevelBadge";
import { RiskScoreCard } from "../components/dashboard/RiskScoreCard";
import { RiskTimeline } from "../components/dashboard/RiskTimeline";
import { StatusBadge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import {
  forecastStatus,
  prediction,
  recommendedAction,
  riskFactors,
  riskScore,
  riskTimeline,
} from "../data/mockDashboard.js";

export function AiForecastCard() {
  return (
    <Panel
      title="AI Forecast Model"
      code="FCST-04 · Ensemble v2.4.1"
      className="flex h-full flex-col"
      bodyClassName="flex flex-1 flex-col gap-3.5 sm:gap-4 p-4 sm:p-6"
    >
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-linear-to-br from-amber-50/70 to-orange-50/40 p-3.5 sm:p-4">
        <Radar size={18} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm sm:text-[15px] font-bold text-slate-900 truncate">
            {prediction.headline}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{prediction.summary}</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 sm:py-2.5">
          <span className="font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
            Predicted attack
          </span>
          <span className="font-display text-xs sm:text-sm font-bold text-slate-800">
            {prediction.attackType}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 sm:py-2.5">
          <span className="font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
            Confidence
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-blue-600">
            {prediction.confidence}%
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 py-2 sm:py-2.5">
          <span className="font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
            Expected risk window
          </span>
          <span className="font-mono text-[11px] sm:text-xs font-bold text-amber-600">
            {prediction.riskWindow}
          </span>
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Alternative attack vectors
        </p>
        <div className="space-y-2 sm:space-y-2.5">
          {prediction.alternateVectors.map((v) => (
            <div key={v.vector} className="flex items-center gap-2.5 sm:gap-3">
              <span className="w-24 sm:w-28 shrink-0 truncate text-xs font-medium text-slate-600">{v.vector}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${v.probability}%` }}
                />
              </div>
              <span className="w-8 sm:w-9 shrink-0 text-right font-mono text-[10.5px] sm:text-[11px] font-semibold text-slate-700">
                {v.probability}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-start gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs text-slate-500">
        <Info size={14} className="mt-0.5 shrink-0 text-slate-400" aria-hidden />
        <p className="leading-relaxed text-[11.5px]">{prediction.disclaimer}</p>
      </div>
    </Panel>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <PageHeader
        icon={LayoutDashboard}
        eyebrow="Module SOC-01 · Command overview"
        title="Overview"
        description="Live threat posture, predictive attack horizon and prioritized analyst guidance on a single pane of glass."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <RiskLevelBadge level={riskScore.level} />
            <StatusBadge tone="safe" pulse>
              Live Telemetry Feed
            </StatusBadge>
          </div>
        }
      />

      {/* Top 4 Hero Metric Cards (Exact match to the 4 gradient cards in reference image!) */}
      <section aria-label="Key indicators" className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <RiskScoreCard score={riskScore} />
        <PredictionCard prediction={prediction} />
        <ForecastStatus status={forecastStatus} />
        <ConfidenceCard confidence={prediction.confidence} />
      </section>

      {/* Middle Row: Risk Timeline Area Chart (Total Income) + Vector Activity Donut Chart (Activity) */}
      <section aria-label="Threat trajectory and vector breakdown" className="grid gap-5 sm:gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RiskTimeline points={riskTimeline.points} threshold={riskTimeline.threshold} />
        </div>
        <div className="xl:col-span-1">
          <ActivityDonutCard />
        </div>
      </section>

      {/* Bottom Row: Incident History (Transaction History) + Defense Goals (My Goals) */}
      <section aria-label="Telemetry history and mitigation goals" className="grid gap-5 sm:gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentIncidentsTable />
        </div>
        <div className="xl:col-span-1">
          <DefenseGoalsCard />
        </div>
      </section>

      {/* Contributing Factors + Recommended Action */}
      <section aria-label="Analysis and guidance" className="grid gap-5 sm:gap-6 xl:grid-cols-3">
        <Panel
          title="Why is risk high?"
          code="Top Contributing Factors"
          className="xl:col-span-2"
          bodyClassName="p-4 sm:p-6"
        >
          <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            {riskFactors.map((factor, i) => (
              <RiskFactorCard key={factor.id} factor={factor} index={i} />
            ))}
          </div>
        </Panel>
        <div className="xl:col-span-1">
          <RecommendedAction action={recommendedAction} />
        </div>
      </section>
    </div>
  );
}
