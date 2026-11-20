import { TrendingUp } from "lucide-react";
import { RiskWindowCard } from "../components/analysis/RiskWindowCard";
import { ConfidenceCard } from "../components/dashboard/ConfidenceCard";
import { PredictionCard } from "../components/dashboard/PredictionCard";
import { RecommendedAction } from "../components/dashboard/RecommendedAction";
import { RiskFactorCard } from "../components/dashboard/RiskFactorCard";
import { RiskLevelBadge } from "../components/dashboard/RiskLevelBadge";
import { RiskTimeline } from "../components/dashboard/RiskTimeline";
import { ForecastHorizonChart } from "../components/forecast/ForecastHorizonChart";
import { ForecastStatTile } from "../components/forecast/ForecastStatTile";
import { WhatIfSimulation } from "../components/forecast/WhatIfSimulation";
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
import { riskWindow } from "../data/mockRiskAnalysis.js";
import { forecastHorizon, forecastSummary } from "../data/mockForecast.js";

export default function ForecastPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={TrendingUp}
        eyebrow="Module FCST-04 · Attack prediction"
        title="Forecast"
        description="Probabilistic attack outlook from the neural forecasting engine — current risk, predicted attack vector, calibrated model confidence and expected risk window."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="warn" pulse>
              {forecastStatus.status}
            </StatusBadge>
            <RiskLevelBadge level={riskScore.level} />
          </div>
        }
      />

      {/* Forecast summary strip with gradient icon tiles */}
      <Panel title="Forecast Summary" code={`Refreshed ${forecastStatus.lastRun} · ${forecastStatus.model}`}>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {forecastSummary.map((stat, i) => (
            <ForecastStatTile key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </Panel>

      {/* Primary forecast visualization + model output */}
      <section aria-label="Forecast visualization" className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ForecastHorizonChart data={forecastHorizon} />
        </div>
        <div className="grid h-full grid-rows-2 gap-4">
          <PredictionCard prediction={prediction} />
          <ConfidenceCard confidence={prediction.confidence} />
        </div>
      </section>

      {/* Risk timeline + expected risk window */}
      <section aria-label="Risk timeline and window" className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RiskTimeline points={riskTimeline.points} threshold={riskTimeline.threshold} />
        </div>
        <div className="xl:col-span-2">
          <RiskWindowCard data={riskWindow} />
        </div>
      </section>

      {/* Main risk factors + recommended action */}
      <section aria-label="Factors and guidance" className="grid gap-6 xl:grid-cols-3">
        <Panel title="Main Risk Factors" code="Why Risk Is Increasing" className="xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {riskFactors.map((factor, i) => (
              <RiskFactorCard key={factor.id} factor={factor} index={i} />
            ))}
          </div>
        </Panel>
        <RecommendedAction action={recommendedAction} />
      </section>

      {/* What-if simulation */}
      <WhatIfSimulation />
    </div>
  );
}
