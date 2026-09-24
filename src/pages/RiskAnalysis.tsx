import { ShieldAlert } from "lucide-react";
import { BehaviourStat } from "../components/analysis/BehaviourStat";
import { RiskWindowCard } from "../components/analysis/RiskWindowCard";
import { TrafficChartCard } from "../components/analysis/TrafficChartCard";
import { RiskFactorCard } from "../components/dashboard/RiskFactorCard";
import { RiskLevelBadge } from "../components/dashboard/RiskLevelBadge";
import { RiskTimeline } from "../components/dashboard/RiskTimeline";
import { StatusBadge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { riskFactors } from "../data/mockDashboard.js";
import {
  riskTimelineDetailed,
  riskWindow,
  trafficBehaviour,
  trafficMetrics,
} from "../data/mockRiskAnalysis.js";

export default function RiskAnalysisPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        icon={ShieldAlert}
        eyebrow="Module RSK-03 · Threat scoring"
        title="Risk Analysis"
        description="Observed traffic behaviour, trend deviations and the weighted factors driving the current composite risk — with the detailed risk timeline and expected window."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <RiskLevelBadge level="HIGH" />
            <StatusBadge tone="pulse" pulse>
              Live analysis
            </StatusBadge>
          </div>
        }
      />

      {/* 1 · Current traffic behaviour */}
      <Panel title="Current traffic behaviour" code="Live snapshot · 5-min aggregates">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {trafficBehaviour.map((stat, i) => (
            <BehaviourStat key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </Panel>

      {/* 2 · Traffic trends */}
      <Panel title="Traffic trends" code="Trailing 60 min · dashed line = baseline">
        <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {trafficMetrics.map((metric, i) => (
            <TrafficChartCard key={metric.id} metric={metric} index={i} />
          ))}
        </div>
      </Panel>

      {/* 3 · Risk factors */}
      <Panel title="Risk factors" code="Weighted contributors to composite score">
        <div className="grid gap-3.5 md:grid-cols-2">
          {riskFactors.map((factor, i) => (
            <RiskFactorCard key={factor.id} factor={factor} index={i} />
          ))}
        </div>
      </Panel>

      {/* 4 · Risk timeline + 5 · Expected risk window */}
      <section aria-label="Risk timeline and expected window" className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RiskTimeline
            points={riskTimelineDetailed.points}
            threshold={riskTimelineDetailed.threshold}
            historyStart={riskTimelineDetailed.historyStart}
            forecastEnd={riskTimelineDetailed.forecastEnd}
            code={riskTimelineDetailed.code}
          />
        </div>
        <div className="xl:col-span-2">
          <RiskWindowCard data={riskWindow} />
        </div>
      </section>
    </div>
  );
}
