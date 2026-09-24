import { Info, LayoutDashboard, Radar } from "lucide-react";
import { ConfidenceCard } from "../components/dashboard/ConfidenceCard";
import { ForecastStatus } from "../components/dashboard/ForecastStatus";
import { PredictionCard } from "../components/dashboard/PredictionCard";
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

/**
 * AI Forecast card — the model's current verdict, composed from the same
 * mock fixtures as the KPI row. Forecasting language only.
 */
function AiForecastCard() {
  return (
    <Panel
      title="AI forecast"
      code="FCST-04 · Ensemble v2.4.1"
      className="flex h-full flex-col"
      bodyClassName="flex flex-1 flex-col gap-4"
    >
      <div className="flex items-start gap-3 rounded-md border border-warn-500/25 bg-warn-500/[0.07] px-3.5 py-3">
        <Radar size={16} className="mt-0.5 shrink-0 text-warn-400" aria-hidden />
        <div>
          <div className="font-display text-[15px] font-semibold leading-snug text-warn-400">
            {prediction.headline}
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-mist-400">{prediction.summary}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 border-b border-line/60 py-2.5">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist-600">
            Predicted attack
          </span>
          <span className="font-display text-[15px] font-semibold text-mist-50">
            {prediction.attackType}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-line/60 py-2.5">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist-600">
            Confidence
          </span>
          <span className="font-mono text-[13px] font-medium tabular-nums text-pulse-400">
            {prediction.confidence}%
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 py-2.5">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist-600">
            Expected risk window
          </span>
          <span className="font-mono text-[13px] font-medium text-warn-400">
            {prediction.riskWindow}
          </span>
        </div>
      </div>

      <div>
        <p className="mb-2.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist-600">
          Alternative attack vectors
        </p>
        <div className="space-y-2">
          {prediction.alternateVectors.map((v) => (
            <div key={v.vector} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-[11.5px] text-mist-400">{v.vector}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-700">
                <div
                  className="h-full rounded-full bg-signal-500/70"
                  style={{ width: `${v.probability}%` }}
                />
              </div>
              <span className="w-9 shrink-0 text-right font-mono text-[10.5px] tabular-nums text-mist-400">
                {v.probability}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-start gap-2 rounded-md border border-line bg-ink-850/70 px-3 py-2.5">
        <Info size={13} className="mt-0.5 shrink-0 text-mist-500" aria-hidden />
        <p className="text-[11px] leading-relaxed text-mist-500">{prediction.disclaimer}</p>
      </div>
    </Panel>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        icon={LayoutDashboard}
        eyebrow="Module SOC-01 · Command overview"
        title="Overview"
        description="Live threat posture, model forecast and prioritized guidance for the current watch."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <RiskLevelBadge level={riskScore.level} />
            <StatusBadge tone="pulse" pulse>
              Live forecast
            </StatusBadge>
          </div>
        }
      />

      {/* KPI row */}
      <section aria-label="Key indicators" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RiskScoreCard score={riskScore} />
        <PredictionCard prediction={prediction} />
        <ConfidenceCard confidence={prediction.confidence} />
        <ForecastStatus status={forecastStatus} />
      </section>

      {/* Risk timeline + AI forecast */}
      <section aria-label="Forecast detail" className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RiskTimeline points={riskTimeline.points} threshold={riskTimeline.threshold} />
        </div>
        <AiForecastCard />
      </section>

      {/* Why is risk high + recommended action */}
      <section aria-label="Analysis and guidance" className="grid gap-4 xl:grid-cols-3">
        <Panel
          title="Why is risk high?"
          code="Top contributing factors"
          className="xl:col-span-2"
        >
          <div className="grid gap-3.5 sm:grid-cols-2">
            {riskFactors.map((factor, i) => (
              <RiskFactorCard key={factor.id} factor={factor} index={i} />
            ))}
          </div>
        </Panel>
        <RecommendedAction action={recommendedAction} />
      </section>
    </div>
  );
}
